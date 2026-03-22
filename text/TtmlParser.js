/**
 * @module TtmlParser
 * @description TTML (Timed Text Markup Language) parser for Netflix subtitle rendering.
 * Implements an incremental streaming parser that processes TTML/XML subtitle documents.
 * Includes a bundled SAX XML parser (originally sax-js) adapted for the Netflix player.
 *
 * The TtmlParser emits events as it parses subtitle entries, supporting:
 * - Incremental parsing with configurable buffer sizes
 * - Style inheritance and region layout
 * - Japanese (ja) language-specific handling
 * - Ruby text annotation support
 * - Tick-rate and clock-time based timing
 *
 * Also exports a SAX XML parser (SaxParser / SaxStream) for low-level XML processing.
 *
 * @original Module_18797
 */

import { parseClockTime } from '../text/ClockTimeParser'; // Module 4574
import { EventEmitter } from 'events';                     // Module 22699
// SaxParser is bundled inline (originally module 60514)
import { TimedTextIndex } from '../text/TimedTextIndex';   // Module 96379
import { RegionHelper } from '../text/RegionHelper';       // Module 81668
// Module 81824 imported for side effects

// ─── Style attribute name lists ───

/** @type {string[]} TTML style properties to extract */
const STYLE_ATTRIBUTES = [
    'color', 'fontSize', 'fontWeight', 'fontStyle', 'textAlign', 'fontFamily',
    'backgroundColor', 'textDecoration', 'textOutline', 'textCombine',
    'multiRowAlign', 'direction', 'ruby', 'rubyAlign', 'rubyPosition',
    'rubyReserve', 'textEmphasis', 'shear', 'lineHeight'
];

/** @type {string[]} Root-level TT element attribute names */
const ROOT_ATTRIBUTES = [
    'cellResolution', 'pixelAspectRatio', 'tickRate', 'timeBase', 'extent', 'lang'
];

/** @type {string[]} Region definition attribute names */
const REGION_ATTRIBUTES = [
    'backgroundColor', 'displayAlign', 'extent', 'origin', 'position',
    'writingMode', 'multiRowAlign', 'textAlign', 'direction'
];

/** @type {{info: Function, debug: Function}} No-op logger */
const NULL_LOGGER = {
    info() {},
    debug() {}
};

// ─── Helper Functions ───

/**
 * Gets the last element of an array.
 * @param {Array} arr
 * @returns {*}
 * @throws {Error} If not an array
 */
function last(arr) {
    if (!Array.isArray(arr)) throw new Error('last called on non-array: ' + arr);
    return arr[arr.length - 1];
}

/**
 * Extracts attributes with known namespace prefixes from an XML element.
 * @param {Object} attributes - Raw XML attributes
 * @param {string[]} names - Attribute names to extract
 * @returns {Object} Extracted attributes with styles/regions containers
 */
function extractNamespacedAttributes(attributes, names) {
    const result = {};
    names.forEach((name) => {
        if (attributes['tts:' + name] !== undefined) {
            result[name] = attributes['tts:' + name];
        } else if (attributes['ttp:' + name] !== undefined) {
            result[name] = attributes['ttp:' + name];
        } else if (attributes['ebutts:' + name] !== undefined) {
            result[name] = attributes['ebutts:' + name];
        } else if (attributes['xml:' + name] !== undefined) {
            result[name] = attributes['xml:' + name];
        }
    });
    result.styles = {};
    result.regions = {};
    return result;
}

/**
 * Checks if the tag stack contains a given tag name.
 * @param {Array} stack - Tag stack
 * @param {string} tagName - Tag to look for
 * @returns {boolean}
 */
function stackContains(stack, tagName) {
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === tagName) return true;
    }
    return false;
}

/**
 * Transforms a text node for output, applying style resolution.
 * @param {Object} styles - Style definitions map
 * @param {Object} textNode - Raw text node
 * @returns {Object} Transformed text node with resolved style
 */
