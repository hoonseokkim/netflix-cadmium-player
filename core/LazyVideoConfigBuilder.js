/**
 * Lazy Video Config Builder
 *
 * Creates a video configuration using the VideoConfigBuilder with lazy loading
 * strategy, starting at time 0 with infinite content end.
 *
 * @module LazyVideoConfigBuilder
 * @source Module_14999
 */
export default function LazyVideoConfigBuilder(module, exports, require) {
    var VideoConfigModule;

    Object.defineProperties(exports, {
        __esModule: {
            value: true
        }
    });

    /**
     * Builds a lazy-loaded video configuration for a given fragment.
     *
     * @param {Object} fragmentJ - The fragment identifier (J property)
     * @param {Object} fragmentConfig - The fragment configuration to attach
     * @param {Object} additionalConfig - Additional build configuration (B5a param)
     * @returns {Object} Built video configuration
     */
    exports.k6a = function buildLazyVideoConfig(fragmentJ, fragmentConfig, additionalConfig) {
        var builder;
        builder = new VideoConfigModule.videoConfigBuilder();
        builder.BF(fragmentConfig)
            .eAa("lazy")
            .B5a(additionalConfig)
            .configureFragment(fragmentConfig, {
                J: fragmentJ,
                startTimeMs: 0,
                contentEndPts: Infinity
            });
        return builder.build();
    };

    VideoConfigModule = require(48456);
}
