/**
 * Netflix Cadmium Player - LASER Logger Module
 *
 * Manages the LASER (Live Analytics & Streaming Event Reporting) logging system.
 * Handles WebSocket connections for real-time event streaming with state machine
 * transitions (DISABLED -> CONNECTING -> CONNECTED -> CLOSING -> CLOSED).
 *
 * @module LaserLogger
 */

import { MediaType } from '../streaming/MediaRequestEventReporter.js';

/**
 * Connection state enum for the LASER logger.
 * @enum {string}
 */
export const ConnectionState = Object.freeze(
  ['CLOSED', 'CLOSING', 'CONNECTED', 'CONNECTING', 'DISABLED'].reduce(
    (acc, s) => { acc[s] = s; return acc; },
    {}
  )
);

/**
 * Default clock offset configuration.
 * @type {{ aheadMs: number, behindMs: number }}
 */
export const DEFAULT_CLOCK_OFFSET = { aheadMs: 0, behindMs: 0 };

export const UNKNOWN = 'UNKNOWN';

// ─── Utility Functions ───────────────────────────────────────────────

/**
 * Checks whether a given event type is allowed by the events configuration.
 * Supports boolean, numeric threshold, and wildcard ("*") entries.
 *
 * @param {string} eventType - The event type to check.
 * @param {Object} eventsConfig - Map of event type to enabled/threshold.
 * @param {number} [threshold] - Random threshold for sampling.
 * @returns {boolean}
 */
function isEventAllowed(eventType, eventsConfig, threshold = _samplingThreshold) {
  const entry = eventsConfig[eventType];
  if (entry !== undefined) {
    if (entry === true) return true;
    if (entry === false) return false;
    if (typeof entry === 'number') return threshold <= entry;
  }
  return eventsConfig['*'] ? true : false;
}

/**
 * Converts an error or arbitrary value to a displayable string.
 *
 * @param {*} value
 * @returns {string}
 */
function errorToString(value) {
  if (value instanceof Error) return value.message;
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value) + '\n' + errorToString(err);
  }
}

/**
 * Validates and returns the managed socket client.
 *
 * @param {Object|null} socketWrapper - The socket wrapper object.
 * @returns {Object} The underlying socket client.
 * @throws {Error} If no socket client is injected or if using an external client.
 */
function getManagedClient(socketWrapper) {
  if (!socketWrapper) {
    throw new Error('A managed socket client must be injected in order to access socket client methods');
  }
  if (socketWrapper.type === 'EXTERNAL') {
    throw new Error('Managed socket client is not available when an external socket client is used');
  }
  return socketWrapper.client;
}

/**
 * Generates a unique session ID in the format YYYYMMDD-HHMMSSmmm-RANDOM.
 *
 * @param {Function} [randomFn=Math.random] - Random number generator.
 * @returns {string}
 */