function transformTextNode(styles, textNode) {
    return {
        lineBreaks: textNode.lineBreaks,
        text: textNode.text,
        lang: textNode.lang,
        style: this.style.rmc(styles[textNode.style] || {}, this._metadata),
        id: textNode.id
    };
}

/**
 * Transforms a parsed entry for output consumption.
 * @param {Object} metadata - Document metadata
 * @param {Object} entry - Parsed subtitle entry
 * @returns {Object} Transformed entry with resolved regions and styles
 */
function transformEntry(metadata, entry) {
    const styles = metadata.styles || {};
    return {
        startTime: entry.startTime,
        id: entry.id,
        endTime: entry.endTime,
        displayTime: entry.displayTime,
        duration: entry.duration,
        blocks: entry.blocks.map((block) => {
            const region = RegionHelper.hmc(metadata, block);
            return {
                textNodes: block.textNodes.map(transformTextNode.bind(this, styles)),
                region,
                id: block.id
            };
        })
    };
}

/**
 * Filters entries that overlap with or immediately follow a given timestamp.
 * @param {Array} entries - Subtitle entries
 * @param {number} timestamp - Current playback time in ms
 * @returns {Array} Visible entries
 */
function getVisibleEntries(entries, timestamp) {
    const current = entries.filter((e) => e.startTime <= timestamp && timestamp <= e.endTime);
    const upcoming = entries.filter((e) => e.startTime > timestamp);
    return upcoming.length > 0 ? current.concat([upcoming[0]]) : current;
}

/**
 * Parses the document header XML (everything before <p> tags) to extract
 * metadata, styles, regions, and initial styles.
 * @param {string} xml - Header XML string
 * @param {Function} callback - Callback(error, metadata)
 */
function parseHeader(xml, callback) {
    const parser = SaxParser.createParser(true);
    const metadata = {};
    const tagStack = [];
    let currentRegionId = null;
    let initialStyles = {};

    parser.onerror = (err) => callback(err, null);
    parser.onend = () => callback(null, metadata);
    parser.onclosetag = () => tagStack.pop();

    parser.onopentag = (tag) => {
        const attrs = tag.attributes;
        const name = tag.name;
        const regions = metadata.regions;
        const styles = metadata.styles;

        tagStack.push(tag);

        if (name === 'tt') {
            Object.assign(metadata, parseTtElement(attrs));
        } else if (name === 'body') {
            if (attrs.style !== undefined) {
                metadata.defaultStyle = attrs.style;
            }
        } else if (name === 'initial' && stackContains(tagStack, 'styling')) {
            initialStyles = extractNamespacedAttributes(attrs, STYLE_ATTRIBUTES);
            metadata.initialStyle = initialStyles;
        } else if (name === 'style' && stackContains(tagStack, 'styling')) {
            const id = attrs['xml:id'];
            const style = extractNamespacedAttributes(attrs, STYLE_ATTRIBUTES);

            // Inherit from initial styles
            if (Object.keys(initialStyles).length) {
                for (const key in initialStyles) {
                    if (style[key] === undefined) {
                        style[key] = initialStyles[key];
                    }
                }
            }
            styles[id] = style;
        } else if (name === 'style' && stackContains(tagStack, 'region')) {
            const attrName = Object.keys(attrs)[0];
            if (typeof attrName === 'string') {
                regions[currentRegionId][attrName.slice(4)] = attrs[attrName];
            }
        } else if (name === 'region' && stackContains(tagStack, 'layout')) {
            currentRegionId = attrs['xml:id'];
            regions[currentRegionId] = extractNamespacedAttributes(attrs, REGION_ATTRIBUTES);
        }
    };

    setTimeout(() => {
        parser.write(xml);
        while (tagStack.length > 0 && !parser.error) {
            const name = last(tagStack).name;
            parser.write('</' + name + '>');
        }
        parser.close();
    }, 10);
}

/**
 * Parses the root <tt> element attributes into document metadata.
 * @param {Object} attrs - TT element attributes
 * @returns {Object} Document metadata with dimensions and cell resolution
 */
