/**
 * Netflix Cadmium Player - PlayerConfig (Module 29204)
 *
 * Central configuration module for the entire Cadmium streaming player.
 * Manages all player settings including codec support, DRM, ABR (adaptive bitrate),
 * buffering, network, live streaming, timed text (subtitles), logging, and more.
 *
 * Configuration values are sourced from:
 *   1. Initial parameters passed at player creation
 *   2. Default platform configuration values
 *   3. A "cadmiumconfig" cookie for overrides
 *   4. Test account overrides (all defaults applied)
 *   5. Runtime re-application via applyConfig()
 *
 * Each config property is a lazy getter backed by one of the typed parsers
 * (parseBoolean, parseInteger, parseFloat, parseString, etc.) which validate
 * and coerce raw string/object values from the merged config map.
 *
 * Referenced as "config" by virtually every other module in the player.
 *
 * @module PlayerConfig
 * @see Module 18128 (PlayerSession) - primary consumer
 * @see Module 52569 (defaultConfigurationValues / cookie helpers)
 * @see Module 87141 (config freezer / immutable snapshot builder)
 */

// ─── Dependency Imports (original webpack module IDs) ───────────────────────
import * as Constants from './Module_33096';           // c - global constants (endTime, preferredLanguages, etc.)
import * as ConfigDefaults from './Module_52569';      // g - defaultConfigurationValues(), cookie reader uSc()
import * as Platform from './Module_31276';            // f - log, disposableList (service locator)
import * as EnumTokens from './Module_34231';          // e - enumConstants token
import { assert } from './Module_45146';               // h - assertion utility
import * as CapabilityTypes from './Module_56800';     // k - video/audio capability detector type enums
import * as TimedTextProfiles from './Module_75568';   // l - timed text profile constants (gs.UDa, gs.xX)
import * as ObjectUtils from './Module_3887';          // m - forEachProperty, parseInteger, assignProperties
// import './Module_87386';                            // side-effect only import
import * as JsonUtils from './Module_22365';           // n - cla() JSON helper, forEach
import * as TypeChecks from './Module_32687';          // q - type checking (isString, isObject, isArray, isNumber, isDefined, etc.)
import * as SeekConstants from './Module_93294';       // r - pKa (small seek delta constant)
import * as PlaydataToken from './Module_45118';       // u - oq (playdata logger token)
import * as LogBlobToken from './Module_31850';        // v - hG (log blob builder token)
import * as PlatformDefaults from './Module_5614';     // w - IX (platform default config values)
import * as AbrDefaults from './Module_45247';         // x - observableValue (ABR default config)
import * as UnitTypes from './Module_72574';           // y - unitConversion constant
import * as TimeUnits from './Module_5021';            // A - MILLISECONDS enum
import * as PlatformToken from './Module_91581';       // z - PlatformToken (TOa = isTestAccount)
import * as ClockToken from './Module_81918';          // B - ClockToken (.id for sampling)
import * as ArrayHelpers from './Module_88195';        // C - flattenAndMap
import createImmutableSnapshot from './Module_87141';  // config freezer

// ─── Playback Type Classification ───────────────────────────────────────────

/**
 * Known playback surface types used to select per-type config overrides.
 * @readonly
 * @enum {string}
 */
const PlaybackType = Object.freeze({
  BILLBOARD: 'billboard',
  PREPLAY: 'preplay',
  EMBEDDED: 'embedded',
  CONTENT_SAMPLING: 'content-sampling',
  VIDEO_MERCH_BOB_HORIZONTAL: 'video-merch-bob-horizontal',
  MINI_MODAL_HORIZONTAL: 'mini-modal-horizontal',
  STANDARD: 'standard',
  BRANCHING: 'branching',
  LIVE: 'live',
});

/**
 * Classifies a UI context string into a canonical playback type.
 *
 * @param {string} uiContext - The raw UI context identifier (e.g. "billboard-autoplay", "standard-hd")
 * @returns {string|undefined} The canonical playback type, or the original string if unrecognised
 */
function classifyPlaybackType(uiContext) {
  if (!uiContext) return undefined;

  const lower = uiContext.toLowerCase();

  if (uiContext.includes('billboard')) return PlaybackType.BILLBOARD;
  if (lower.includes('preplay')) return PlaybackType.PREPLAY;
  if (uiContext.includes('embedded')) return PlaybackType.EMBEDDED;
  if (uiContext.includes('content-sampling')) return PlaybackType.CONTENT_SAMPLING;
  if (uiContext.includes('video-merch-bob-horizontal')) return PlaybackType.VIDEO_MERCH_BOB_HORIZONTAL;
  if (uiContext.includes('mini-modal-horizontal')) return PlaybackType.MINI_MODAL_HORIZONTAL;
  if (uiContext.includes('standard')) return PlaybackType.STANDARD;
  if (uiContext.includes('branching')) return PlaybackType.BRANCHING;
  if (uiContext.includes('live')) return PlaybackType.LIVE;

  return uiContext;
}

/**
 * Returns the per-playback-type configuration overrides for a given UI context.
 *
 * @param {string} uiContext - The raw UI context identifier
 * @returns {Object} Type-specific config overrides, or empty object if none found
 */
function getPlaybackConfigForType(uiContext) {
  const typeConfig = config.playbackConfigByType[classifyPlaybackType(uiContext)];
  return typeConfig ?? {};
}

// ─── Exported Config Object ─────────────────────────────────────────────────

/**
 * The live, mutable configuration object consumed by all player subsystems.
 * Properties are populated by {@link initializeConfig} and updated by {@link applyConfig}.
 * @type {Object}
 */
export const config = {};

// ─── Config Initialization ──────────────────────────────────────────────────

/**
 * Initialise the player configuration from initial parameters and overrides.
 *
 * This is the main entry point called once during player bootstrap. It:
 *   1. Merges initial params, string overrides, and object overrides into a flat map
 *   2. Loads defaults and cookie overrides
 *   3. For test accounts, applies all defaults unconditionally
 *   4. Defines every config property as a lazy, type-validated getter
 *   5. Calls applyConfig() to populate the exported `config` object
 *
 * @param {Array<string|Object>} configOverrides - Array of config override sources
 *        (strings are comma-separated "key=value" pairs; objects are merged directly)
 * @param {Object} initialParams - Initial flat key/value parameter map
 * @returns {void}
 *
 * @example
 *   initializeConfig(
 *     ["enableHDR=true,enableHEVC=true", { esn: "NFANDROID..." }],
 *     { enableAV1: "false" }
 *   );
 */
