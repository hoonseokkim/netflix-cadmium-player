/**
 * Media Segment Template Factory
 *
 * Generates blank/black video frames and silence audio segments for use
 * as placeholder content. These are used during ad transitions, gap filling,
 * or when real content is not yet available. Supports different codecs,
 * aspect ratios, frame rates, and track IDs.
 *
 * Templates include pre-encoded MP4 init segments and media segments
 * that can be decoded from base64 or decompressed from compressed data.
 *
 * @module MediaSegmentTemplateFactory
 * @source Module_38454
 */
export default function MediaSegmentTemplateFactory(module, exports, require) {
    var tslib, TimeUtil, TemplateDataModule, CodecConstants, FrameRateConstants, AssertModule, DecompressModule;

    /**
     * Normalizes a codec string to a known base codec.
     * If the input is already a known codec, returns it directly.
     * Otherwise finds which known codec is a substring of the input.
     *
     * @param {string} codecString - Full or partial codec string
     * @returns {string} Normalized base codec string
     */
    function normalizeCodec(codecString) {
        if (-1 !== CodecConstants.NJ.indexOf(codecString))
            return codecString;

        var baseCodec;
        for (var i = 0; i < CodecConstants.NJ.length; ++i) {
            if (-1 !== codecString.indexOf(CodecConstants.NJ[i])) {
                baseCodec = CodecConstants.NJ[i];
                break;
            }
        }

        (0, AssertModule.assert)(baseCodec);
        return baseCodec;
    }

    Object.defineProperties(exports, {
        __esModule: {
            value: true
        }
    });
    exports.internal_Tlb = void 0;

    tslib = require(22970);
    TimeUtil = require(91176);
    TemplateDataModule = require(43051);
    CodecConstants = require(68954);
    FrameRateConstants = require(85017);
    AssertModule = require(89707);
    DecompressModule = require(67769);

    var MediaSegmentTemplateFactoryClass = (function () {
        /**
         * @param {Function} atobFn - Base64 decode function (atob)
         * @param {Object} console - Console/logger reference
         */
        function MediaSegmentTemplateFactoryClass(atobFn, console) {
            this.atob = atobFn;
            this.console = console;
            this.maxCachedTemplates = 1;
            this.videoTemplateCache = [];
            this.audioTemplateCache = [];
        }

        /**
         * Gets or creates a black video frame template for the given parameters.
         *
         * @param {string} type - Template type identifier
         * @param {string} codecString - Video codec string
         * @param {number} frameRate - Target frame rate
         * @param {Object} aspectRatio - Aspect ratio {w, zy} (e.g., {w:16, zy:9})
         * @param {number} trackId - Track ID (default: 1)
         * @returns {Object} Video template with init segment and media data
         */
        MediaSegmentTemplateFactoryClass.prototype.internal_Azc = function getVideoTemplate(type, codecString, frameRate, aspectRatio, trackId) {
            var frameRateKey, cached;

            if (aspectRatio === undefined) aspectRatio = { w: 16, zy: 9 };
            if (trackId === undefined) trackId = 1;

            codecString = normalizeCodec(codecString);
            frameRateKey = (0, TimeUtil.findLast)(FrameRateConstants.QO[codecString], function (fr) {
                return (0, FrameRateConstants.DUa)(frameRate, FrameRateConstants.zba[fr]);
            });
            (0, AssertModule.assert)(frameRateKey);
            (0, AssertModule.assert)(16 === aspectRatio.w && 9 === aspectRatio.zy || 4 === aspectRatio.w && 3 === aspectRatio.zy);

            var aspectRatioStr = (16 === aspectRatio.w) ? "16:9" : "4:3";

            // Check cache for existing template
            for (var i = 0; i < this.videoTemplateCache.length; i++) {
                cached = this.videoTemplateCache[i];
                if (cached.type === type && cached.zD === aspectRatioStr &&
                    cached.codecString === codecString && cached.frameRate === frameRateKey &&
                    cached.trackId === trackId) {
                    return cached;
                }
            }

            // Create new template and cache it
            var template = this.createVideoTemplate(type, aspectRatioStr, codecString, frameRateKey, trackId);
            this.videoTemplateCache.unshift(template);
            if (this.videoTemplateCache.length > this.maxCachedTemplates) {
                this.videoTemplateCache.splice(this.maxCachedTemplates, this.videoTemplateCache.length - this.maxCachedTemplates);
            }
            return template;
        };

        /**
         * Gets or creates a silence audio template for the given parameters.
         *
         * @param {string} codecString - Audio codec string
         * @param {number} bitrate - Audio bitrate
         * @param {number} trackId - Track ID (default: 1)
         * @returns {Object} Audio silence template with init segment and media data
         */
        MediaSegmentTemplateFactoryClass.prototype.yzc = function getSilenceTemplate(codecString, bitrate, trackId) {
            var cached;

            if (trackId === undefined) trackId = 1;

            for (var i = 0; i < this.audioTemplateCache.length; i++) {
                cached = this.audioTemplateCache[i];
                if ("silence" === cached.type && cached.codecString === codecString &&
                    cached.bitrate === bitrate && cached.trackId === trackId) {
                    return cached;
                }
            }

            // Create new silence template
            var template = this.createSilenceTemplate(codecString, bitrate, trackId);
            this.audioTemplateCache.unshift(template);
            if (this.audioTemplateCache.length > this.maxCachedTemplates) {
                this.audioTemplateCache.splice(this.maxCachedTemplates, this.audioTemplateCache.length - this.maxCachedTemplates);
            }
            return template;
        };

        /**
         * Returns a minimal empty TTML document as an ArrayBuffer.
         * Used as a placeholder for timed text tracks.
         *
         * @returns {ArrayBuffer} Buffer containing '<tt xmlns="http://www.w3.org/ns/ttml" />'
         */
        MediaSegmentTemplateFactoryClass.prototype.zzc = function getEmptyTtmlTemplate() {
            if (MediaSegmentTemplateFactoryClass.emptyTtmlBuffer === undefined) {
                MediaSegmentTemplateFactoryClass.emptyTtmlBuffer = new Uint8Array(
                    Array.from({ length: 40 }, function (_, index) {
                        return ('<tt xmlns="http://www.w3.org/ns/ttml" />').charCodeAt(index);
                    })
                ).buffer;
            }
            return MediaSegmentTemplateFactoryClass.emptyTtmlBuffer;
        };

        /**
         * Creates a new video template from the template data tables.
         * @private
         */
        MediaSegmentTemplateFactoryClass.prototype.createVideoTemplate = function (type, aspectRatio, codec, frameRate, trackId) {
            var templateData = TemplateDataModule.yXb[type][aspectRatio][codec][frameRate];
            (0, AssertModule.assert)(templateData);

            var parsed = (0, TemplateDataModule.r2c)(templateData().X);
            return tslib.__assign(tslib.__assign({}, this.decodeTemplate(parsed, trackId)), {
                type: type,
                zD: aspectRatio,
                codecString: codec,
                frameRate: frameRate,
                width: parsed.width,
                height: parsed.height,
                V1a: parsed.V1a,
                W1a: parsed.W1a
            });
        };

        /**
         * Creates a new silence audio template from the template data tables.
         * @private
         */
        MediaSegmentTemplateFactoryClass.prototype.createSilenceTemplate = function (codec, bitrate, trackId) {
            var templateData = TemplateDataModule.msb.silence[codec][bitrate];
            (0, AssertModule.assert)(templateData);

            var parsed = (0, TemplateDataModule.q2c)(templateData().X);
            return tslib.__assign(tslib.__assign({}, this.decodeTemplate(parsed, trackId)), {
                type: "silence",
                codecString: codec,
                bitrate: bitrate,
                channels: parsed.channels
            });
        };

        /**
         * Decodes template data (init segment + media segment) and patches
         * the track ID into the MP4 boxes if needed.
         * @private
         */
        MediaSegmentTemplateFactoryClass.prototype.decodeTemplate = function (templateData, trackId) {
            var initSegment = templateData.data.encryptionSession
                ? this.decompressData(templateData.data)
                : this.atob(templateData.data.data);
            var mediaSegment = templateData.data.encryptionSession
                ? this.decompressData(templateData.data)
                : this.atob(templateData.data.data);

            if (trackId !== 1) {
                var initView = new DataView(initSegment);
                var mediaView = new DataView(mediaSegment);

                // Patch track ID at known offsets in the MP4 boxes
                templateData.data.mediaKeySystemFactory.forEach(function (offset) {
                    return initView.setUint32(offset, trackId);
                });
                templateData.data.mediaKeySystemFactory.forEach(function (offset) {
                    return mediaView.setUint32(offset, trackId);
                });
            }

            return tslib.__assign(tslib.__assign({}, templateData), {
                Gb: initSegment,
                data: mediaSegment,
                trackId: trackId
            });
        };

        /**
         * Decompresses segment data that is stored in compressed form.
         * Handles both simple compressed data and data with a media attribute
         * (dictionary-based decompression).
         * @private
         */
        MediaSegmentTemplateFactoryClass.prototype.decompressData = function (dataObj) {
            var result;

            if (dataObj.encryptionSession) {
                if (dataObj.mediaAttribute === undefined) {
                    result = (0, DecompressModule.EIb)(dataObj.data);
                } else {
                    var dictionary = this.decompressData(dataObj.mediaAttribute);
                    result = (0, DecompressModule.EIb)(dataObj.data, new Uint8Array(dictionary));
                }
            } else {
                result = new Uint8Array(this.atob(dataObj.data));
            }

            return result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
        };

        return MediaSegmentTemplateFactoryClass;
    })();

    exports.internal_Tlb = MediaSegmentTemplateFactoryClass;
}