function parseTtElement(attrs) {
    const meta = extractNamespacedAttributes(attrs, ROOT_ATTRIBUTES);

    if (typeof meta.extent === 'string') {
        const dims = meta.extent.split(' ').map((v) => parseInt(v, 10));
        meta.width = dims[0];
        meta.height = dims[1];
    } else {
        meta.width = 1280;
        meta.height = 720;
    }

    meta.aspectRatio = meta.width / meta.height;

    if (typeof meta.cellResolution === 'string') {
        const cells = meta.cellResolution.split(' ').map((v) => parseInt(v, 10));
        meta.cellResolution = { x: cells[0], y: cells[1] };
    } else {
        meta.cellResolution = { x: 52, y: 19 };
    }

    return meta;
}

// ─── TtmlParser Class ───

/**
 * Incremental TTML subtitle parser that extends EventEmitter.
 *
 * Emits:
 * - 'ready': When parsing is initialized and first entries are available
 * - 'error': On parse errors
 *
 * @extends EventEmitter
 */
export class TtmlParser extends EventEmitter {
    /**
     * @param {Object} options - Parser configuration
     * @param {number} [options.hasContent=0] - Initial content offset/position in ms
     * @param {Object} [options.logger] - Logger instance
     * @param {string} [options.xml] - Pre-loaded TTML XML string
     * @param {Function} [options.request] - Function to fetch TTML data
     * @param {string} [options.url] - URL to fetch TTML from
     * @param {number} [options.internal_Pfa=0] - Lookback window in ms
     * @param {Object} [options.M6a] - Style transformation reference
     */
    constructor(options) {
        if (!options.xml && !options.request) {
            throw new Error("TtmlParser requires either a 'request' function or the 'xml' data");
        }

        super();

        /** @private @type {Object|null} Parsed document metadata */
        this._metadata = null;

        /** @private @type {TimedTextIndex|null} Index for seeking */
        this._index = null;

        /** @private @type {number} Content offset in ms */
        this._contentOffset = typeof options.hasContent === 'number' ? options.hasContent : 0;

        /** @private @type {string} Raw XML data */
        this._xml = options.xml || '';

        /** @private @type {Object} Logger */
        this._logger = typeof options.logger === 'object' ? options.logger : NULL_LOGGER;

        /** @private @type {Function|undefined} Request function */
        this._request = options.request;

        /** @private @type {string|undefined} Request URL */
        this._requestUrl = options.url;

        /** @private @type {Array} Parsed subtitle entries buffer */
        this._entries = [];

        /** @private @type {number} Current playback position in ms */
        this._currentPosition = this._contentOffset;

        /** @private @type {number|null} Parse timeout handle */
        this._parseTimeout = null;

        /** @private @type {boolean} Whether initial ready event has fired */
        this._isReady = false;

        /** @private @type {boolean} Whether currently parsing */
        this._isParsing = false;

        /** @private @type {number} Lookback window in ms */
        this._lookbackWindow = options.internal_Pfa || 0;

        /** @private @type {Object} Style transformation ref */
        this.style = options.M6a;
    }

    /**
     * Starts parsing the TTML document. Fetches XML if not pre-loaded,
     * then parses the header and begins incremental entry parsing.
     */
    start() {
        this._logger.info('incremental text stream created, starting at pts ' + this._contentOffset);

        if (this._xml) {
            this._parseHeaderAndIndex();
        } else {
            this._request({ url: this._requestUrl }, (err, data) => {
                this._xml = data;
                this._parseHeaderAndIndex();
            });
        }
    }

    /**
     * @private
     * Finds the header portion (before first <p> tag), parses metadata,
     * builds the timed text index, and begins parsing entries.
     */
    _parseHeaderAndIndex() {
        const pTagIndex = this._xml.indexOf('<p');
        if (pTagIndex > -1) {
            const headerXml = this._xml.slice(0, pTagIndex);
            parseHeader(headerXml, (error, metadata) => {
                if (error !== null) {
                    error.EEb = headerXml;
                    this.emit('error', error);
                } else {
                    this._metadata = metadata;
                    this._index = new TimedTextIndex(this._xml, metadata.tickRate);
                    this._parseEntries(this._contentOffset);
                }
            });
        } else {
            this.emit('error', new Error(
                "paragraph tag not found when searching for '<p'; could not build index"
            ));
        }
    }

