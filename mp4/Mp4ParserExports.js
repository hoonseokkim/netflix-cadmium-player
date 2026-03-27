/**
 * Netflix Cadmium Player - MP4 Parser Exports Barrel
 *
 * Re-exports all MP4 parsing utilities including box parsers, SIDX parser,
 * media type definitions, and sample registries. Central entry point for
 * all MP4/fMP4 container parsing functionality.
 *
 * @module Mp4ParserExports
 * @original Module_91562
 */

/** @type {Object} SIDX box definition */
export { sidxBox as sidxDefinition } from '../mp4/BoxDefinitions.js';

/** @type {Function} Box parser instance */
export { boxParser } from '../mp4/BoxParser.js';

/** @type {Object} MP4 parse console/logger */
export { mp4ParseConsole } from '../mp4/Mp4ParseConsole.js';

/** @type {Function} MP4 box parser class constructor */
export { mp4BoxParserClass } from '../mp4/Mp4BoxParserClass.js';

/** @type {*} M1 parser helper */
export { M1 } from '../mp4/Mp4BoxParserClass.js';

/** @type {Function} Track fragment parser (I7) */
export { I7 } from '../mp4/TrackFragmentParser.js';

/** @type {Function} Sample table parser (p7) */
export { p7 } from '../mp4/SampleTableParser.js';

/** @type {Function} Main MP4 box parser */
export { mp4BoxParser } from '../mp4/Mp4BoxParser.js';

/** @type {*} Segment index parser (wK) */
export { wK } from '../mp4/SegmentIndexParser.js';

/** @type {*} Internal box constants */
export { _Pgb, _Mmb, _Lmb } from '../mp4/BoxDefinitions.js';

/** @type {Function} Fragment parser (o8) */
export { o8 } from '../mp4/FragmentParser.js';

/** @type {Object} Media type enum */
export { MediaType } from '../mp4/MediaType.js';

/** @type {Object} Box type constants (BX) */
export { BX as BoxTypes } from '../mp4/BoxTypes.js';

/** @type {*} Fragment layout (fla) */
export { fla as FragmentLayout } from '../mp4/FragmentLayout.js';

/** @type {*} Track parser exports */
export { TX, e8 } from '../mp4/TrackParser.js';

/** @type {*} Sample description parser */
export { bma as SampleDescriptionParser } from '../mp4/SampleDescriptionParser.js';

/** @type {*} Encryption parser */
export { vma as EncryptionParser } from '../mp4/EncryptionParser.js';

/** @type {Object} Typed array utilities */
export { default as TypedArrayUtils } from '../mp4/TypedArrayUtils.js';

/** @type {Object} Array copy utilities */
export { default as ArrayCopyUtils } from '../mp4/ArrayCopyUtils.js';

/** @type {Object} Audio sample registry */
export { audioSampleRegistry } from '../mp4/AudioSampleRegistry.js';
