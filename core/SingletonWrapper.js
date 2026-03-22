/**
 * Netflix Cadmium Player — Singleton Wrapper
 *
 * A minimal singleton pattern wrapper around a service instance.
 * Stores a single static reference for global access.
 *
 * @module SingletonWrapper
 */

// Dependencies
// import { tgb as WrappedService } from './modules/Module_53300';

/**
 * Wraps a service in a singleton pattern with a static `instance` reference.
 */
export class SingletonWrapper {
  /** @type {SingletonWrapper|undefined} */
  static instance;

  /**
   * @param {*} config - Configuration passed to the underlying service.
   */
  constructor(config) {
    /** @private The wrapped service instance. */
    this.wrappedService = new WrappedService(config);
    SingletonWrapper.instance = this;
  }
}