    /**
     * @private
     * Incrementally parses the next batch of subtitle entries from the given position.
     *
     * @param {number} fromPosition - Start position in ms
     */
    _parseEntries(fromPosition) {
        const metadata = this._metadata;
        let lineBreakCount = 0;
        const parsedEntries = [];
        const styleStack = metadata.defaultStyle ? [metadata.defaultStyle] : [];
        const langStack = metadata.lang ? [metadata.lang] : [];
        const usesTickRate = this._index.MMa;

        this._logger.info('parsing the next 5 entries...');

        const xmlSlice = this._index.internal_Yxc(fromPosition);
        this._logger.debug(xmlSlice);

        const parser = SaxParser.createParser(true);

        parser.onerror = (error) => {
            error.xml = xmlSlice;
            this.emit('error', error);
        };

        parser.onend = () => {
            // Merge new entries, avoiding duplicate block IDs
            const existingBlockIds = this._entries.reduce((ids, entry) => {
                const blockIds = entry.blocks.reduce((acc, block) => acc.concat([block.id]), []);
                return ids.concat(blockIds);
            }, []);

            parsedEntries.forEach((entry) => {
                if (existingBlockIds.indexOf(entry.id) === -1) {
                    const nonEmptyBlocks = entry.blocks?.filter((b) => b.textNodes.length > 0);
                    if (nonEmptyBlocks?.length > 0) {
                        entry.blocks = nonEmptyBlocks;
                        this._entries.push(entry);
                    }
                }
            });

            this._isParsing = false;
            if (!this._isReady) {
                this._isReady = true;
                this.emit('ready');
            }
        };

        parser.ontext = (text) => {
            if (text.trim() !== '' || text.match(/ +/)) {
                const textNodes = last(last(parsedEntries).blocks).textNodes;
                const processedText = text.match(/ +/) || (last(langStack) && last(langStack).slice(0, 2) === 'ja')
                    ? text
                    : text.trim();

                textNodes.push({
                    text: processedText,
                    style: last(styleStack),
                    lang: last(langStack) && last(langStack).indexOf('ja') === 0 ? 'ja' : last(langStack),
                    lineBreaks: lineBreakCount
                });
            }
            lineBreakCount = 0;
        };

        parser.onclosetag = () => {
            const closedTag = parser.error;
            if (closedTag.attributes.style !== undefined) styleStack.pop();
            if (closedTag.attributes['xml:lang'] !== undefined) langStack.pop();
        };

        parser.onopentag = (tag) => {
            const attrs = tag.attributes;
            const name = tag.name;
            const tickRate = metadata.tickRate;

            if (name === 'p') {
                lineBreakCount = 0;
                const id = attrs['xml:id'];
                if (attrs.style) styleStack.push(attrs.style);
                if (attrs['xml:lang']) langStack.push(attrs['xml:lang']);

                const displayTime = usesTickRate
                    ? Math.floor(parseInt(attrs.begin) / tickRate * 1000)
                    : Math.floor(parseClockTime(attrs.begin));

                if (parsedEntries.length === 0 || last(parsedEntries).displayTime !== displayTime) {
                    let startTime, endTime;
                    if (usesTickRate) {
                        startTime = parseInt(attrs.begin) / tickRate * 1000;
                        endTime = parseInt(attrs.end) / tickRate * 1000;
                    } else {
                        startTime = parseClockTime(attrs.begin);
                        endTime = parseClockTime(attrs.end);
                    }

                    parsedEntries.push({
                        id,
                        startTime: Math.floor(startTime),
                        endTime: Math.floor(endTime),
                        style: attrs.style,
                        region: attrs.region,
                        displayTime: Math.floor(startTime),
                        duration: Math.floor(endTime) - Math.floor(startTime),
                        extent: attrs['tts:extent'] || null,
                        origin: attrs['tts:origin'] || null,
                        latestEndSoFar: Math.floor(endTime) < 0 ? 0 : Math.floor(endTime),
                        blocks: [{
                            textNodes: [],
                            region: attrs.region,
                            id,
                            extent: attrs['tts:extent'] || null,
                            origin: attrs['tts:origin'] || null
                        }]
                    });
                } else {
                    last(parsedEntries).blocks.push({
                        textNodes: [],
                        region: attrs.region,
                        id,
                        extent: attrs['tts:extent'] || null,
                        origin: attrs['tts:origin'] || null
                    });
                }
            } else if (name === 'span') {
                styleStack.push(attrs.style);
                if (attrs['xml:lang']) langStack.push(attrs['xml:lang']);

                const spanStyle = metadata.styles[attrs.style];
                if (attrs.style && spanStyle?.ruby &&
                    ['container', 'baseContainer', 'textContainer'].indexOf(spanStyle.ruby) >= 0) {
                    last(last(parsedEntries).blocks).textNodes.push({
                        text: '',
                        style: last(styleStack),
                        lang: last(langStack),
                        lineBreaks: 0
                    });
                }
            } else if (name === 'br') {
                lineBreakCount++;
            }
        };

        parser.write('<entries>').write(xmlSlice).write('</entries>').close();
    }