export function generateSessionId(randomFn = Math.random.bind(Math)) {
  const pad = (val, len = 2) => val.toString().padStart(len, '0');
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}${pad(now.getUTCMilliseconds(), 3)}`;
  const randomPart = generateRandomToken(randomFn).toUpperCase();
  return `${datePart}-${timePart}-${randomPart}`;
}

/**
 * Generates a short random alphanumeric token.
 *
 * @param {Function} [randomFn=Math.random]
 * @returns {string}
 */
function generateRandomToken(randomFn = Math.random) {
  return randomFn().toString(36).slice(2, 8);
}

/**
 * Asserts that the LASER logger has been configured.
 *
 * @param {Object|null} config
 * @throws {Error} If config is falsy.
 */
function assertConfigured(config) {
  if (!config) throw new Error('LASER logger must be configured before use');
}

/**
 * Converts seconds to milliseconds.
 *
 * @param {number} seconds
 * @returns {number}
 */
export function secondsToMilliseconds(seconds) {
  return 1000 * seconds;
}

/**
 * Converts a MediaType enum value to its string representation.
 *
 * @param {number} mediaType
 * @returns {string}
 * @throws {RangeError} If the media type is invalid.
 */
export function mediaTypeToString(mediaType) {
  switch (mediaType) {
    case MediaType.V: return 'AUDIO';
    case MediaType.supplementaryMediaType: return 'MEDIA_EVENTS';
    case MediaType.TEXT_MEDIA_TYPE: return 'TEXT';
    case MediaType.U: return 'VIDEO';
  }
  throw new RangeError(`Invalid MediaType: ${mediaType}`);
}

/**
 * Converts a camelCase string to UPPER_SNAKE_CASE.
 *
 * @param {string} str
 * @returns {string}
 */
export function camelToSnakeCase(str) {
  return str
    .split(/(?=[A-Z])/)
    .map(s => s.toUpperCase())
    .join('_');
}

// ─── State Machine ───────────────────────────────────────────────────

/**
 * State machine transition table for the LASER logger.
 * Maps current state + event -> next state.
 */
const STATE_TRANSITIONS = {
  CONNECTED: { on: { CLOSE: 'CLOSING' } },
  CONNECTING: { on: { CONNECTED: 'CONNECTED', ERROR: 'CLOSED' } },
  DISABLED: { on: { CONNECT: 'CONNECTING' } },
  CLOSED: { on: { CONNECT: 'CONNECTING' } },
  CLOSING: { on: { CLOSED: 'CLOSED', ERROR: 'CLOSED' } },
};

/** Global events that apply regardless of current state. */
const GLOBAL_TRANSITIONS = { DISABLE: 'DISABLED' };

/** Random sampling threshold for event filtering. */
let _samplingThreshold = Math.random();

// ─── LASER Logger State ──────────────────────────────────────────────

/**
 * Internal state holder for the LASER logger connection.
 */
class LaserLoggerState {
  constructor() {
    /** @type {string} */
    this.className = 'DISABLED';
    /** @type {string} */
    this.sessionType = '';
    /** @type {string} */
    this.drmSessionId = '';
    /** @type {Object|null} */
    this.pendingSessionStart = null;
    /** @type {Object} */
    this.eventsConfig = { '*': true };
  }

  /** @returns {boolean} Whether a DRM session is active. */
  get hasSession() {
    return this.drmSessionId !== '';
  }

  /** @returns {boolean} */
  get isDisabled() {
    return this.className === 'DISABLED';
  }

  /** @returns {boolean} */
  get isClosed() {
    return this.className === 'CLOSED';
  }

  /** @returns {boolean} */
  get isClosing() {
    return this.className === 'CLOSING';
  }

  /** @returns {boolean} */
  get isConnecting() {
    return this.className === 'CONNECTING';
  }

  /** @returns {boolean} */
  get isConnected() {
    return this.className === 'CONNECTED';
  }

  /** @returns {boolean} */
  get isEnabled() {
    return this.isConnecting || this.isConnected;
  }

  /** @returns {boolean} Whether this is a MEMBER_NTL session. */
  get isNtlSession() {
    return this.sessionType === 'MEMBER_NTL';
  }
}

// ─── LASER Logger Singleton ──────────────────────────────────────────

/**
 * The LASER logger singleton.
 * Provides real-time event logging over WebSocket for Netflix streaming sessions.
 *
 * @type {Object}
 */
export const laser = (() => {
  let state = new LaserLoggerState();
  let eventBuffer = [];
  let config = null;
  let socketWrapper = null;
  let clientFactory = null;
  let connectPromise = Promise.resolve();
  let clock = Date;

  /**
   * Ends the current DRM session and sends SESSION_END.
   */
  function endSession() {
    sendEvent({
      type: 'SESSION_END',
      id: state.drmSessionId,
    });
    state.drmSessionId = '';
    state.sessionType = '';
  }

  /**
   * Sends or buffers an event based on connection state.
   *
   * @param {Object} event - The event payload.
   */
  function sendEvent(event) {
    if (state.isDisabled || !state.hasSession) return;
    assertConfigured(config);

    if (!isEventAllowed(event.type, state.eventsConfig)) return;

    assertConfigured(config);
    Object.assign(event, {
      schemaVersion: config.aWc,
      timestampMs: clock.now(),
      monoTimestampMs: clock.now ? clock.now() : -1,
      drmSessionId: state.drmSessionId,
    });

    if (state.isNtlSession) {
      event.ntl = true;
    }

    if (!state.isConnected) {
      logger.enable();
    }

    assertConfigured(config);

    if (!socketWrapper || state.isConnecting) {
      // Buffer events while connecting
      if (event.type === 'SESSION_START') {
        state.pendingSessionStart = event;
      } else {
        while (eventBuffer.length >= config.iJb) {
          eventBuffer.shift();
        }
        eventBuffer.push(event);
      }
    } else {
      socketWrapper.client.send(event);
    }
  }

  /**
   * Flushes all buffered events to the connected socket.
   */
  function flushBuffer() {
    if (eventBuffer.length === 0 && !state.pendingSessionStart) return;
    if (!socketWrapper) throw new Error('Socket client must be connected');

    const client = socketWrapper.client;
    config?.console.pauseTrace(`Flushing ${eventBuffer.length} buffered events`);

    if (state.pendingSessionStart) {
      client.send(state.pendingSessionStart);
      state.pendingSessionStart = null;
    }

    eventBuffer.forEach(evt => client.send(evt));
    eventBuffer.length = 0;
  }

  /**
   * Transitions the state machine based on an event.
   *
   * @param {string} event - The trigger event name.
   */
  function transition(event) {
    const currentState = state.className;
    const stateConfig = STATE_TRANSITIONS[currentState];

    let nextState;
    if (stateConfig?.type === 'FINAL') {
      nextState = currentState;
    } else {
      const onMap = stateConfig?.on;
      if (onMap && event in onMap) {
        nextState = onMap[event];
      } else if (GLOBAL_TRANSITIONS && event in GLOBAL_TRANSITIONS) {
        nextState = GLOBAL_TRANSITIONS[event];
      } else {
        nextState = currentState;
      }
    }

    if (nextState !== currentState) {
      config?.console.pauseTrace(`Logger state transition: ${currentState} -${event}-> ${nextState}`);
      state.className = nextState;

      if (state.isConnected && currentState !== 'CONNECTED') {
        flushBuffer();
      }
    }
  }

  const logger = {
    /** @returns {string} Current connection state. */
    get state() {
      return state.className;
    },

    /** @returns {boolean} Whether a DRM session is active. */
    get hasSession() {
      return state.hasSession;
    },

    /** @returns {boolean} Whether connected or connecting. */
    get isActiveOrConnecting() {
      return state.isConnected || state.isConnecting;
    },

    /** @returns {boolean} Whether the logger is enabled. */
    get isEnabled() {
      return state.isEnabled;
    },

    /** @returns {boolean} Whether the logger has been configured. */
    get isConfigured() {
      return !!config;
    },

    /**
     * Configures the LASER logger with connection settings.
     *
     * @param {Object} settings - Configuration object.
     * @param {Object|Function} settings.client - Socket client or factory function.
     * @param {number} [settings.iJb=500] - Max buffer size for queued events.
     */
    configure(settings) {
      if (config) {
        if (state.isConnected) {
          throw new Error('LASER Logger already connected');
        }
        config.console.RETRY('.configure() called multiple times');
      }

      config = {
        ...settings,
        iJb: settings.iJb ?? 500,
      };

      socketWrapper = null;
      clientFactory = null;

      if (typeof config.client === 'function') {
        clientFactory = config.client;
      } else if (config.client) {
        socketWrapper = { type: 'MANAGED', client: config.client };
      }
    },

    /**
     * Overrides the clock used for timestamps.
     *
     * @param {Object} newClock - A Date-like object with a now() method.
     * @returns {Object} The new clock.
     */
    setClock(newClock) {
      clock = newClock;
      return clock;
    },

    /**
     * Gracefully closes the socket connection.
     *
     * @returns {Promise<void>}
     */
    async closing() {
      assertConfigured(config);
      const client = getManagedClient(socketWrapper);

      if (state.isClosing || state.isDisposed) return;

      transition('CLOSE');

      try {
        await connectPromise;
        await client.closing();
      } catch (err) {
        config.console.RETRY('Socket client disconnection failed: ' + errorToString(err));
      }

      transition('CLOSED');
    },

    /**
     * Initiates the socket connection.
     *
     * @returns {Promise<void>}
     */
    async connect() {
      assertConfigured(config);
      const client = getManagedClient(socketWrapper);

      if (state.isConnecting || state.isConnected) return connectPromise;

      transition('CONNECT');

      try {
        connectPromise = client.connect();
        await connectPromise;
        transition('CONNECTED');
      } catch (err) {
        config.console.RETRY('Socket client connection failed: ' + errorToString(err));
        transition('ERROR');
      }
    },

    /**
     * Disables the logger and ends any active session.
     */
    disable() {
      if (state.hasSession) endSession();
      transition('DISABLE');
      config?.console.pauseTrace('Logger disabled');
    },

    /**
     * Enables the logger and initiates connection if needed.
     *
     * @param {Object} [eventsConfig] - Optional events filter configuration.
     */
    enable(eventsConfig) {
      assertConfigured(config);

      if (state.isEnabled) return;

      config.console.pauseTrace('Logger enabled');

      if (eventsConfig) {
        state.eventsConfig = eventsConfig;
        config.console.pauseTrace('Received events config:\n' + JSON.stringify(state.eventsConfig, null, 2));
      }

      if (socketWrapper?.type === 'MANAGED') {
        void logger.connect();
      } else {
        if (!clientFactory) {
          throw new Error('Socket client must be provided before enabling');
        }

        transition('CONNECT');
        clientFactory()
          .then(client => {
            socketWrapper = { type: 'EXTERNAL', client };
            transition('CONNECTED');
          })
          .catch(err => {
            config?.console.RETRY('Socket client connection failed: ' + errorToString(err));
            transition('ERROR');
          });
      }
    },

    /** Ends the current session. */
    endSession,

    /**
     * Starts a new LASER session.
     *
     * @param {Object} sessionInfo - Session descriptor.
     * @param {string} [sessionInfo.id] - Optional session ID (auto-generated if omitted).
     * @param {string} sessionInfo.type - Session type (e.g. "MEMBER_NTL").
     * @param {string} [sessionInfo.description] - Human-readable description.
     * @param {string} [sessionInfo.name] - Session name.
     * @param {string} [sessionInfo.CVc] - Run ID.
     * @throws {Error} If a session is already active.
     */
    startSession(sessionInfo) {
      assertConfigured(config);

      if (state.hasSession) {
        throw new Error(
          `Cannot start a new session while another session (${state.sessionType}:${state.drmSessionId}) is active`
        );
      }

      state.drmSessionId = sessionInfo.id || generateSessionId();
      state.sessionType = sessionInfo.type;

      const { pPc: platformType, platformVersion, hnd: guid } = config;

      config.console.pauseTrace(`Starting session ${state.sessionType}:${state.drmSessionId}`);

      sendEvent({
        type: 'SESSION_START',
        sessionType: sessionInfo.type,
        platformType,
        platformVersion,
        guid,
        description: sessionInfo.description,
        name: sessionInfo.name,
        runId: sessionInfo.CVc,
      });
    },

    /** Sends an event through the logger. */
    log: sendEvent,

    /**
     * Disposes of the logger, resetting all state.
     */
    dispose() {
      Object.assign(state, new LaserLoggerState());
      eventBuffer.length = 0;
      config = null;
      socketWrapper = null;
      clientFactory = null;
      connectPromise = Promise.resolve();
      clock = Date;
    },
  };

  return logger;
})();
