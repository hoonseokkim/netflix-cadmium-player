/**
 * Text Render Controller
 *
 * Bridges the player state with the text/subtitle rendering engine. Listens
 * for caption setting changes, text track switches, and visibility events to
 * update the timed text renderer. Handles font-weight adjustments for
 * specific language codes that should not use bold fonts.
 *
 * @module TextRenderController
 * @original Module_79014
 */

// import { PRIORITY } from './Constants';
// import { assert } from './Assert';
// import { globalEvents, VISIBILITY_CHANGE_EVENT } from './GlobalEvents';
// import { config } from './PlayerConfig';
// import { TimedTextRenderer } from './TimedTextRenderer';
// import { PlayerEvents } from './PlayerEvents';
// import { MediaType } from './MediaType';

/**
 * Controls the timed text rendering engine, connecting it to player state
 * changes for caption settings, track switches, and document visibility.
 */
export class TextRenderController {
    /**
     * @param {Object} playerState - The player state object
     * @param {Object} renderOptions - Configuration for the text renderer
     */
    constructor(playerState, renderOptions) {
        /** @type {Object} */
        this.playerState = playerState;

        /** @type {Function} Cleanup handler for player close */
        this._onClose = () => {
            globalEvents.removeListener(VISIBILITY_CHANGE_EVENT, this._onVisibilityChange);
            const container = this.textRenderEngine.getConfiguration();
            if (container?.parentNode) {
                container.parentNode.removeChild(container);
            }
        };

        /** @type {Function} Caption settings change handler */
        this._onCaptionSettingsChange = (event) => {
            this.textRenderEngine.updateCaptionSettings(event.newValue);
        };

        /** @type {Function} Text track switch handler */
        this._onTextTrackChange = (event) => {
            this.textRenderEngine.setTrackLanguage(
                event.textTrackInfo ? event.textTrackInfo.trackLanguage : undefined
            );
            this.textRenderEngine.setLanguageCode(event.textTrackInfo?.languageCode);
            this.textRenderEngine.updateFontFamilyMapping(
                this._getFontFamilyMapping(event.textTrackInfo)
            );
        };

        /** @type {Function} Visibility change handler */
        this._onVisibilityChange = () => {
            this.textRenderEngine.clearDisplay();
        };

        // Initialize text render engine
        const trackLanguage = playerState.tracks.textTrackSelection?.trackLanguage;
        const languageCode = playerState.tracks.textTrackSelection?.languageCode;
        const fontMapping = this._getFontFamilyMapping(playerState.tracks.textTrackSelection);

        /** @type {TimedTextRenderer} */
        this.textRenderEngine = new TimedTextRenderer(renderOptions, fontMapping, trackLanguage, languageCode);

        // Set aspect ratio
        const dimensions = playerState.containerDimensions.value;
        assert(dimensions.width / dimensions.height > 0.1);
        this.textRenderEngine.setAspectRatio(dimensions.width / dimensions.height);

        // Attach to DOM and register listeners
        playerState.containerElement.appendChild(this.textRenderEngine.getConfiguration());
        playerState.captionSettings.addListener(this._onCaptionSettingsChange);
        playerState.tracks.addListener([MediaType.TEXT_MEDIA_TYPE], this._onTextTrackChange);
        playerState.addEventListener(PlayerEvents.CLOSE, this._onClose, PRIORITY);
        globalEvents.addListener(VISIBILITY_CHANGE_EVENT, this._onVisibilityChange);
    }

    /**
     * Sets the text bottom margin.
     * @param {number} margin
     */
    setBottomMargin(margin) {
        this.textRenderEngine.setBottomMargin(margin);
    }

    /**
     * Gets the current bottom margin.
     * @returns {number}
     */
    getBottomMargin() {
        return this.textRenderEngine.getBottomMargin();
    }

    /**
     * Sets the text top margin.
     * @param {number} margin
     */
    setTopMargin(margin) {
        this.textRenderEngine.setTopMargin(margin);
    }

    /**
     * Gets the current top margin.
     * @returns {number}
     */
    getTopMargin() {
        return this.textRenderEngine.getTopMargin();
    }

    /**
     * Sets the text horizontal margin.
     * @param {number} margin
     */
    setHorizontalMargin(margin) {
        this.textRenderEngine.setHorizontalMargin(margin);
    }

    /**
     * Gets the current horizontal margin.
     * @returns {number}
     */
    getHorizontalMargin() {
        return this.textRenderEngine.getHorizontalMargin();
    }

    /**
     * Gets the font family mapping for a text track, adjusting font-weight
     * for specific languages configured as "no weight" languages.
     *
     * @param {Object} textTrack - The text track with languageCode
     * @returns {Object} Font family mapping
     */
    _getFontFamilyMapping(textTrack) {
        if (textTrack && config.noWeightLanguages && config.noWeightLanguages.indexOf(textTrack.languageCode) >= 0) {
            const mapping = Object.assign({}, config.timedTextFontFamilyMapping);
            Object.entries(mapping).forEach(([key, value]) => {
                mapping[key] = value.replace(/font-weight:bolder/g, "font-weight:normal");
            });
            return mapping;
        }
        return config.timedTextFontFamilyMapping;
    }
}
