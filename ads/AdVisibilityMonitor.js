/**
 * Ad Visibility Monitor
 *
 * Monitors page visibility during ad playback and pauses the player
 * when the browser tab becomes hidden while an ad is presenting.
 * This prevents ads from playing when the user is not actually watching.
 *
 * Uses the document.visibilitychange event and integrates with the
 * player's pause state and ad presentation state.
 *
 * @module AdVisibilityMonitor
 * @source Module_38508
 */
export default function AdVisibilityMonitor(module, exports, require) {
    var tslib, inversify, LoggerTokenModule;

    function AdVisibilityMonitorClass(logger) {
        var self = this;

        /**
         * Checks visibility state and pauses playback if the page is hidden
         * during an ad presentation.
         */
        this.checkVisibilityAndPause = function () {
            var isVisible, isAdPresenting, isPaused;

            isVisible = !document.hidden;
            isAdPresenting = self.playerState.getPlaybackContainer()
                ? self.playerState.getPlaybackContainer().onAdPresenting.value
                : undefined;
            isPaused = self.playerState.paused.value;

            if (!isVisible && isAdPresenting && !isPaused) {
                self.logger.debug("Pausing playback because window is not visible");
                self.playerState.paused.set(true, {
                    QB: true,
                    reason: "adnotvisible"
                });
            }
        };

        /**
         * Removes all event listeners and stops monitoring.
         */
        this.unsubscribe = function () {
            document.removeEventListener("visibilitychange", self.checkVisibilityAndPause);
            self.playerState.getPlaybackContainer().onAdPresenting.removeListener(self.checkVisibilityAndPause);
            self.playerState.paused.removeListener(self.checkVisibilityAndPause);
        };

        this.logger = logger.createSubLogger("AdVisibilityMonitor");
    }

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.wCa = void 0;

    tslib = require(22970);
    inversify = require(22674);
    LoggerTokenModule = require(87386);

    /**
     * Starts monitoring the player state for visibility-based ad pausing.
     * Registers listeners on visibilitychange, ad presentation state, and pause state.
     *
     * @param {Object} playerState - The player state object to monitor
     */
    AdVisibilityMonitorClass.prototype.m2 = function startMonitoring(playerState) {
        if (!this.isMonitoring) {
            this.logger.debug("Starting to monitor playback for visibility");
            this.playerState = playerState;
            this.isMonitoring = true;
            document.addEventListener("visibilitychange", this.checkVisibilityAndPause);
            this.playerState.getPlaybackContainer().onAdPresenting.addListener(this.checkVisibilityAndPause);
            this.playerState.paused.addListener(this.checkVisibilityAndPause);
            this.playerState.addEventListener("closing", this.unsubscribe);
            this.checkVisibilityAndPause();
        }
    };

    var AdVisibilityMonitorExport = AdVisibilityMonitorClass;
    exports.wCa = AdVisibilityMonitorExport;
    exports.wCa = AdVisibilityMonitorExport = tslib.__decorate([
        (0, inversify.injectable)(),
        tslib.__param(0, (0, inversify.injectDecorator)(LoggerTokenModule.LoggerToken))
    ], AdVisibilityMonitorExport);
}
