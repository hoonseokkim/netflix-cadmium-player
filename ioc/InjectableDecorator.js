/**
 * Netflix Cadmium Player — Injectable Decorator
 *
 * Provides a class-level decorator (`@injectable`) used by the dependency
 * injection (IoC) container. When applied, it stores a `Metadata` record
 * on the constructor via `Reflect.defineMetadata`, keyed by a well-known
 * DI metadata symbol (`Q7`). Throws if the class is already registered.
 *
 * @module ioc/InjectableDecorator
 */

// import { ERROR_ALREADY_INJECTABLE as Z2b } from '../modules/Module_25640';
// import { DI_METADATA_KEY as Q7 } from '../modules/Module_37425';
// import { Metadata } from '../modules/Module_67258';

/**
 * Class decorator that registers a constructor as injectable.
 *
 * @returns {Function} A class decorator that attaches DI metadata via Reflect.
 * @throws {Error} If the class has already been marked as injectable.
 *
 * @example
 *   @injectable()
 *   class MyService { ... }
 */
export function injectable() {
  return function (target, propertyKey) {
    const metadata = new Metadata(DI_METADATA_KEY, propertyKey);

    if (Reflect.hasOwnMetadata(DI_METADATA_KEY, target.constructor)) {
      throw Error(ERROR_ALREADY_INJECTABLE);
    }

    Reflect.defineMetadata(DI_METADATA_KEY, metadata, target.constructor);
  };
}
