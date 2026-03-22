/**
 * Netflix Cadmium Player - MediaSourceEvents
 *
 * Enumeration of events emitted by the MediaSource / SourceBuffer layer.
 * Used throughout the player to coordinate reactions to MSE state changes,
 * seek completions, DRM license arrivals, and key negotiations.
 *
 * Originally: Module 16520 (export: MediaSourceEvents)
 */

/**
 * Events raised by the MediaSource subsystem.
 *
 * @readonly
 * @enum {number}
 */
export const MediaSourceEvents = Object.freeze({
    /** The MediaSource has opened and is ready to receive source buffers. */
    sourceopen: 1,

    /** The HTMLMediaElement's currentTime has changed (timeupdate). */
    currentTimeChanged: 2,

    /** A seek operation has completed. */
    seeked: 3,

    /** A DRM license has been successfully added to the session. */
    licenseadded: 5,

    /** A new SourceBuffer has been added to the MediaSource. */
    sourceBufferAdded: 6,

    /** An encrypted media "needkey" / "encrypted" event was fired. */
    onNeedKey: 7,

    /** The MediaSource readyState property has changed. */
    readyStateChanged: 8,
});