    /**
     * Returns subtitle entries visible at the given timestamp.
     * Triggers incremental parsing if the buffer is running low.
     *
     * @param {number} timestamp - Current playback time in ms
     * @returns {Array|null} Array of transformed entries, or null if data not yet available
     */
    getEntriesAtTime(timestamp) {
        if (timestamp < this._currentPosition - this._lookbackWindow) {
            this._entries = [];
        }

        const entries = this._entries;
        const nextParsePoint = entries.length
            ? Math.max(entries[entries.length - 1].startTime, timestamp)
            : timestamp;

        this._currentPosition = timestamp;

        // Trigger more parsing if buffer is low
        if (!this._parseTimeout && this._entries.length < 5 && !this._isParsing) {
            this._logger.info('buffer size: ' + this._entries.length + '; minimum: 5');
            this._isParsing = true;
            this._parseTimeout = setTimeout(() => {
                this._parseTimeout = null;
                this._parseEntries(nextParsePoint + 1);
            }, 10);
        }

        // Remove expired entries
        while (entries.length > 0 && entries[0].endTime < timestamp) {
            entries.shift();
        }

        const visible = getVisibleEntries(entries, timestamp).map(
            transformEntry.bind(this, this._metadata)
        );

        // Return null if before indexed content and nothing visible
        if (timestamp < this._index.internal_Xzb() && visible.length === 0) {
            return null;
        }

        return visible;
    }

    /**
     * Checks if a time range overlaps with indexed subtitle content.
     * @param {number} start - Range start in ms
     * @param {number} end - Range end in ms
     * @returns {number} Number of overlapping entries
     */
    overlapsRange(start, end) {
        return this._index ? this._index.overlapsRange(start, end) : 0;
    }

    /**
     * No-op close method for compatibility.
     */
    close() {}
}

// ─── SAX XML Parser (bundled) ───

// The SAX parser implementation is a Netflix-modified version of sax-js.
// It provides streaming XML parsing with namespace support, entity resolution,
// and configurable strictness. The full implementation is preserved in the
// original module for runtime compatibility.

/**
 * SAX XML parser namespace. Provides factory methods for creating parsers.
 * @namespace SaxParser
 */
export const SaxParser = {
    /**
     * Creates a new SAX parser instance.
     * @param {boolean} [strict=false] - Whether to enforce strict XML parsing
     * @param {Object} [options={}] - Parser options
     * @returns {Object} SAX parser instance
     */
    createParser(strict, options) {
        // Implementation preserved in original module 60514
        // Returns a streaming XML parser with event callbacks:
        // ontext, onopentag, onclosetag, onerror, onend, etc.
    }
};

export default {
    TtmlParser,
    parseHeader,
    last,
    getVisibleEntries,
    transformEntry
};
