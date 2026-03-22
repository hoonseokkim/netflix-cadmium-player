/**
 * Netflix Cadmium Player - MP4 Box Parser Facade Module
 * Component: MP4
 *
 * Re-exports the core MP4 parsing utilities from the low-level box parser
 * and provides a convenience Mp4BoxParserFacade that auto-creates its
 * own console instance.
 */

// Dependencies
// import { __extends } from 'tslib';                      // webpack 22970
// import { platform } from './Platform';                   // webpack 66164
// import { Mp4BoxParser as BaseMp4BoxParser, mp4ParseConsole, M1, cma } from './Mp4BoxParser'; // webpack 91562

// Re-export low-level parsing utilities
export { mp4ParseConsole } from "./Mp4BoxParser";
export { Mp4BoxParserClass as mp4BoxParserClass } from "./Mp4BoxParser";
export { M1 } from "./Mp4BoxParser";
export { cma } from "./Mp4BoxParser";

/**
 * @class Mp4BoxParserFacade
 * @extends BaseMp4BoxParser
 *
 * A convenience wrapper around the base Mp4BoxParser that lazily creates
 * and caches its own console instance. Callers do not need to pass a
 * console reference; one is created automatically on first use.
 */
export class Mp4BoxParserFacade extends BaseMp4BoxParser {
    /** @private @type {Console|undefined} Lazily created console */
    static _console;

    /**
     * Returns a lazily created console for MP4 parsing.
     * @returns {Console}
     */
    static get console() {
        return (
            Mp4BoxParserFacade._console ||
            (Mp4BoxParserFacade._console = new platform.Console("MP4", "media|asejs"))
        );
    }

    /**
     * @param {Object} stream - Media stream reference
     * @param {ArrayBuffer} data - MP4 binary data to parse
     * @param {Array<string>} stopBoxes - Box types to stop at (e.g. ["moov"])
     * @param {boolean} parseAdditional - Whether to parse additional boxes
     * @param {Object} [options] - Parsing options
     */
    constructor(stream, data, stopBoxes, parseAdditional, options) {
        super(Mp4BoxParserFacade.console, stream, data, stopBoxes, parseAdditional, options);
    }
}
