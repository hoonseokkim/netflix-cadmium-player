/**
 * @file MicrosoftScreenSizeFilter.js
 * @description Resolution filter for Microsoft (Edge/IE) platforms that restricts UHD
 *   streaming when the display doesn't support 4K via MSMediaKeys capability checks.
 * @module drm/MicrosoftScreenSizeFilter
 * @original Module_45706 (w9c)
 */

import { registerStreamFilter } from '../streaming/StreamFilterRegistry.js'; // Module 59032
import { config } from '../config/PlayerConfig.js'; // Module 29204
import { fetchOperation } from '../utils/LoggerFactory.js'; // Module 31276

/**
 * Creates a Microsoft Screen Size filter that restricts resolution to 1080p
 * when the display does not support UHD output, as detected via MSMediaKeys.
 *
 * @param {Object} logContext - Logging context
 * @param {Object} restrictions - Resolution restriction state holder
 * @param {Object} restrictions.fw - Resolution restriction tracker
 * @returns {Object|undefined} Filter object with filter identifier and predicate, or undefined if disabled
 */
export function createMicrosoftScreenSizeFilter(logContext, restrictions) {
    const log = fetchOperation(logContext, 'MSS');

    if (!config.microsoftScreenSizeFilterEnabled) {
        return undefined;
    }

    /** @type {boolean|undefined} Cached result of UHD display detection */
    let hasUltraHdDisplay;

    return {
        /** @type {string} Filter identifier */
        xra: 'mss',

        /**
         * Filter predicate that removes streams above 1080p when the display
         * cannot handle UHD content.
         *
         * The check uses MSMediaKeys.isTypeSupportedWithFeatures to probe for
         * 3840x2160 display support. The result is cached after the first call.
         *
         * @param {Object} stream - Stream to evaluate
         * @param {number} stream.height - Stream height in pixels
         * @param {Object} [stream.lower] - Next lower quality stream in the ladder
         * @returns {boolean|undefined} true to filter out the stream, false to keep, undefined if not applicable
         */
        nJ(stream) {
            // Only check streams that are 2160p or above and have a lower alternative
            let needsCheck;
            if (stream.lower && stream.height >= 2160) {
                let current = stream;
                needsCheck = false;
                while (current.lower) {
                    if (current.height < 2160 && current.height > 1080) {
                        needsCheck = true;
                        break;
                    }
                    if (current.height <= 1080) {
                        break;
                    }
                    current = current.lower;
                }
            }

            if (!needsCheck) {
                return undefined;
            }

            if (hasUltraHdDisplay === undefined) {
                try {
                    const msMediaKeys = window.MSMediaKeys;
                    hasUltraHdDisplay = msMediaKeys && msMediaKeys.isTypeSupportedWithFeatures
                        ? msMediaKeys.isTypeSupportedWithFeatures(
                            'com.microsoft.playready.software',
                            'video/mp4;codecs="avc1,mp4a";features="display-res-x=3840,display-res-y=2160,display-bpc=8"'
                        ) === 'probably'
                        : false;
                } catch (_error) {
                    log.error('hasUltraHdDisplay exception');
                    hasUltraHdDisplay = true;
                }

                if (!hasUltraHdDisplay) {
                    log.RETRY('Restricting resolution due screen size', {
                        MaxHeight: stream.height
                    });
                    restrictions.fw.set({
                        reason: 'microsoftScreenSize',
                        height: stream.height
                    });
                }
            }

            return !hasUltraHdDisplay;
        }
    };
}

// Self-register the filter
registerStreamFilter(createMicrosoftScreenSizeFilter);

export default createMicrosoftScreenSizeFilter;
