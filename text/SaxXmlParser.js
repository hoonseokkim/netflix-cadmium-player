/**
 * Netflix Cadmium Player - SAX-style JSON Streaming Parser
 *
 * Provides a streaming/event-driven JSON parser similar to SAX parsers for XML.
 * Emits events as JSON tokens are encountered (open/close object, open/close array,
 * key, value, etc.) without building a full in-memory tree.
 *
 * @module SaxJsonParser
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const env =
  typeof process === "object"
    ? {
        NODE_ENV: "production",
        PLATFORM: "cadmium",
        ASEBUILD: "release",
        OBFUSCATE: "obfuscate",
        BUILD_VERSION: "6.0055.939.911",
      }
    : Da; // eslint-disable-line no-undef

/** @type {number} Maximum buffer length before forcing a flush. */
const MAX_BUFFER_LENGTH = 65536;

/** Whether verbose debug logging is enabled. */
const DEBUG = env.tab === "debug";

/** Whether informational logging is enabled. */
const INFO = env.tab === "debug" || env.tab === "info";

// ---------------------------------------------------------------------------
// Event names
// ---------------------------------------------------------------------------

/**
 * All SAX event names emitted by the parser.
 * @type {string[]}
 */
const SAX_EVENTS = [
  "value",
  "string",
  "key",
  "openobject",
  "closeobject",
  "openarray",
  "closearray",
  "error",
  "end",
  "ready",
];

/**
 * Events that can be forwarded (excludes "error" and "end" which are handled
 * specially by the stream wrapper).
 * @type {string[]}
 */
const FORWARDABLE_EVENTS = SAX_EVENTS.filter(
  (name) => name !== "error" && name !== "end"
);

// ---------------------------------------------------------------------------
// Parser states
// ---------------------------------------------------------------------------

/** @enum {number} */
const State = Object.freeze({
  BEGIN: 0,
  VALUE: 1,
  OPEN_OBJECT: 2,
  CLOSE_OBJECT: 3,
  OPEN_ARRAY: 4,
  CLOSE_ARRAY: 5,
  TEXT_ESCAPE: 6,
  STRING: 7,
  BACKSLASH: 8,
  END: 9,
  OPEN_KEY: 10,
  CLOSE_KEY: 11,
  TRUE1: 12, // t
  TRUE2: 13, // tr
  TRUE3: 14, // tru
  FALSE1: 15, // f
  FALSE2: 16, // fa
  FALSE3: 17, // fal
  FALSE4: 18, // fals
  NULL1: 19, // n
  NULL2: 20, // nu
  NULL3: 21, // nul
  NUMBER_LEADING_ZERO: 22,
  NUMBER_DIGIT: 23,
});

// Build reverse-lookup (number -> name) for debug output.
const STATE_NAME = {};
for (const key of Object.keys(State)) {
  STATE_NAME[State[key]] = key;
}

// ---------------------------------------------------------------------------
// Default buffer fields reset on every new parser / re-init
// ---------------------------------------------------------------------------

/** @type {Record<string, any>} */
const DEFAULT_BUFFERS = Object.freeze({
  textNode: undefined,
  jsonParseState: "",
});

// ---------------------------------------------------------------------------
// Regex used inside the string-parsing hot loop
// ---------------------------------------------------------------------------

