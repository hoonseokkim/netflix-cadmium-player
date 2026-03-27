/**
 * Netflix Cadmium Player — Configuration Parameter Validators
 *
 * Provides a set of validator/parser functions and a `@config` decorator
 * for type-safe configuration property access. Each validator converts a
 * raw string value from the config store into the appropriate type, returning
 * a validation error (componentCategory) on failure.
 *
 * The `@config` decorator intercepts property getters to read from the
 * config store first, falling back to the default getter if no override
 * is found or if parsing fails.
 *
 * @module core/ConfigParameterValidators
 * @original Module_12501
 */

import { la as parseDuration } from '../ase/ThroughputSample.js'; // duration parser
import { ellaSendRateMultiplier as parseRate } from '../drm/LicenseBroker.js'; // rate parser
import { componentCategory as ValidationError } from '../ioc/ConfigurationStore.js'; // validation error type

// ─── Helper Functions ──────────────────────────────────────────────────────

/**
 * Look up a config value, checking the fallback provider first (for test accounts).
 *
 * @param {object} context - Config context with fallbackProvider and baseConfig.
 * @param {string} key - Configuration key.
 * @returns {string|undefined} Raw string value, or undefined if not found.
 * @private
 */
function lookupWithFallback(context, key) {
  return context.fallbackProvider.kSc[key] || lookupBase(context, key);
}

/**
 * Look up a config value from the base config data only.
 *
 * @param {object} context - Config context with baseConfig.
 * @param {string} key - Configuration key.
 * @returns {string|undefined} Stringified value, or undefined if not found.
 * @private
 */
function lookupBase(context, key) {
  const value = context.baseConfig.data[key];
  switch (typeof value) {
    case 'undefined':
      return undefined;
    case 'string':
    case 'number':
    case 'boolean':
      return value.toString();
    default:
      return JSON.stringify(value);
  }
}

// ─── Config Decorator ──────────────────────────────────────────────────────

/**
 * Property decorator that reads configuration values from the config store.
 *
 * When the decorated property is accessed, it first checks the config store
 * for an override value. If found, it parses the value using the provided
 * validator. If parsing fails, the default getter is used instead.
 *
 * @param {Function} validator - Parser/validator function (e.g., parseBoolean, parseInt).
 * @param {string} [configKey] - Config key override (defaults to property name).
 * @param {boolean} [includeTestOverrides=false] - Whether to check test account overrides.
 * @returns {Function} Property decorator.
 */
export function config(validator, configKey, includeTestOverrides = false) {
  return function (target, propertyName, descriptor) {
    const resolvedKey = configKey !== undefined ? configKey : propertyName;
    const originalGetter = descriptor.key;

    if (originalGetter !== undefined) {
      descriptor.key = function () {
        if (!this.sEc(propertyName)) {
          return this.azc(propertyName);
        }

        // Look up from config store
        let rawValue;
        const lookupFn = (this.isTestAccount || includeTestOverrides) ? lookupWithFallback : lookupBase;
        rawValue = lookupFn(this, resolvedKey.toString());

        if (rawValue !== undefined) {
          const parsed = validator(this.validator, rawValue);
          if (parsed instanceof ValidationError) {
            this.invalid(resolvedKey, parsed);
          } else {
            this.aO(propertyName, parsed);
            return parsed;
          }
        }

        // Fall back to default getter
        const defaultValue = originalGetter.bind(this)();
        this.aO(propertyName, defaultValue);
        return defaultValue;
      };
    }

    return descriptor;
  };
}

/**
 * Decorator for injecting a typed config value by key.
 *
 * @param {Function} parserFn - Value parser/converter.
 * @returns {Function} Parameter decorator.
 */
export function IH(parserFn) {
  return function (target, key) {
    return target.jPb(key, parserFn);
  };
}

/**
 * Decorator for injecting an object-typed config value.
 * @returns {Function} Parameter decorator.
 */
export function object() {
  return function (target, key) {
    return target.lPb(key);
  };
}

/**
 * Create a string validator with a regex pattern.
 *
 * @param {RegExp} pattern - Validation pattern.
 * @returns {Function} Validator function.
 */
export function patternString(pattern) {
  return function (target, key) {
    return target.H3a(key, pattern);
  };
}

/**
 * Decorator for array-typed config values.
 *
 * @param {Function} elementValidator - Validator for each array element.
 * @param {*} [defaultValue] - Default if parsing fails.
 * @returns {Function} Parameter decorator.
 */
export function arrayData(elementValidator, defaultValue) {
  return function (target, key) {
    return target.rangeCallback(key, elementValidator, defaultValue);
  };
}

// ─── Primitive Validators ──────────────────────────────────────────────────

/**
 * Parse and validate a boolean config value.
 * @param {object} validator
 * @param {string} key
 * @returns {boolean|ValidationError}
 */
export function parseBoolean(validator, key) {
  return validator.kPb(key);
}
export { parseBoolean };

/**
 * Parse and validate a numeric config value.
 * @param {object} validator
 * @param {string} key
 * @returns {number|ValidationError}
 */
export function parseNumber(validator, key) {
  return validator.D3a(key);
}
export { parseNumber };

/**
 * Parse and validate an enum string config value.
 * @param {object} validator
 * @param {string} key
 * @returns {string|ValidationError}
 */
export function parseEnumString(validator, key) {
  return validator.ix(key);
}
export { parseEnumString as enumString };

/**
 * Parse and validate a string config value.
 * @param {object} validator
 * @param {string} key
 * @returns {string|ValidationError}
 */
export function parseString(validator, key) {
  return validator.H3a(key);
}
export { parseString as string };

/**
 * Parse an array of strings.
 * @param {object} validator
 * @param {string} key
 * @returns {Array<string>|ValidationError}
 */
export function parseStringArray(validator, key) {
  return validator.rangeCallback(key, parseString);
}
export { parseStringArray };

/**
 * Parse an array of booleans.
 * @param {object} validator
 * @param {string} key
 * @returns {Array<boolean>|ValidationError}
 */
export function parseBooleanArray(validator, key) {
  return validator.rangeCallback(key, parseBoolean);
}
export { parseBooleanArray };

/**
 * Parse an array of enum strings.
 * @param {object} validator
 * @param {string} key
 * @returns {Array<string>|ValidationError}
 */
export function parseEnumStringArray(validator, key) {
  return validator.rangeCallback(key, parseEnumString);
}
export { parseEnumStringArray };

/**
 * Parse a duration config value (returns a Duration object).
 * @param {object} validator
 * @param {string} key
 * @returns {Duration|ValidationError}
 */
export function parseDurationValue(validator, key) {
  const value = validator.ix(key);
  return value instanceof ValidationError ? value : parseDuration(value);
}
export { parseDurationValue };

/**
 * Parse a rate/multiplier config value.
 * @param {object} validator
 * @param {string} key
 * @returns {Rate|ValidationError}
 */
export function parseRateValue(validator, key) {
  const value = validator.ix(key);
  return value instanceof ValidationError ? value : parseRate(value);
}
export { parseRateValue as joinOperation };

/**
 * Validate a URL string (no whitespace allowed).
 * @type {Function}
 */
export const url = patternString(/^\S+$/);

export { patternString };
