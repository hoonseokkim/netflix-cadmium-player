/**
 * Netflix Cadmium Player — Inject Metadata Decorator
 *
 * Creates a parameter/property decorator that attaches dependency-injection
 * metadata (service identifier) to a class, enabling the IoC container
 * to resolve dependencies at construction time.
 *
 * @module InjectMetadataDecorator
 */

// Dependencies
// import { JP as INJECT_TAG } from './modules/Module_37425';          // metadata key for inject
// import { Metadata } from './modules/Module_67258';                  // metadata wrapper
// import { HV as tagParameter, tagProperty as tagProperty } from './modules/Module_28041';  // metadata appliers

/**
 * Creates a decorator that tags a constructor parameter or class property
 * with a service identifier for dependency injection.
 *
 * When applied to a parameter (by index), it uses `tagParameter`.
 * When applied to a property (no index), it uses `tagProperty`.
 *
 * @param {*} serviceIdentifier - The DI service identifier (symbol or string).
 * @returns {function} A decorator function usable on parameters or properties.
 *
 * @example
 * class MyService {
 *   constructor(@inject(LoggerToken) logger) { ... }
 * }
 */
export function createInjectDecorator(serviceIdentifier) {
  return function (target, propertyKey, parameterIndex) {
    const metadata = new Metadata(INJECT_TAG, serviceIdentifier);

    if (typeof parameterIndex === "number") {
      tagParameter(target, propertyKey, parameterIndex, metadata);
    } else {
      tagProperty(target, propertyKey, metadata);
    }
  };
}
