/**
 * @file BatteryManager.js
 * @description Initializes and manages the Battery Status API integration for the
 * Netflix Cadmium player. Monitors device battery level and charging state
 * to enable power-aware playback decisions (e.g., reducing quality on low battery).
 * @module monitoring/BatteryManager
 * @see Module_66093
 */

import { SUCCESS, lK as NOOP_CALLBACK } from '../utils/DomHelpers.js';
import config from '../core/PlayerConfig.js';
import { INIT_COMPONENT_BATTERY_MANAGER } from '../core/defaultPlatformConfig.js';
import { disposableList } from '../core/ReflectMetadataPolyfill.js';
import { navigator } from '../utils/PlatformGlobals.js';
import { typeofChecker } from '../utils/TypeChecks.js';
import { ellaSendRateMultiplier } from '../timing/TimeUnit.js';

// DI container keys
const initKey = disposableList.key(/* BatteryManagerKey */);
const timeoutKey = disposableList.key(/* TimeoutKey */);

/**
 * Battery manager API interface exposed to the rest of the player.
 * Provides access to battery level, charging status, and battery events.
 * @type {Object}
 */
export const batteryManagerApi = {
  /** @type {string} Event name for charging state changes */
  CHARGING_CHANGE_EVENT: 'chargingchange',

  /**
   * Gets the current battery level as a value between 0.0 and 1.0.
   * @returns {number|null} Battery level or null if unavailable
   */
  getBatteryLevel() {
    return batteryInstance ? batteryInstance.level : null;
  },

  /**
   * Gets whether the device is currently charging.
   * @returns {boolean|null} Charging state or null if unavailable
   */
  isCharging() {
    return batteryInstance ? batteryInstance.charging : null;
  },

  /**
   * Adds an event listener to the battery manager.
   * @param {string} event - Event name (e.g., 'chargingchange', 'levelchange')
   * @param {Function} callback - Event handler
   */
  addEventListener(event, callback) {
    if (batteryInstance) {
      batteryInstance.addEventListener(event, callback);
    }
  },

  /**
   * Removes an event listener from the battery manager.
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  removeEventListener(event, callback) {
    if (batteryInstance) {
      batteryInstance.removeEventListener(event, callback);
    }
  },
};

/** @type {BatteryManager|undefined} The native BatteryManager instance */
let batteryInstance;

/**
 * Validates that the battery manager object implements EventTarget correctly.
 * @param {Object} manager - The battery manager to validate
 * @throws {string} If the manager doesn't implement required methods
 */
function validateBatteryManager(manager) {
  if (!(manager instanceof EventTarget)) {
    throw 'batteryManager is not an instaceof EventTarget';
  }
  ['addEventListener', 'removeEventListener'].forEach((method) => {
    if (!typeofChecker(manager[method])) {
      throw `${method} is not a function`;
    }
  });
}

/**
 * Requests the BatteryManager from the Navigator API.
 * @returns {Promise<BatteryManager>}
 */
function requestBatteryManager() {
  return Promise.resolve().then(() => {
    const promise = navigator.getBattery();
    if (!typeofChecker(promise.then)) {
      throw 'getBattery did not return a promise';
    }
    return promise;
  });
}

// Component initialization registration
initKey.register(INIT_COMPONENT_BATTERY_MANAGER, function initBattery(done) {
  const log = disposableList.getCategoryLog('BatteryManager');

  let initComplete = function () {
    done(SUCCESS);
    initComplete = NOOP_CALLBACK;
  };

  if (config.B$ && typeofChecker(navigator.getBattery)) {
    timeoutKey
      .removeCallback(ellaSendRateMultiplier(config.svc), requestBatteryManager())
      .then((manager) => {
        validateBatteryManager(manager);
        batteryInstance = manager;
      })
      .catch((error) => {
        log.error('getBattery failed', error);
      })
      .then(initComplete);
  } else {
    initComplete();
  }
});
