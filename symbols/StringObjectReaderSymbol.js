/**
 * Netflix Cadmium Player -- StringObjectReaderSymbol
 *
 * IoC container symbol for the string-object reader service, plus
 * a no-op componentCategory validation placeholder.
 *
 * @module symbols/StringObjectReaderSymbol
 * @original Module_37187
 */

/**
 * No-op placeholder for component category validation.
 * May be overridden by testing or debug tooling.
 * @type {Function}
 */
export const componentCategory = function () {};

/**
 * Symbol identifier used to register/resolve the string-object reader
 * in the dependency injection container.
 * @type {string}
 */
export const StringObjectReaderSymbol = "StringObjectReaderSymbol";
