/**
 * Manifest Validation Error
 *
 * Validates a parsed manifest for required fields: CDN list, default audio
 * track, default video track, and default subtitle track. Collects any
 * missing-field errors into a JSON-serialized config flag for diagnostics.
 *
 * @module ManifestValidationError
 * @source Module_44236
 */
export default function ManifestValidationError(module, exports, require) {
    /**
     * @param {Object} parsedManifest - The parsed manifest to validate
     */
    function ManifestValidationErrorClass(parsedManifest) {
        this.parsedManifest = parsedManifest;
        this.configFlag = JSON.stringify(this.collectErrors());
    }

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.internal_Agb = void 0;

    /**
     * Checks the manifest for missing required fields and returns
     * an array of error descriptors.
     *
     * @returns {Array<Object>} Array of error objects, each with an "error" message
     *   and optionally "foundTracks" listing available track IDs
     */
    ManifestValidationErrorClass.prototype.collectErrors = function () {
        var errors = [];

        // Check for CDN list
        if (!this.parsedManifest.di || this.parsedManifest.di.length <= 0) {
            errors.push({
                error: "No CDN."
            });
        }

        // Check for default audio track
        if (!this.parsedManifest.naa) {
            errors.push({
                error: "No default audio track.",
                foundTracks: this.getTrackIds(this.parsedManifest.supportedKeySystemList)
            });
        }

        // Check for default video track
        if (!this.parsedManifest.defaultTrack) {
            errors.push({
                error: "No default video track.",
                foundTracks: this.getTrackIds(this.parsedManifest.encryptedContentMetadata)
            });
        }

        // Check for default subtitle track
        if (!this.parsedManifest.paa) {
            errors.push({
                error: "No default subtitle track.",
                foundTracks: this.getTrackIds(this.parsedManifest.sk)
            });
        }

        return errors;
    };

    /**
     * Extracts track IDs from a track array.
     *
     * @param {Array} tracks - Array of track objects with trackId property
     * @returns {Array<string>|string} Track IDs or "No tracks found."
     */
    ManifestValidationErrorClass.prototype.getTrackIds = function (tracks) {
        if (tracks && tracks.length > 0) {
            return tracks.map(function (track) {
                return track.trackId;
            });
        }
        return "No tracks found.";
    };

    exports.internal_Agb = ManifestValidationErrorClass;
}