const STRING_SCAN_RE = /[\\"\n]/g;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Reset all buffer fields on a target object.
 * @param {Record<string, any>} target
 */
function resetBuffers(target) {
  for (const key in DEFAULT_BUFFERS) {
    target[key] = DEFAULT_BUFFERS[key];
  }
}

/**
 * Emit a named event on the parser if a handler is registered.
 * @param {SaxJsonParser} parser
 * @param {string} eventName  - e.g. "onvalue"
 * @param {*} [data]
 */
function emit(parser, eventName, data) {
  if (INFO) {
    console.log("-- emit", eventName, data);
  }
  if (parser[eventName]) {
    parser[eventName](data);
  }
}

/**
 * Flush the current text node, optionally trimming / normalizing whitespace,
 * then emit it via the given event (defaults to "onvalue").
 *
 * @param {SaxJsonParser} parser
 * @param {string} [eventName] - Defaults to "onvalue".
 */
function flushTextNode(parser, eventName) {
  const options = parser.options;
  let text = parser.textNode;

  if (text !== undefined) {
    if (options.trim) {
      text = text.trim();
    }
    if (options.normalize) {
      text = text.replace(/\s+/g, " ");
    }
  }

  parser.textNode = text;

  if (parser.textNode !== undefined) {
    emit(parser, eventName || "onvalue", parser.textNode);
  }

  parser.textNode = undefined;
}

/**
 * Record an error on the parser and emit it.
 *
 * @param {SaxJsonParser} parser
 * @param {string} message
 * @returns {SaxJsonParser}
 */
function emitError(parser, message) {
  flushTextNode(parser);
  message +=
    "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.currentChar;
  const error = new Error(message);
  parser.error = error;
  emit(parser, "onerror", error);
  return parser;
}

/**
 * Finalize the parser – emit remaining text, fire "onend", and re-initialize.
 *
 * @param {SaxJsonParser} parser
 * @returns {SaxJsonParser}
 */
function endParser(parser) {
  if (parser.state === State.VALUE && parser.depth === 0) {
    // Valid end at top-level value state – OK.
  } else {
    emitError(parser, "Unexpected end");
  }

  flushTextNode(parser);
  parser.currentChar = "";
  parser.closed = true;
  emit(parser, "onend");

  // Re-initialize for potential reuse.
  SaxJsonParser.call(parser, parser.options);
  return parser;
}

// ---------------------------------------------------------------------------
// SaxJsonParser – the core pull/push parser
// ---------------------------------------------------------------------------

/**
 * A streaming, event-driven JSON parser.
 *
 * Usage:
 * ```js
 * const parser = new SaxJsonParser({ trim: true });
 * parser.onvalue = (v) => console.log("value:", v);
 * parser.onopenobject = (key) => console.log("open object, first key:", key);
 * parser.write('{"hello":"world"}');
 * parser.end();
 * ```
 */
class SaxJsonParser {
  /**
   * @param {object} [options={}] - Parser options (e.g. `trim`, `normalize`).
   */
  constructor(options) {
    resetBuffers(this);

    /** @type {number} Position at which to check buffer overflow. */
    this.bufferCheckPosition = MAX_BUFFER_LENGTH;

    /**
     * Pending (unparsed) input data.
     * @type {string}
     */
    this.pending = "";

    /** @type {string} */
    this.q = "";

    /** @type {string} Current character. */
    this.currentChar = "";

    /** @type {string} Previous character. */
    this.previousChar = "";

    /** @type {object} Parser options. */
    this.options = options || {};

    /** @type {boolean} */
    this.closed = false;

    /** @type {boolean} */
    this.closedRoot = false;

    /** @type {boolean} */
    this.sawRoot = false;

    /** @type {boolean} */
    this.paused = false;

    /** @type {Error|null} */
    this.error = null;

    /** @type {number} Current parser state. */
    this.state = State.BEGIN;

    /** @type {number[]} State stack for nested structures. */
    this.stack = [];

    /** @type {number} Byte position in the input stream. */
    this.position = 0;

    /** @type {number} Column number (0-based). */
    this.column = 0;

    /** @type {number} Line number (1-based). */
    this.line = 1;

    /** @type {boolean} Whether a backslash escape is active in a string. */
    this.slashed = false;

    /** @type {number} Remaining hex digits for a \\uXXXX escape. */
    this.unicodeRemaining = 0;

    /** @type {string|null} Accumulator for \\uXXXX hex digits. */
    this.unicodeBuffer = null;

    /** @type {number} Current nesting depth. */
    this.depth = 0;

    emit(this, "onready");
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /** Signal the end of input. */
  end() {
    endParser(this);
  }

  /**
   * Feed data into the parser.
   *
   * @param {string|null} chunk - A string of JSON data, or `null` to signal EOF.
   * @returns {SaxJsonParser} `this` for chaining.
   */
  write(chunk) {
    if (this.error) {
      throw this.error;
    }
    if (this.closed) {
      return emitError(this, "Cannot write after close. Assign an onready handler.");
    }
    if (chunk === null) {
      return endParser(this);
    }

    this.pending += chunk;

    if (this.paused) {
      return this;
    }

    if (DEBUG) {
      console.log("write -> [" + chunk + "]");
    }

    return this._processInput();
  }

  /** Pause the parser (it will buffer further writes). */
  pause() {
    this.paused = true;
    return this;
  }

  /** Resume parsing after a pause. */
  resume() {
    this.paused = false;
    this.error = null;
    return this;
  }

  /** Convenience – equivalent to `write(null)`. */
  close() {
    return this.write(null);
  }

  // -----------------------------------------------------------------------
  // Main parse loop (private)
  // -----------------------------------------------------------------------

  /**
   * Process buffered input character-by-character.
   * @returns {SaxJsonParser}
   * @private
   */
  _processInput() {
    const input = this.pending;
    let pos = 0;
    let char = input[0];
    let prevChar;
    let regexMatch;
    let unicodeRemaining;
    let scanResult;

    while (char && !this.paused) {
      prevChar = char;
      this.currentChar = char = input.charAt(pos++);
      if (prevChar !== char) {
        this.previousChar = prevChar;
      } else {
        prevChar = this.previousChar;
      }

      if (!char) break;

      if (DEBUG) {
        console.log(pos, char, STATE_NAME[this.state]);
      }

      this.position++;

      if (char === "\n") {
        this.line++;
        this.column = 0;
      } else {
        this.column++;
      }

      switch (this.state) {
        // ---- Expect top-level value opener ---------------------------------
        case State.BEGIN:
          if (char === "{") {
            this.state = State.OPEN_OBJECT;
          } else if (char === "[") {
            this.state = State.OPEN_ARRAY;
          } else if (char !== "\r" && char !== "\n" && char !== " " && char !== "\t") {
            emitError(this, "Non-whitespace before {[.");
          }
          continue;

        // ---- Object key context --------------------------------------------
        case State.OPEN_KEY:
        case State.OPEN_OBJECT:
          if (char === "\r" || char === "\n" || char === " " || char === "\t") continue;

          if (this.state === State.OPEN_KEY) {
            this.stack.push(State.CLOSE_KEY);
          } else if (char === "}") {
            emit(this, "onopenobject");
            this.depth++;
            emit(this, "oncloseobject");
            this.depth--;
            this.state = this.stack.pop() || State.VALUE;
            continue;
          } else {
            this.stack.push(State.CLOSE_OBJECT);
          }

          if (char === '"') {
            this.state = State.STRING;
          } else {
            emitError(this, 'Malformed object key should start with "');
          }
          continue;

        // ---- After key/value in object context -----------------------------
        case State.CLOSE_KEY:
        case State.CLOSE_OBJECT:
          if (char === "\r" || char === "\n" || char === " " || char === "\t") continue;

          if (char === ":") {
            if (this.state === State.CLOSE_OBJECT) {
              this.stack.push(State.CLOSE_OBJECT);
              flushTextNode(this, "onopenobject");
              this.depth++;
            } else {
              flushTextNode(this, "onkey");
            }
            this.state = State.VALUE;
          } else if (char === "}") {
            flushTextNode(this);
            emit(this, "oncloseobject", undefined);
            this.depth--;
            this.state = this.stack.pop() || State.VALUE;
          } else if (char === ",") {
            if (this.state === State.CLOSE_OBJECT) {
              this.stack.push(State.CLOSE_OBJECT);
            }
            flushTextNode(this);
            this.state = State.OPEN_KEY;
          } else {
            emitError(this, "Bad object");
          }
          continue;

        // ---- Array / generic value context ---------------------------------
        case State.OPEN_ARRAY:
        case State.VALUE:
          if (char === "\r" || char === "\n" || char === " " || char === "\t") continue;

          if (this.state === State.OPEN_ARRAY) {
            emit(this, "onopenarray");
            this.depth++;
            this.state = State.VALUE;

            if (char === "]") {
              emit(this, "onclosearray");
              this.depth--;
              this.state = this.stack.pop() || State.VALUE;
              continue;
            } else {
              this.stack.push(State.CLOSE_ARRAY);
            }
          }

          if (char === '"') {
            this.state = State.STRING;
          } else if (char === "{") {
            this.state = State.OPEN_OBJECT;
          } else if (char === "[") {
            this.state = State.OPEN_ARRAY;
          } else if (char === "t") {
            this.state = State.TRUE1;
          } else if (char === "f") {
            this.state = State.FALSE1;
          } else if (char === "n") {
            this.state = State.NULL1;
          } else if (char === "-") {
            this.jsonParseState += char;
          } else if (char === "0") {
            this.jsonParseState += char;
            this.state = State.NUMBER_DIGIT;
          } else if ("123456789".indexOf(char) !== -1) {
            this.jsonParseState += char;
            this.state = State.NUMBER_DIGIT;
          } else {
            emitError(this, "Bad value");
          }
          continue;

        // ---- After array element -------------------------------------------
        case State.CLOSE_ARRAY:
          if (char === ",") {
            this.stack.push(State.CLOSE_ARRAY);
            flushTextNode(this, "onvalue");
            this.state = State.VALUE;
          } else if (char === "]") {
            flushTextNode(this);
            emit(this, "onclosearray", undefined);
            this.depth--;
            this.state = this.stack.pop() || State.VALUE;
          } else if (char === "\r" || char === "\n" || char === " " || char === "\t") {
            continue;
          } else {
            emitError(this, "Bad array");
          }
          continue;

        // ---- String parsing (hot path) -------------------------------------
        case State.STRING:
          if (this.textNode === undefined) {
            this.textNode = "";
          }

          prevChar = pos - 1;
          regexMatch = this.slashed;
          unicodeRemaining = this.unicodeRemaining;

          stringLoop: for (;;) {
            if (DEBUG) {
              console.log(pos, char, STATE_NAME[this.state], regexMatch);
            }

            // Handle remaining hex digits of a \uXXXX escape
            while (unicodeRemaining > 0) {
              this.unicodeBuffer += char;
              char = input.charAt(pos++);
              this.position++;

              if (unicodeRemaining === 4) {
                this.textNode += String.fromCharCode(parseInt(this.unicodeBuffer, 16));
                unicodeRemaining = 0;
                prevChar = pos - 1;
              } else {
                unicodeRemaining++;
              }

              if (!char) break stringLoop;
            }

            // Unescaped closing quote
            if (char === '"' && !regexMatch) {
              this.state = this.stack.pop() || State.VALUE;
              this.textNode += input.substring(prevChar, pos - 1);
              this.position += pos - 1 - prevChar;
              break;
            }

            // Backslash – start escape sequence
            if (char === "\\" && !regexMatch) {
              regexMatch = true;
              this.textNode += input.substring(prevChar, pos - 1);
              this.position += pos - 1 - prevChar;
              char = input.charAt(pos++);
              this.position++;
              if (!char) break;
            }

            // Process escape character
            if (regexMatch) {
              regexMatch = false;

              if (char === "n") this.textNode += "\n";
              else if (char === "r") this.textNode += "\r";
              else if (char === "t") this.textNode += "\t";
              else if (char === "f") this.textNode += "\f";
              else if (char === "b") this.textNode += "\b";
              else if (char === "u") {
                unicodeRemaining = 1;
                this.unicodeBuffer = "";
              } else {
                this.textNode += char;
              }

              char = input.charAt(pos++);
              this.position++;
              prevChar = pos - 1;

              if (char) continue;
              else break;
            }

            // Fast-scan for next special character
            STRING_SCAN_RE.lastIndex = pos;
            scanResult = STRING_SCAN_RE.exec(input);

            if (scanResult === null) {
              pos = input.length + 1;
              this.textNode += input.substring(prevChar, pos - 1);
              this.position += pos - 1 - prevChar;
              break;
            }

            pos = scanResult.index + 1;
            char = input.charAt(scanResult.index);

            if (!char) {
              this.textNode += input.substring(prevChar, pos - 1);
              this.position += pos - 1 - prevChar;
              break;
            }
          }

          this.slashed = regexMatch;
          this.unicodeRemaining = unicodeRemaining;
          continue;

        // ---- Literal: true -------------------------------------------------
        case State.TRUE1:
          if (char === "") continue;
          if (char === "r") this.state = State.TRUE2;
          else emitError(this, "Invalid true started with t" + char);
          continue;

        case State.TRUE2:
          if (char === "") continue;
          if (char === "u") this.state = State.TRUE3;
          else emitError(this, "Invalid true started with tr" + char);
          continue;

        case State.TRUE3:
          if (char === "") continue;
          if (char === "e") {
            emit(this, "onvalue", true);
            this.state = this.stack.pop() || State.VALUE;
          } else {
            emitError(this, "Invalid true started with tru" + char);
          }
          continue;

        // ---- Literal: false ------------------------------------------------
        case State.FALSE1:
          if (char === "") continue;
          if (char === "a") this.state = State.FALSE2;
          else emitError(this, "Invalid false started with f" + char);
          continue;

        case State.FALSE2:
          if (char === "") continue;
          if (char === "l") this.state = State.FALSE3;
          else emitError(this, "Invalid false started with fa" + char);
          continue;

        case State.FALSE3:
          if (char === "") continue;
          if (char === "s") this.state = State.FALSE4;
          else emitError(this, "Invalid false started with fal" + char);
          continue;

        case State.FALSE4:
          if (char === "") continue;
          if (char === "e") {
            emit(this, "onvalue", false);
            this.state = this.stack.pop() || State.VALUE;
          } else {
            emitError(this, "Invalid false started with fals" + char);
          }
          continue;

        // ---- Literal: null -------------------------------------------------
        case State.NULL1:
          if (char === "") continue;
          if (char === "u") this.state = State.NULL2;
          else emitError(this, "Invalid null started with n" + char);
          continue;

        case State.NULL2:
          if (char === "") continue;
          if (char === "l") this.state = State.NULL3;
          else emitError(this, "Invalid null started with nu" + char);
          continue;

        case State.NULL3:
          if (char === "") continue;
          if (char === "l") {
            emit(this, "onvalue", null);
            this.state = this.stack.pop() || State.VALUE;
          } else {
            emitError(this, "Invalid null started with nul" + char);
          }
          continue;

        // ---- Number: leading zero ------------------------------------------
        case State.NUMBER_LEADING_ZERO:
          if (char === ".") {
            this.jsonParseState += char;
            this.state = State.NUMBER_DIGIT;
          } else {
            emitError(this, "Leading zero not followed by .");
          }
          continue;

        // ---- Number: digits / decimals / exponent --------------------------
        case State.NUMBER_DIGIT:
          if ("0123456789".indexOf(char) !== -1) {
            this.jsonParseState += char;
          } else if (char === ".") {
            if (this.jsonParseState.indexOf(".") !== -1) {
              emitError(this, "Invalid number has two dots");
            }
            this.jsonParseState += char;
          } else if (char === "e" || char === "E") {
            if (
              this.jsonParseState.indexOf("e") !== -1 ||
              this.jsonParseState.indexOf("E") !== -1
            ) {
              emitError(this, "Invalid number has two exponential");
            }
            this.jsonParseState += char;
          } else if (char === "+" || char === "-") {
            if (prevChar !== "e" && prevChar !== "E") {
              emitError(this, "Invalid symbol in number");
            }
            this.jsonParseState += char;
          } else {
            if (this.jsonParseState) {
              emit(this, "onvalue", parseFloat(this.jsonParseState));
            }
            this.jsonParseState = "";
            pos--;
            this.state = this.stack.pop() || State.VALUE;
          }
          continue;

        // ---- Fallback ------------------------------------------------------
        default:
          emitError(this, "Unknown state: " + this.state);
      }
    }

    // Check buffer overflow
    if (this.position >= this.bufferCheckPosition) {
      const maxSize = Math.max(MAX_BUFFER_LENGTH, 10);
      let maxBufferUsed = 0;

      for (const bufferKey in DEFAULT_BUFFERS) {
        const bufferLength = this[bufferKey] === undefined ? 0 : this[bufferKey].length;

        if (bufferLength > maxSize) {
          switch (bufferKey) {
            case "text":
              flushTextNode(this);
              break;
            default:
              emitError(this, "Max buffer length exceeded: " + bufferKey);
          }
        }

        maxBufferUsed = Math.max(maxBufferUsed, bufferLength);
      }

      this.bufferCheckPosition = MAX_BUFFER_LENGTH - maxBufferUsed + this.position;
    }

    if (pos > 0) {
      this.pending = input.substring(pos);
    }

    return this;
  }
}

// ---------------------------------------------------------------------------
// SaxJsonStream – wraps SaxJsonParser as a Node.js stream
// ---------------------------------------------------------------------------

/**
 * Resolve the EventEmitter base class. Falls back to a no-op if unavailable.
 * @type {Function}
 */
let EventEmitterBase;
try {
  // Module 75177 provides EventEmitter in the Netflix Cadmium environment.
  EventEmitterBase = require("events").EventEmitter; // eslint-disable-line
} catch (_unused) {
  EventEmitterBase = function () {};
}

/**
 * A Node.js stream wrapper around {@link SaxJsonParser} that handles
 * multi-byte UTF-8 sequences and emits standard stream events.
 */
class SaxJsonStream {
  /**
   * @param {object} [options={}] - Options forwarded to the underlying parser.
   */
  constructor(options) {
    if (!(this instanceof SaxJsonStream)) {
      return new SaxJsonStream(options);
    }

    /** @type {SaxJsonParser} The underlying SAX parser instance. */
    this.parser = new SaxJsonParser(options);

    /** @type {boolean} */
    this.readable = true;

    /** @type {boolean} */
    this.writable = true;

    /**
     * Expected total byte length of the current multi-byte character.
     * @type {number}
     */
    this.expectedBytes = 0;

    /**
     * Remaining bytes still needed for the current multi-byte character.
     * @type {number}
     */
    this.remainingBytes = 0;

    /**
     * Pre-allocated buffers for 2-, 3-, and 4-byte UTF-8 characters.
     * @type {Record<number, Buffer>}
     */
    this.multiByteBuffers = {
      2: new Buffer(2),
      3: new Buffer(3),
      4: new Buffer(4),
    };

    /** @type {string} Decoded string chunk for the current write. */
    this.decodedString = "";

    const self = this;
    EventEmitterBase.apply(self);

    // Forward "end" and "error" from the parser to the stream.
    this.parser.onend = function () {
      self.emit("end");
    };

    this.parser.onerror = function (err) {
      self.emit("error", err);
      self.parser.error = null;
    };

    // Create getter/setter proxies for all forwardable SAX events.
    FORWARDABLE_EVENTS.forEach(function (eventName) {
      Object.defineProperty(self, "on" + eventName, {
        get() {
          return self.parser["on" + eventName];
        },
        set(handler) {
          if (!handler) {
            self.removeAllListeners(eventName);
            self.parser["on" + eventName] = handler;
            return;
          }
          self.on(eventName, handler);
        },
        enumerable: true,
        configurable: false,
      });
    });
  }

  /**
   * Write a chunk of data (as a Buffer) to the stream.
   * Handles multi-byte UTF-8 character boundaries that may be split across
   * write calls.
   *
   * @param {Buffer|string} chunk
   * @returns {boolean}
   */
  write(chunk) {
    const buffer = new Buffer(chunk);

    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];

      // Continue accumulating bytes for a multi-byte character
      if (this.remainingBytes > 0) {
        let j;
        for (j = 0; j < this.remainingBytes; j++) {
          this.multiByteBuffers[this.expectedBytes][this.expectedBytes - this.remainingBytes + j] =
            buffer[j];
        }

        this.decodedString = this.multiByteBuffers[this.expectedBytes].toString();
        this.expectedBytes = 0;
        this.remainingBytes = 0;
        i = i + j - 1;

        this.parser.write(this.decodedString);
        this.emit("data", this.decodedString);
      } else if (this.remainingBytes === 0 && byte >= 128) {
        // Determine expected byte length from the leading byte
        if (byte >= 194 && byte <= 223) this.expectedBytes = 2;
        if (byte >= 224 && byte <= 239) this.expectedBytes = 3;
        if (byte >= 240 && byte <= 244) this.expectedBytes = 4;

        // Check if the multi-byte char spans beyond this buffer
        if (this.expectedBytes + i > buffer.length) {
          let j;
          for (j = 0; j <= buffer.length - 1 - i; j++) {
            this.multiByteBuffers[this.expectedBytes][j] = buffer[i + j];
          }
          this.remainingBytes = i + this.expectedBytes - buffer.length;
          return true;
        }

        this.decodedString = buffer.slice(i, i + this.expectedBytes).toString();
        i = i + this.expectedBytes - 1;

        this.parser.write(this.decodedString);
        this.emit("data", this.decodedString);
      } else {
        // ASCII run – scan ahead for the next multi-byte boundary
        let j;
        for (j = i; j < buffer.length && buffer[j] < 128; j++);

        this.decodedString = buffer.slice(i, j).toString();
        this.parser.write(this.decodedString);
        this.emit("data", this.decodedString);
        i = j - 1;
      }
    }
  }

  /**
   * Signal end-of-stream.
   *
   * @param {Buffer|string} [chunk] - Optional final chunk.
   * @returns {boolean}
   */
  end(chunk) {
    if (chunk && chunk.length) {
      this.parser.write(chunk.toString());
    }
    this.parser.end();
    return true;
  }

  /**
   * Register an event listener. Automatically wires up the underlying parser
   * handler for SAX events.
   *
   * @param {string} eventName
   * @param {Function} handler
   */
  on(eventName, handler) {
    const self = this;

    if (!self.parser["on" + eventName] && FORWARDABLE_EVENTS.indexOf(eventName) !== -1) {
      self.parser["on" + eventName] = function () {
        const args =
          arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        args.splice(0, 0, eventName);
        self.emit.apply(self, args);
      };
    }

    return EventEmitterBase.prototype.on.call(self, eventName, handler);
  }

  /**
   * Remove all listeners and signal close.
   */
  clearListeners() {
    resetBuffers(this.parser);
    this.emit("close");
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * Create a new parser instance (functional API).
 * @param {object} [options]
 * @returns {SaxJsonParser}
 */
export function createParser(options) {
  return new SaxJsonParser(options);
}

/**
 * Create a new stream wrapper instance (functional API).
 * @param {object} [options]
 * @returns {SaxJsonStream}
 */
export function createStream(options) {
  return new SaxJsonStream(options);
}

export { SaxJsonParser, SaxJsonStream, State, SAX_EVENTS, MAX_BUFFER_LENGTH };

export default {
  createParser,
  SaxJsonParser,
  createStream,
  SaxJsonStream,
  MAX_BUFFER_LENGTH,
  DEBUG,
  INFO,
  SAX_EVENTS,
  State,
};
