/**
 * @module MediaRequestCompleteNotifier
 * @description Factory function that creates a download wrapper which fires a
 * MEDIA_REQUEST_COMPLETE player event upon download completion. Wraps an
 * existing HTTP response type to add event notification on top of the
 * standard download flow.
 * @original Module_24427
 */

// import { PlayerEvents } from '../player/PlayerEvents'; // Module 85001
// import { responseType } from '../network/ResponseType';   // Module 61726

/**
 * Creates a media download wrapper that notifies the player when a request completes.
 *
 * @param {Object} playerContext - The current player context
 * @param {Function} playerContext.fireEvent - Function to fire player events
 * @param {Object} playerContext.aseGcSettings - ASE GC settings with R property
 * @returns {Object} A download interface with a `download` method
 */
export function createMediaRequestCompleteNotifier(playerContext) {
    /**
     * Callback fired when a download completes, dispatching MEDIA_REQUEST_COMPLETE.
     * @param {Object} response - The completed download response
     */
    function onComplete(response) {
        playerContext.fireEvent(/* PlayerEvents.MEDIA_REQUEST_COMPLETE */'MEDIA_REQUEST_COMPLETE', {
            response,
            R: playerContext.aseGcSettings.R
        });
    }

    return {
        /**
         * Initiates a download, attaching the completion notifier callback.
         *
         * @param {Object} request - The request descriptor
         * @param {Object} options - Download options
         * @returns {Object} The download handle
         */
        download(request, options) {
            request.playerState = playerContext;
            const handle = /* responseType.download */ (request, options);
            handle.onCompleteCallback(onComplete);
            return handle;
        }
    };
}

export default createMediaRequestCompleteNotifier;
