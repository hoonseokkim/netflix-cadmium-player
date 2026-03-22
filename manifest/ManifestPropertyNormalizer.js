/**
 * Manifest Property Name Normalizer
 *
 * Normalizes manifest property names between camelCase and snake_case formats.
 * Netflix manifests may use either naming convention depending on the source;
 * this module creates proxy getters so either name resolves to the same value.
 *
 * For example, "audioTracks" and "audio_tracks" are aliased to each other,
 * "videoTracks" and "video_tracks", "cdnList" and "cdnlist", etc.
 *
 * @module ManifestPropertyNormalizer
 * @source Module_80635
 */
export default function ManifestPropertyNormalizer(module, exports, require) {
    var ArrayUtils;

    Object.defineProperties(exports, {
        __esModule: {
            value: true
        }
    });
    exports.XIb = exports.comparatorFn = void 0;

    ArrayUtils = require(27192);

    /**
     * Creates a property alias function. When a property matching one of
     * the aliasNames is set, it defines getters on the other names as well.
     *
     * @param {string[]} aliasNames - Array of property name aliases (e.g., ["audioTracks", "audio_tracks"])
     * @returns {Function} A setter-interceptor that creates aliased properties
     */
    exports.comparatorFn = function createPropertyAlias(aliasNames) {
        return function (propertyName, value) {
            var self = this;

            // Check if the property being set is one of the alias names
            (0, ArrayUtils.findLast)(aliasNames, function (name) {
                return propertyName === name;
            }) && aliasNames.forEach(function (aliasName) {
                // Define missing alias properties as getters pointing to the value
                if (!(aliasName in self)) {
                    self[aliasName] = value;
                }
            });

            return value;
        };
    };

    /**
     * All known property name aliases between camelCase and snake_case manifest formats.
     */
    var propertyAliases = [
        (0, exports.comparatorFn)(["audioTracks", "audio_tracks"]),
        (0, exports.comparatorFn)(["textTracks", "timedtexttracks"]),
        (0, exports.comparatorFn)(["timedtexttracks", "textTracks"]),
        (0, exports.comparatorFn)(["videoTracks", "video_tracks"]),
        (0, exports.comparatorFn)(["maxFramerateValue", "max_framerate_value"]),
        (0, exports.comparatorFn)(["maxFramerateScale", "max_framerate_scale"]),
        (0, exports.comparatorFn)(["cdnList", "cdnlist"]),
        (0, exports.comparatorFn)(["downloadables", "ttDownloadables"]),
        (0, exports.comparatorFn)(["textTrackId", "timedTextTrackId"]),
        (0, exports.comparatorFn)(["downloadableId", "downloadable_id"]),
        (0, exports.comparatorFn)(["contentProfile", "content_profile"]),
        (0, exports.comparatorFn)(["cdnId", "cdn_id"]),
        (0, exports.comparatorFn)(["pixW", "pix_w"]),
        (0, exports.comparatorFn)(["pixH", "pix_h"]),
        (0, exports.comparatorFn)(["resW", "res_w"]),
        (0, exports.comparatorFn)(["resH", "res_h"]),
        (0, exports.comparatorFn)(["cropX", "crop_x"]),
        (0, exports.comparatorFn)(["cropY", "crop_y"]),
        (0, exports.comparatorFn)(["cropW", "crop_w"]),
        (0, exports.comparatorFn)(["cropH", "crop_h"]),
        (0, exports.comparatorFn)(["framerateValue", "framerate_value"]),
        (0, exports.comparatorFn)(["framerateScale", "framerate_scale"]),
        (0, exports.comparatorFn)(["newStreamId", "new_stream_id"]),
        (0, exports.comparatorFn)(["id", "new_track_id"]),
        (0, exports.comparatorFn)(["id", "track_id"])
    ];

    /**
     * Applies all property name normalizations to an object.
     * Chains through each alias function, building up equivalent property names.
     *
     * @param {string} propertyName - The property name being set
     * @param {*} value - The value being assigned
     * @returns {*} The final value after all alias processing
     */
    exports.XIb = function normalizePropertyName(propertyName, value) {
        return propertyAliases.reduce((function (currentValue, aliasFn) {
            return aliasFn.call(this, propertyName, currentValue);
        }).bind(this), value);
    };
}
