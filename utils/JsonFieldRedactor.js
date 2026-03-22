/**
 * JSON Field Redactor
 *
 * Creates a frozen copy of an object with a custom `toJSON()` method
 * that omits specified fields during serialization. Used to redact
 * sensitive or internal fields from event/log payloads before they
 * are sent over the wire (e.g., for telemetry or logging).
 *
 * @module utils/JsonFieldRedactor
 * @original Module_66412
 */

// import { __assign } from 'tslib';         // Module 22970
// import { NI as freeze } from './Freeze';   // Module 54520 - Object.freeze utility

/**
 * Creates a frozen version of `source` whose `toJSON()` omits the given fields.
 *
 * @param {Object} source - The original object to wrap.
 * @param {string[]} fieldsToRedact - Property names to strip during JSON serialization.
 * @returns {Object} A frozen shallow copy of `source` with a custom `toJSON`.
 */
export function createRedactedJson(source, fieldsToRedact) {
  return Object.freeze(source, {
    toJSON() {
      const copy = Object.assign({}, source);
      fieldsToRedact.forEach((field) => {
        delete copy[field];
      });
      return copy;
    },
  });
}
