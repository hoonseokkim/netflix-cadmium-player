/**
 * Netflix Cadmium Player - MP4 Box Parser Registry
 *
 * ISO BMFF (MP4) box parser registry for fragmented MP4 streams used in DASH streaming.
 * Defines parsers for all standard and Netflix-specific MP4 box types including:
 * - Container boxes (moov, trak, mdia, moof, traf, etc.)
 * - Media header boxes (mdhd, tfhd, tfdt)
 * - Segment index (sidx) for seeking and fragment management
 * - DRM/encryption boxes (tenc, senc, saiz, saio)
 * - Sample grouping and dependency (sbgp, sdtp)
 * - VP9 codec configuration (vpcC)
 * - Netflix VMAF quality metrics
 *
 * @module BoxParserRegistry
 */

import { assert } from '../modules/Module_93334.js';
import * as BoxTypeConstants from '../modules/Module_75589.js';
import { TimeUtil } from '../modules/Module_49420.js';
import ArrayFrom from '../modules/Module_24500.js';
// Side-effect imports for box type registrations
import '../modules/Module_2050.js';
import '../modules/Module_32296.js';

import { debugEnabled as BaseBoxParser } from '../modules/Module_72905.js';

// Individual box parser imports (pre-registered box types from other modules)
import BoxH from '../modules/Module_71368.js';
import BoxJ from '../modules/Module_95797.js';
import BoxM from '../modules/Module_85571.js';
import BoxK from '../modules/Module_45645.js';
import BoxL from '../modules/Module_35503.js';
import BoxO from '../modules/Module_29973.js';
import BoxI from '../modules/Module_19234.js';
import BoxN from '../modules/Module_28721.js';
import BoxQ from '../modules/Module_84379.js';

// Side-effect imports
import '../modules/Module_71724.js';
import '../modules/Module_70428.js';

import { h9a as BoxS, internal_Zbb as BoxT } from '../modules/Module_40755.js';
import BoxU from '../modules/Module_26856.js';
import BoxX from '../modules/Module_29043.js';
import DefaultEncvBox from '../modules/Module_41192.js';
import { p9a as BoxDa, q9a as BoxBa, r9a as BoxAa, s9a as BoxCa } from '../modules/Module_41192.js';
import { workin_Kdb as BoxZ, ydb as BoxFa, sbb as BoxLa, o9a as BoxKa } from '../modules/Module_41192.js';
import SchmBox from '../modules/Module_41116.js';
import BoxR from '../modules/Module_18319.js';
import BoxP from '../modules/Module_56226.js';
import BoxV from '../modules/Module_87206.js';
import BoxSa from '../modules/Module_97066.js';
import BoxQa from '../modules/Module_96345.js';
import BoxWa from '../modules/Module_31025.js';
import BoxNa from '../modules/Module_91056.js';
import BoxOa from '../modules/Module_64280.js';

// More side-effect imports
import '../modules/Module_91578.js';
import '../modules/Module_59909.js';
import '../modules/Module_27364.js';
import '../modules/Module_48823.js';

import BoxW from '../modules/Module_30717.js';
import { o8 as TrunBox } from '../modules/Module_70179.js';
import BoxHa from '../modules/Module_89362.js';
import BoxPa from '../modules/Module_96989.js';
import BoxVa from '../modules/Module_23471.js';
import MdatBox from '../modules/Module_16530.js';
import BoxA2 from '../modules/Module_53158.js';

// ─────────────────────────────────────────────────────────────────────────────
// Utility functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert an ArrayBuffer to a hexadecimal string representation.
 * Used primarily for displaying encryption key IDs.
 * @this {ArrayBuffer}
 * @returns {string} Hex string (e.g. "0123456789abcdef")
 */
function bufferToHexString() {
    const view = new DataView(this);
    let hex = '';
    for (let i = 0; i < this.byteLength; i++) {
        const byte = view.getUint8(i);
        hex += ('00' + byte.toString(16)).slice(-2);
    }
    return hex;
}

/**
 * Register an array of box parsers into a registry map.
 * Each parser must have a `writeUint32` property containing its four-character box type code.
 * @param {Array} parsers - Array of box parser constructors
 * @param {Object} registry - Target registry object mapping box type codes to parsers
 */
