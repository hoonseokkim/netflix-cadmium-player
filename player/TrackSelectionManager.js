/**
 * Track Selection Manager
 *
 * Manages audio, video, and text track selection state for the player.
 * Notifies registered listeners when track selections change, and provides
 * track configuration for different API versions.
 *
 * @module TrackSelectionManager
 * @original Module_73403
 */

// import { MediaType } from './MediaType';
// import { assert, assertFunction } from './Assert';
// import { TrackType } from './TrackType';

/**
 * Manages track selection for audio, video, and text tracks.
 * Maintains current selections and dispatches change notifications
 * to registered listeners filtered by media type.
 */
export class TrackSelectionManager {
    constructor() {
        /** @type {Array<{mediaTypesForBranching: string[], listener: Function}>} */
        this.subscriberList = [];
        /** @type {Object|null} */
        this.audioTrackSelection = null;
        /** @type {Object|null} */
        this.videoTrack = null;
        /** @type {Object|null} */
        this.textTrackSelection = null;
    }

    /**
     * Sets the text track selection and notifies listeners.
     * @param {Object} textTrack - The new text track
     */
    setTextTrack(textTrack) {
        if (textTrack !== this.textTrackSelection) {
            const previousTextTrack = this.textTrackSelection;
            this.textTrackSelection = textTrack;
            this._notifyListeners({
                textTrackChanged: true,
                previousTextTrack,
                forceSetTrack: false,
            });
        }
    }

    /**
     * Sets the audio track selection and notifies listeners.
     * @param {Object} audioTrack - The new audio track
     * @param {Object} [options] - Options including forceSetTrack
     */
    setAudioTrack(audioTrack, options) {
        if (audioTrack !== this.audioTrackSelection) {
            const previousAudioTrack = this.audioTrackSelection;
            this.audioTrackSelection = audioTrack;
            this._notifyListeners({
                previousAudioTrack,
                audioTrackChanged: true,
                forceSetTrack: options?.forceSetTrack ?? false,
            });
        }
    }

    /**
     * Sets the video track selection and notifies listeners.
     * @param {Object} videoTrack - The new video track
     */
    setVideoTrack(videoTrack) {
        if (videoTrack !== this.videoTrack) {
            const previousVideoTrack = this.videoTrack;
            this.videoTrack = videoTrack;
            this._notifyListeners({
                previousVideoTrack,
                videoTrackChanged: true,
            });
        }
    }

    /**
     * Resumes track selections from a saved state, notifying listeners
     * of any changes.
     * @param {Object} savedState - Object with videoTrack, audioTrackSelection, textTrackSelection
     */
    canResume(savedState) {
        const videoChanged = savedState.videoTrack !== undefined && this.videoTrack !== savedState.videoTrack;
        const audioChanged = savedState.audioTrackSelection !== undefined && this.audioTrackSelection !== savedState.audioTrackSelection;
        const textChanged = savedState.textTrackSelection !== undefined && this.textTrackSelection !== savedState.textTrackSelection;

        if (videoChanged || audioChanged || textChanged) {
            const previousVideo = this.videoTrack;
            if (videoChanged) this.videoTrack = savedState.videoTrack;

            const previousAudio = this.audioTrackSelection;
            if (audioChanged) this.audioTrackSelection = savedState.audioTrackSelection;

            const previousText = this.textTrackSelection;
            if (textChanged) this.textTrackSelection = savedState.textTrackSelection;

            this._notifyListeners({
                previousVideoTrack: previousVideo,
                videoTrackChanged: videoChanged,
                previousAudioTrack: previousAudio,
                audioTrackChanged: audioChanged,
                previousTextTrack: previousText,
                textTrackChanged: textChanged,
            });
        }
    }

    /**
     * Gets the track configuration, choosing between v3 and legacy format.
     * @param {Object} audioTrack - Current audio track
     * @param {Object[]} trackList - Available tracks
     * @param {string} apiVersion - API version string (e.g., "v3")
     * @returns {Object} Track configuration object
     */
    getTrackConfiguration(audioTrack, trackList, apiVersion) {
        if (apiVersion === "v3") {
            return {
                audioTrack: this.audioTrackSelection,
                textTrackSelection: this.textTrackSelection,
                videoTrack: this.videoTrack,
            };
        }
        return this.getAudioConfig(audioTrack, trackList);
    }

