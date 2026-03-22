/**
 * @module CadmiumEventEmitter
 * @description Extended EventEmitter with listener-handle and deferred-event support.
 * Wraps the base EventEmitter to provide a `listener()` method that returns a
 * clearable handle, and a `waitForEvent()` method that returns a Deferred/Promise
 * which resolves when an event fires (or immediately if already satisfied).
 *
 * @original Module_70402
 */

// import { EventEmitter as BaseEventEmitter } from '...'; // Module 90745
// import { Deferred } from '...';                          // Module 91176

/**
 * A Deferred that resolves when a specific event fires on an emitter.
 * Automatically unsubscribes from the event upon resolution.
 *
 * @class DeferredEvent
 * @extends Deferred
 */
class DeferredEvent extends Deferred {
  /**
   * @param {CadmiumEventEmitter} emitter - The event emitter to listen on.
   * @param {string} eventName - The event name to wait for.
   * @param {boolean} [alreadySatisfied=false] - If true, resolves immediately.
   */
  constructor(emitter, eventName, alreadySatisfied) {
    super();

    if (alreadySatisfied) {
      this.resolve();
    } else {
      /** @private */
      this.listenerHandle = emitter.listener(eventName, () => {
        this.clear();
        this.resolve();
      });
    }
  }

  /**
   * Removes the event listener and cleans up.
   */
  clear() {
    if (this.listenerHandle) {
      this.listenerHandle.clear();
      this.listenerHandle = undefined;
    }
  }
}

/**
 * EventEmitter with clearable listener handles and deferred event support.
 *
 * @class CadmiumEventEmitter
 * @extends BaseEventEmitter
 */
export class CadmiumEventEmitter extends BaseEventEmitter {
  /**
   * Subscribes to an event and returns a handle with a `clear()` method
   * for easy unsubscription.
   *
   * @param {string} eventName - The event to listen for.
   * @param {Function} handler - The event handler.
   * @returns {{clear: Function}} A handle whose `clear()` removes the listener.
   */
  listener(eventName, handler) {
    this.on(eventName, handler);
    return {
      clear: () => this.removeListener(eventName, handler),
    };
  }

  /**
   * Returns a Deferred/Promise that resolves the next time the given event fires,
   * or immediately if `alreadySatisfied` is true.
   *
   * @param {string} eventName - The event to wait for.
   * @param {boolean} [alreadySatisfied=false] - Resolve immediately without waiting.
   * @returns {DeferredEvent} A deferred that resolves on the event.
   */
  waitForEvent(eventName, alreadySatisfied) {
    return new DeferredEvent(this, eventName, alreadySatisfied);
  }
}