export function initializeConfig(configOverrides, initialParams) {
  /** @type {RegExp} Pattern for percentage-or-integer values like "5%" or "100" */
  const PERCENT_OR_INT_PATTERN = /^[0-9]+[%]?$/;

  /** @type {RegExp} Pattern for pure integer strings */
  const INTEGER_PATTERN = /^[0-9]*$/;

  /**
   * Map of config keys that were forced via test-account defaults.
   * Used to re-apply these values after each applyConfig() call.
   * @type {Object<string, *>}
   */
  const forcedTestOverrides = {};

  /** Service locator references */
  const enumConstants = Platform.disposableList.key(EnumTokens.enumConstants);
  const platformDefaults = Platform.disposableList.key(PlatformDefaults.IX);

  // ─── Merged config map (all sources collapsed to lowercase keys) ──────

  /** @type {Object<string, *>} The merged, case-insensitive config map */
  let configMap;

  /** @type {Object<string, *>} Default config values (from platform + hardcoded) */
  let defaultValues;

  // ─── Internal Helper: Deep-apply config template to target ────────────

  /**
   * Recursively applies a config template to a target object.
   * If a template value is a function, it is called with the current target value.
   * If it is an object, recurse into sub-properties.
   *
   * @param {Object} template - The config definition template (property getters)
   * @param {Object} target - The target config object to populate
   */
  function applyTemplate(template, target) {
    ObjectUtils.forEachProperty(template, (key, value) => {
      if (TypeChecks.typeofChecker(value)) {
        // value is a function (lazy getter) -- call it to produce the config value
        target[key] = value.call(undefined, target[key]);
      } else if (TypeChecks.sB(value)) {
        // value is a plain object -- recurse
        target[key] = target[key] || {};
        applyTemplate(value, target[key]);
      }
    });
  }

  // ─── Typed Config Parsers ─────────────────────────────────────────────

  /**
   * Creates a deferred config getter. When eventually called (during applyConfig),
   * it reads from the current configMap, validates/coerces the value, and returns it.
   *
   * @param {Function} parser - One of the typed parse functions (parseBoolean, parseIntRange, etc.)
   * @param {string} key - The config key name (will be lowercased)
   * @param {*} defaultValue - Default value if key is missing or invalid
   * @param {...*} extraArgs - Additional arguments forwarded to the parser
   * @returns {Function} A getter function: (overrideDefault?) => parsedValue
   */
  function createConfigGetter(parser, key, defaultValue, ...extraArgs) {
    return function configGetter(overrideDefault) {
      if (TypeChecks.gd(overrideDefault)) {
        defaultValue = overrideDefault;
      }
      assert(TypeChecks.typeofChecker(parser));
      return parser(key, defaultValue, ...extraArgs);
    };
  }

  /**
   * Registers a config key for test-account forced defaults.
   * If the key exists in the default values map, it is copied into configMap and forcedTestOverrides.
   *
   * @param {string} key - Config key name
   * @returns {string} The lowercased key
   */
  function registerDefaultOverride(key) {
    key = key.toLowerCase();
    if (defaultValues.hasOwnProperty(key)) {
      configMap[key] = defaultValues[key];
      forcedTestOverrides[key] = defaultValues[key];
    }
    return key;
  }

  /**
   * Retrieves and validates a config value by key, applying an optional validator/transformer.
   *
   * @param {string} key - Config key name (case-insensitive)
   * @param {*} defaultValue - Returned if key is missing or value is invalid
   * @param {Function} [validator] - Optional function to validate/transform the raw value.
   *        Should return the value if valid, or undefined to reject it.
   * @returns {*} The validated config value, or the default
   */
  function getConfigValue(key, defaultValue, validator) {
    key = key.toLowerCase();
    if (!configMap.hasOwnProperty(key)) {
      return defaultValue;
    }

    let value = configMap[key];
    try {
      value = validator ? validator(value) : value;
    } catch (_err) {
      value = undefined;
    }

    if (value !== undefined) {
      return value;
    }

    assert(false);
    Platform.log.error('Invalid configuration value. Name: ' + key);
    return defaultValue;
  }

  /**
   * Parses a config value as an integer, validating it falls within an optional
   * inclusive range. Uses `gGb` which allows the value to equal min but not max (half-open).
   *
   * @param {string} key - Config key
   * @param {number} defaultValue - Default integer
   * @param {number} [min] - Minimum allowed value
   * @param {number} [max] - Maximum allowed value (exclusive)
   * @returns {number}
   */
  function parseIntHalfOpen(key, defaultValue, min, max) {
    return getConfigValue(key, defaultValue, (raw) => {
      if (TypeChecks.arrayCheck(raw)) raw = ObjectUtils.parseInteger(raw);
      if (TypeChecks.gGb(raw, min, max)) return raw;
    });
  }

  /**
   * Parses a config value as an integer within an inclusive range.
   *
   * @param {string} key - Config key
   * @param {number} defaultValue - Default integer
   * @param {number} [min] - Minimum allowed value (inclusive)
   * @param {number} [max] - Maximum allowed value (inclusive)
   * @returns {number}
   */
  function parseIntRange(key, defaultValue, min, max) {
    return getConfigValue(key, defaultValue, (raw) => {
      if (TypeChecks.arrayCheck(raw)) raw = ObjectUtils.parseInteger(raw);
      if (TypeChecks.EM(raw, min, max)) return raw;
    });
  }

  /**
   * Parses a config value as a floating-point number within an inclusive range.
   *
   * @param {string} key - Config key
   * @param {number} defaultValue - Default float
   * @param {number} [min] - Minimum allowed value
   * @param {number} [max] - Maximum allowed value
   * @returns {number}
   */
  function parseFloatRange(key, defaultValue, min, max) {
    return getConfigValue(key, defaultValue, (raw) => {
      if (TypeChecks.arrayCheck(raw)) raw = parseFloat(raw);
      if (TypeChecks.wc(raw, min, max)) return raw;
    });
  }

  /**
   * Parses a config value as a string, optionally validated against a regex pattern.
   *
   * @param {string} key - Config key
   * @param {string} [defaultValue] - Default string
   * @param {RegExp} [pattern] - Optional regex the value must match
   * @returns {string}
   */
  function parseString(key, defaultValue, pattern) {
    return getConfigValue(key, defaultValue, (raw) => {
      if (pattern ? pattern.test(raw) : TypeChecks.arrayCheck(raw)) return raw;
    });
  }

  /**
   * Parses a config value as a boolean. Accepts "true"/"false" strings as well as boolean literals.
   *
   * @param {string} key - Config key
   * @param {boolean} [defaultValue] - Default boolean
   * @returns {boolean}
   */
  function parseBoolean(key, defaultValue) {
    return getConfigValue(key, defaultValue, (raw) => {
      if (raw === 'true' || raw === true) return true;
      if (raw === 'false' || raw === false) return false;
    });
  }

  /**
   * Parses a config value as a JSON object. Handles both string (parsed) and object (pass-through) values.
   *
   * @param {string} key - Config key
   * @param {Object} [defaultValue] - Default object
   * @returns {Object}
   */
  function parseJsonObject(key, defaultValue) {
    return getConfigValue(key, defaultValue, (raw) => {
      if (TypeChecks.arrayCheck(raw)) {
        return JSON.videoSampleEntry(JsonUtils.cla(raw));
      }
      if (TypeChecks.sB(raw)) return raw;
    });
  }

  /**
   * Generic complex value parser supporting string serialisation formats.
   * Handles JSON-encoded strings (starting with a delimiter character),
   * pipe-delimited strings, and pre-parsed values.
   *
   * @param {string} key - Config key
   * @param {*} defaultValue - Default value
   * @param {string} delimiter - Expected first character for JSON-encoded strings
   * @param {Function} stringParser - Converts a raw string into the desired type
   * @param {Function[]} validators - Array of validator functions; all must return true
   * @param {Function} [transformer] - Optional post-validation transformer
   * @returns {*}
   */
  function parseComplex(key, defaultValue, delimiter, stringParser, validators, transformer) {
    key = key.toLowerCase();
    let value;
    if (configMap.hasOwnProperty(key)) {
      value = configMap[key];
    }

    if (!TypeChecks.gd(value)) return defaultValue;

    if (TypeChecks.arrayCheck(value)) {
      if (value[0] !== delimiter) {
        value = stringParser(value);
      } else {
        try {
          value = JSON.videoSampleEntry(JsonUtils.cla(value));
        } catch (_err) {
          value = undefined;
        }
      }
    }

    if (value === undefined) return defaultValue;

    for (let i = 0; i < validators.length; i++) {
      if (!validators[i](value)) return defaultValue;
    }

    return transformer ? transformer(value) : value;
  }

  /**
   * Parses a pipe-delimited integer array config value.
   *
   * @param {string} key - Config key
   * @param {number[]} defaultValue - Default array
   * @param {number} [min] - Min allowed value for each element
   * @param {number} [max] - Max allowed value for each element
   * @param {number} [minLength] - Minimum required array length
   * @returns {number[]}
   */
  function parseIntArray(key, defaultValue, min, max, minLength) {
    return parseComplex(key, defaultValue, '[', (raw) => {
      const parts = raw.split('|');
      for (let i = parts.length; i--;) {
        parts[i] = ObjectUtils.parseInteger(parts[i]);
      }
      return parts;
    }, [
      (arr) => TypeChecks.isArray(arr) && arr.length > 0,
      (arr) => {
        for (let i = arr.length; i--;) {
          if (!TypeChecks.EM(arr[i], min, max)) return false;
        }
        return true;
      },
      (arr) => minLength === undefined || arr.length >= minLength,
    ]);
  }

  /**
   * Parses a pipe-delimited JSON object array config value.
   *
   * @param {string} key - Config key
   * @param {Object[]} defaultValue - Default array of objects
   * @returns {Object[]}
   */
  function parseJsonObjectArray(key, defaultValue) {
    return parseComplex(key, defaultValue, '[', (raw) => {
      const parts = TypeChecks.isArray(raw) ? raw : raw.split('|');
      for (let i = parts.length; i--;) {
        try {
          parts[i] = JSON.videoSampleEntry(JsonUtils.cla(parts[i]));
        } catch (_err) {
          return undefined;
        }
      }
      return parts;
    }, [
      (arr) => TypeChecks.isArray(arr) && arr.length > 0,
      (arr) => {
        for (let i = arr.length; i--;) {
          if (!TypeChecks.gd(arr[i]) || !TypeChecks.sB(arr[i])) return false;
        }
        return true;
      },
    ]);
  }

  /**
   * Parses a profile list or flattens a nested array into a flat mapped result.
   * Falls back to {@link parseJsonObjectArray} if the flat array form is empty.
   *
   * @param {string} key - Config key
   * @param {*} defaultValue - Default value
   * @returns {*}
   */
  function parseProfileList(key, defaultValue) {
    const flat = parseStringArray(key, []);
    return (flat && flat.length > 0)
      ? ArrayHelpers.flattenAndMap(flat)
      : parseJsonObjectArray(key, defaultValue);
  }

  /**
   * Parses a pipe-delimited string array config value, with optional regex validation.
   *
   * @param {string} key - Config key
   * @param {string[]} defaultValue - Default array
   * @param {RegExp} [pattern] - Optional pattern each element must match
   * @param {number} [minLength] - Minimum required array length
   * @returns {string[]}
   */
  function parseStringArray(key, defaultValue, pattern, minLength) {
    return parseComplex(key, defaultValue, '[', (raw) => {
      return TypeChecks.isArray(raw) ? raw : raw.split('|');
    }, [
      (arr) => TypeChecks.isArray(arr) && arr.length > 0,
      (arr) => {
        for (let i = arr.length; i--;) {
          if (pattern ? !pattern.test(arr[i]) : !TypeChecks.n1(arr[i])) return false;
        }
        return true;
      },
      (arr) => minLength === undefined || arr.length >= minLength,
    ]);
  }

  /**
   * Parses a semicolon-delimited key:value map config value.
   *
   * @param {string} key - Config key
   * @param {Object} defaultValue - Default map
   * @param {RegExp} [valuePattern] - Optional pattern each value must match
   * @returns {Object}
   */
  function parseKeyValueMap(key, defaultValue, valuePattern) {
    return parseComplex(key, defaultValue, '{', (raw) => {
      const result = {};
      const pairs = raw.split(';');
      for (let i = pairs.length; i--;) {
        const pair = pairs[i];
        const colonIdx = pair.indexOf(':');
        if (colonIdx <= 0) return undefined;
        result[pair.substring(0, colonIdx)] = pair.substring(colonIdx + 1);
      }
      return result;
    }, [
      (obj) => TypeChecks.sB(obj) && Object.keys(obj).length > 0,
      (obj) => {
        if (!valuePattern) return true;
        for (const k in obj) {
          if (!valuePattern.test(obj[k])) return false;
        }
        return true;
      },
    ], (obj) => {
      const merged = {};
      ObjectUtils.assignProperties(merged, defaultValue);
      ObjectUtils.assignProperties(merged, obj);
      return merged;
    });
  }

  /**
   * Serialises a config map to a human-readable "key=value" string for logging.
   *
   * @param {Object} map - Config map to serialise
   * @returns {string} Newline-delimited key=value string
   */
  function serializeConfigForLog(map) {
    const entries = [];
    ObjectUtils.forEachProperty(map, (key, value) => {
      let serialised;
      try {
        serialised = (key.toLowerCase() === 'videoapp') ? '[object object]' : JSON.stringify(value);
      } catch (_err) {
        serialised = 'cantparse';
      }
      entries.push(key + '=' + serialised);
    });
    return entries.join('\n');
  }

  // ─── Phase 1: Merge all config sources into configMap ─────────────────

  /**
   * Parses a comma-separated "key=value,key=value" string into the configMap.
   * @param {string} raw - Comma-separated config string
   */
  function parseConfigString(raw) {
    raw.split(',').forEach((pair) => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx > 0) {
        configMap[pair.substring(0, eqIdx).toLowerCase()] = pair.substring(eqIdx + 1);
      }
    });
  }

  // Build the merged config map from initial params + overrides
  configMap = {};
  ObjectUtils.assignProperties(configMap, initialParams);

  if (configOverrides && configOverrides.length) {
    JsonUtils.forEach.call(configOverrides, (override) => {
      if (TypeChecks.arrayCheck(override)) {
        // String override: "key=val,key=val"
        parseConfigString(override);
      } else if (TypeChecks.sB(override)) {
        // Object override: merge directly (lowercase keys)
        ObjectUtils.assignProperties(configMap, override, { aea: true });
      }
    });
  }

  // Load default configuration values from platform
  defaultValues = ObjectUtils.assignProperties({}, ConfigDefaults.defaultConfigurationValues(), { aea: true });

  // Apply cookie-based overrides if present
  const cookieConfig = ConfigDefaults.uSc().cadmiumconfig;
  if (cookieConfig) {
    Platform.log.info('Config cookie loaded', cookieConfig);
    parseConfigString(cookieConfig);
  }

  // For test accounts, apply all default values unconditionally
  if (Platform.disposableList.key(PlatformToken.PlatformToken).TOa || configMap.istestaccount) {
    ObjectUtils.assignProperties(configMap, defaultValues);
    Object.assign(forcedTestOverrides, defaultValues);
  }

  // ─── Phase 2: Define the config property template ─────────────────────

  /** Shorthand aliases for readability */
  const B = parseBoolean;
  const I = parseIntRange;
  const M = parseIntHalfOpen;
  const F = parseFloatRange;
  const S = parseString;
  const J = parseJsonObject;
  const IA = parseIntArray;
  const JA = parseJsonObjectArray;
  const PL = parseProfileList;
  const SA = parseStringArray;
  const KV = parseKeyValueMap;
  const G = createConfigGetter;
  const R = registerDefaultOverride;

  /**
   * The config template: each property is either a lazy getter function
   * (created by createConfigGetter) or a nested object of the same structure.
   * When applyConfig() runs, applyTemplate() walks this tree and calls each
   * getter, writing the result into the exported `config` object.
   */
  const configTemplate = {
    // ── Audio Codec Support ───────────────────────────────────────
    enableXHEAAC:                     G(B, R('enableXHEAAC'), false),
    enableDDPlus51:                   G(B, R('enableDDPlus51'), false),
    enableDDPlusAtmos:                G(B, R('enableDDPlusAtmos'), false),
    enableLSSDH:                      G(B, R('enableLSSDH'), true),

    // ── Video Codec Support ──────────────────────────────────────
    enableHEVC:                       G(B, R('enableHEVC'), false),
    overrideEnableHEVC:               G(B, R('overrideEnableHEVC'), false),
    enableHDR:                        G(B, R('enableHDR'), false),
    overrideEnableHDR:                G(B, R('overrideEnableHDR'), false),
    overrideEnableHdrDisplay:         G(B, R('overrideEnableHdrDisplay'), false),
    overrideEnableDV:                 G(B, R('overrideEnableDV'), false),
    enableAV1:                        G(B, R('enableAV1'), false),
    overrideEnableAV1:                G(B, R('overrideEnableAV1'), false),
    enableAV1HDR10P:                  G(B, R('enableAV1HDR10P'), false),
    overrideEnableAV1HDR10P:          G(B, R('overrideEnableAV1HDR10P'), false),
    overrideEnableXHEAAC:             G(B, R('overrideEnableXHEAAC'), false),
    overrideEnableAllAudioProfiles:   G(B, 'overrideEnableAllAudioProfiles', false),
    overrideEnableAllVideoProfiles:   G(B, 'overrideEnableAllVideoProfiles', false),
    enablePRK:                        G(B, R('enablePRK'), false),
    enableDV:                         G(B, R('enableDV'), false),
    enableHWDRM:                      G(B, R('enableHWDRM'), false),
    enableHwdrmOnArm:                 G(B, R('enableHwdrmOnArm'), false),
    disablePlayReady:                 G(B, R('disablePlayReady'), false),
    enableImageSubs:                  G(B, R('enableImageSubs'), true),

    // ── Profile Lists ────────────────────────────────────────────
    audioProfiles:                    G(PL, R('audioProfiles'), platformDefaults.iL),
    enableFullHdForSWDRM:             G(B, R('enableFullHdForSWDRM'), false),
    enableFullHdForHWDRM:             G(B, R('enableFullHdForHWDRM'), false),
    enableUHD:                        G(B, R('enableUHD'), true),
    videoCapabilityDetectorType:      G(I, 'videoCapabilityDetectorType', CapabilityTypes.ks.Default),
    audioCapabilityDetectorType:      G(I, 'audioCapabilityDetectorType', CapabilityTypes.XF.Default),
    supportedVideoProfiles:           G(PL, R('videoProfiles'), platformDefaults.supportedVideoProfiles),
    supportedAudioProfiles:           G(PL, R('liveVideoProfiles'), platformDefaults.supportedAudioProfiles),
    additionalVideoProfiles:          G(PL, R('additionalVideoProfiles'), []),

    // ── Timed Text (Subtitle) Profiles ───────────────────────────
    /** @private Raw timed text profiles before filtering */
    _rawTimedTextProfiles:            G(SA, R('timedTextProfiles'), platformDefaults.defaultProfiles),
    /** Filtered timed text profiles (removes LSSDH/image-subs if disabled) */
    timedTextProfiles() {
      return this._rawTimedTextProfiles().filter((profile) => {
        if (profile === TimedTextProfiles.gs.UDa) return configTemplate.enableLSSDH();
        if (profile === TimedTextProfiles.gs.xX) return configTemplate.enableImageSubs();
        return true;
      });
    },

    // ── Endpoint & Version ───────────────────────────────────────
    endpoint:                         G(B, R('endpoint'), false),
    version:                          G(S, 'version', 'unknown'),

    // ── DRM / HDCP ───────────────────────────────────────────────
    enableHdcp:                       G(B, R('enableHdcp'), false),
    enableManifestCache:              G(B, R('prepareCadmium'), false),
    acceptManifestOnPrepareItemParams: G(B, R('acceptManifestOnPrepareItemParams'), true),
    prefetchPipelineConfig:           G(J, 'ppmconfig', { maxNumberTitlesScheduled: 1 }),
    enableLdlPrefetch:                G(B, R('enableLdlPrefetch'), false),
    enableMediaPrefetch:              G(B, R('enableMediaPrefetch'), AbrDefaults.observableValue.enableMediaPrefetch),
    enableManifestCacheStorage:       G(B, R('enableManifestCache'), true),
    deleteCachedManifestOnPlayback:   G(B, R('deleteCachedManifestOnPlayback'), false),
    deleteCachedManifestOnCreate:     G(B, R('deleteCachedManifestOnCreate'), false),
    deleteOtherManifestCacheOnCreate: G(B, R('deleteOtherManifestCacheOnCreate'), false),
    deleteOtherLdlCacheOnCreate:      G(B, R('deleteOtherLdlCacheOnCreate'), false),
    periodicPrepareLogsIntervalMs:    G(I, R('periodicPrepareLogsIntervalMilliseconds'), 3600000),
    prepareManifestCacheMaxCount:     G(I, R('prepareManifestCacheMaxCount'), 50),
    prepareLdlCacheMaxCount:          G(I, R('prepareLdlCacheMaxCount'), 30),
    prepareManifestExpiryMs:          G(I, R('prepareManifestExpiryMilliseconds'), 1200000),
    prepareLdlExpiryMs:              G(I, R('prepareLdlExpiryMilliseconds'), 780000),
    prefetcherMaxWishlistSize:        G(I, R('prefetcherMaxWishlistSize'), 10),
    prefetcherBudgetInBytes:          G(I, R('prefetcherBudgetInBytes'), Infinity),
    prefetcherOverrideItemPriority:   G(B, R('prefetcherOverrideItemPriority'), true),
    prepareInsertStrategyPersistentTasks: G(S, R('prepareInsertStrategyPersistentTasks'), 'append', /^(prepend|append|ignore)$/),

    // ── App & Platform ───────────────────────────────────────────
    videoApp:                         G(J, 'videoApp'),
    storageRules:                     G(J, 'storageRules'),
    ftlEnabled:                       G(B, 'ftlEnabled', true),
    imageSubsResolution:              G(I, R('imageSubsResolution'), 0),
    imageSubsMaxBuffer:               G(I, R('imageSubsMaxBuffer'), platformDefaults.decoderBufferBytes.toUnit(UnitTypes.unitConversion), 0),
    captureBatteryStatus:             G(B, R('captureBatteryStatus'), false),
    getBatteryApiTimeoutMs:           G(I, R('getBatteryApiTimeoutMilliseconds'), 5000),

    // ── Key System / DRM ─────────────────────────────────────────
    keySystemId:                      G(S, R('keySystemId'), platformDefaults.yB),
    keySystemList:                    G(SA, R('keySystemList'), undefined, undefined),
    validateKeySystemAccess:          G(B, R('validateKeySystemAccess'), false),
    hdcpGlobalTimeout1:               G(I, R('hdcpGlobalTimeout1'), 10000),
    hdcpGlobalTimeout2:               G(I, R('hdcpGlobalTimeout2'), 10000),
    hdcpQueryTimeout1:                G(I, R('hdcpQueryTimeout1'), 1000),
    hdcpQueryTimeout2:                G(I, R('hdcpQueryTimeout2'), 1000),
    hdcpQueryRetryDelay:              G(I, R('hdcpQueryTimeout2'), 100),
    microsoftHwdrmRequiresHevc:       G(B, R('microsoftHwdrmRequiresHevc'), false),
    microsoftHwdrmRequiresQHD:        G(B, R('microsoftHwdrmRequiresQHD'), false),
    minimumMajorOsVersionForHwdrm:    G(I, R('minimumMajorOsVersionForHwdrm'), 15),
    microsoftClearLeadRequiresSwdrm:  G(B, R('microsoftClearLeadRequiresSwdrm'), false),
    enableAvcHighHwdrm:               G(B, R('enableAvcHighHwdrm'), false),
    enableHevcPrkHwdrm:               G(B, R('enableHevcPrkHwdrm'), false),
    enableMediaCapabilities:          G(B, R('enableMediaCapabilities'), false),
    powerEfficientForVideo:           G(B, R('powerEfficientForVideo'), false),
    spatialRenderingForDolbyAudio:    G(B, R('spatialRenderingForDolbyAudio'), true),
    enableMediaCapabilitiesSourceBufferCheck: G(B, R('enableMediaCapabilitiesSourceBufferCheck'), false),
    logMediaPipelineStatus:           G(B, 'logMediaPipelineStatus', false),

    // ── Diagnostics & Logging ────────────────────────────────────
    renderDomDiagnostics:             G(B, R('renderDomDiagnostics'), true),
    /** @returns {number} Always -1 (unused placeholder) */
    maxLogEntryAge() { return -1; },
    defaultSegmentDurationMs:         G(M, R('logDisplayMaxEntryCount'), platformDefaults.defaultSegmentDurationMs, -1),
    logToConsoleLevel:                G(M, R('logToConsoleLevel'), -1),
    bladerunnerCmdHistorySize:        G(M, R('bladerunnerCmdHistorySize'), 10),
    /** @returns {*} Environment constant from platform */
    environment() { return enumConstants.bE; },
    logErrorIfEsnNotProvided:         G(B, 'logErrorIfEsnNotProvided', true),

    // ── Session Management ───────────────────────────────────────
    enforceSinglePlayback:            G(B, 'enforceSinglePlayback', platformDefaults.enforceSinglePlayback),
    enforceSingleSession:             G(B, 'enforceSingleSession', platformDefaults.enforceSingleSession),
    closeOtherPlaybacks:              G(B, 'closeOtherPlaybacks', true),
    asyncLoadTimeout:                 G(I, 'asyncLoadTimeout', 15000, 1),
    mainThreadMonitorPollRate:        G(I, 'mainThreadMonitorPollRate', 0),

    /** @returns {string} Platform group name */
    groupName() { return enumConstants.groupName; },
    /** @returns {*} Platform wZ property */
    wZ() { return enumConstants.wZ; },
    /** @returns {*} Platform pia property */
    pia() { return enumConstants.pia; },

    verbosePlaybackInfoDenominator:   G(I, R('verbosePlaybackInfoDenominator'), 0),

    // ── Timed Text (Subtitle) Rendering ──────────────────────────
    renderTimedText:                  G(B, 'renderTimedText', true),
    preBufferTimedText:               G(B, 'preBufferTimedText', true),
    fatalOnTimedTextLoadError:        G(B, 'fatalOnTimedTextLoadError', true),
    timedTextStyleDefaults:           G(KV, 'timedTextStyleDefaults', { characterSize: 'MEDIUM' }),
    timedTextStyleOverrides:          G(KV, 'timedTextStyleOverrides', {}),
    timedTextFontFamilyMapping:       G(KV, 'timedTextFontFamilyMapping', platformDefaults.timedTextFontFamilyMapping || { 'default': 'font-family:Arial,Helvetica;font-weight:bolder' }),
    timedTextSimpleFallbackThreshold: G(I, 'timedTextSimpleFallbackThreshold', platformDefaults.timedTextSimpleFallbackThreshold.toUnit(UnitTypes.unitConversion)),
    complexLanguages:                 G(SA, R('increasedMediumScaleLanguageList'), platformDefaults.complexLanguages),
    fullComplexLanguages:             G(SA, R('increasedSmallScaleLanguageList'), platformDefaults.fullComplexLanguages),
    noWeightLanguages:                G(SA, R('lessBoldLanguageList'), platformDefaults.noWeightLanguages),
    customDfxpUrl:                    G(S, R('customDfxpUrl')),
    enableSubtitleTrackerLogging:     G(B, R('enableSubtitleTrackerLogging'), false),
    sendSubtitleQoeLogblobOnMidplay:  G(B, R('sendSubtitleQoeLogblobOnMidplay'), false),

    // ── CDN Selection ────────────────────────────────────────────
    cdnIdWhiteList:                   G(IA, 'cdnIdWhiteList', []),
    cdnIdBlackList:                   G(IA, 'cdnIdBlackList', []),

    // ── Track Forcing ────────────────────────────────────────────
    forceAudioTrack:                  G(S, R('forceAudioTrack')),
    forceTimedTextTrack:              G(S, R('forceTimedTextTrack')),
    maxRetriesTimedTextDownload:      G(I, R('maxRetriesTimedTextDownload'), 0),
    timedTextRetryInterval:           G(I, R('timedTextRetryInterval'), 8000),

    // ── Storage ──────────────────────────────────────────────────
    storageType:                      G(S, 'storageType', 'idb', /^(none|fs|idb|ls)$/),
    lockExpiration:                   G(I, 'lockExpiration', 10000),
    lockRefresh:                      G(I, 'lockRefresh', 3000),

    // ── Error Handling ───────────────────────────────────────────
    captureUnhandledExceptions:       G(B, 'captureUnhandledExceptions', true),
    ignoreUnhandledExceptionDuringPlayback: G(B, 'ignoreUnhandledExceptionDuringPlayback', true),
    unhandledExceptionsArePlaybackErrors: G(B, 'unhandledExceptionsArePlaybackErrors', false),
    unhandledExceptionSource:         G(S, 'unhandledExceptionSource', ''),

    // ── Playback Behaviour ───────────────────────────────────────
    preserveLastFrame:                G(B, 'preserveLastFrame', false),
    minBufferingTimeInMilliseconds:   G(I, 'minBufferingTimeInMilliseconds', 4000),
    progressBackwardsGraceTimeMs:     G(I, 'progressBackwardsGraceTimeMilliseconds', 4000),
    progressBackwardsMinPercent:      G(I, 'progressBackwardsMinPercent', 10),
    bookmarkIgnoreBeginning:          G(S, R('bookmarkIgnoreBeginning'), '0', PERCENT_OR_INT_PATTERN),
    bookmarkIgnoreEnd:                G(S, R('bookmarkIgnoreEnd'), '5%', PERCENT_OR_INT_PATTERN),
    bookmarkIgnoreEndForBranching:    G(S, R('bookmarkIgnoreEndForBranching'), '60000', PERCENT_OR_INT_PATTERN),

    // ── Networking ───────────────────────────────────────────────
    maxParallelConnections:           G(I, 'maxParallelConnections', 3),
    reportThroughputInLogblobs:       G(B, 'reportThroughputInLogblobs', true),
    minAudioMediaRequestDuration:     G(I, 'minAudioMediaRequestDuration', 4000),
    minAudioMediaRequestDurationBranching: G(I, 'minAudioMediaRequestDurationBranching', 0),
    minVideoMediaRequestDuration:     G(I, 'minVideoMediaRequestDuration', 4000),
    minVideoMediaRequestDurationVariableGOP: G(I, 'minVideoMediaRequestDurationVariableGOP', 0),
    minVideoMediaRequestDurationBranching: G(I, 'minVideoMediaRequestDurationBranching', 0),
    minAudioMediaRequestSizeBytes:    G(I, 'minAudioMediaRequestSizeBytes', 0),
    minVideoMediaRequestSizeBytes:    G(I, 'minVideoMediaRequestSizeBytes', 0),

    // ── Dropped Frame Rate Filtering ─────────────────────────────
    droppedFrameRateFilterEnabled:    G(B, 'droppedFrameRateFilterEnabled', false),
    droppedFrameRateFilterMaxObservation: G(I, 'droppedFrameRateFilterMaxObservation', 60, 10, 1000),
    /**
     * Dropped frame rate filter policy: array of [threshold, maxFrameDropPercent] pairs.
     * Parsed from a special semicolon+pipe delimited format.
     */
    droppedFrameRateFilterPolicy: G(
      function parseDroppedFramePolicy(key, defaultValue, min, max, tupleLength, minLength) {
        return parseComplex(key, defaultValue, '[', (raw) => {
          const rows = raw.split(';');
          for (let i = rows.length; i--;) {
            rows[i] = rows[i].split('|');
            for (let j = rows[i].length; j--;) {
              rows[i][j] = ObjectUtils.parseInteger(rows[i][j]);
            }
          }
          return rows;
        }, [
          (arr) => TypeChecks.isArray(arr) && arr.length > 0,
          (arr) => {
            for (let i = arr.length; i-- && arr !== undefined;) {
              if (!TypeChecks.isArray(arr[i])) return false;
              for (let j = arr[i].length; j--;) {
                if (!TypeChecks.EM(arr[i][j], min, max)) return false;
              }
            }
            return true;
          },
          (arr) => {
            if (tupleLength === undefined) return true;
            for (let i = arr.length; i--;) {
              if (tupleLength !== arr[i].length) return false;
            }
            return true;
          },
          (arr) => minLength === undefined || arr.length >= minLength,
        ]);
      },
      'droppedFrameRateFilterPolicy',
      [[4, 15], [8, 9], [12, 2], [20, 1]],
      undefined, undefined, 2, 0
    ),
    droppedFrameRateFilterMinHeight:  G(I, 'droppedFrameRateFilterMinHeight', 384),
    droppedFramesPercentilesList:     G(IA, 'droppedFramesPercentilesList', []),

    // ── Microsoft-specific Filters ───────────────────────────────
    microsoftScreenSizeFilterEnabled: G(B, 'microsoftScreenSizeFilterEnabled', false),
    keyStatusFilterEnabled:           G(B, 'keyStatusFilterEnabled', true),
    uiLabelFilterEnabled:             G(B, 'uiLabelFilterEnabled', true),
    uiLabelFilter:                    G(J, 'uiLabelFilter', {}),

    // ── Volume / Playback Rate ───────────────────────────────────
    defaultVolume:                    G(I, R('defaultVolume'), 100, 0, 100),
    maxPlaybackRate:                  G(I, R('maxPlaybackRate'), 2, 0, 16),
    fastForwardAds:                   G(B, 'fastForwardAds', false),
    disableVideoRightClickMenu:       G(B, 'disableVideoRightClickMenu', false),
    disablePictureInPicture:          G(B, 'disablePictureInPicture', true),

    // ── Decoder Buffer ───────────────────────────────────────────
    minDecoderBufferMilliseconds:     G(I, 'minDecoderBufferMilliseconds', 1000, 0, Constants.endTime),
    optimalDecoderBufferMilliseconds: G(I, 'optimalDecoderBufferMilliseconds', 5000, 0, Constants.endTime),
    optimalDecoderBufferMillisecondsBranching: G(I, 'optimalDecoderBufferMillisecondsBranching', 3000, 0, Constants.endTime),
    minimumTimeBeforeBranchDecision:  G(I, 'minimumTimeBeforeBranchDecision', 3000, 0, Constants.endTime),
    minimumTimeBeforeDelayedSeekToQueuedSegment: G(I, 'minimumTimeBeforeDelayedSeekToQueuedSegment', 500, 0, Constants.endTime),
    maxDecoderBufferMilliseconds:     G(I, 'maxDecoderBufferMilliseconds', platformDefaults.maxDecoderBufferMilliseconds.toUnit(TimeUnits.MILLISECONDS), 0, Constants.endTime),
    decoderTimeoutMilliseconds:       G(I, 'decoderTimeoutMilliseconds', 10000, 1),
    noRenderTimeoutMilliseconds:      G(I, 'noRenderTimeoutMilliseconds', 0),
    gapsTimeoutMilliseconds:          G(I, 'gapsTimeoutMilliseconds', 500),
    monitorAudioGaps:                 G(B, 'monitorAudioGaps', true),
    pauseTimeoutLimitMilliseconds:    G(I, 'pauseTimeoutLimitMilliseconds', 1800000),
    inactivityMonitorInterval:        G(I, 'inactivityMonitorInterval', 30000, 0),
    abrdelLogPointsSeconds:           G(IA, 'abrdelLogPointsSeconds', [15, 30, 60, 120], 0, undefined, 4),

    // ── Trick Play ───────────────────────────────────────────────
    enableTrickPlay:                  G(B, 'enableTrickPlay', false),
    additionalDownloadSimulationParams: G(IA, 'additionalDownloadSimulationParams', [2000, 2000, 100], 0, undefined, 3),
    trickPlayHighResolutionBitrateThreshold: G(I, 'trickPlayHighResolutionBitrateThreshold', 1000),
    trickPlayHighResolutionThresholdMs: G(I, 'trickPlayHighResolutionThresholdMilliseconds', 10000),
    trickplayBufferFactor:            G(F, 'trickplayBufferFactor', 0.5),
    trickPlayDownloadRetryCount:      G(I, 'trickPlayDownloadRetryCount', 1),

    // ── ABR (Adaptive Bitrate) Algorithm ─────────────────────────
    marginPredictor:                  G(S, 'marginPredictor', 'simple', /^(simple|scale|iqr|percentile|ci)$/),
    experimentalFilter:               G(SA, 'experimentalFilter', ['throughput-wssl']),
    ciPredictorSource:                G(S, 'ciPredictorSource', 'throughput-ci'),
    simulationDurationStrategy:       G(S, 'simulationDurationStrategy', 'default'),
    networkMeasurementGranularity:    G(S, 'networkMeasurementGranularity', 'video_location', /^(location|video_location)$/),
    maxIQRSamples:                    G(M, 'maxIQRSamples', Infinity),
    minIQRSamples:                    G(M, 'minIQRSamples', 5),
    useResourceTimingAPI:             G(B, 'useResourceTimingAPI', false),
    ignoreFirstByte:                  G(B, 'ignoreFirstByte', true),

    // ── Network Retry / Timeout ──────────────────────────────────
    failedDownloadRetryWaitsASE:      G(IA, 'failedDownloadRetryWaitsASE', [200, 500, 1000, 2000, 4000]),
    connectTimeoutMilliseconds:       G(I, 'connectTimeoutMilliseconds', 8000, 500),
    noProgressTimeoutMilliseconds:    G(I, 'noProgressTimeoutMilliseconds', 8000, 500),
    timedTextDownloadRetryCountBeforeCdnSwitch: G(I, 'timedTextDownloadRetryCountBeforeCdnSwitch', 3),
    netflixRequestExpiryTimeout:      G(I, 'netflixRequestExpiryTimeout', 0),
    webkitDecodedFrameCountIncorrectlyReported: G(B, 'webkitDecodedFrameCountIncorrectlyReported', false),
    supportedAudioTrackTypes:         G(SA, R('supportedAudioTrackTypes'), [], undefined, 1),

    // ── Playdata / Logblob ───────────────────────────────────────
    initialLogFlushTimeout:           G(I, 'initialLogFlushTimeout', 5000),
    playdataPersistKey:               G(S, 'playdataPersistKey', enumConstants.bE ? 'unsentplaydatatest' : 'unsentplaydata'),
    sendPersistedPlaydata:            G(B, 'sendPersistedPlaydata', true),
    playdataPersistIntervalMs:        G(I, 'playdataPersistIntervalMilliseconds', 4000),
    playdataSendDelayMs:              G(I, 'playdataSendDelayMilliseconds', 10000),
    sendPlaydataBackupOnInit:         G(B, 'sendPlaydataBackupOnInit', true),
    logPerformanceTiming:             G(SA, 'logPerformanceTiming', 'navigationStart redirectStart fetchStart secureConnectionStart requestStart domLoading'.split(' ')),
    midplayEnabled:                   G(B, 'midplayEnabled', true),
    midplayIntervalMs:                G(I, 'midplayIntervalMilliseconds', 300000),
    midplayKeyPoints:                 G(IA, 'midplayKeyPoints', [15000, 30000, 60000, 120000]),
    downloadReportDenominator:        G(I, 'downloadReportDenominator', 0),
    downloadReportInterval:           G(I, 'downloadReportInterval', 300000),
    logConfigApplyDenominator:        G(I, 'logConfigApplyDenominator', 0),

    // ── License / DRM Session ────────────────────────────────────
    bookmarkByMovieId:                G(KV, R('bookmarkByMovieId'), {}),
    forceLimitedDurationLicense:      G(B, R('forceLimitedDurationLicense'), false),
    licenseRenewalRequestDelay:       G(I, R('licenseRenewalRequestDelay'), 0),
    persistedReleaseDelay:            G(I, R('persistedReleaseDelay'), 10000),
    limitedDurationFlagOverride:      G(B, R('limitedDurationFlagOverride'), undefined),
    safariPlayPauseWorkaroundDelay:   G(I, 'safariPlayPauseWorkaroundDelay', 100),
    workaroundValueForSeekIssue:      G(I, 'workaroundValueForSeekIssue', 1200),
    enableTimedTextFallback:          G(B, R('callEndOfStream'), platformDefaults.enableTimedTextFallback),
    performRewindCheck:               G(B, 'performRewindCheck', false),
    logUnexpectedRewindDelay:         G(I, 'logUnexpectedRewindDelay', 1000),
    fatalOnUnexpectedSeeking:         G(B, 'fatalOnUnexpectedSeeking', true),
    fatalOnUnexpectedSeeked:          G(B, 'fatalOnUnexpectedSeeked', true),
    fatalOnManifestMismatch:          G(B, 'fatalOnManifestMistmatch', true),
    delayPlayPause:                   G(I, R('delayPlayPause'), 0),
    useEncryptedEvent:                G(B, R('useEncryptedEvent'), true),
    drmPersistKey:                    G(S, R('drmPersistKey'), 'unsentDrmData'),
    nudgeSourceBuffer:                G(B, R('nudgeSourceBuffer'), false),
    seekDelta:                        G(M, R('seekDelta'), 1),
    preciseSeeking:                   G(B, R('preciseSeeking'), false),
    preciseSeekingOnTwoCoreDevice:    G(B, R('preciseSeekingOnTwoCoreDevice'), false),
    delayErrorHandling:               G(KV, R('delayErrorHandling')),

    // ── ESN / Identity ───────────────────────────────────────────
    esn:                              G(S, 'esn', ''),
    fesn:                             G(S, 'fesn', ''),
    enablePerformanceLogging:         G(B, R('enablePerformanceLogging'), false),
    enableEmeVerboseLogging:          G(B, R('enableEmeVerboseLogging'), false),
    appId:                            G(S, 'appId', '', INTEGER_PATTERN),
    drmSessionId:                     G(S, 'sessionId', '', INTEGER_PATTERN),
    cdnProxyUrl:                      G(S, 'cdnProxyUrl'),
    forceXhrErrorResponseCode:        G(I, 'forceXhrErrorResponseCode', undefined),

    // ── MSL (Message Security Layer) API ─────────────────────────
    mslConfig: {
      mslApiPath:                     G(S, 'mslApiPath', '/msl/'),
      proxyPath:                      G(S, 'proxyPath', ''),
      uiVersion:                      G(S, 'uiVersion'),
      uiPlatform:                     G(S, 'uiPlatform'),
      /** @returns {string} Always "0" */
      clientVersion() { return '0'; },
      preferredLanguages:             G(SA, 'preferredLanguages', Constants.mbb, /^[a-zA-Z-]{2,5}$/, 1),
      forceDebugLogLevel:             G(S, R('forceDebugLogLevel'), undefined, /^(ERROR|WARN|INFO|TRACE)$/),
      supportPreviewContentPin:       G(B, 'supportPreviewContentPin', true),
      supportWatermarking:            G(B, 'supportWatermarking', true),
      showAllSubDubTracks:            G(B, 'showAllSubDubTracks', false),
      failOnGuidMismatch:             G(B, R('failOnGuidMismatch'), false),
    },

    // ── QC (Quality Check) ───────────────────────────────────────
    qcConfig: {
      enabled:                        G(B, 'qcEnabled', false),
      qcPackageId:                    G(S, 'qcPackageId', ''),
    },

    // ── Network / Request ────────────────────────────────────────
    useRangeHeader:                   G(B, 'useRangeHeader', false),
    enableMilestoneEventList:         G(B, 'enableMilestoneEventList', true),
    authenticationKeyNames:           G(KV, 'authenticationKeyNames', ObjectUtils.assignProperties({ e: 'DKE', h: 'DKH', w: 'DKW', s: 'DKS' })),
    systemKeyWrapFormat:              G(S, 'systemKeyWrapFormat'),
    shouldSendUserAuthData:           G(B, 'shouldSendUserAuthData', true),
    sendUserAuthIfRequired:           G(B, 'sendUserAuthIfRequired', platformDefaults.sendUserAuthIfRequired),
    shouldClearUserData:              G(B, 'shouldClearUserData', false),
    supportsMatrixPlayback:           G(B, 'usesMsl', true),
    mslDeleteStore:                   G(B, 'mslDeleteStore', false),
    mslPersistStore:                  G(B, 'mslPersistStore', true),
    correctNetworkForShortTitles:     G(B, 'correctNetworkForShortTitles', true),
    supportsUnequalizedDownloadables: G(B, 'supportsUnequalizedDownloadables', true),
    debugAseDenominator:              G(I, R('debugAseDenominator'), 100),

    // ── ASE (Adaptive Streaming Engine) Buffer Sizes ─────────────
    aseAudioBufferSizeBytes:          G(I, 'aseAudioBufferSizeBytes', platformDefaults.aseAudioBufferSizeBytes.toUnit(UnitTypes.unitConversion)),
    aseVideoBufferSizeBytes:          G(I, 'aseVideoBufferSizeBytes', platformDefaults.aseVideoBufferSizeBytes.toUnit(UnitTypes.unitConversion)),
    aseTextBufferSizeBytes:           G(I, 'aseTextBufferSizeBytes', platformDefaults.aseTextBufferSizeBytes.toUnit(UnitTypes.unitConversion)),

    // ── ABR Bitrate / Buffer Targets ─────────────────────────────
    minInitVideoBitrate:              G(I, 'minInitVideoBitrate', AbrDefaults.observableValue.minInitVideoBitrate),
    maxInitVideoBitrate:              G(I, 'maxInitVideoBitrate', AbrDefaults.observableValue.maxInitVideoBitrate),
    minInitAudioBitrate:              G(I, 'minInitAudioBitrate', AbrDefaults.observableValue.minInitAudioBitrate),
    maxInitAudioBitrate:              G(I, 'maxInitAudioBitrate', AbrDefaults.observableValue.$u),
    minAllowedVideoBitrate:           G(I, 'minAllowedVideoBitrate', AbrDefaults.observableValue.minAllowedVideoBitrate),
    maxAllowedVideoBitrate:           G(I, 'maxAllowedVideoBitrate', AbrDefaults.observableValue.maxAllowedVideoBitrate),
    switchableAudioProfiles:          G(SA, 'switchableAudioProfiles', AbrDefaults.observableValue.switchableAudioProfiles),
    switchableAudioProfilesOverride:  G(JA, 'switchableAudioProfilesOverride', AbrDefaults.observableValue.switchableAudioProfilesOverride),
    minAcceptableVideoBitrate:        G(I, 'minAcceptableVideoBitrate', AbrDefaults.observableValue.minAcceptableVideoBitrate),
    minRequiredBuffer:                G(I, 'minRequiredBuffer', AbrDefaults.observableValue.minRequiredBuffer),
    minPrebufSize:                    G(I, 'minPrebufSize', AbrDefaults.observableValue.minPrebufSize),
    minCheckBufferingCompleteInterval: G(I, 'minCheckBufferingCompleteInterval', AbrDefaults.observableValue.minCheckBufferingCompleteInterval),
    rebufferingFactor:                G(F, 'rebufferingFactor', AbrDefaults.observableValue.rebufferingFactor),
    maxBufferingTime:                 G(I, 'maxBufferingTime', AbrDefaults.observableValue.$s),
    useMaxPrebufSize:                 G(B, 'useMaxPrebufSize', AbrDefaults.observableValue.useMaxPrebufSize),
    maxPrebufSize:                    G(I, 'maxPrebufSize', AbrDefaults.observableValue.maxPrebufSize),
    maxRebufSize:                     G(I, 'maxRebufSize', AbrDefaults.observableValue.maxRebufSize),
    initialBitrateSelectionCurve:     G(JA, 'initialBitrateSelectionCurve', AbrDefaults.observableValue.initialBitrateSelectionCurve),
    throughputPercentForAudio:        G(I, 'throughputPercentForAudio', AbrDefaults.observableValue.throughputPercentForAudio),
    bandwidthMargin:                  G(I, 'bandwidthMargin', AbrDefaults.observableValue.h$),
    bandwidthMarginContinuous:        G(B, 'bandwidthMarginContinuous', AbrDefaults.observableValue.i$),
    bandwidthMarginCurve:             G(JA, 'bandwidthMarginCurve', AbrDefaults.observableValue.j$),
    conservBandwidthMargin:           G(I, 'conservBandwidthMargin', AbrDefaults.observableValue.P$),
    switchConfigBasedOnInSessionTput: G(B, 'switchConfigBasedOnInSessionTput', AbrDefaults.observableValue.switchConfigBasedOnInSessionTput),
    conservBandwidthMarginTputThreshold: G(I, 'conservBandwidthMarginTputThreshold', AbrDefaults.observableValue.R$),
    conservBandwidthMarginCurve:      G(JA, 'conservBandwidthMarginCurve', AbrDefaults.observableValue.Q$),
    maxTotalBufferLevelPerSession:    G(I, 'maxTotalBufferLevelPerSession', AbrDefaults.observableValue.maxTotalBufferLevelPerSession),

    // ── Playgraph / Combined Playback ────────────────────────────
    enableCombinedPlaygraphs:         G(B, 'enableCombinedPlaygraphs', AbrDefaults.observableValue.enableCombinedPlaygraphs),
    enableAdPlaygraphs:               G(B, 'enableAdPlaygraphs', AbrDefaults.observableValue.$D),
    enableLiveProgramPlaygraphs:      G(B, 'enableLiveProgramPlaygraphs', AbrDefaults.observableValue.enableLiveProgramPlaygraphs),
    enableLiveProgramPlaygraphsForLinear: G(B, 'enableLiveProgramPlaygraphsForLinear', AbrDefaults.observableValue.enableLiveProgramPlaygraphsForLinear),
    enableLiveAdPlaygraphs:           G(B, 'enableLiveAdPlaygraphs', AbrDefaults.observableValue.enableLiveAdPlaygraphs),
    exposeDroppedAdsToUI:             G(B, R('exposeDroppedAdsToUI'), AbrDefaults.observableValue.exposeDroppedAdsToUI),
    retainSbrOnFade:                  G(B, 'retainSbrOnFade', AbrDefaults.observableValue.retainSbrOnFade),
    excludedContentPlaygraphIds:      G(SA, 'excludedContentPlaygraphIds', AbrDefaults.observableValue.excludedContentPlaygraphIds),
    enableDiscontiguousBuffering:     G(B, 'enableDiscontiguousBuffering', AbrDefaults.observableValue.enableDiscontiguousBuffering),
    forceImmediateTransitionTypeForTitles: G(IA, 'forceImmediateTransitionTypeForTitles', AbrDefaults.observableValue.forceImmediateTransitionTypeForTitles),
    forceImmediateTransitionExitZone: G(I, 'forceImmediateTransitionExitZone', AbrDefaults.observableValue.forceImmediateTransitionExitZone),

    // ── Buffer Management ────────────────────────────────────────
    useBufferSizeLimiter:             G(B, 'useBufferSizeLimiter', AbrDefaults.observableValue.useBufferSizeLimiter),
    skipBitrateInUpswitch:            G(B, 'skipBitrateInUpswitch', AbrDefaults.observableValue.skipBitrateInUpswitch),
    watermarkLevelForSkipStart:       G(I, 'watermarkLevelForSkipStart', AbrDefaults.observableValue.watermarkLevelForSkipStart),
    highStreamRetentionWindow:        G(I, 'highStreamRetentionWindow', AbrDefaults.observableValue.highStreamRetentionWindow),
    lowStreamTransitionWindow:        G(I, 'lowStreamTransitionWindow', AbrDefaults.observableValue.lowStreamTransitionWindow),
    highStreamRetentionWindowUp:      G(I, 'highStreamRetentionWindowUp', AbrDefaults.observableValue.highStreamRetentionWindowUp),
    lowStreamTransitionWindowUp:      G(I, 'lowStreamTransitionWindowUp', AbrDefaults.observableValue.lowStreamTransitionWindowUp),
    highStreamRetentionWindowDown:    G(I, 'highStreamRetentionWindowDown', AbrDefaults.observableValue.highStreamRetentionWindowDown),
    lowStreamTransitionWindowDown:    G(I, 'lowStreamTransitionWindowDown', AbrDefaults.observableValue.lowStreamTransitionWindowDown),
    highStreamInfeasibleBitrateFactor: G(F, 'highStreamInfeasibleBitrateFactor', AbrDefaults.observableValue.highStreamInfeasibleBitrateFactor),
    lowestBufForUpswitch:             G(I, 'lowestBufForUpswitch', AbrDefaults.observableValue.lowestBufForUpswitch),
    lockPeriodAfterDownswitch:        G(I, 'lockPeriodAfterDownswitch', AbrDefaults.observableValue.lockPeriodAfterDownswitch),
    lowWatermarkLevel:                G(I, 'lowWatermarkLevel', AbrDefaults.observableValue.lowWatermarkLevel),
    lowestWaterMarkLevel:             G(I, 'lowestWaterMarkLevel', AbrDefaults.observableValue.miniModalHorizontalLowestWaterMarkLevel),
    lowestWaterMarkLevelBufferRelaxed: G(B, 'lowestWaterMarkLevelBufferRelaxed', AbrDefaults.observableValue.$da),
    mediaRate:                        G(F, 'mediaRate', AbrDefaults.observableValue.mediaRate),
    maxTrailingBufferLen:             G(I, 'maxTrailingBufferLen', AbrDefaults.observableValue.maxTrailingBufferLen),
    audioBufferTargetAvailableSize:   G(I, 'audioBufferTargetAvailableSize', AbrDefaults.observableValue.audioBufferTargetAvailableSize),
    videoBufferTargetAvailableSize:   G(I, 'videoBufferTargetAvailableSize', AbrDefaults.observableValue.videoBufferTargetAvailableSize),
    fastUpswitchFactor:               G(F, 'fastUpswitchFactor', AbrDefaults.observableValue.fastUpswitchFactor),
    fastDownswitchFactor:             G(F, 'fastDownswitchFactor', AbrDefaults.observableValue.fastDownswitchFactor),
    maxMediaBufferAllowed:            G(I, 'maxMediaBufferAllowed', AbrDefaults.observableValue.maxMediaBufferAllowed),
    maxLiveMediaBufferAllowed:        G(I, 'maxLiveMediaBufferAllowed', AbrDefaults.observableValue.maxLiveMediaBufferAllowed),
    simulatePartialBlocks:            G(B, 'simulatePartialBlocks', AbrDefaults.observableValue.simulatePartialBlocks),
    considerConnectTime:              G(B, 'considerConnectTime', AbrDefaults.observableValue.S$),
    connectTimeMultiplier:            G(F, 'connectTimeMultiplier', AbrDefaults.observableValue.O$),

    // ── Network Error Handling ───────────────────────────────────
    maxNetworkErrorsDuringBuffering:  G(I, 'maxNetworkErrorsDuringBuffering', AbrDefaults.observableValue.maxNetworkErrorsDuringBuffering),
    maxBufferingTimeAllowedWithNetworkError: G(I, 'maxBufferingTimeAllowedWithNetworkError', AbrDefaults.observableValue.maxBufferingTimeAllowedWithNetworkError),
    probeServerWhenError:             G(B, 'probeServerWhenError', AbrDefaults.observableValue.probeServerWhenError),
    probeRequestTimeoutMs:            G(I, 'probeRequestTimeoutMilliseconds', AbrDefaults.observableValue.probeRequestTimeoutMilliseconds),
    allowSwitchback:                  G(B, 'allowSwitchback', AbrDefaults.observableValue.allowSwitchback),
    probeDetailDenominator:           G(I, 'probeDetailDenominator', AbrDefaults.observableValue.probeDetailDenominator),
    minProbeIntervalMs:               G(I, 'minProbeIntervalMs', AbrDefaults.observableValue.minProbeIntervalMs),
    maxDelayToReportFailure:          G(I, 'maxDelayToReportFailure', AbrDefaults.observableValue.maxDelayToReportFailure),
    locationStatisticsUpdateInterval: G(I, 'locationStatisticsUpdateInterval', AbrDefaults.observableValue.locationStatisticsUpdateInterval),

    // ── Header / Pipeline ────────────────────────────────────────
    headerRequestSize:                G(I, 'headerRequestSize', 4096),
    estimateHeaderSize:               G(B, 'estimateHeaderSize', false),
    minBufferLenForHeaderDownloading: G(I, 'minBufferLenForHeaderDownloading', 10000),
    pipelineEnabled:                  G(B, 'pipelineEnabled', false),
    socketReceiveBufferSize:          G(I, 'socketReceiveBufferSize', 0),
    audioSocketReceiveBufferSize:     G(I, 'audioSocketReceiveBufferSize', 32768),
    videoSocketReceiveBufferSize:     G(I, 'videoSocketReceiveBufferSize', 65536),
    headersSocketReceiveBufferSize:   G(I, 'headersSocketReceiveBufferSize', 32768),
    bufferLevelNotifyIntervalMs:      G(I, 'bufferLevelNotifyIntervalMs', 2000),

    // ── ASE Reporting ────────────────────────────────────────────
    aseReportDenominator:             G(I, 'aseReportDenominator', 0),
    aseReportIntervalMs:              G(I, 'aseReportIntervalMs', 300000),
    prebufferTimeLimit:               G(I, 'prebufferTimeLimit', 240000),

    // ── Connection Quality ───────────────────────────────────────
    penaltyFactorForLongConnectTime:  G(I, 'penaltyFactorForLongConnectTime', 2),
    longConnectTimeThreshold:         G(I, 'longConnectTimeThreshold', 200),
    additionalBufferingLongConnectTime: G(I, 'additionalBufferingLongConnectTime', 2000),
    additionalBufferingPerFailure:    G(I, 'additionalBufferingPerFailure', 8000),
    rebufferCheckDuration:            G(I, 'rebufferCheckDuration', 60000),

    // ── OC Side Channel ──────────────────────────────────────────
    enableOCSideChannel:              G(B, 'enableOCSideChannel', true),
    OCSCBufferQuantizationConfig:     G(J, 'OCSCBufferQuantizationConfig', { lv: 5, mx: 240 }),

    // ── Header Cache ─────────────────────────────────────────────
    defaultHeaderCacheSize:           G(I, 'defaultHeaderCacheSize', 4),
    defaultHeaderCacheDataPrefetchMs: G(I, 'defaultHeaderCacheDataPrefetchMs', 8000),

    // ── Network Failure ──────────────────────────────────────────
    networkFailureResetWaitMs:        G(I, 'networkFailureResetWaitMs', 2000),
    networkFailureAbandonMs:          G(I, 'networkFailureAbandonMs', 120000),
    maxThrottledNetworkFailures:      G(I, 'maxThrottledNetworkFailures', 3),
    throttledNetworkFailureThresholdMs: G(I, 'throttledNetworkFailureThresholdMs', 2000),
    lowThroughputThreshold:           G(M, 'lowThroughputThreshold', 400),
    excludeSessionWithoutHistoryFromLowThroughputThreshold: G(B, 'excludeSessionWithoutHistoryFromLowThroughputThreshold', false),
    requireAudioStreamToEncompassVideo: G(B, 'requireAudioStreamToEncompassVideo', true),
    enableManagerDebugTraces:         G(B, 'enableManagerDebugTraces', false),
    notifyManifestCacheEom:           G(B, 'notifyManifestCacheEom', false),
    periodicHistoryPersistMs:         G(I, 'periodicHistoryPersistMs', 300000),
    saveBitrateMs:                    G(I, 'saveBitrateMs', 180000),
    waitForDrmToAppendMedia:          G(B, 'waitForDrmToAppendMedia', false),
    forceAppendHeadersAfterDrm:       G(B, R('forceAppendHeadersAfterDrm'), false),
    forceAppendEncryptedStreamHeaderFirst: G(B, R('forceAppendEncryptedStreamHeaderFirst'), true),

    // ── Network Interruption History ─────────────────────────────
    netIntrStoreWindow:               G(I, 'netIntrStoreWindow', 36000),
    minNetIntrDuration:               G(I, 'minNetIntrDuration', 8000),
    fastHistoricBandwidthExpirationTime: G(I, 'fastHistoricBandwidthExpirationTime', 10368000),
    bandwidthExpirationTime:          G(I, 'bandwidthExpirationTime', 5184000),
    failureExpirationTime:            G(I, 'failureExpirationTime', 86400),
    historyTimeOfDayGranularity:      G(I, 'historyTimeOfDayGranularity', 4),
    expandDownloadTime:               G(B, 'expandDownloadTime', false),
    ignoreShortResponses:             G(B, 'ignoreShortResponses', false),
    shortResponseDurationMs:          G(B, 'shortResponseDurationMs', 10),
    shortResponseBytes:               G(B, 'shortResponseBytes', 10000),
    minimumMeasurementTime:           G(I, 'minimumMeasurementTime', 500),
    minimumMeasurementBytes:          G(I, 'minimumMeasurementBytes', 131072),
    probingMeasurementTime:           G(I, 'probingMeasurementTime', 2000),
    probingMeasurementBytes:          G(I, 'probingMeasurementBytes', 262144),
    historicBandwidthUpdateInterval:  G(I, 'historicBandwidthUpdateInterval', 2000),

    // ── Throughput Estimators / Filters ──────────────────────────
    secondThroughputEstimator:        G(S, 'secondThroughputEstimator', 'none'),
    enableFilters:                    G(SA, 'enableFilters', 'throughput-ewma throughput-sw throughput-sw-fast throughput-iqr throughput-tdigest avtp entropy'.split(' ')),
    filterDefinitionOverrides:        G(J, 'filterDefinitionOverrides', {}),
    defaultFilter:                    G(S, 'defaultFilter', 'throughput-ewma'),
    secondaryFilter:                  G(S, 'secondaryFilter', 'none'),
    /** Default throughput filter algorithm definitions */
    defaultFilterDefinitions:         G(J, 'defaultFilterDefinitions', {
      'throughput-ewma':              { type: 'discontiguous-ewma', mw: 5000, wt: 5000 },
      'throughput-sw':                { type: 'slidingwindow', mw: 5000 },
      'throughput-sw-fast':           { type: 'slidingwindow', mw: 500 },
      'throughput-iqr':               { type: 'iqr', mx: Infinity, mn: 5, bw: 15000, iv: 1000 },
      'throughput-iqr-history':       { type: 'iqr-history' },
      'throughput-location-history':  { type: 'discrete-ewma', hl: 14400, 'in': 3600 },
      'respconn-location-history':    { type: 'discrete-ewma', hl: 100, 'in': 25 },
      'throughput-tdigest':           { type: 'tdigest', maxc: 25, c: 0.5, b: 1000, w: 15000, mn: 6 },
      'throughput-tdigest-history':   { type: 'tdigest-history', maxc: 25, rc: 'ewma', c: 0.5, hl: 7200 },
      'respconn-ewma':               { type: 'discrete-ewma', hl: 10, 'in': 10 },
      average:                        { type: 'avtp' },
      entropy:                        { type: 'entropy', mw: 2000, sw: 60000, 'in': 'none', mins: 1, hdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958], uhdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958, 10657, 16322, 25000] },
    }),

    needMinimumNetworkConfidence:     G(B, 'needMinimumNetworkConfidence', true),
    biasTowardHistoricalThroughput:   G(B, 'biasTowardHistoricalThroughput', true),
    addHeaderDataToNetworkMonitor:    G(B, 'addHeaderDataToNetworkMonitor', false),
    startMonitorOnLoadStart:          G(B, 'startMonitorOnLoadStart', false),
    reportFailedRequestsToNetworkMonitor: G(B, 'reportFailedRequestsToNetworkMonitor', false),
    maxFastPlayBufferInMs:            G(M, 'maxFastPlayBufferInMs', Infinity),
    appendFirstHeaderOnComplete:      G(B, 'appendFirstHeaderOnComplete', true),

    // ── ASE Stream Selector ──────────────────────────────────────
    ase_stream_selector:              G(S, 'ase_stream_selector', 'optimized'),
    liveStreamSelectorAlgorithm:      G(S, 'liveStreamSelectorAlgorithm', 'livesimple'),
    jointStreamSelectorEnabled:       G(B, 'jointStreamSelectorEnabled', false),
    bufferingSelectorAlgorithm:       G(S, 'bufferingSelectorAlgorithm', 'default'),
    ase_dump_fragments:               G(B, 'ase_dump_fragments', false),
    ase_location_history:             G(I, 'ase_location_history', 0),
    historicByLocationOrGlobal:       G(S, 'historicByLocationOrGlobal', 'timedPerLocation'),

    // ── Polling / Timing ─────────────────────────────────────────
    pollingPeriod:                    G(I, 'pollingPeriod', 150),
    loadTimeMs:                       G(I, 'loadTimeMs', 180000),
    marginTimeMs:                     G(I, 'marginTimeMs', 10000),

    // ── Device / Log Blobs ───────────────────────────────────────
    getDeviceIdFromBindDevice:        G(B, 'getDeviceIdFromBindDevice', false),
    addFailedLogBlobsToQueue:         G(B, 'addFailedLogBlobsToQueue', true),

    // ── Per-Playback-Type Config Overrides ───────────────────────
    playbackConfigByType: {
      'content-sampling': {
        maxBufferingTime:                  G(I, 'contentSamplingMaxBufferingTime', 3000),
        selectStartingVMAFMethod:          G(S, 'contentSamplingSelectStartingVMAFMethod', AbrDefaults.observableValue.selectStartingVMAFMethod),
        activateSelectStartingVMAF:        G(B, 'contentSamplingActivateSelectStartingVMAF', true),
        minStartingVideoVMAF:              G(I, 'contentSamplingMinStartingVideoVMAF', 80),
        minAcceptableVMAF:                 G(I, 'contentSamplingMinAcceptableVMAF', 70),
        minAllowedVmaf:                    G(I, 'contentSamplingMinAllowedVmaf', 60),
      },
      billboard: {
        minInitVideoBitrate:               G(I, 'billboardMinInitVideoBitrate', 1050),
        maxInitVideoBitrate:               G(I, 'billboardMaxInitVideoBitrate', null),
        minPrebufSize:                     G(I, 'billboardMinPrebufSize', null),
        maxPrebufSize:                     G(I, 'billboardMaxPrebufSize', null),
        maxBufferingTime:                  G(I, 'billboardMaxBufferingTime', null),
        lowestWaterMarkLevel:              G(I, 'billboardLowestWaterMarkLevel', 6000),
        lowestBufForUpswitch:              G(I, 'billboardLowestBufForUpswitch', 25000),
        billboardSwitchConfigBasedOnThroughputHistory: G(S, 'billboardSwitchConfigBasedOnThroughputHistory', 'none', /^(none|iqr|avg)$/),
      },
      preplay: {
        minInitVideoBitrate:               G(I, 'preplayMinInitVideoBitrate', 1050),
        maxInitVideoBitrate:               G(I, 'preplayMaxInitVideoBitrate', null),
        minPrebufSize:                     G(I, 'preplayMinPrebufSize', null),
        maxPrebufSize:                     G(I, 'preplayMaxPrebufSize', null),
        maxBufferingTime:                  G(I, 'preplayMaxBufferingTime', null),
        lowestWaterMarkLevel:              G(I, 'preplayLowestWaterMarkLevel', 6000),
        lowestBufForUpswitch:              G(I, 'preplayLowestBufForUpswitch', 25000),
      },
      embedded: {
        minInitVideoBitrate:               G(I, 'embeddedMinInitVideoBitrate', 1050),
        maxInitVideoBitrate:               G(I, 'embeddedMaxInitVideoBitrate', null),
        minPrebufSize:                     G(I, 'embeddedMinPrebufSize', null),
        maxPrebufSize:                     G(I, 'embeddedMaxPrebufSize', null),
        maxBufferingTime:                  G(I, 'embeddedMaxBufferingTime', null),
        lowestWaterMarkLevel:              G(I, 'embeddedLowestWaterMarkLevel', 6000),
        lowestBufForUpswitch:              G(I, 'embeddedLowestBufForUpswitch', 25000),
      },
      'video-merch-bob-horizontal': {
        minInitVideoBitrate:               G(I, 'videoMerchBobHorizontalMinInitVideoBitrate', null),
        maxInitVideoBitrate:               G(I, 'videoMerchBobHorizontalMaxInitVideoBitrate', null),
        minPrebufSize:                     G(I, 'videoMerchBobHorizontalMinPrebufSize', null),
        maxPrebufSize:                     G(I, 'videoMerchBobHorizontalMaxPrebufSize', null),
        maxBufferingTime:                  G(I, 'videoMerchBobHorizontalMaxBufferingTime', null),
        lowestWaterMarkLevel:              G(I, 'videoMerchBobHorizontalLowestWaterMarkLevel', null),
        lowestBufForUpswitch:              G(I, 'videoMerchBobHorizontalLowestBufForUpswitch', null),
      },
      'mini-modal-horizontal': {
        minInitVideoBitrate:               G(I, 'miniModalHorizontalMinInitVideoBitrate', null),
        maxInitVideoBitrate:               G(I, 'miniModalHorizontalMaxInitVideoBitrate', null),
        minPrebufSize:                     G(I, 'miniModalHorizontalMinPrebufSize', null),
        maxPrebufSize:                     G(I, 'miniModalHorizontalMaxPrebufSize', null),
        maxBufferingTime:                  G(I, 'miniModalHorizontalMaxBufferingTime', 500),
        lowestWaterMarkLevel:              G(I, 'miniModalHorizontalLowestWaterMarkLevel', null),
        lowestBufForUpswitch:              G(I, 'miniModalHorizontalLowestBufForUpswitch', null),
      },
      live: {},
    },

    // ── Verbose / Seamless ───────────────────────────────────────
    enableVerbosePlaydelayLogging:    G(B, 'enableVerbosePlaydelayLogging', false),
    enableSeamless:                   G(B, 'enableSeamless', false),

    // ── Hindsight (Retrospective Quality Analysis) ───────────────
    hindsightDenominator:             G(I, 'hindsightDenominator', 0),
    hindsightDebugDenominator:        G(I, 'hindsightDebugDenominator', 0),
    hindsightParam:                   G(J, 'hindsightParam', { numB: Infinity, bSizeMs: 1000, fillS: 'last', fillHl: 1000 }),

    // ── Session History ──────────────────────────────────────────
    maxNumSessionHistoryStored:       G(I, 'maxNumSessionHistoryStored', 30),
    minSessionHistoryDuration:        G(I, 'minSessionHistoryDuration', 300000),
    maxActiveRequestsPerSession:      G(I, 'maxActiveRequestsPerSession', 3),
    maxActiveRequestsSABCell100:      G(I, 'maxActiveRequestsSABCell100', AbrDefaults.observableValue.maxActiveRequestsSABCell100),
    limitAudioDiscountByMaxAudioBitrate: G(B, 'limitAudioDiscountByMaxAudioBitrate', true),
    browserInfo:                      G(J, 'browserInfo', {}),

    // ── Misc ─────────────────────────────────────────────────────
    busyGracePeriod:                  G(I, R('busyGracePeriod'), 199),
    sendTransitionLogblob:            G(B, R('sendTransitionLogblob'), true),
    includeSegmentInfoOnLogblobs:     G(B, R('includeSegmentInfoOnLogblobs'), true),
    exposeTestData:                   G(B, 'exposeTestData', false),
    exposeErrorData:                  G(B, R('exposeErrorData'), false),

    // ── Audio Timestamp Offset Profiles ──────────────────────────
    applyProfileTimestampOffset:      G(B, R('applyProfileTimestampOffset'), false),
    profileTimestampOffsets:          G(J, R('profileTimestampOffsets'), {
      'heaac-2-dash':    { 64: { ticks: -3268, timescale: 48000 }, 96: { ticks: -3268, timescale: 48000 } },
      'heaac-2hq-dash':  { 128: { ticks: -3268, timescale: 48000 } },
      'heaac-5.1-dash':  { 192: { ticks: -3268, timescale: 48000 } },
    }),
    applyProfileStreamingOffset:      G(B, R('applyProfileStreamingOffset'), false),
    mediaSourceSupportsNegativePts:   G(B, R('mediaSourceSupportsNegativePts'), false),
    allowSmallSeekDelta:              G(B, R('allowSmallSeekDelta'), false),
    smallSeekDeltaThresholdMs:        G(I, R('smallSeekDeltaThresholdMilliseconds'), SeekConstants.pKa),

    // ── CDM Attested Descriptors ─────────────────────────────────
    enableCDMAttestedDescriptors:     G(B, 'enableCDMAttestedDescriptors', false),
    requireDownloadDataAtBuffering:   G(B, 'requireDownloadDataAtBuffering', AbrDefaults.observableValue.requireDownloadDataAtBuffering),
    requireSetupConnectionDuringBuffering: G(B, 'requireSetupConnectionDuringBuffering', AbrDefaults.observableValue.requireSetupConnectionDuringBuffering),

    // ── VMAF (Video Multi-Method Assessment Fusion) ──────────────
    useMobileVMAF:                    G(B, 'useMobileVMAF', false),
    desiredVMAFTypeMobile:            G(S, 'desiredVMAFTypeMobile', 'phone_plus_lts'),
    desiredVMAFTypeNonMobile:         G(S, 'desiredVMAFTypeNonMobile', 'plus_lts'),
    activateSelectStartingVMAF:       G(B, 'activateSelectStartingVMAF', AbrDefaults.observableValue.activateSelectStartingVMAF),
    minStartingVideoVMAF:             G(I, 'minStartingVideoVMAF', AbrDefaults.observableValue.minStartingVideoVMAF),
    minAcceptableVMAF:                G(I, 'minAcceptableVMAF', AbrDefaults.observableValue.minAcceptableVMAF),
    minAllowedVmaf:                   G(I, 'minAllowedVmaf', AbrDefaults.observableValue.minAllowedVmaf),
    maxAllowedOutstandingRequests:    G(I, 'maxAllowedOutstandingRequests', AbrDefaults.observableValue.maxAllowedOutstandingRequests),
    minStreamableConcurrencyWindow:   G(I, 'minStreamableConcurrencyWindow', AbrDefaults.observableValue.minStreamableConcurrencyWindow),
    streamableConcurrencyFactor:      G(F, 'streamableConcurrencyFactor', AbrDefaults.observableValue.streamableConcurrencyFactor),
    bufferingConcurrencyWindow:       G(I, 'bufferingConcurrencyWindow', AbrDefaults.observableValue.bufferingConcurrencyWindow),
    enableResolutionVMAFStreamFilter: G(B, 'enableResolutionVMAFStreamFilter', AbrDefaults.observableValue.enableResolutionVMAFStreamFilter),
    resolutionVMAFCappingRuleList:    G(J, 'resolutionVMAFCappingRuleList', AbrDefaults.observableValue.resolutionVMAFCappingRuleList),
    percentCapTitlesForResolutionVMAFStreamFilter: G(M, 'percentCapTitlesForResolutionVMAFStreamFilter', AbrDefaults.observableValue.percentCapTitlesForResolutionVMAFStreamFilter),

    // ── Skipping / HLS ───────────────────────────────────────────
    disableSkipping:                  G(B, 'disableSkipping', false),
    useHLSPlayer:                     G(B, 'useHLSPlayer', platformDefaults.useHLSPlayer),
    useExitZones:                     G(B, R('useExitZones'), AbrDefaults.observableValue.useExitZones),
    requestSegmentVmaf:               G(B, 'requestSegmentVmaf', false),
    perFragmentVMAFConfig:            G(J, 'perFragmentVMAFConfig', { enabled: false }),

    // ── Padding / PTS ────────────────────────────────────────────
    paddingDurationMs:                G(I, 'paddingDurationMs', 1000),
    paddingMediaType:                 G(S, 'paddingMediaType', 'padding'),
    paddingCodecSelector:             G(S, 'paddingCodecSelector', 'flexible'),
    supportsPtsChanged:               G(B, 'supportsPtsChanged', false),
    preferUnletterboxed:              G(B, R('preferUnletterboxed'), false),
    standaloneMode:                   G(B, 'standaloneMode', false),

    // ── Key System Restrictor ────────────────────────────────────
    enableKeySystemRestrictor:        G(B, 'enableKeySystemRestrictor', false),
    errorEventToRestrict:             G(I, 'errorEventToRestrict', 2),
    errorCodesToRestrict:             G(IA, 'errorCodesToRestrict', [7353, 7361, 7377, 7701, 7702, 7703, 7717]),
    errorCodesToCache:                G(IA, 'errorCodesToCache', [7353, 7361, 7377, 7701, 7702, 7703, 7717]),
    enableCachedErrors:               G(B, 'enableCachedErrors', false),
    cachedErrorCountLimit:            G(I, 'cachedErrorCountLimit', 20),
    cachedErrorExpirationSeconds:     G(I, 'cachedErrorExpirationSeconds', 604800),
    cachedErrorsStorageTimeoutSeconds: G(I, 'cachedErrorsStorageTimeoutSeconds', 2000),

    // ── Live Streaming ───────────────────────────────────────────
    liveEdgeCushion:                  G(M, 'liveEdgeCushion', 0),
    liveEdgeCushionWithSpreadMs:      G(M, 'liveEdgeCushionWithSpreadMs', 0),
    enableLive504Handling:            G(B, 'enableLive504Handling', false),
    liveStreamSelectorUseLatency:     G(B, 'liveStreamSelectorUseLatency', true),
    latencyMultiplierForLive:         G(F, 'latencyMultiplierForLive', 4),
    liveLowQualityAvoidance:          G(B, 'liveLowQualityAvoidance', true),
    liveLowQualityThreshold:          G(M, 'liveLowQualityThreshold', 850),
    liveLowQualityMultiplier:         G(F, 'liveLowQualityMultiplier', 6),
    liveBufferRatioStrategy:          G(B, 'liveBufferRatioStrategy', 'strict'),
    liveMaxUpswitchSteps:             G(M, 'liveMaxUpswitchSteps', Infinity),
    enableConditionalServerTimeUpdate: G(B, 'enableConditionalServerTimeUpdate', false),
    negligibleServerTimeDeltaDifference: G(M, 'negligibleServerTimeDeltaDifference', 1000),
    liveSwitchStreamsOnErrorInPipeline: G(B, 'liveSwitchStreamsOnErrorInPipeline', true),
    enableMissingSegmentsReplacement: G(B, 'enableMissingSegmentsReplacement', true),
    simulateLiveEdge:                 G(B, 'simulateLiveEdge', false),
    liveEdgeThreshold:                G(M, 'liveEdgeThreshold', 10000),
    forceDisableLiveUi:               G(B, 'forceDisableLiveUi', false),
    enableForceLiveEdgeAtEventStart:  G(B, 'enableForceLiveEdgeAtEventStart', true),
    enableForceLiveEdgeOnResumeInStartSlate: G(B, 'enableForceLiveEdgeOnResumeInStartSlate', true),
    enableLivePlaybackRateDriftCorrection: G(B, 'enableLivePlaybackRateDriftCorrection', false),
    livePlaybackRateMin:              G(F, 'livePlaybackRateMin', 0.98),
    livePlaybackRateMax:              G(F, 'livePlaybackRateMax', 1.02),
    livePlaybackRateAdjustmentThresholdMs: G(M, 'livePlaybackRateAdjustmentThresholdMs', 20),
    livePlaybackRateAdjustmentIntervalMs: G(M, 'livePlaybackRateAdjustmentIntervalMs', 1000),
    livePlaybackRateAdjustmentFactor: G(F, 'livePlaybackRateAdjustmentFactor', 0.1),
    forceAstRelativeLiveBookmark:     G(M, 'forceAstRelativeLiveBookmark', undefined),
    forceEstRelativeLiveBookmark:     G(M, 'forceEstRelativeLiveBookmark', undefined),
    startSlateMs:                     G(M, 'startSlateMs', undefined),
    liveSlateMs:                      G(M, 'liveSlateMs', undefined),
    enableLiveManifestReuse:          G(B, 'enableLiveManifestReuse', true),
    liveShouldAccountForPlayDelay:    G(B, 'liveShouldAccountForPlayDelay', false),
    livePrefetchEnabled:              G(B, 'livePrefetchEnabled', true),
    livePrefetchEnabledForStickySteering: G(B, 'livePrefetchEnabledForStickySteering', true),
    decryptOCSideChannelMinInterval:  G(M, 'decryptOCSideChannelMinInterval', 1000),
    decryptOCSideChannelMinIntervalAfterCompleted: G(M, 'decryptOCSideChannelMinIntervalAfterCompleted', 1000),
    enableLiveOCSideChannelRefresh:   G(B, 'enableLiveOCSideChannelRefresh', true),
    liveOCSideChannelRefreshInterval: G(M, 'liveOCSideChannelRefreshInterval', 30000),

    // ── Non-Seamless Transitions ─────────────────────────────────
    enableNonSeamlessTransitions:     G(B, R('enableNonSeamlessTransitions'), false),
    codecMismatchPatterns:            G(SA, R('videoCodecsRequiringNonSeamlessTransitions'), []),
    adBreakTransitionConfig:          G(SA, R('segmentTypesRequiringNonSeamlessTransitions'), []),
    playreadyAdsConfig:               G(SA, R('playreadySegmentTypesRequiringNonSeamlessTransitions'), []),

    // ── Live Origin / Spread ─────────────────────────────────────
    liveOriginOverride:               G(J, 'liveOriginOverride', undefined),
    liveRequestSpreadMs:              G(M, 'liveRequestSpreadMs', 1000),
    liveConsiderSpreadInCushion:      G(B, 'liveConsiderSpreadInCushion', false),
    enableTwoPartLiveFragmentEditing: G(B, 'enableTwoPartLiveFragmentEditing', true),
    liveSlowBufferFilling:            G(B, 'liveSlowBufferFilling', false),

    // ── LNA (Low Network Awareness) Mode ─────────────────────────
    lnaModeJitterMs:                  G(M, 'lnaModeJitterMs', 1200000),
    maxLNADuration:                   G(M, 'maxLNADuration', 36000000),
    forceDisableLNA:                  G(B, 'forceDisableLNA', false),

    // ── Live Ads ─────────────────────────────────────────────────
    liveAdsCapability:                G(S, 'liveAdsCapability', 'dynamic'),
    enableRequestAbandonment:         G(B, 'enableRequestAbandonment', false),
    pipelineHealthThresholdCriticalMs: G(M, 'pipelineHealthThresholdCriticalMs', 2000),
    pipelineHealthThresholdLowMs:     G(M, 'pipelineHealthThresholdLowMs', 6000),
    requestAbandonmentLockIntervalMs: G(M, 'requestAbandonmentLockIntervalMs', 10000),
    streamModeAppendAttachThreshold:  G(F, 'streamModeAppendAttachThreshold', 0.75),
    enableLiveAdsUi:                  G(B, 'enableLiveAdsUi', true),
    liveEarlyRequestProbability:      G(F, 'liveEarlyRequestProbability', 0.05),
    liveEarlyRequestDefaultOffsetMs:  G(M, 'liveEarlyRequestDefaultOffsetMs', -500),
    supportLiveIdrMismatch:           G(B, 'supportLiveIdrMismatch', false),
    synthesizeLiveIdrMismatch:        G(M, 'synthesizeLiveIdrMismatch', 0),
    alwaysRetainAds:                  G(B, 'alwaysRetainAds', false),
    enableMediaEventsTrack:           G(B, 'enableMediaEventsTrack', true),
    liveAdManifestWindowMs:           G(M, 'liveAdManifestWindowMs', 10000),
    liveAdManifestWindowAllowanceMs:  G(M, 'liveAdManifestWindowAllowanceMs', 5000),
    syntheticAdBreakUx:               G(S, 'syntheticAdBreakUx', ''),
    enableMediaEventHistory:          G(B, 'enableMediaEventHistory', AbrDefaults.observableValue.enableMediaEventHistory),
    enableLiveAdBreakReportingEvents: G(B, 'enableLiveAdBreakReportingEvents', AbrDefaults.observableValue.enableLiveAdBreakReportingEvents),
    enableBlackBoxNotification:       G(B, 'enableBlackBoxNotification', AbrDefaults.observableValue.enableBlackBoxNotification),
    liveAdEventJitterMs:              G(M, 'liveAdEventJitterMs', 60000),
    auxiliaryManifestTokenOverride:   G(S, 'auxiliaryManifestTokenOverride'),
    minimumPresentationDelayMs:       G(M, 'minimumPresentationDelayMs', AbrDefaults.observableValue.minimumPresentationDelayMs),
    liveEdgeSegmentSkipCount:         G(M, 'liveEdgeSegmentSkipCount', AbrDefaults.observableValue.liveEdgeSegmentSkipCount),
    probeBeforeSwitchingBackToPrimary: G(B, 'probeBeforeSwitchingBackToPrimary', AbrDefaults.observableValue.probeBeforeSwitchingBackToPrimary),
    minIntervalForSwitchingBackToPrimary: G(M, 'minIntervalForSwitchingBackToPrimary', AbrDefaults.observableValue.minIntervalForSwitchingBackToPrimary),
    maxIntervalForSwitchingBackToPrimary: G(M, 'maxIntervalForSwitchingBackToPrimary', AbrDefaults.observableValue.maxIntervalForSwitchingBackToPrimary),
    supportsAdLazyLoading:            G(B, 'supportsAdLazyLoading', false),
    maxSupportedAdAuxiliaryManifests: G(M, 'maxSupportedAdAuxiliaryManifests', undefined),
    disableDAISupportedForHWDRM:      G(B, 'disableDAISupportedForHWDRM', false),
    monitorFrozenFrames:              G(B, 'monitorFrozenFrames', false),

    // ── Request Pacing ───────────────────────────────────────────
    enableLiveRequestPacing:          G(B, 'enableLiveRequestPacing', AbrDefaults.observableValue.enableLiveRequestPacing),
    logarithmicRequestPacingCurveCenterPositionMs: G(I, 'logarithmicRequestPacingCurveCenterPositionMs', AbrDefaults.observableValue.logarithmicRequestPacingCurveCenterPositionMs),
    logarithmicRequestPacingCurveSharpness: G(F, 'logarithmicRequestPacingCurveSharpness', AbrDefaults.observableValue.logarithmicRequestPacingCurveSharpness),
    maxLiveTargetBufferDurationMs:    G(I, 'maxLiveTargetBufferDurationMs', AbrDefaults.observableValue.maxLiveTargetBufferDurationMs),
    useLiveBitrateDynamicCap:         G(B, 'useLiveBitrateDynamicCap', AbrDefaults.observableValue.useLiveBitrateDynamicCap),
    useProbabilisticLiveBitrateDynamicCap: G(B, 'useProbabilisticLiveBitrateDynamicCap', AbrDefaults.observableValue.useProbabilisticLiveBitrateDynamicCap),
    useLiveBitrateDynamicCapForDai:   G(B, 'useLiveBitrateDynamicCapForDai', AbrDefaults.observableValue.useLiveBitrateDynamicCapForDai),
    enableSvodRequestPacing:          G(B, 'enableSvodRequestPacing', AbrDefaults.observableValue.enableSvodRequestPacing),
    minSvodTargetBufferDurationMs:    G(I, 'minSvodTargetBufferDurationMs', AbrDefaults.observableValue.minSvodTargetBufferDurationMs),
    svodBufferGrowthRateSlope:        G(F, 'svodBufferGrowthRateSlope', AbrDefaults.observableValue.svodBufferGrowthRateSlope),

    // ── CPR (Concurrent Playback Resolution) ─────────────────────
    enableCprVideo:                   G(B, 'enableCprVideo', AbrDefaults.observableValue.enableCprVideo),
    enableCprVideoNonPipelined:       G(B, 'enableCprVideoNonPipelined', AbrDefaults.observableValue.enableCprVideoNonPipelined),
    enableInitialThroughputHistory:   G(B, 'enableInitialThroughputHistory', AbrDefaults.observableValue.enableInitialThroughputHistory),
    enableActiveRequestsInFilters:    G(B, 'enableActiveRequestsInFilters', AbrDefaults.observableValue.enableActiveRequestsInFilters),

    // ── UI Context ───────────────────────────────────────────────
    uiContext:                        G(J, 'uiContext'),

    // ── Unified Side Channel ─────────────────────────────────────
    enableUnifiedSideChannel:         G(B, 'enableUnifiedSideChannel', AbrDefaults.observableValue.enableUnifiedSideChannel),
    liveEnableUnifiedSideChannel:     G(B, 'liveEnableUnifiedSideChannel', AbrDefaults.observableValue.liveEnableUnifiedSideChannel),
    svodEnableUnifiedSideChannel:     G(B, 'svodEnableUnifiedSideChannel', AbrDefaults.observableValue.svodEnableUnifiedSideChannel),

    // ── Laser (Logging / Analytics) ──────────────────────────────
    laser:                            G(B, 'laser', AbrDefaults.observableValue.laser),
    laserEvents:                      G(J, 'laserEvents', AbrDefaults.observableValue.laserEvents),
    laserSessionType:                 G(S, 'laserSessionType', AbrDefaults.observableValue.laserSessionType),
    laserSessionName:                 G(S, 'laserSessionName', AbrDefaults.observableValue.laserSessionName),
    laserSessionDescription:          G(S, 'laserSessionDescription', AbrDefaults.observableValue.laserSessionDescription),
    laserRunId:                       G(S, 'laserRunId', AbrDefaults.observableValue.laserRunId),
  };

  // ─── Phase 3: applyConfig ─────────────────────────────────────────────

  /** Whether this is the first config application (used for logging) */
  let isFirstApplication = true;

  /**
   * Applies (or re-applies) configuration values from a new parameter map.
   *
   * This replaces the current configMap with the new params, re-applies
   * forced test overrides, then walks the config template to populate
   * the exported `config` object with freshly-evaluated values.
   *
   * Optionally logs the applied config at a sampling rate controlled by
   * `logConfigApplyDenominator`.
   *
   * @param {Object} params - New flat config key/value map
   */
  applyConfig = function applyConfig(params) {
    // Sampled config-apply logging
    const clockId = Platform.disposableList.key(ClockToken.ClockToken).id;
    if (config.logConfigApplyDenominator > 0 && (clockId % config.logConfigApplyDenominator) === 0) {
      try {
        const playdataLogger = Platform.disposableList.key(PlaydataToken.oq);
        const logBlob = Platform.disposableList.key(LogBlobToken.hG).tu('config', 'info', { params });
        playdataLogger.logblob(logBlob);
      } catch (err) {
        Platform.log.error('Failed to log config$apply', err);
      }
    }

    // Expose config globally for debugging
    globalThis._cad_global.config = config;

    assert(params);
    if (!params) return;

    // Rebuild the config map from the new params
    configMap = ObjectUtils.assignProperties({}, params, { aea: true });
    ObjectUtils.assignProperties(configMap, forcedTestOverrides, { aea: true });

    // Walk the template and populate the config object
    applyTemplate(configTemplate, config);

    // Log for test accounts
    if (configMap.istestaccount) {
      Platform.log.pauseTrace('Config applied for', serializeConfigForLog(isFirstApplication ? configMap : params));
    }
    isFirstApplication = false;
  };

  // Perform the initial config application
  applyConfig(configMap);
}