    /**
     * Gets the audio configuration with compatible text track validation.
     * @param {Object} audioTrack - Current audio track candidate
     * @param {Object[]} trackList - Available tracks
     * @returns {Object} Configuration with video, audio, and text track
     */
    getAudioConfig(audioTrack, trackList) {
        const resolvedAudio = audioTrack.type === TrackType.AUDIO
            ? audioTrack
            : trackList.find((t) => t.type === TrackType.AUDIO) ?? this.audioTrackSelection;

        let resolvedText = audioTrack.type === TrackType.TEXT
            ? audioTrack
            : trackList.find((t) => t.type === TrackType.TEXT) ?? this.textTrackSelection;

        assert(resolvedAudio && resolvedText && this.videoTrack, "assert tracks are defined for track switching");

        // If text track is not compatible with the audio track, fall back to first subtitle
        if (!this._isTextTrackCompatible(resolvedAudio, resolvedText)) {
            resolvedText = resolvedAudio.subtitleTracks[0];
        }

        return {
            videoTrack: this.videoTrack,
            audioTrackSelection: resolvedAudio,
            textTrackSelection: resolvedText,
        };
    }

    /**
     * Checks if a text track is compatible with an audio track.
     * @param {Object} audioTrack - Audio track with subtitleTracks array
     * @param {Object} textTrack - Text track to check
     * @returns {boolean}
     */
    _isTextTrackCompatible(audioTrack, textTrack) {
        return audioTrack.subtitleTracks.indexOf(textTrack) >= 0;
    }

    /**
     * Adds a listener for track changes filtered by media types.
     * @param {string[]} mediaTypes - Media types to listen for (e.g., MediaType.V, MediaType.U, MediaType.TEXT_MEDIA_TYPE)
     * @param {Function} listener - Callback function
     */
    addListener(mediaTypes, listener) {
        assertFunction(listener);
        assert(this._findListenerIndex(listener) < 0);
        this.subscriberList = this.subscriberList.slice();
        this.subscriberList.push({
            mediaTypesForBranching: mediaTypes,
            listener,
        });
    }

    /**
     * Removes a previously registered listener.
     * @param {Function} listener - The listener to remove
     */
    removeListener(listener) {
        assertFunction(listener);
        this.subscriberList = this.subscriberList.slice();
        const index = this._findListenerIndex(listener);
        if (index >= 0) {
            this.subscriberList.splice(index, 1);
        }
    }

    /**
     * @private
     * @param {Function} listener
     * @returns {number}
     */
    _findListenerIndex(listener) {
        return this.subscriberList.findIndex((entry) => entry.listener === listener);
    }

    /**
     * Dispatches track change notifications to all matching listeners.
     * @private
     * @param {Object} changeInfo - Change details
     */
    _notifyListeners(changeInfo) {
        const merged = Object.assign({
            textTrackChanged: false,
            previousTextTrack: this.textTrackSelection,
            textTrackInfo: this.textTrackSelection,
            audioTrackChanged: false,
            previousAudioTrack: this.audioTrackSelection,
            currentAudioTrack: this.audioTrackSelection,
            videoTrackChanged: false,
            previousVideoTrack: this.videoTrack,
            currentVideoTrack: this.videoTrack,
            forceSetTrack: false,
        }, changeInfo);

        const subscribers = this.subscriberList;
        for (let i = 0; i < subscribers.length; i++) {
            const { mediaTypesForBranching, listener } = subscribers[i];
            const shouldNotify =
                (mediaTypesForBranching.includes(MediaType.V) && merged.audioTrackChanged) ||
                (mediaTypesForBranching.includes(MediaType.U) && merged.videoTrackChanged) ||
                (mediaTypesForBranching.includes(MediaType.TEXT_MEDIA_TYPE) && merged.textTrackChanged);
            if (shouldNotify) {
                listener(merged);
            }
        }
    }
}
