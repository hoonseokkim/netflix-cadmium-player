/**
 * Netflix Cadmium Player — DefaultEventsModel
 *
 * Stub/default implementation of the events model interface.
 * All capability checks return true by default, while
 * `isEventsModelComplete` returns false (indicating incomplete).
 *
 * Used as a fallback when no specialized events model is configured.
 *
 * @module events/DefaultEventsModel
 * @original Module_40385
 */

export class DefaultEventsModel {
    /**
     * Whether the model supports event tracking.
     * @returns {boolean} Always true
     */
    supportsTracking() {
        return true;
    }

    /**
     * Whether the events model has been fully initialized.
     * @returns {boolean} Always false (this is a stub)
     */
    isEventsModelComplete() {
        return false;
    }

    /**
     * Whether the model can accept new events.
     * @returns {boolean} Always true
     */
    canAcceptEvents() {
        return true;
    }

    /**
     * Whether the model is ready for flushing.
     * @returns {boolean} Always true
     */
    isReadyToFlush() {
        return true;
    }
}
