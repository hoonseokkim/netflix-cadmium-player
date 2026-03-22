/**
 * Netflix Cadmium Player - Observable Value
 *
 * Implements the observer pattern for trackable values. Provides a
 * read-only observable base class and a mutable observable that
 * notifies listeners on value changes. Used throughout the player
 * for reactive state management.
 *
 * @module core/ObservableValue
 */

/**
 * Read-only observable value. Holds a value and maintains a list of
 * listeners that can observe it (but cannot modify it through this class).
 */
export class ReadOnlyObservable {
  /**
   * @param {*} initialValue - The initial value.
   * @param {Function} [listener] - Optional initial listener.
   */
  constructor(initialValue, listener) {
    /** @private @type {*} */
    this._value = initialValue;
    /** @private @type {Array<Function>} */
    this._listeners = listener ? [listener] : [];
  }

  /**
   * The current value (read-only).
   * @type {*}
   */
  get value() {
    return this._value;
  }

  /**
   * Registers a change listener.
   *
   * @param {Function} listener - Callback receiving { oldValue, newValue }.
   */
  addListener(listener) {
    if (this._listeners.indexOf(listener) === -1) {
      this._listeners = this._listeners.slice();
      this._listeners.push(listener);
    }
  }

  /**
   * Unregisters a change listener.
   *
   * @param {Function} listener - The listener to remove.
   */
  removeListener(listener) {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners = this._listeners.slice();
      this._listeners.splice(index, 1);
    }
  }
}

/**
 * Mutable observable value. Extends ReadOnlyObservable with the ability
 * to set the value and automatically notify all listeners on change.
 */
export class ObservableValue extends ReadOnlyObservable {
  /**
   * @param {*} initialValue - The initial value.
   * @param {Function} [listener] - Optional initial listener.
   */
  constructor(initialValue, listener) {
    super(initialValue, listener);
  }

  /**
   * Creates a subscription that fires a callback when the observable
   * changes to match a condition.
   *
   * @param {ObservableValue} observable - The observable to watch.
   * @param {Function} predicate - Condition function.
   * @param {Function} callback - Callback when predicate matches.
   * @returns {Object} Subscription handle with a `clear()` method.
   */
  static createSubscription(observable, predicate, callback) {
    return new Subscription(observable, predicate, callback, false);
  }

  /**
   * Returns a promise that resolves when the observable changes to
   * match a condition, with an optional timeout.
   *
   * @param {ObservableValue} observable - The observable to watch.
   * @param {Function} predicate - Condition function.
   * @param {number} [timeout] - Optional timeout in milliseconds.
   * @returns {Promise<*>}
   */
  static async waitFor(observable, predicate, timeout) {
    let subscription;
    const promise = new Promise((resolve) => {
      subscription = this.createSubscription(observable, predicate, resolve);
    });

    try {
      if (timeout) {
        return await raceWithTimeout(timeout, promise);
      }
      return await promise;
    } finally {
      subscription.clear();
    }
  }

  /**
   * The current value. Setting triggers listener notifications.
   * @type {*}
   */
  get value() {
    return this._value;
  }

  set value(newValue) {
    this.set(newValue);
  }

  /**
   * Sets the value and notifies listeners if it changed.
   *
   * @param {*} newValue - The new value.
   */
  set(newValue) {
    const oldValue = this._value;
    if (oldValue !== newValue) {
      this._value = newValue;
      this._listeners.forEach((listener) =>
        listener({ oldValue, newValue })
      );
    }
  }
}