/**
 * Function reference set during initializeConfig. Allows runtime re-application
 * of config with new parameters.
 *
 * @type {Function}
 * @param {Object} params - New config parameters to apply
 */
export let applyConfig;

// ─── Config Snapshot Builders ───────────────────────────────────────────────

/**
 * Creates an immutable format configuration snapshot for a given UI context.
 * Merges per-playback-type overrides with the global config and freezes the result.
 *
 * @param {string} uiContext - The UI context identifier (e.g. "billboard", "standard")
 * @returns {Readonly<Object>} Frozen config snapshot for format selection
 */
export function createFormatConfig(uiContext) {
  const typeOverrides = getPlaybackConfigForType(uiContext);
  return ObjectUtils.assignProperties({}, createImmutableSnapshot(typeOverrides), { jxa: true });
}

/**
 * Creates an immutable media request configuration snapshot.
 * Adjusts minimum request durations based on whether the content is branching
 * and whether the video profile uses variable GOP (h264 high profile or AV1).
 *
 * @param {boolean} isBranching - Whether this is a branching (interactive) playback
 * @param {*} _unused - Unused parameter (preserved from original signature)
 * @param {string} [videoProfile] - Video profile identifier string
 * @returns {Readonly<Object>} Frozen config snapshot for media request parameters
 */
export function createMediaRequestConfig(isBranching, _unused, videoProfile) {
  const isVariableGOP = !!videoProfile && (videoProfile.includes('h264hpl') || videoProfile.includes('av1'));

  const requestConfig = {
    LB: isBranching ? config.minAudioMediaRequestDurationBranching : config.minAudioMediaRequestDuration,
    minVideoMediaRequestDuration: isBranching
      ? config.minVideoMediaRequestDurationBranching
      : isVariableGOP
        ? config.minVideoMediaRequestDurationVariableGOP
        : config.minVideoMediaRequestDuration,
  };

  return ObjectUtils.assignProperties({}, createImmutableSnapshot(requestConfig), { jxa: true });
}

// ─── Re-exports ─────────────────────────────────────────────────────────────

export { getPlaybackConfigForType, classifyPlaybackType };
