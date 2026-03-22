/**
 * Netflix Cadmium Player -- AudioQualityScorer
 *
 * Singleton that maps audio bitrate (kbps) to a perceptual quality score
 * (MOS-like, roughly 1-5 scale) using piecewise linear interpolation.
 *
 * Four codec families have separate quality curves:
 *   - xHE-AAC  (Codec string contains "xheaac")
 *   - HE-AAC   (Codec string contains "heaac")
 *   - DD+ 2ch  (Codec string contains "ddplus-2")
 *   - DD+ 5.1  (All other codecs, typically ddplus-atmos or ddplus-5.1)
 *
 * @module media/AudioQualityScorer
 * @original Module_92140
 */

/**
 * Audio quality scorer using piecewise linear interpolation
 * over measured subjective quality data points.
 */
class AudioQualityScorer {
    constructor() {
        /**
         * HE-AAC quality curve (bitrate kbps -> MOS score)
         * @private
         */
        this._heAacCurve = this._buildInterpolator([
            { x: 32, y: 3.3 },
            { x: 48, y: 3.65 },
            { x: 64, y: 4.24 },
            { x: 80, y: 4.56 },
            { x: 96, y: 4.67 },
        ]);

        /**
         * xHE-AAC quality curve (bitrate kbps -> MOS score)
         * @private
         */
        this._xheAacCurve = this._buildInterpolator([
            { x: 16, y: 2.0 },
            { x: 32, y: 3.2 },
            { x: 48, y: 3.6 },
            { x: 64, y: 3.8 },
            { x: 80, y: 4.3 },
            { x: 96, y: 4.5 },
            { x: 112, y: 4.6 },
            { x: 128, y: 4.7 },
            { x: 144, y: 4.8 },
        ]);

        /**
         * DD+ stereo quality curve (bitrate kbps -> MOS score)
         * @private
         */
        this._ddPlusStereo = this._buildInterpolator([
            { x: 48, y: 2.73 },
            { x: 64, y: 3.15 },
            { x: 80, y: 3.39 },
            { x: 96, y: 3.59 },
            { x: 128, y: 4.55 },
            { x: 192, y: 4.8 },
        ]);

        /**
         * DD+ 5.1 / Atmos quality curve (bitrate kbps -> MOS score)
         * @private
         */
        this._ddPlusSurround = this._buildInterpolator([
            { x: 192, y: 2.9 },
            { x: 256, y: 3.4 },
            { x: 320, y: 3.8 },
            { x: 384, y: 4.3 },
            { x: 448, y: 4.6 },
            { x: 512, y: 4.75 },
            { x: 576, y: 4.76 },
            { x: 640, y: 4.9 },
            { x: 768, y: 4.9 },
        ]);
    }

    /**
     * Get or create the singleton instance.
     * @returns {AudioQualityScorer}
     */
    static instance() {
        if (!AudioQualityScorer._singleton) {
            AudioQualityScorer._singleton = new AudioQualityScorer();
        }
        return AudioQualityScorer._singleton;
    }

    /**
     * Build a piecewise linear interpolation function from data points.
     * Extrapolates linearly beyond the first/last data points.
     *
     * @param {Array<{x: number, y: number}>} points - Sorted (x, y) data points
     * @returns {Function} Interpolation function: (bitrate) => quality score
     * @private
     */
    _buildInterpolator(points) {
        points.sort((a, b) => a.x - b.x);

        return function interpolate(bitrate) {
            // Extrapolate below first point
            if (bitrate < points[0].x) {
                const slope = (points[1].y - points[0].y) / (points[1].x - points[0].x);
                const intercept = points[0].y - slope * points[0].x;
                return slope * bitrate + intercept;
            }

            // Extrapolate above last point
            if (bitrate > points[points.length - 1].x) {
                const last = points.length - 1;
                const slope = (points[last].y - points[last - 1].y) / (points[last].x - points[last - 1].x);
                const intercept = points[last].y - slope * points[last].x;
                return slope * bitrate + intercept;
            }

            // Interpolate between points
            for (let i = 0; i < points.length - 1; i++) {
                if (bitrate >= points[i].x && bitrate <= points[i + 1].x) {
                    const slope = (points[i + 1].y - points[i].y) / (points[i + 1].x - points[i].x);
                    const intercept = points[i].y - slope * points[i].x;
                    return slope * bitrate + intercept;
                }
            }
        };
    }

    /**
     * Compute the audio quality score for a given bitrate and codec.
     *
     * @param {number} bitrateKbps - Audio bitrate in kbps
     * @param {string} codecString - Audio codec identifier (e.g. "mp4a.40.29", "heaac-2-dash", "xheaac", "ddplus-2")
     * @returns {number} Quality score (~1-5 MOS scale)
     */
    audioQualityScore(bitrateKbps, codecString) {
        if (codecString.indexOf("xheaac") !== -1) {
            return this._xheAacCurve(bitrateKbps);
        }
        if (codecString.indexOf("heaac") !== -1) {
            return this._heAacCurve(bitrateKbps);
        }
        if (codecString.indexOf("ddplus-2") !== -1) {
            return this._ddPlusStereo(bitrateKbps);
        }
        return this._ddPlusSurround(bitrateKbps);
    }
}

/** @type {AudioQualityScorer|null} */
AudioQualityScorer._singleton = null;

export { AudioQualityScorer };
