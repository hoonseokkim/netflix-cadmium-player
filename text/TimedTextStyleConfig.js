/**
 * Netflix Cadmium Player - Timed Text Style Configuration
 *
 * Manages subtitle/timed text display styles with three layers of configuration:
 *   1. Base defaults (from timedTextStyleDefaults)
 *   2. Overrides (from timedTextStyleOverrides)
 *   3. User adjustments (runtime changes like character size)
 *
 * Styles are merged in priority order: base < overrides < user adjustments.
 *
 * @module TimedTextStyleConfig
 * @see Module_99416
 */

/**
 * Manages the layered style configuration for timed text (subtitles/captions).
 */
export class TimedTextStyleConfig {
    /**
     * @param {Object} config - Configuration object containing style settings
     * @param {Object} config.timedTextStyleDefaults - Base default styles
     * @param {Object} config.timedTextStyleOverrides - Override styles
     */
    constructor(config) {
        /** @type {Object} Base default styles from config */
        this.baseDefaults = config.timedTextStyleDefaults;

        /** @type {Object} Style overrides from config */
        this.styleOverrides = config.timedTextStyleOverrides;

        /** @type {Object} User-applied runtime style adjustments */
        this.userAdjustments = {};
    }

    /**
     * Returns the fully merged style configuration (defaults + overrides + user adjustments).
     * @returns {Object} Complete merged style object
     */
    getMergedStyles() {
        return Object.assign(
            Object.assign(Object.assign({}, this.baseDefaults), this.styleOverrides),
            this.userAdjustments
        );
    }

    /**
     * Returns only the non-default styles (overrides + user adjustments).
     * @returns {Object} Merged overrides and user adjustments
     */
    getActiveOverrides() {
        return Object.assign(Object.assign({}, this.styleOverrides), this.userAdjustments);
    }

    /**
     * Sets the character size for subtitle rendering.
     * @param {number|string} size - The character size value
     */
    setCharacterSize(size) {
        this.userAdjustments.characterSize = size;
    }
}
