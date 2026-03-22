/**
 * @module PlayerInfoOverlay
 * @description Debug overlay panel (Ctrl+Alt+Shift+Q) that displays real-time
 * player diagnostics: version, ESN, playback state, bitrate, buffer levels,
 * codec info, framerate, dropped frames, DRM status, throughput, and HDR support.
 * Renders as a semi-transparent textarea over the video player.
 * @see Module_52200
 */

import { tq as activeSessionList } from '../core/SessionList.js';
import { writeBytes, gM as KEYDOWN_EVENT } from '../events/EventBus.js';
import { oG as clampRange } from '../utils/MathUtils.js';
import { r_a as formatVideoDiag } from '../utils/DiagUtils.js';
import { uX as roundValue, totalTime as formatPercent, browserua } from '../utils/MathUtils.js';
import { wc as isNumber } from '../utils/TypeChecks.js';
import { PlayerEvents, pacingTargetBufferStrategy, zh as BufferingState, setState as PlayerState } from '../player/PlayerEvents.js';
import { kX as KeyCodes } from '../player/KeyCodes.js';
import { MILLISECONDS } from '../timing/Timestamp.js';
import { MediaType, FI as getMediaTypeName } from '../media/MediaTypes.js';
import { readSlice as AudioProfiles } from '../media/AudioProfiles.js';
import { zk as formatTime } from '../utils/FormatUtils.js';

/** Maps player state enum to display string. */
const PLAYER_STATE_LABELS = {
    [pacingTargetBufferStrategy.NOTLOADED]: 'Not Loaded',
    [pacingTargetBufferStrategy.LOADING]: 'Loading',
    [pacingTargetBufferStrategy.NORMAL]: 'Normal',
    [pacingTargetBufferStrategy.CLOSING]: 'Closing',
    [pacingTargetBufferStrategy.CLOSED]: 'Closed'
};

/** Maps buffering state enum to display string. */
const BUFFERING_STATE_LABELS = {
    [BufferingState.NORMAL]: 'Normal',
    [BufferingState.BUFFERING]: 'Pre-buffering',
    [BufferingState.STALLED]: 'Network stalled'
};

/** Maps presenting state enum to display string. */
const PRESENTING_STATE_LABELS = {
    [PlayerState.WAITING]: 'Waiting for decoder',
    [PlayerState.PLAYING]: 'Playing',
    [PlayerState.PAUSED]: 'Paused',
    [PlayerState.ENDED]: 'Media ended'
};

/**
 * On-screen debug overlay for the Netflix player. Toggled with Ctrl+Alt+Shift+Q.
 * Shows comprehensive playback diagnostics including streaming quality, buffer
 * health, codec information, DRM status, and performance metrics.
 */
export class PlayerInfoOverlay {
    /**
     * @param {Object} playerState - Player state observables.
     * @param {Function} getEsnFn - Returns device ESN info.
     * @param {Object} scheduler - UI render scheduler.
     * @param {Object} elementFactory - DOM element factory.
     * @param {Object} codecHelper - Codec detection utilities.
     * @param {Object} hdrDetector - HDR capability detection.
     */
    constructor(playerState, getEsnFn, scheduler, elementFactory, codecHelper, hdrDetector) {
        this.playerState = playerState;
        this.getEsnFn = getEsnFn;
        this.scheduler = scheduler;
        this.elementFactory = elementFactory;
        this.codecHelper = codecHelper;
        this.hdrDetector = hdrDetector;
        this.customFields = {};
        this.visible = false;

        // Bind update methods
        this.updateDisplay = () => {
            if (this.textarea.selectionStart === this.textarea.selectionEnd) {
                let text = '';
                this.getInfoGroups().forEach(group => {
                    text = text ? text + '\n' : '';
                    Object.entries(group).forEach(([key, value]) => {
                        text += key + ': ' + value + '\n';
                    });
                });
                this.textarea.style.fontSize = clampRange(
                    roundValue(this.element.clientHeight / 60), 8, 18
                ) + 'px';
                this.textarea.value = text;
            }
        };

        this.pollDroppedFrames = () => {
            if (this.playerState.mediaSourceManager) {
                const droppedFrames = this.playerState.mediaSourceManager.vS();
                if (droppedFrames) {
                    this.currentDroppedFrames = droppedFrames - (this.previousDroppedFrames ?? 0);
                    this.previousDroppedFrames = droppedFrames;
                    this.scheduleUpdate();
                }
            }
        };

        this.scheduleUpdate = () => {
            this.scheduler.scheduleHydration(this.updateDisplay);
        };

        this.onKeyDown = (event) => {
            if (event.ctrlKey && event.altKey && event.shiftKey &&
                (event.keyCode === KeyCodes.t_b || event.keyCode === KeyCodes.Q)) {
                this.toggle();
            }
        };

        // Observables to watch for changes
        this.observables = [
            playerState.mediaTime, playerState.sourceBufferArray[MediaType.V],
            playerState.sourceBufferArray[MediaType.U],
            playerState.sourceBufferArray[MediaType.TEXT_MEDIA_TYPE],
            playerState.mediaTimeObservable, playerState.targetBuffer,
            playerState.playbackRate, playerState.isStalled,
            playerState.isSeeking, playerState.state,
            playerState.avBufferingState, playerState.presentingState,
            playerState.volume, playerState.muted
        ];

        // Build DOM
        this.element = elementFactory.createElement('div',
            'position:fixed;left:10px;top:10px;right:10px;bottom:10px;z-index:9999',
            undefined, { class: 'player-info' });
        this.textarea = elementFactory.createElement('textarea',
            'position:absolute;resize:none;box-sizing:border-box;width:100%;height:100%;' +
            'padding:10px;background-color:rgba(0,0,0,0.4);color:#fff;font-size:12px;' +
            'font-family:Arial;overflow:auto;',
            undefined, { readonly: 'readonly' });
        this.element.appendChild(this.textarea);

        this.controls = elementFactory.createElement('div', 'position:absolute;top:2px;right:2px');
        this.element.appendChild(this.controls);

        const closeBtn = elementFactory.createElement('button', undefined, 'X');
        closeBtn.addEventListener('click', () => this.hide(), false);
        this.controls.appendChild(closeBtn);

        writeBytes.addListener(KEYDOWN_EVENT, this.onKeyDown);
        playerState.addEventListener(PlayerEvents.clearTimeoutFn, () => {
            writeBytes.removeListener(KEYDOWN_EVENT, this.onKeyDown);
            this.hide();
        });
    }

