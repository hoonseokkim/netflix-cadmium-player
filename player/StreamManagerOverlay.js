/**
 * StreamManagerOverlay - Debug overlay for stream/bitrate selection
 *
 * Provides a visual debug overlay that displays available audio/video bitrates,
 * CDN information, and allows manual override of bitrate and CDN selection.
 * Activated via Ctrl+Alt+Shift+D keyboard shortcut when debug mode is enabled.
 *
 * @module player/StreamManagerOverlay
 * @original Module_62439
 */

// import { writeBytes as keyboardManager, gM as KEYDOWN_EVENT } from '../events/KeyboardManager';
// import { createElement } from '../utils/dom';
// import { disposableList } from '../core/ServiceLocator';
// import { enumConstants as debugSymbol } from '../core/DebugConfig';
// import { kX as KeyCodes } from '../core/KeyCodes';
// import { PlayerEvents } from '../player/PlayerEvents';
// import { MediaType } from '../types/MediaType';

/**
 * A debug overlay UI for manually selecting audio/video bitrates and CDNs.
 *
 * Shows a floating panel with:
 * - Audio bitrate list
 * - Video bitrate / VMAF score list (with disallow reasons)
 * - CDN server list
 * - Override and Reset buttons
 */
export class StreamManagerOverlay {
    /**
     * @param {Object} playerState - Player state object
     */
    constructor(playerState) {
        this.playerState = playerState;
        this.bitrateOverrideFn = undefined;

        /** @type {Object} Currently selected bitrates for override */
        this.selectedBitrates = {};

        this.debugConfig = disposableList.get(debugSymbol);

        // Build DOM
        this.container = createElement("DIV",
            "position:fixed;left:0;top:50%;right:0;bottom:0;text-align:center;color:#040;font-size:11px;font-family:monospace;z-index:9999",
            undefined,
            { class: "player-streams" }
        );

        this.panel = createElement("DIV",
            "display:inline-block;background-color:rgba(255,255,255,0.86);border:3px solid #fff;padding:5px;margin-top:-90px"
        );

        this.buttonRow = createElement("DIV", "width:100%;text-align:center");

        this.audioSelect = this.createSelectColumn("Audio Bitrate");
        this.videoSelect = this.createSelectColumn("Video Bitrate / VMAF");
        this.cdnSelect = this.createSelectColumn("CDN");

        this.container.appendChild(this.panel);
        this.panel.appendChild(this.buttonRow);

        // Override button
        const overrideBtn = createElement("BUTTON", undefined, "Override");
        overrideBtn.addEventListener("click", this.onOverride.bind(this), false);
        this.buttonRow.appendChild(overrideBtn);

        // Reset button
        const resetBtn = createElement("BUTTON", undefined, "Reset");
        resetBtn.addEventListener("click", this.onReset.bind(this), false);
        this.buttonRow.appendChild(resetBtn);

        // Keyboard shortcut listener
        const onKeyDown = this.onKeyDown.bind(this);
        keyboardManager.addListener(KEYDOWN_EVENT, onKeyDown);

        // Cleanup on player close
        playerState.addEventListener(PlayerEvents.SESSION_CHANGED, () => {
            this.selectedBitrates = {};
        });
        playerState.addEventListener(PlayerEvents.CLOSED, () => {
            keyboardManager.removeListener(KEYDOWN_EVENT, onKeyDown);
        });

        // Update on track/CDN changes
        const onTrackChange = this.refreshIfVisible.bind(this);
        playerState.sourceBufferArray.forEach((sb) => sb.addListener(onTrackChange));
        playerState.tracks.addListener([MediaType.AUDIO, MediaType.VIDEO], onTrackChange);
    }

    /** Shows the overlay */
    show() {
        if (!this.isVisible) {
            this.populateSelects();
            document.body.appendChild(this.container);
            this.isVisible = true;
        }
    }

    /** Hides the overlay */
    hide() {
        if (this.isVisible) {
            document.body.removeChild(this.container);
            this.isVisible = false;
        }
    }

    /** Toggles overlay visibility */
    toggle() {
        this.isVisible ? this.hide() : this.show();
    }

    /**
     * Applies the selected bitrate overrides to the streaming session.
     * @private
     */
    applyBitrateFilters() {
        const allowedStreams = this.playerState.SD();
        const allStreams = this.playerState.fM().sort((a, b) => a.bitrate - b.bitrate);

        const profiles = allStreams
            .reduce((acc, stream) => {
                if (acc.indexOf(stream.profileName) < 0) acc.push(stream.profileName);
                return acc;
            }, [])
            .map((profile) => ({
                profile,
                ranges: this.getBitrateRanges(profile, allStreams, allowedStreams),
                disallowed: this.getDisallowedStreams(profile, allStreams, allowedStreams),
            }));

        this.playerState.streamingSession?.setBitrateFilters(profiles, this.playerState.R);
    }

