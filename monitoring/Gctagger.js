/**
 * Netflix Cadmium Player - GcTagger
 * Provides garbage collection tracking for class instances via `nrdp.gcTag()`.
 * When GC tagging is enabled (via build config), tagged instances report their
 * lifecycle to help detect memory leaks. Only active in `gctag` builds.
 *
 * @module GcTagger
 */

// import { __extends, __spreadArray, __read } from 'tslib';
// import { platform } from './Module_66164';
// import { DEBUG } from './Module_48170';

/**
 * Sort comparator for ascending numeric order.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function numericAscending(a, b) {
  return a - b;
}

/**
 * Whether GC tagging is enabled for this build.
 * Only active when the `U0b` (GC_TAG_MODE) environment variable is "gctag".
 * @type {boolean}
 */
const GC_TAGGING_ENABLED = "gctag" === ({
  NODE_ENV: "production",
  PLATFORM: "cadmium",
  ASEBUILD: "release",
  OBFUSCATE: "obfuscate",
  BUILD_VERSION: "6.0055.939.911",
}).U0b;

/**
 * Wrap a class constructor so that all instances are automatically GC-tagged.
 * When an instance is garbage collected, the `nrdp.gcTag` callback fires,
 * enabling detection of leaked instances.
 *
 * @param {Function} TargetClass - The class constructor to wrap.
 * @param {Object} [logger] - Optional scoped console for logging.
 * @returns {Function} The wrapped class constructor (or the original if GC tagging is disabled).
 */
export function withGcTagging(TargetClass, logger) {
  if (!GC_TAGGING_ENABLED) {
    return TargetClass;
  }

  const tagger = new GcTagger(TargetClass.name, logger);

  return class extends TargetClass {
    constructor(...args) {
      const instance = super(...args) || this;
      instance.gcTagHandle = tagger.tagInstance(instance);
      return instance;
    }
  };
}

/**
 * Manages GC tagging for instances of a specific class.
 * Tracks instance IDs and logs when instances are garbage collected.
 */
class GcTagger {
  /**
   * @param {string} className - The name of the class being tracked.
   * @param {Object} [logger] - Optional scoped console for logging.
   */
  constructor(className, logger) {
    /** @type {string} */
    this.className = className;

    /** @type {Object|undefined} */
    this.logger = logger;

    /** @type {Array<number>} Active instance IDs */
    this.activeInstances = [];

    /** @type {number} Monotonically increasing instance counter */
    this.instanceCounter = 0;
  }

  /**
   * Lazily initialized console logger.
   * @returns {Object}
   */
  static get console() {
    if (!GcTagger._console) {
      GcTagger._console = new platform.Console("GCTAGGER");
    }
    return GcTagger._console;
  }

  /**
   * Tag an instance for GC tracking. When the instance is garbage collected,
   * the callback fires to remove it from the active list and log the event.
   *
   * @param {Object} instance - The class instance to tag.
   * @returns {*} The GC tag handle, or undefined if tagging is not available.
   */
  tagInstance(instance) {
    if (!GC_TAGGING_ENABLED) return undefined;

    const logger = this.logger || GcTagger.console;

    if (!instance.gcTagHandle && typeof nrdp !== "undefined") {
      const tagInfo = {
        type: this.className,
        id: this.instanceCounter++,
      };

      this.activeInstances.push(tagInfo.id);
      const tagJson = JSON.stringify(tagInfo);

      const handle = nrdp.gcTag(
        tagJson,
        ((tracker, instanceId, typeName, log) => {
          // Remove from active list
          tracker.activeInstances.splice(tracker.activeInstances.indexOf(instanceId), 1);
          tracker.activeInstances = tracker.activeInstances.sort(numericAscending);

          // Log the first few remaining instance IDs
          const preview = [];
          for (let i = 0; i < tracker.activeInstances.length && i < 5; i++) {
            preview.push(tracker.activeInstances[i]);
          }

          log?.error(
            `Removing instance for ${typeName}/${instanceId}. ` +
            `${tracker.activeInstances.length} remaining, earliest: ${preview}}`
          );
        }).bind(null, this, tagInfo.id, tagInfo.type, logger)
      );

      DEBUG && logger?.info("Creating tagged instance", tagInfo);
      return handle;
    }

    return undefined;
  }
}

export { GcTagger };