    /** Shows the debug overlay. */
    show() {
        if (!this.visible) {
            this.pollIntervalId = setInterval(this.pollDroppedFrames, 1000);
            document.body.appendChild(this.element);
            this.observables.forEach(obs => obs.addListener(this.scheduleUpdate));
            [PlayerEvents.sea].forEach(evt => {
                this.playerState.addEventListener(evt, this.scheduleUpdate);
            });
            this.visible = true;
            this.hdrDetector.internal_Eha().then(result => {
                this.hdrInfo = result;
                this.scheduleUpdate();
            });
        }
        this.updateDisplay();
    }

    /** Hides the debug overlay. */
    hide() {
        if (this.visible) {
            clearInterval(this.pollIntervalId);
            this.previousDroppedFrames = this.currentDroppedFrames = undefined;
            document.body.removeChild(this.element);
            this.observables.forEach(obs => obs.removeListener(this.scheduleUpdate));
            [PlayerEvents.sea].forEach(evt => {
                this.playerState.removeEventListener(evt, this.scheduleUpdate);
            });
            this.scheduler.scheduleHydration();
            this.visible = false;
        }
    }

    /** Toggles overlay visibility. */
    toggle() {
        this.visible ? this.hide() : this.show();
    }

    /**
     * Collects all debug info groups for display.
     * @returns {Object[]} Array of key-value group objects.
     */
    getInfoGroups() {
        const groups = [];
        const esn = this.getEsnFn();

        // Version info
        groups.push({
            Version: '6.0055.939.911',
            Esn: esn ? esn.wj : 'UNKNOWN',
            PBCID: this.playerState.correlationId,
            UserAgent: browserua
        });

        // Playback position info
        try {
            const currentTime = this.playerState.mediaTime.value;
            const info = {
                MovieId: this.playerState.R,
                Position: formatTime(currentTime),
                Duration: formatTime(this.playerState.segmentTimestamp.toUnit(MILLISECONDS)),
                Volume: formatPercent(100 * this.playerState.volume.value) + '%' +
                    (this.playerState.muted.value ? ' (Muted)' : ''),
                Segment: this.playerState.nWa()
            };
            groups.push(info);
        } catch (e) { /* swallow */ }

        // Player/buffering/rendering state
        try {
            groups.push({
                'Player state': PLAYER_STATE_LABELS[this.playerState.state.value],
                'Buffering state': BUFFERING_STATE_LABELS[this.playerState.avBufferingState.value],
                'Rendering state': PRESENTING_STATE_LABELS[this.playerState.presentingState.value]
            });
        } catch (e) { /* swallow */ }

        // Buffer and bitrate info
        try {
            const audioStream = this.playerState.mediaTimeObservable.value;
            const videoStream = this.playerState.targetBuffer.value;
            groups.push({
                'Playing bitrate (a/v)': (audioStream?.stream?.bitrate ?? '?') + ' / ' +
                    (videoStream ? videoStream.stream.bitrate + ' (' + videoStream.stream.width + 'x' + videoStream.stream.height + ')' : '?'),
                'Buffer size in Seconds (a/v)': formatTime(this.playerState.AudioBufferLength()) +
                    ' / ' + formatTime(this.playerState.VideoBufferLength())
            });
        } catch (e) { /* swallow */ }

        // Framerate and dropped frames
        try {
            const msm = this.playerState.mediaSourceManager;
            groups.push({
                Framerate: (this.playerState.isStalled.value?.framerate ?? 0).toFixed(3),
                'Current Dropped Frames': isNumber(this.currentDroppedFrames) ? this.currentDroppedFrames : '',
                'Total Frames': msm.YA(),
                'Total Dropped Frames': msm.vS(),
                'Total Corrupted Frames': msm.internal_Nba()
            });
        } catch (e) { /* swallow */ }

        // Throughput
        try {
            groups.push({ Throughput: this.playerState.bufferLength + ' kbps' });
        } catch (e) { /* swallow */ }

        // Custom fields
        let customGroup;
        try {
            Object.entries(this.customFields).forEach(([key, value]) => {
                customGroup = customGroup || {};
                customGroup[key] = JSON.stringify(value);
            });
            if (customGroup) groups.push(customGroup);
        } catch (e) { /* swallow */ }

        return groups;
    }
}