    /**
     * Gets allowed bitrate ranges for a profile.
     * @private
     */
    getBitrateRanges(profile, allStreams, allowedStreams) {
        const ranges = [];
        let min, max;

        allStreams
            .filter((s) => s.profileName === profile)
            .forEach((stream) => {
                if (allowedStreams.indexOf(stream) >= 0) {
                    if (min === undefined) min = stream.bitrate;
                    max = stream.bitrate;
                } else if (min !== undefined && max !== undefined) {
                    ranges.push({ min, max });
                    min = max = undefined;
                }
            });

        if (min !== undefined && max !== undefined) {
            ranges.push({ min, max });
        }
        return ranges;
    }

    /**
     * Gets manually disallowed streams for a profile.
     * @private
     */
    getDisallowedStreams(profile, allStreams, allowedStreams) {
        return allStreams
            .filter((s) => s.profileName === profile)
            .filter((s) => allowedStreams.indexOf(s) === -1)
            .map((s) => ({
                stream: { bitrate: s.bitrate },
                disallowedBy: ["manual"],
            }));
    }

    /**
     * Handles the Override button click.
     * @private
     */
    onOverride() {
        this.selectedBitrates = {};
        const options = this.videoSelect.options;
        for (let i = options.length; i--; ) {
            if (options[i].selected) {
                this.selectedBitrates[options[i].value] = 1;
            }
        }

        this.bitrateOverrideFn = this.getOverrideStreams.bind(this);
        this.applyBitrateFilters();
        this.playerState.lza();

        // CDN override
        const cdns = this.playerState.di;
        if (cdns) {
            const selectedCdnId = this.cdnSelect.value;
            const targetCdn = cdns.find((cdn) => cdn.id == selectedCdnId);
            const currentCdn = this.playerState.sourceBufferArray[MediaType.VIDEO].value;

            if (targetCdn && targetCdn !== currentCdn) {
                targetCdn.internal_Itb = {
                    testreason: "streammanager",
                    selreason: "userselection",
                };
                this.playerState.sourceBufferArray[MediaType.VIDEO].set(targetCdn);
            }
        }

        this.hide();
    }

    /**
     * Handles the Reset button click.
     * @private
     */
    onReset() {
        this.bitrateOverrideFn = undefined;
        this.playerState.KSb(this.playerState.R);
        this.playerState.lza();
        this.hide();
    }

    /**
     * Returns the filtered stream list based on manual selection.
     * @private
     */
    getOverrideStreams() {
        return this.playerState.fM().filter((stream) => this.selectedBitrates[stream.bitrate]);
    }

    /**
     * Populates the select elements with current track data.
     * @private
     */
    populateSelects() {
        const audioTrack = this.playerState.tracks.audioTrackSelection;
        const videoTrack = this.playerState.tracks.videoTrack;
        let cdns = this.playerState.di;

        if (audioTrack) {
            this.populateOptions(this.audioSelect, audioTrack.streams.map((stream) => ({
                value: stream.bitrate,
                caption: String(stream.bitrate),
                selected: stream === this.playerState.playbackRate.value,
            })));
        }

        if (videoTrack) {
            this.populateOptions(this.videoSelect, videoTrack.streams.map((stream) => {
                const disallowReasons = this.playerState.c2.nJ(stream);
                let caption = String(stream.bitrate);
                if (stream.vmaf) caption += ` / ${stream.vmaf}`;
                if (disallowReasons) caption += ` (${disallowReasons.join("|")})`;

                return {
                    value: stream.bitrate,
                    caption,
                    selected: this.bitrateOverrideFn ? this.selectedBitrates[stream.bitrate] : !disallowReasons,
                };
            }));
            this.videoSelect.removeAttribute("disabled");
        }

        if (cdns) {
            cdns = cdns.slice().sort((a, b) => a.rank - b.rank);
            this.populateOptions(this.cdnSelect, cdns.map((cdn) => ({
                value: cdn.id,
                caption: `[${cdn.id}] ${cdn.name}`,
                selected: cdn === this.playerState.sourceBufferArray[MediaType.VIDEO].value,
            })));
            this.cdnSelect.removeAttribute("disabled");
        }
    }

    /** @private */
    refreshIfVisible() {
        if (this.isVisible) this.populateSelects();
    }

    /**
     * Creates a labeled select column.
     * @private
     */
    createSelectColumn(label) {
        const wrapper = createElement("DIV", "display:inline-block;vertical-align:top;margin:5px;");
        const labelEl = createElement("DIV", undefined, label);
        const select = createElement("select", "width:120px;height:180px", undefined, {
            disabled: "disabled",
            multiple: "multiple",
        });
        wrapper.appendChild(labelEl);
        wrapper.appendChild(select);
        this.panel.appendChild(wrapper);
        return select;
    }

    /**
     * Fills a select element with option elements.
     * @private
     */
    populateOptions(selectEl, items) {
        selectEl.innerHTML = "";
        items.forEach((item) => {
            const attrs = { title: item.caption };
            if (item.selected) attrs.selected = "selected";
            const option = createElement("option", undefined, item.caption, attrs);
            option.value = item.value;
            selectEl.appendChild(option);
        });
    }

    /**
     * Handles keyboard shortcuts.
     * @private
     */
    onKeyDown(event) {
        if (event.ctrlKey && event.altKey && event.shiftKey && event.keyCode === KeyCodes.D && this.debugConfig.dZa) {
            this.toggle();
        }
    }
}