function registerBoxParsers(parsers, registry) {
    parsers.forEach(function (parser) {
        registry[parser.writeUint32] = parser;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Container Box - Generic container that holds child boxes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generic container box parser (e.g. trak, mdia, minf, stbl, sinf, schi, mvex, edts).
 * Simply delegates parsing to child boxes.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function ContainerBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

ContainerBox.isBoxComplete = true;
ContainerBox.prototype = new BaseBoxParser();
ContainerBox.prototype.constructor = ContainerBox;

// ─────────────────────────────────────────────────────────────────────────────
// MoovBox - Movie container box ('moov')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Movie box ('moov') parser. Top-level container for all movie metadata.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function MoovBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

MoovBox.isBoxComplete = true;
MoovBox.prototype = new BaseBoxParser();
MoovBox.prototype.constructor = MoovBox;

// ─────────────────────────────────────────────────────────────────────────────
// MdhdBox - Media Header Box ('mdhd')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Media Header Box ('mdhd') parser.
 * Contains timescale, duration, and language for a media track.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function MdhdBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

MdhdBox.isBoxComplete = false;
MdhdBox.prototype = new BaseBoxParser();
MdhdBox.prototype.constructor = MdhdBox;

/**
 * Parse the mdhd box contents.
 * Reads version-dependent creation/modification times, timescale, duration, and ISO-639-2 language.
 * @param {Object} ma - Parse context with optional `ce` (track context) to store timescale/duration
 * @returns {boolean} true on success
 */
MdhdBox.prototype.videoSampleEntry = function (ma) {
    this.oi();
    if (1 === this.version) {
        this.bitReader.longValue();  // creation_time (64-bit)
        this.bitReader.longValue();  // modification_time (64-bit)
        this.timescaleValue = this.bitReader.dc();
        this.duration = this.bitReader.longValue();
    } else {
        this.bitReader.dc();  // creation_time (32-bit)
        this.bitReader.dc();  // modification_time (32-bit)
        this.timescaleValue = this.bitReader.dc();
        this.duration = this.bitReader.dc();
    }

    // Decode ISO-639-2/T language code from packed 15-bit value
    const langBits = this.bitReader.sg() & 32767;
    this.language = String.fromCharCode(
        96 + (langBits >>> 10),
        96 + ((langBits >>> 5) & 31),
        96 + (langBits & 31)
    );

    if (ma && ma.ce) {
        ma.ce.timescaleValue = this.timescaleValue;
        ma.ce.duration = this.duration;
    }

    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// SidxBox - Segment Index Box ('sidx')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Segment Index Box ('sidx') parser.
 * Contains a compact index of media segments for seeking in fragmented MP4.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function SidxBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
    /** @type {number|undefined} Minimum segment duration config */
    this.f6a = ma.config.f6a;
    /** @type {Uint32Array|undefined} Segment durations */
    this.og = undefined;
    /** @type {Uint32Array|undefined} Segment sizes */
    this.sizes = undefined;
}

SidxBox.isBoxComplete = false;
SidxBox.prototype = new BaseBoxParser();
SidxBox.prototype.constructor = SidxBox;

/**
 * Parse the sidx header fields (reference_ID, timescale, earliest PTS, first offset, reference count).
 * @private
 */
SidxBox.prototype.M9b = function () {
    this.oi();
    this.bitReader.dc(); // reference_ID
    this.timescaleValue = this.bitReader.dc();

    if (0 === this.version) {
        this.jyb = this.bitReader.dc();   // earliest_presentation_time (32-bit)
        this.yAb = this.bitReader.dc();   // first_offset (32-bit)
    } else {
        this.jyb = this.bitReader.longValue();  // earliest_presentation_time (64-bit)
        this.yAb = this.bitReader.longValue();  // first_offset (64-bit)
    }

    this.vQb = this.bitReader.sg(); // reserved
    this.DPb = this.bitReader.sg(); // reference_count
};

/**
 * Parse segment references and compute durations, applying timescale conversion.
 * @param {Object} ma - Frame duration info with timescaleValue
 * @param {number} ra - Number of references
 * @private
 */
SidxBox.prototype.P7b = function (ma, ra) {
    const localTimescale = this.timescaleValue;
    const targetTimescale = (ma && ma.timescaleValue) || localTimescale;
    const scaleFactor = targetTimescale / localTimescale;

    // Read segment sizes (12 bytes per reference entry, sizes at byte offset)
    const segmentSizes = this.bitReader.internal_Kya(ra, 12, false);

    // Read segment durations, applying scale factor if needed
    const segmentDurations = (1 === scaleFactor)
        ? this.bitReader.internal_Kya(ra, 12, false)
        : ArrayFrom.from(Uint32Array, { length: ra }, function () {
            const duration = Math.round(this.bitReader.dc() * scaleFactor);
            this.bitReader.offset += 8;
            return duration;
        }, this);

    this.C$b(ra, segmentDurations, segmentSizes, targetTimescale);
};

/**
 * Merge small segments if a minimum duration threshold (f6a) is configured.
 * @param {number} count - Number of references
 * @param {Uint32Array} durations - Segment durations
 * @param {Uint32Array} sizes - Segment sizes
 * @param {number} timescale - Target timescale
 * @private
 */
SidxBox.prototype.C$b = function (count, durations, sizes, timescale) {
    if (this.f6a) {
        const minDuration = this.f6a * timescale / 1000;
        let writeIdx = 0;

        for (let i = 1; i < count; i++) {
            if (Math.abs(durations[writeIdx] - minDuration) > Math.abs(durations[writeIdx] + durations[i] - minDuration)) {
                // Merge: accumulate into current segment
                durations[writeIdx] += durations[i];
                sizes[writeIdx] += sizes[i];
            } else {
                // Start a new segment
                ++writeIdx;
                if (writeIdx !== i) {
                    durations[writeIdx] = durations[i];
                    sizes[writeIdx] = sizes[i];
                }
            }
        }
        ++writeIdx;

        durations = new Uint32Array(durations.buffer.slice(0, 4 * writeIdx));
        sizes = new Uint32Array(sizes.buffer.slice(0, 4 * writeIdx));
    }

    this.sizes = sizes;
    this.og = durations;
};

/**
 * Parse the full sidx box, building the fragment index for seeking.
 * @param {Object} ma - Parse context with frameDuration info
 * @returns {boolean} true on success
 */
SidxBox.prototype.videoSampleEntry = function (ma) {
    this.M9b();
    this.frameDuration = ma.frameDuration;

    const sidxTimescale = this.timescaleValue;
    const targetTimescale = (this.frameDuration && this.frameDuration.timescaleValue) || sidxTimescale;
    const referenceCount = this.DPb;
    const dataOffset = this.startOffset + this.length + this.yAb;
    const presentationTime = new TimeUtil(this.jyb, sidxTimescale).downloadState(targetTimescale).$;

    this.fragmentIndex = {
        O: targetTimescale,
        renditionValue: presentationTime,
        offset: dataOffset
    };

    this.P7b(this.frameDuration, referenceCount);
    this.fragmentIndex.og = this.og;
    this.fragmentIndex.sizes = this.sizes;

    ma.sidx = this;
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// VmafBox - Netflix VMAF Quality Metrics Box ('vmaf')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * VMAF (Video Multi-Method Assessment Fusion) box parser.
 * Contains per-frame quality scores for Netflix quality-of-experience metrics.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function VmafBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

VmafBox.isBoxComplete = false;
VmafBox.prototype = new BaseBoxParser();
VmafBox.prototype.constructor = VmafBox;

/**
 * Parse VMAF scores from the box payload.
 * @returns {boolean} true on success
 */
VmafBox.prototype.videoSampleEntry = function () {
    this.PF = [];    // VMAF scores array
    this.cPc = [];   // Secondary metric array
    const count = (this.length - 11) / 2;

    this.bitReader.readUint32();
    this.bitReader.readUint32();
    this.bitReader.readUint32();

    for (let i = 0; i < count; i++) {
        this.PF.push(this.bitReader.readUint32());
        this.cPc.push(this.bitReader.readUint32());
    }
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// TencBox - Track Encryption Box ('tenc')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Track Encryption Box ('tenc') parser.
 * Contains default encryption parameters (algorithm, IV size, key ID) for a track.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function TencBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

TencBox.isBoxComplete = false;
TencBox.prototype = new BaseBoxParser();
TencBox.prototype.constructor = TencBox;

/**
 * Parse tenc box: encryption algorithm, IV size, and default key ID.
 * For version >= 1, also reads crypt_byte_block and skip_byte_block (CENS/CBCS patterns).
 * @param {Object} ma - Parse context with optional `ce` (track encryption context)
 * @returns {boolean} true on success
 */
TencBox.prototype.videoSampleEntry = function (ma) {
    this.oi();
    this.bitReader.offset += 1; // reserved

    if (0 == this.version) {
        this.bitReader.offset += 1; // reserved
    } else {
        const patternByte = this.bitReader.readUint32();
        this.internal_Onc = patternByte >> 4;    // crypt_byte_block
        this.internal_Snc = patternByte & 15;    // skip_byte_block
        if (ma && ma.ce) {
            ma.ce.internal_Vdd = this.internal_Onc;
            ma.ce.internal_Ydd = this.internal_Snc;
        }
    }

    this.ixb = this.bitReader.readUint32();   // isProtected
    this.gxb = this.bitReader.readUint32();   // per_sample_IV_size
    this.pZa = this.bitReader.offset;
    this.xB = this.bitReader.s3(16);          // default_KID (16 bytes)
    this.xB.toString = bufferToHexString;

    if (ma && ma.ce) {
        ma.ce.internal_Wdd = this.ixb;
        ma.ce.hxb = this.gxb;
        ma.ce.internal_Xdd = this.xB;
    }

    // If isProtected=1 and per_sample_IV_size=0, read constant IV
    if (1 == this.ixb && 0 == this.gxb) {
        this.internal_Nnc = this.bitReader.readUint32();          // constant_IV_size
        this.internal_Mnc = this.bitReader.s3(this.internal_Nnc); // constant_IV
        if (ma && ma.ce) {
            ma.ce.internal_Pnc = this.internal_Mnc;
        }
    }

    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// CustomKeyedBox - Custom keyed data box
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom keyed data box parser for Netflix-specific extensions.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function CustomKeyedBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

CustomKeyedBox.isBoxComplete = false;
CustomKeyedBox.prototype = new BaseBoxParser();
CustomKeyedBox.prototype.constructor = CustomKeyedBox;

/**
 * Parse the custom keyed box: reads entry count and key-value data.
 * @returns {boolean} true on success
 */
CustomKeyedBox.prototype.videoSampleEntry = function () {
    this.oi();
    this.length = this.bitReader.sg();
    this.YIc = this.bitReader.internal_Kya(this.length, undefined, true);
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// AdditionalSapBox - Additional SAP (Stream Access Point) Box
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Additional SAP box parser. Contains extra stream access point information
 * for fine-grained seeking within segments.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function AdditionalSapBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

AdditionalSapBox.isBoxComplete = false;
AdditionalSapBox.prototype = new BaseBoxParser();
AdditionalSapBox.prototype.constructor = AdditionalSapBox;

/**
 * Parse additional SAP data using the sidx reference as context.
 * Builds lookup tables for SAP positions and offsets within segments.
 * @param {Object} ma - Parse context with `sidx` and `frameDuration`
 * @returns {boolean} true on success
 */
AdditionalSapBox.prototype.videoSampleEntry = function (ma) {
    const sidx = ma.sidx;
    assert(sidx);
    const frameDuration = ma.frameDuration;
    const sidxTimescale = sidx.timescaleValue;
    const referenceCount = sidx.DPb;

    assert(frameDuration);
    assert(sidxTimescale);
    assert(referenceCount);

    this.oi();
    assert(2 > this.version);

    this.length = this.bitReader.sg();
    this.g3 = new Uint16Array(referenceCount + 1);

    const samplesPerSegment = frameDuration.IDb(sidxTimescale);
    const timePerSample = samplesPerSegment / sidxTimescale;
    const sampleDuration = frameDuration.downloadState(samplesPerSegment).$;

    if (0 === this.version) {
        this.Q3 = new Uint16Array();
        this.offsetGet = new Uint32Array();
        let sapIdx = 0;

        for (let segIdx = 0; segIdx <= referenceCount; ++segIdx) {
            this.g3[segIdx] = sapIdx;
            if (segIdx < this.length) {
                const sapCount = this.bitReader.readUint32();
                if (0 !== sapCount) {
                    for (let j = 0; j < sapCount; ++j, ++sapIdx) {
                        this.Q3[sapIdx] = Math.floor((this.bitReader.dc() + 1) * timePerSample) / sampleDuration;
                        this.offsetGet[sapIdx] = this.bitReader.dc();
                    }
                }
            }
        }
    } else if (1 === this.version) {
        const segmentIndices = this.bitReader.tSc(this.length);
        this.bitReader.offset += 4;
        this.offsetGet = this.bitReader.internal_Kya(this.length, 10, false);
        this.bitReader.offset -= 8;

        this.Q3 = ArrayFrom.from(Uint16Array, { length: this.length }, function () {
            const val = Math.floor((this.bitReader.dc() + 1) * timePerSample) / sampleDuration;
            this.bitReader.offset += 6;
            return val;
        }, this);

        let sapIdx = 0;
        for (let segIdx = 0; segIdx <= referenceCount; ++segIdx) {
            while (sapIdx < segmentIndices.length && segmentIndices[sapIdx] < segIdx) {
                ++sapIdx;
            }
            this.g3[segIdx] = sapIdx;
        }
    }

    this.additionalSAPs = {
        g3: this.g3,
        Q3: this.Q3,
        offsetGet: this.offsetGet
    };

    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// MoofBox - Movie Fragment Box ('moof')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Movie Fragment Box ('moof') parser.
 * Container for a set of track fragments representing a movie fragment.
 * Inherits from ContainerBox.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function MoofBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

MoofBox.isBoxComplete = true;
MoofBox.prototype = Object.create(ContainerBox.prototype);
MoofBox.prototype.constructor = MoofBox;

// ─────────────────────────────────────────────────────────────────────────────
// TrafBox - Track Fragment Box ('traf')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Track Fragment Box ('traf') parser.
 * Container for track-level fragment metadata within a movie fragment.
 * After parsing children, resolves the base data offset from tfhd.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function TrafBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

TrafBox.isBoxComplete = true;
TrafBox.prototype = Object.create(ContainerBox.prototype);
TrafBox.prototype.constructor = TrafBox;

/**
 * After child boxes are parsed, resolve the base data offset.
 * If tfhd has base-data-offset-present flag, use it; otherwise use moof start offset.
 * @returns {boolean} true
 */
TrafBox.prototype.supportsOperation = function () {
    const tfhd = this.findBox('tfhd');
    if (tfhd) {
        this.CA = tfhd.internal_Nsb ? tfhd.CA : this.parent.startOffset;
    }
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// VpcCBox - VP Codec Configuration Box ('vpcC')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * VP Codec Configuration Box ('vpcC') parser.
 * Contains VP9 codec configuration including color space, bit depth, chroma subsampling.
 * Handles version 1 -> version 0 downgrade for compatibility.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function VpcCBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

VpcCBox.isBoxComplete = false;
VpcCBox.prototype = new BaseBoxParser();
VpcCBox.prototype.constructor = VpcCBox;

/**
 * Parse vpcC box. For version 1, converts to version 0 format in-place,
 * mapping colour primaries to VP9 color space constants.
 * @returns {boolean} true on success
 */
VpcCBox.prototype.videoSampleEntry = function () {
    const versionOffset = this.bitReader.offset;
    this.oi();

    if (1 === this.version) {
        this.bitReader.offset += 2;
        let writeOffset = this.bitReader.offset;

        const profile = this.bitReader.readUint32();
        const colourPrimaries = this.bitReader.readUint32();
        const bitDepth = this.bitReader.readUint32();
        const matrixCoefficients = this.bitReader.readUint32();
        const codecInitCount = this.bitReader.sg();
        const codecInitData = [];

        for (let i = 0; i < codecInitCount; ++i) {
            codecInitData[i] = this.bitReader.readUint32();
        }

        // Extract VP9 profile fields
        const profileNum = (profile & 240) >>> 4;
        const chromaSubsampling = (profile & 14) >>> 1;
        const videoFullRangeFlag = profile & 1;
        const bitDepthFlag = (16 === bitDepth) ? 1 : 0;

        if (colourPrimaries != matrixCoefficients) {
            this.bitReader.console.RETRY(
                'VP9: Has the VP9 spec for vpcC changed? colourPrimaries ' +
                colourPrimaries + ' and matrixCoefficients ' + matrixCoefficients +
                ' should be the same value!'
            );
        }

        // Map colour primaries to VP9 color space enum
        let colorSpace = 2; // VP9_COLOR_SPACE_BT709_6 (default)
        switch (colourPrimaries) {
            case 1: colorSpace = 2; break; // BT.709
            case 6: colorSpace = 1; break; // BT.601
            case 9: colorSpace = 5; break; // BT.2020
            default:
                this.bitReader.console.RETRY(
                    'VP9: Unknown colourPrimaries ' + colourPrimaries +
                    '! Falling back to default color space VP9_COLOR_SPACE_BT709_6 (2)'
                );
        }

        // Rewrite as version 0 in-place
        this.version = 0;
        this.readFloat64.$h(this.version, versionOffset);
        this.readFloat64.$h(profileNum << 4 | colorSpace, writeOffset++);
        this.readFloat64.$h(chromaSubsampling << 4 | bitDepthFlag << 1 | videoFullRangeFlag, writeOffset++);

        const newCodecInitCount = codecInitCount + 2;
        codecInitData.push(0, 0);
        this.readFloat64.rW(newCodecInitCount, false);
        writeOffset += 2;

        codecInitData.forEach(function (val) {
            this.readFloat64.$h(val, writeOffset++);
        });
    }

    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// TfhdBox - Track Fragment Header Box ('tfhd')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Track Fragment Header Box ('tfhd') parser.
 * Contains per-fragment defaults for sample description, duration, size, and flags.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function TfhdBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

TfhdBox.isBoxComplete = false;
TfhdBox.prototype = new BaseBoxParser();
TfhdBox.prototype.constructor = TfhdBox;
TfhdBox.writeUint32 = 'tfhd';

Object.defineProperties(TfhdBox.prototype, {
    /** @type {boolean} base-data-offset-present flag (0x000001) */
    Nsb: {
        get: function () { return this.flags & 1; }
    },
    /** @type {boolean} sample-description-index-present flag (0x000002) */
    LVc: {
        get: function () { return this.flags & 2; }
    },
    /** @type {boolean} default-sample-duration-present flag (0x000008) */
    internal_Qnc: {
        get: function () { return this.flags & 8; }
    },
    /** @type {boolean} default-sample-size-present flag (0x000010) */
    internal_Rnc: {
        get: function () { return this.flags & 16; }
    },
    /** @type {boolean} default-sample-flags-present flag (0x000020) */
    jxb: {
        get: function () { return this.flags & 32; }
    }
});

/**
 * Parse tfhd fields: track_ID and optional base_data_offset, sample_description_index,
 * default_sample_duration, default_sample_size, default_sample_flags.
 * @param {Object} ma - Parse context with optional `data` object
 * @returns {boolean} true on success
 */
TfhdBox.prototype.videoSampleEntry = function (ma) {
    this.oi();
    this.Y4 = this.bitReader.dc();                                       // track_ID
    this.CA = this.internal_Nsb ? this.bitReader.longValue() : undefined; // base_data_offset
    this.eRb = this.LVc ? this.bitReader.dc() : undefined;               // sample_description_index
    this.YD = this.internal_Qnc ? this.bitReader.dc() : undefined;       // default_sample_duration
    this.ZD = this.internal_Rnc ? this.bitReader.dc() : undefined;       // default_sample_size
    this.AH = this.jxb ? this.bitReader.dc() : undefined;                // default_sample_flags

    if (ma && ma.data) {
        ma.data.Y4 = this.Y4;
        ma.data.CA = this.CA;
        ma.data.eRb = this.eRb;
        ma.data.YD = this.YD;
        ma.data.ZD = this.ZD;
        ma.data.AH = this.jxb ? this.AH : undefined;
    }

    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// TfdtBox - Track Fragment Decode Time Box ('tfdt')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Track Fragment Decode Time Box ('tfdt') parser.
 * Contains the absolute decode time of the first sample in the fragment.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function TfdtBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

TfdtBox.isBoxComplete = false;
TfdtBox.prototype = new BaseBoxParser();
TfdtBox.prototype.constructor = TfdtBox;

/**
 * Parse the base media decode time (32-bit or 64-bit depending on version).
 * @param {Object} ma - Parse context with optional `data` object
 * @returns {boolean} true on success
 */
TfdtBox.prototype.videoSampleEntry = function (ma) {
    this.oi();
    this.fH = (1 === this.version) ? this.bitReader.longValue() : this.bitReader.dc();
    if (ma && ma.data) {
        ma.data.fH = this.fH;
    }
    return true;
};

/**
 * Adjust the base media decode time by a delta (for fragment trimming).
 * @param {number} delta - Amount to add to the base decode time
 */
TfdtBox.prototype.ase_location_history = function (delta) {
    const writeOffset = this.startOffset + 12;
    this.fH += delta;
    if (1 === this.version) {
        this.readFloat64.jYb(this.fH, writeOffset);
    } else {
        this.readFloat64.fo(this.fH, writeOffset);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SaizBox - Sample Auxiliary Information Sizes Box ('saiz')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sample Auxiliary Information Sizes Box ('saiz') parser.
 * Contains the size of auxiliary information for each sample (e.g. encryption metadata sizes).
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function SaizBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

SaizBox.isBoxComplete = false;
SaizBox.prototype = Object.create(BaseBoxParser.prototype);
SaizBox.prototype.constructor = SaizBox;

Object.defineProperties(SaizBox.prototype, {
    /** @type {boolean} aux_info_type_parameter present flag */
    WQ: {
        get: function () { return this.flags & 1; }
    }
});

/**
 * Parse saiz: optional aux_info_type fields, default_sample_info_size, and sample_count.
 * If default size is 0, reads per-sample sizes.
 * @param {Object} ma - Parse context with optional `data` object
 * @returns {boolean} true on success
 */
SaizBox.prototype.videoSampleEntry = function (ma) {
    this.oi();

    if (this.WQ) {
        this.bitReader.gC();   // aux_info_type
        this.bitReader.dc();   // aux_info_type_parameter
    }

    this.kSa = this.bitReader.readUint32();  // default_sample_info_size
    this.getPosition = this.bitReader.dc();  // sample_count

    // If default size is 0, per-sample sizes follow
    if (0 === this.kSa) {
        this.bitReader.KU(this.getPosition);
    }

    if (ma && ma.data) {
        ma.data.GVc = this.getPosition;
    }

    return true;
};

/**
 * Adjust saiz box for fragment trimming.
 * @param {number} ma - Trim count
 * @param {boolean} ra - Trim from end (true) or start (false)
 * @returns {boolean} true
 */
SaizBox.prototype.ase_location_history = function (ma, ra) {
    if (ma) {
        const trimCount = ra ? this.getPosition - ma : ma;
        this.readFloat64.offset = this.startOffset + 13 + (this.WQ ? 8 : 0);
        this.getPosition -= trimCount;
        this.readFloat64.fo(this.getPosition);

        if (0 !== this.kSa) {
            this.tza = ra ? 0 : this.kSa * trimCount;
            return;
        }

        this.tza = 0;
        if (ra) {
            this.readFloat64.offset += this.getPosition;
        } else {
            for (let i = 0; i < trimCount; ++i) {
                this.tza += this.readFloat64.readUint32();
            }
            this.readFloat64.offset -= trimCount;
        }
        this.parseBoxContent(trimCount, this.bitReader.offset);
    }
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// SaioBox - Sample Auxiliary Information Offsets Box ('saio')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sample Auxiliary Information Offsets Box ('saio') parser.
 * Contains offsets to sample auxiliary information (encryption IVs and subsample info).
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function SaioBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

SaioBox.isBoxComplete = false;
SaioBox.prototype = Object.create(BaseBoxParser.prototype);
SaioBox.prototype.constructor = SaioBox;

Object.defineProperties(SaioBox.prototype, {
    /** @type {boolean} aux_info_type_parameter present flag */
    WQ: {
        get: function () { return this.flags & 1; }
    }
});

/**
 * Parse saio box: reads the offset to auxiliary information and then parses
 * the encryption metadata (IVs and subsample ranges) at that offset.
 * @param {Object} ma - Parse context with `data` and `ce` (encryption context)
 * @returns {boolean} true on success
 */
SaioBox.prototype.videoSampleEntry = function (ma) {
    this.oi();

    if (this.WQ) {
        this.bitReader.gC();   // aux_info_type
        this.bitReader.dc();   // aux_info_type_parameter
    }

    this.length = this.bitReader.dc(); // entry_count
    assert(1 === this.length, 'Expected a single entry in Sample Auxiliary Information Offsets box');

    // Read the offset (32-bit for v0, 64-bit for v1)
    this.zl = (0 === this.version) ? this.bitReader.workin_Ufa() : this.bitReader.mPb();
    this.bitReader.offset = this.zl;

    // Parse encryption info at the offset
    if (ma && ma.data && ma.ce) {
        const ivSize = ma.ce.hxb;
        const sampleCount = ma.data.GVc;

        assert(0 < ivSize || void 0 !== ma.ce.internal_Pnc, 'Expected per sample or constant IV');
        assert(0 < sampleCount, 'Expected saix box parsing to find sample count');

        ma.data.eV = [];
        for (let i = 0; i < sampleCount; i++) {
            const iv = ivSize ? this.bitReader.s3(ivSize) : undefined;
            const subsampleRanges = [];
            const subsampleCount = this.bitReader.sg();

            for (let j = 0; j < subsampleCount; j++) {
                const clearBytes = this.bitReader.sg();
                const encryptedBytes = this.bitReader.dc();
                subsampleRanges.push({
                    bfc: clearBytes,
                    cfc: encryptedBytes
                });
            }

            ma.data.eV.push({
                O6a: subsampleRanges,
                QFa: iv
            });
        }
    }

    return true;
};

/**
 * Adjust the saio offset for fragment trimming.
 * @param {number} ma - Offset adjustment value
 * @param {*} ra - New offset value for rewrite
 * @returns {boolean} true
 */
SaioBox.prototype.ase_location_history = function (ma, ra) {
    this.zl += ma;
    this.readFloat64.offset = this.startOffset + 16 + (this.WQ ? 8 : 0) + (0 === this.version ? 0 : 4);
    this.readFloat64.d9a(ra, this.zl);
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// SencBox - Sample Encryption Box ('senc')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sample Encryption Box ('senc') parser.
 * Contains per-sample encryption metadata (IVs and optional subsample encryption ranges).
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function SencBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

SencBox.isBoxComplete = false;
SencBox.prototype = Object.create(BaseBoxParser.prototype);
SencBox.prototype.constructor = SencBox;

// ─────────────────────────────────────────────────────────────────────────────
// SencExtBox - Extended Sample Encryption Box (Netflix extension)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extended Sample Encryption Box parser (Netflix-specific senc variant).
 * Similar to SencBox but includes additional fields (IV size, key ID) in the box itself.
 * Inherits parsing logic from SencBox.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function SencExtBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

SencExtBox.isBoxComplete = false;
SencExtBox.prototype = Object.create(SencBox.prototype);
SencExtBox.prototype.constructor = SencExtBox;

Object.defineProperties(SencBox.prototype, {
    /** @type {boolean} Always false for standard senc (no extended header) */
    M1a: {
        get: function () { return false; }
    },
    /** @type {boolean} Use subsample encryption flag (0x000002) */
    jXb: {
        get: function () { return this.flags & 2; }
    }
});

Object.defineProperties(SencExtBox.prototype, {
    /** @type {boolean} Extended header present flag (0x000001) */
    M1a: {
        get: function () { return this.flags & 1; }
    }
});

/**
 * Parse senc box: reads per-sample IVs and optional subsample encryption ranges.
 * If auxiliary info was already parsed via saio/saiz, skips duplicate parsing.
 * @param {Object} ma - Parse context with `data` and `ce` (encryption context)
 * @returns {boolean} true on success
 */
SencBox.prototype.videoSampleEntry = function (ma) {
    this.oi();

    // Determine IV size from track encryption context or default to 8
    let ivSize = ma?.ce?.hxb;
    this.HM = (ivSize !== undefined) ? ivSize : 8;

    // Extended senc includes IV size and key ID inline
    if (this.M1a) {
        this.HM = this.bitReader.dc() & 255;
        this.kid = this.bitReader.KU(16);
    }

    if (ma && ma.data) {
        // If auxiliary info already parsed via saio, skip
        if (ma.data.eV) return true;
        if (!ma.data.keyframeArray) ma.data.keyframeArray = [];
    }

    // Validate IV size
    if (0 !== this.HM && 8 !== this.HM && 16 !== this.HM) return true;

    this.getPosition = this.bitReader.dc(); // sample_count

    if (ma && ma.data) {
        for (let i = 0; i < this.getPosition; i++) {
            // Read per-sample IV
            ma.data.keyframeArray[i].QFa = (0 < this.HM) ? this.bitReader.s3(this.HM) : undefined;

            // Read subsample encryption ranges if flag is set
            if (this.jXb) {
                const subsampleRanges = [];
                const subsampleCount = this.bitReader.sg();
                for (let j = 0; j < subsampleCount; j++) {
                    const clearBytes = this.bitReader.sg();
                    const encryptedBytes = this.bitReader.dc();
                    subsampleRanges.push({
                        bfc: clearBytes,
                        cfc: encryptedBytes
                    });
                }
                ma.data.keyframeArray[i].O6a = subsampleRanges;
            }
        }
    }

    return true;
};

/**
 * Adjust extended senc box for fragment trimming.
 * @param {number} ma - Trim count
 * @param {boolean} ra - Trim from end
 * @returns {*} Result from parent ase_location_history
 */
SencExtBox.prototype.ase_location_history = function (ma, ra) {
    return SencBox.prototype.ase_location_history.call(this, ma, ra, 28 + (this.M1a ? 20 : 0));
};

/**
 * Adjust senc box for fragment trimming: updates sample count and trims sample data.
 * @param {number} ma - Trim count
 * @param {boolean} ra - Trim from end (true) or start (false)
 * @param {number} [ya] - Override start offset for the sample count field
 */
SencBox.prototype.ase_location_history = function (ma, ra, ya) {
    const trimCount = ra ? this.getPosition - ma : ma;
    this.readFloat64.offset = this.startOffset + (ya || 12);
    this.getPosition -= trimCount;
    this.readFloat64.fo(this.getPosition);

    const afterCountOffset = this.readFloat64.offset;

    if (this.jXb) {
        // Variable-size entries: must walk through each sample
        let samplesToSkip = ra ? this.getPosition : trimCount;
        while (samplesToSkip > 0) {
            this.readFloat64.offset += this.HM;
            const subsampleCount = this.readFloat64.sg();
            this.readFloat64.offset += 6 * subsampleCount;
            --samplesToSkip;
        }
    } else {
        // Fixed-size entries: skip by IV size * count
        this.readFloat64.offset += this.HM * (ra ? this.getPosition : trimCount);
    }

    if (ra) {
        this.parseBoxContent(this.length - (this.bitReader.offset - this.startOffset), this.bitReader.offset);
    } else {
        this.parseBoxContent(this.bitReader.offset - afterCountOffset, afterCountOffset);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SdtpBox - Sample Dependency Type Box ('sdtp')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sample Dependency Type Box ('sdtp') parser.
 * Contains per-sample dependency information (is_leading, depends_on, is_depended_on, has_redundancy).
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function SdtpBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

SdtpBox.isBoxComplete = false;
SdtpBox.prototype = Object.create(BaseBoxParser.prototype);
SdtpBox.prototype.constructor = SdtpBox;

/**
 * Parse sdtp: reads one byte per sample containing dependency flags.
 * @param {Object} ma - Parse context with optional `data.keyframeArray`
 * @returns {boolean} true on success
 */
SdtpBox.prototype.videoSampleEntry = function (ma) {
    this.oi();
    if (ma && ma.data) {
        if (ma.data.keyframeArray === undefined) {
            ma.data.keyframeArray = [];
        }
        for (let i = 0; i < this.length - 12; i++) {
            ma.data.keyframeArray[i].gld = this.bitReader.readUint32();
        }
    }
    return true;
};

/**
 * Adjust sdtp box for fragment trimming.
 * @param {number} ma - Trim count
 * @param {number} ra - Total sample count
 * @param {boolean} ya - Trim from end
 * @returns {boolean} true
 */
SdtpBox.prototype.ase_location_history = function (ma, ra, ya) {
    if (this.length - 12 !== ra) return true;

    if (ya) {
        this.parseBoxContent(ra - ma, this.startOffset + 12 + ma);
    } else {
        this.parseBoxContent(ma, this.startOffset + 12);
    }
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// SbgpBox - Sample to Group Box ('sbgp')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sample to Group Box ('sbgp') parser.
 * Maps samples to sample group description entries for features like
 * random access recovery points and roll groups.
 * @param {Object} ma - Parser context / config
 * @param {*} ra - Bit reader
 * @param {*} ya - Start offset
 * @param {*} ua - Length
 * @param {*} xa - Parent
 */
function SbgpBox(ma, ra, ya, ua, xa) {
    BaseBoxParser.call(this, ma, ra, ya, ua, xa);
}

SbgpBox.isBoxComplete = false;
SbgpBox.prototype = Object.create(BaseBoxParser.prototype);
SbgpBox.prototype.constructor = SbgpBox;

/**
 * Parse sbgp: reads grouping_type, entry_count, and run-length encoded group assignments.
 * Expands run-length encoding into per-sample group array.
 * @returns {boolean} true on success
 */
SbgpBox.prototype.videoSampleEntry = function () {
    this.oi();
    this.bitReader.gC(); // grouping_type (4 bytes)

    if (1 === this.version) {
        this.bitReader.dc(); // grouping_type_parameter
    }

    this.length = this.bitReader.dc(); // entry_count
    this.internal_Gga = []; // expanded per-sample group assignments

    for (let i = 0; i < this.length; ++i) {
        const sampleCount = this.bitReader.dc();
        const groupDescriptionIndex = this.bitReader.dc();
        for (let j = 0; j < sampleCount; ++j) {
            this.internal_Gga.push(groupDescriptionIndex);
        }
    }

    return true;
};

/**
 * Adjust sbgp box for fragment trimming. Re-encodes the run-length groups
 * after slicing the per-sample array.
 * @param {number} ma - Trim count or keep count
 * @param {boolean} ra - Trim from end (true) or start (false)
 * @returns {boolean} true
 */
SbgpBox.prototype.ase_location_history = function (ma, ra) {
    // Slice the per-sample group array
    this.internal_Gga = ra
        ? this.internal_Gga.slice(0, ma)
        : this.internal_Gga.slice(ma);

    // Re-encode as run-length groups
    const groups = this.internal_Gga.reduce(function (acc, group) {
        if (0 !== acc.length && acc[acc.length - 1].group === group) {
            // Extend current run
        } else {
            acc.push({ group: group, length: 0 });
        }
        ++acc[acc.length - 1].length;
        return acc;
    }, []);

    // Rewrite the box data
    this.readFloat64.offset = this.startOffset + 16 + (1 === this.version ? 4 : 0);
    this.readFloat64.fo(groups.length); // entry_count

    groups.forEach((function (entry) {
        this.readFloat64.fo(entry.length);
        this.readFloat64.fo(entry.group);
    }).bind(this));

    // Zero out remaining space if the new encoding is shorter
    if (this.length > groups.length) {
        this.parseBoxContent(8 * (this.length - groups.length));
    }

    this.length = groups.length;
    return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// createVideoSampleEntryBox - Factory for video codec sample entry boxes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Factory function to create a video sample entry box parser for a given codec type.
 * Used for boxes like 'smdm' (SMPTE ST 2086 mastering display metadata)
 * and 'coll' (content light level info).
 * @param {string} codecType - Four-character box type code
 * @returns {Function} Box parser constructor
 */
function createVideoSampleEntryBox(codecType) {
    function VideoSampleEntryBox(ma, ra, ya, ua, xa) {
        BaseBoxParser.call(this, ma, ra, ya, ua, xa);
        this.EKc = codecType;
    }

    VideoSampleEntryBox.isBoxComplete = false;
    VideoSampleEntryBox.prototype = new BaseBoxParser();
    VideoSampleEntryBox.prototype.constructor = VideoSampleEntryBox;

    Object.defineProperties(VideoSampleEntryBox.prototype, {
        rbb: {
            get: function () { return this.EKc; }
        }
    });

    /**
     * Parse the video sample entry: resets offset and writes the codec type.
     * @returns {boolean} true on success
     */
    VideoSampleEntryBox.prototype.videoSampleEntry = function () {
        this.bitReader.offset = this.startOffset + 4;
        this.readFloat64.a9a(this.rbb);
        this.type = this.rbb;
        return true;
    };

    return VideoSampleEntryBox;
}

// ─────────────────────────────────────────────────────────────────────────────
// Box Parser Registry - Maps four-character box type codes to parser classes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The box parser registry object.
 * Organized into sub-registries:
 * - `Se`: Standard box parsers (moov, trak, mdia, moof, traf, etc.)
 * - `L1c`: Video codec configuration parsers (vpcC, SmDm, CoLL)
 * - `KVb`: Scheme-related parsers
 * - `O4a`: Additional/extension parsers
 */
const boxParserRegistry = {
    Se: {
        moov: MoovBox,
        trak: ContainerBox,
        mdia: ContainerBox,
        mdhd: MdhdBox,
        minf: ContainerBox,
        encv: DefaultEncvBox,
        schi: ContainerBox,
        sidx: SidxBox,
        sinf: ContainerBox,
        senc: SencBox,
        stbl: ContainerBox,
        tenc: TencBox,
        mvex: ContainerBox,
        moof: MoofBox,
        traf: TrafBox,
        tfhd: TfhdBox,
        trun: TrunBox,
        sbgp: SbgpBox,
        sdtp: SdtpBox,
        saiz: SaizBox,
        saio: SaioBox,
        tfdt: TfdtBox,
        mdat: MdatBox,
        vmaf: VmafBox,
        edts: ContainerBox
    },
    L1c: {
        vpcC: VpcCBox,
        SmDm: createVideoSampleEntryBox('smdm'),
        CoLL: createVideoSampleEntryBox('coll')
    },
    KVb: {
        schm: SchmBox
    },
    O4a: {}
};

// Register pre-defined box parsers from imported modules into the standard registry
registerBoxParsers(
    [BoxR, BoxP, BoxO, BoxA2, BoxPa, BoxI, BoxHa, BoxN, BoxZ, BoxFa, BoxLa, BoxV, BoxKa, BoxH, BoxK, BoxNa, BoxOa, BoxL, BoxQ, BoxJ, BoxM, BoxW, TrunBox],
    boxParserRegistry.Se
);

// Register extension parsers
registerBoxParsers(
    [BoxS, BoxU, BoxDa, BoxBa, BoxAa, BoxCa, BoxT, BoxX, BoxQa, BoxSa, BoxVa],
    boxParserRegistry.O4a
);

// Register scheme-related parsers
registerBoxParsers(
    [BoxR, SchmBox],
    boxParserRegistry.KVb
);

// Register Netflix-specific box types using constant identifiers
boxParserRegistry.Se[BoxTypeConstants.nib] = TencBox;
boxParserRegistry.Se[BoxTypeConstants.ala] = CustomKeyedBox;
boxParserRegistry.Se[BoxTypeConstants.$ka] = AdditionalSapBox;
boxParserRegistry.Se[BoxTypeConstants.mib] = SencExtBox;
boxParserRegistry.O4a[BoxTypeConstants.QHa] = BoxWa;

/** @type {Function} Reference to the BaseBoxParser constructor */
boxParserRegistry.debugEnabled = BaseBoxParser;

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export {
    boxParserRegistry as o2,
    ContainerBox,
    MoovBox,
    MdhdBox,
    SidxBox,
    VmafBox,
    TencBox,
    CustomKeyedBox,
    AdditionalSapBox,
    MoofBox,
    TrafBox,
    VpcCBox,
    TfhdBox,
    TfdtBox,
    SaizBox,
    SaioBox,
    SencBox,
    SencExtBox,
    SdtpBox,
    SbgpBox,
    bufferToHexString,
    registerBoxParsers,
    createVideoSampleEntryBox,
    BaseBoxParser
};
