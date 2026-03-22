/**
 * @file MediaEventProxy.js
 * @description Proxied event emitter that intercepts media events and applies
 *              transformation rules before forwarding them. Lazily subscribes
 *              to the underlying media event source only when listeners are added.
 *              Used to filter/transform playback events through configurable rule sets.
 * @module events/MediaEventProxy
 * @original Module_64281
 */

import { __extends, __spreadArray, __read } from 'tslib'; // Module 22970
import { EventEmitter } from './EventEmitter'; // Module 90745
import { jG } from '../core/PlayerServiceLocator'; // Module 49165
import { rza as applyEventRules } from '../streaming/StreamSelectionAlgorithm'; // Module 87561

/**
 * Extracts rules from a wildcard config entry, excluding the current event name.
 * @param {string} eventName - Current event name
 * @param {Object|undefined} wildcardConfig - The "*" config entry
 * @returns {Array} Array of rules, or empty array
 * @private
 */
function getWildcardRules(eventName, wildcardConfig) {
  if (wildcardConfig && !Array.isArray(wildcardConfig) && wildcardConfig.logdata.indexOf(eventName) === -1) {
    return wildcardConfig.rules;
  }
  return [];
}

/**
 * An EventEmitter subclass that proxies events from an underlying media event source.
 * Events are transformed through a configurable set of rules before being emitted
 * to registered listeners.
 *
 * @extends EventEmitter
 */
class MediaEventProxy extends EventEmitter {
  /**
   * @param {Function} eventTransformer - Function(eventName, data) -> transformed data
   * @param {Object} mediaEvents - Underlying media event source to proxy
   */
  constructor(eventTransformer, mediaEvents) {
    super();

    /** @type {Function} Transforms event data before emission */
    this._eventTransformer = eventTransformer;

    /** @type {Object} The underlying event source */
    this._mediaEvents = mediaEvents;

    /** @type {Object<string, Function>} Map of event name -> forwarding listener */
    this._forwardingListeners = {};
  }

  /**
   * Emits an event after applying the transformer function.
   * @param {string} eventName
   * @param {...*} args
   * @returns {boolean}
   */
  emit(eventName, ...args) {
    return super.emit(eventName, this._eventTransformer(eventName, args[0]));
  }

  /**
   * Subscribes to the underlying media event source if not already subscribed.
   * @param {string} eventName
   * @private
   */
  _ensureSubscribed(eventName) {
    if (!this.listeners(eventName).length) {
      const forwarder = (...args) => this.emit(eventName, ...args);
      this._forwardingListeners[eventName] = forwarder;
      this._mediaEvents.addListener(eventName, forwarder);
    }
  }

  /**
   * Adds a listener, auto-subscribing to the underlying source if needed.
   * @param {string} eventName
   * @param {Function} listener
   * @returns {this}
   */
  addListener(eventName, listener) {
    this._ensureSubscribed(eventName);
    super.addListener(eventName, listener);
    return this;
  }

  /**
   * Removes a listener, unsubscribing from the underlying source if no listeners remain.
   * @param {string} eventName
   * @param {Function} listener
   * @returns {this}
   */
  removeListener(eventName, listener) {
    super.removeListener(eventName, listener);
    const forwarder = this._forwardingListeners[eventName];
    if (!this.listeners(eventName).length && forwarder) {
      this._mediaEvents.removeListener(eventName, forwarder);
      this._forwardingListeners[eventName] = undefined;
    }
    return this;
  }

  /**
   * Alias for addListener.
   * @param {string} eventName
   * @param {Function} listener
   * @returns {this}
   */
  on(eventName, listener) {
    this.addListener(eventName, listener);
    return this;
  }

  /**
   * Alias for removeListener (named "validateManifest" in original obfuscated code).
   * @param {string} eventName
   * @param {Function} listener
   * @returns {this}
   */
  off(eventName, listener) {
    this.removeListener(eventName, listener);
    return this;
  }

  /**
   * Adds a one-time listener for an event.
   * @param {string} eventName
   * @param {Function} listener
   * @returns {this}
   */
  once(eventName, listener) {
    const self = this;
    function wrapper(...args) {
      self.removeListener(eventName, wrapper);
      listener(...args);
    }
    this.addListener(eventName, wrapper);
    return this;
  }

  /**
   * Prepends a listener to the beginning of the listener array.
   * @param {string} eventName
   * @param {Function} listener
   */
  prependListener(eventName, listener) {
    this._ensureSubscribed(eventName);
    super.kya(eventName, listener);
  }

  /**
   * Prepends a one-time listener.
   * @param {string} eventName
   * @param {Function} listener
   */
  prependOnceListener(eventName, listener) {
    const self = this;
    function wrapper(...args) {
      self.removeListener(eventName, wrapper);
      listener(...args);
    }
    this.prependListener(eventName, wrapper);
  }
}

/**
 * Creates a MediaEventProxy that applies event transformation rules from a config map.
 *
 * @param {*} context - Player/session context
 * @param {Object} mediaEvents - Underlying media event source
 * @param {*} k - Additional config parameter
 * @param {Object} rulesConfig - Map of event name -> rules array. Supports "*" wildcard.
 * @returns {MediaEventProxy}
 */
export function createMediaEventProxy(context, mediaEvents, k, rulesConfig) {
  return new MediaEventProxy(
    (eventName, eventData) => {
      const wildcardRules = getWildcardRules(eventName, rulesConfig['*']);
      const eventSpecificRules = rulesConfig[eventName] || [];

      const objectRules = wildcardRules
        .concat(eventSpecificRules)
        .filter((rule) => typeof rule === 'object');

      const [filterFn] = eventSpecificRules.filter((rule) => typeof rule === 'function');

      if (objectRules.length) {
        return applyEventRules(context, eventData, k, {
          rules: objectRules,
          filterRules: false,
          SOa: true,
        }, jG.IJ, filterFn);
      }

      return eventData;
    },
    mediaEvents
  );
}
