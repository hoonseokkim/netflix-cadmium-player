/**
 * Netflix Cadmium Player - PlayerEvents / States
 *
 * Central enum/constants module defining all player event names and state enumerations.
 * Referenced throughout the player as "PlayerEvents/states" (Webpack Module 85001).
 *
 * Exports:
 *  - UIEvents:           Events emitted to the external UI layer (e.g. currenttimechanged, loaded)
 *  - PlayGraphEvents:    Events related to play-graph segment transitions
 *  - ServerEvents:       Events originating from server-side signals (e.g. serverTimeChanged)
 *  - PlayerEvents:       Internal ASE (Adaptive Streaming Engine) pipeline events
 *  - AdEvents:           Ad-related events
 *  - PlayerState:        Top-level player lifecycle states (NOTLOADED → CLOSED)
 *  - BufferingState:     Audio/video buffering states (NORMAL, BUFFERING, STALLED)
 *  - PresentingState:    Presentation/playback states (WAITING, PLAYING, PAUSED, ENDED)
 *  - RepositionReason:   Reasons the stream position was changed (SEEK, LIVE_EDGE, etc.)
 *
 * @module PlayerEvents
 */

// ---------------------------------------------------------------------------
// UIEvents — events fired on the player's public event surface
// ---------------------------------------------------------------------------

/**
 * Events emitted to the UI / external consumer layer.
 * Consumers attach listeners via `player.addEventListener(UIEvents.xxx, ...)`.
 *
 * @enum {string}
 */
export const UIEvents = Object.freeze({
    /** Track list has been loaded (audio, video, text) */
    LOADED_TRACKS:                    "loadedtracks",
    /** Media metadata (duration, dimensions, etc.) is available */
    LOADED_METADATA:                  "loadedmetadata",
    /** Player has finished loading and is ready */
    LOADED:                           "loaded",
    /** A fatal error occurred */
    ERROR:                            "error",
    /** The player session has been closed */
    CLOSED:                           "closed",
    /** Throttled current-time update (UI-friendly cadence) */
    CURRENT_TIME_CHANGED:             "currenttimechanged",
    /** Un-throttled current-time update (every frame) */
    UNTHROTTLED_CURRENT_TIME_CHANGED: "unthrottledcurrenttimechanged",
    /** @internal Buffered range changed */
    BUFFERED_TIME_CHANGED:            "bufferedtimechanged",
    /** Media duration changed (e.g. live stream growth) */
    DURATION_CHANGED:                 "durationchanged",
    /** Video dimensions changed */
    VIDEO_SIZE_CHANGED:               "videosizechanged",
    /** Paused state toggled */
    PAUSED_CHANGED:                   "pausedchanged",
    /** Playing state toggled */
    PLAYING_CHANGED:                  "playingchanged",
    /** @internal Ended state toggled */
    ENDED_CHANGED:                    "endedchanged",
    /** Player busy/idle state changed (e.g. buffering spinner) */
    BUSY_CHANGED:                     "busychanged",
    /** @internal Audio track list was rebuilt */
    AUDIO_TRACK_LIST_CHANGED:         "audiotracklistchanged",
    /** Active audio track changed */
    AUDIO_TRACK_CHANGED:              "audiotrackchanged",
    /** Timed-text (subtitle) track list was rebuilt */
    TIMED_TEXT_TRACK_LIST_CHANGED:    "timedtexttracklistchanged",
    /** Active timed-text track changed */
    TIMED_TEXT_TRACK_CHANGED:         "timedtexttrackchanged",
    /** Trick-play (thumbnail) frames updated */
    TRICK_PLAY_FRAMES_CHANGED:       "trickplayframeschanged",
    /** Timecodes (e.g. credits markers) updated */
    TIMECODES_UPDATED:                "timecodesupdated",
    /** Chapter list updated */
    CHAPTERS_UPDATED:                 "chaptersupdated",
    /** Muted state changed */
    MUTED_CHANGED:                    "mutedchanged",
    /** Volume level changed */
    VOLUME_CHANGED:                   "volumechanged",
    /** Show a subtitle cue on screen */
    SHOW_SUBTITLE:                    "showsubtitle",
    /** Remove a subtitle cue from screen */
    REMOVE_SUBTITLE:                  "removesubtitle",
    /** Watermark overlay event */
    WATERMARK:                        "watermark",
    /** Player is ready to transition to the next segment/title */
    IS_READY_TO_TRANSITION:           "isReadyToTransition",
    /** Session was inactivated (e.g. due to concurrent streams) */
    INACTIVATED:                      "inactivated",
    /** @internal Non-fatal playback error for logging */
    INTERNAL_PLAYBACK_ERROR:          "internalPlaybackError",
    /** Segment map has been loaded */
    SEGMENT_MAP_LOADED:               "segmentmaploaded",
    /** A segment is now presenting */
    SEGMENT_PRESENTING:               "segmentpresenting",
    /** Autoplay was allowed by the browser */
    AUTOPLAY_WAS_ALLOWED:             "autoplaywasallowed",
    /** @internal Autoplay was blocked by the browser */
    AUTOPLAY_WAS_BLOCKED:             "autoplaywasblocked",
    /** Ads state changed */
    ADS_STATE_CHANGED:                "adsstatechanged",
    /** Live event times changed */
    LIVE_EVENT_TIMES_CHANGED:         "livestatechanged",
    /** Ad metadata updated */
    AD_METADATA_UPDATED:              "admetadataupdated",
    /** @internal Playback rate changed */
    RATE_CHANGE:                      "ratechange",
});

// ---------------------------------------------------------------------------
// PlayGraphEvents — play-graph / branching narrative events
// ---------------------------------------------------------------------------

/**
 * Events related to Netflix's play-graph (branching narrative / multi-segment) system.
 *
 * @enum {string}
 */
export const PlayGraphEvents = Object.freeze({
    /** @internal A play-graph segment transition occurred */
    SEGMENT_TRANSITION: "playgraphsegmenttransition",
});

// ---------------------------------------------------------------------------
// ServerEvents — server-originated signals
// ---------------------------------------------------------------------------

/**
 * Lightweight event class for server-originated signals.
 * Currently only carries `SERVER_TIME_CHANGED`.
 *
 * @enum {string}
 */
export const ServerEvents = Object.freeze({
    /** Server clock time was updated */
    SERVER_TIME_CHANGED: "serverTimeChanged",
});

// ---------------------------------------------------------------------------
// PlayerEvents — internal ASE (Adaptive Streaming Engine) pipeline events
// ---------------------------------------------------------------------------

/**
 * Internal player events used within the ASE pipeline.
 * Fired via `playerState.fireEvent(PlayerEvents.xxx, data)`.
 *
 * @enum {string}
 */
export const PlayerEvents = Object.freeze({
    /** Live pipeline failover occurred */
    LIVE_PIPELINE_FAILOVER:                "livePipelineFailover",
    /** @internal Autoplay was allowed */
    AUTOPLAY_WAS_ALLOWED:                  "autoplayWasAllowed",
    /** Autoplay was blocked */
    AUTOPLAY_WAS_BLOCKED:                  "autoplayWasBlocked",
    /** A buffer underrun was detected */
    BUFFER_UNDERRUN:                       "bufferUnderrun",
    /** The player session has closed */
    CLOSED:                                "closed",
    /** The player session is closing */
    CLOSING:                               "closing",
    /** Current playback time changed */
    CURRENT_TIME_CHANGED:                  "currentTimeChanged",
    /** A media segment download completed */
    DOWNLOAD_COMPLETE:                     "downloadComplete",
    /** Session was inactivated */
    INACTIVATED:                           "inactivated",
    /** A DRM license was added */
    LICENSE_ADDED:                         "licenseAdded",
    /** Content is fully licensed and ready */
    LICENSED:                              "licensed",
    /** A CDN location was selected */
    LOCATION_SELECTED:                     "locationSelected",
    /** Manifest is closing */
    MANIFEST_CLOSING:                      "manifestClosing",
    /** Manifest is now presenting */
    MANIFEST_PRESENTING:                   "manifestPresenting",
    /** Media buffer level changed */
    MEDIA_BUFFER_CHANGED:                  "mediaBufferChanged",
    /** Next branching segment was chosen by the user */
    NEXT_BRANCHING_SEGMENT_CHOSEN:         "nextBranchingSegmentChosen",
    /** Playback has started (first frame after WAITING) */
    PLAYBACK_START:                        "playbackStart",
    /** First render occurred — player is ready for display */
    PLAYBACK_READY:                        "playbackReady",
    /** Stream is repositioning (seek in progress) */
    REPOSITIONING:                         "repositioning",
    /** ASE reposition event */
    REPOSITION_ASE:                        "repositionASE",
    /** Reposition completed */
    REPOSITIONED:                          "repositioned",
    /** @internal A safe-play request was issued */
    SAFE_PLAY_REQUESTED:                   "safePlayRequested",
    /** A media segment is now presenting */
    SEGMENT_PRESENTING:                    "segmentPresenting",
    /** @internal Server switch occurred (CDN failover) */
    SERVER_SWITCH:                         "serverSwitch",
    /** Video diagnostic info should be updated */
    SHOULD_UPDATE_VIDEO_DIAG_INFO:         "shouldUpdateVideoDiagInfo",
    /** A subtitle rendering error occurred */
    SUBTITLE_ERROR:                        "subtitleError",
    /** Throttled media-time update */
    THROTTLED_MEDIA_TIME_CHANGED:          "throttledMediaTimeChanged",
    /** Un-throttled media-time update */
    UNTHROTTLED_MEDIA_TIME_CHANGED:        "unthrottledMediaTimeChanged",
    /** Timed-text rebuffering occurred */
    TIMED_TEXT_REBUFFER:                   "timedTextRebuffer",
    /** Timed-text track list changed */
    TIMED_TEXT_TRACK_LIST_CHANGED:         "timedTextTrackListChanged",
    /** Trick-play frames changed */
    TRICK_PLAY_FRAMES_CHANGED:             "trickPlayFramesChanged",
    /** Update next branching segment weights */
    UPDATE_NEXT_BRANCHING_SEGMENT_WEIGHTS: "updateNextBranchingSegmentWeights",
    /** User initiated a pause */
    USER_INITIATED_PAUSE:                  "userInitiatedPause",
    /** User initiated a resume */
    USER_INITIATED_RESUME:                 "userInitiatedResume",
    /** Track hydration completed */
    TRACKS_HYDRATED:                       "tracksHydrated",
    /** Live event times changed */
    LIVE_EVENT_TIMES_CHANGED:              "livestatechanged",
    /** @internal Player is restarting */
    RESTARTING:                            "restarting",
    /** Live post-play data updated */
    LIVE_POSTPLAY_UPDATED:                 "livePostplayUpdated",
    /** Chapter markers updated */
    CHAPTERS_UPDATED:                      "chaptersUpdated",
    /** ASE log-blob event */
    ASE_LOGBLOB:                           "aseLogblob",
    /** @internal Playback rate changed */
    RATE_CHANGE:                           "ratechange",
});

// ---------------------------------------------------------------------------
// AdEvents — ad-related pipeline events
// ---------------------------------------------------------------------------

/**
 * Events related to Netflix ad insertion.
 *
 * @enum {string}
 */
export const AdEvents = Object.freeze({
    /** @internal An ad break has completed */
    AD_BREAK_COMPLETE: "adBreakComplete",
});

// ---------------------------------------------------------------------------
// PlayerState — top-level player lifecycle
// ---------------------------------------------------------------------------

/**
 * Top-level lifecycle state of the player instance.
 * Progresses: NOTLOADED → LOADING → NORMAL → CLOSING → CLOSED.
 *
 * @enum {number}
 */
export const PlayerState = Object.freeze({
    /** Player has not started loading */
    NOTLOADED: 0,
    /** Player is loading (manifest, keys, initial segments) */
    LOADING:   1,
    /** Player is in its normal operational state */
    NORMAL:    2,
    /** Player is shutting down */
    CLOSING:   3,
    /** Player is fully closed */
    CLOSED:    4,
});

// ---------------------------------------------------------------------------
// BufferingState — audio/video buffering health
// ---------------------------------------------------------------------------

/**
 * Indicates the current buffering health of the A/V pipeline.
 *
 * @enum {number}
 */
export const BufferingState = Object.freeze({
    /** Buffers are healthy — playback can proceed normally */
    NORMAL:    1,
    /** Actively buffering — playback may be interrupted */
    BUFFERING: 2,
    /** Stalled — unable to make progress */
    STALLED:   3,
});

// ---------------------------------------------------------------------------
// PresentingState — presentation / playback state
// ---------------------------------------------------------------------------

/**
 * The current presentation state visible to the user.
 *
 * @enum {number}
 */
export const PresentingState = Object.freeze({
    /** Waiting for data or a play signal */
    WAITING: 1,
    /** Actively playing */
    PLAYING: 2,
    /** Paused by the user or programmatically */
    PAUSED:  3,
    /** Playback reached the end */
    ENDED:   4,
});

// ---------------------------------------------------------------------------
// RepositionReason — why the stream position changed
// ---------------------------------------------------------------------------

/**
 * Describes the reason the stream playback position was changed.
 * Used by seek/reposition logic throughout the ASE pipeline.
 *
 * @enum {number}
 */
export const RepositionReason = Object.freeze({
    /** Initial load / first play */
    INITIAL:             0,
    /** User-initiated seek */
    SEEK:                1,
    /** Jump to the live edge */
    LIVE_EDGE:           2,
    /** Audio/text track change requiring reposition */
    TRACK_CHANGED:       3,
    /** Play-graph segment change (branching narrative) */
    SEGMENT_CHANGED:     4,
    /** Forced rebuffer (e.g. quality upgrade) */
    FORCE_REBUFFER:      5,
    /** Media fragments are missing */
    FRAGMENTS_MISSING:   6,
    /** Discontinuity detected in the media timeline */
    MEDIA_DISCONTINUITY: 7,
});

// ---------------------------------------------------------------------------
// Legacy export map (obfuscated name → deobfuscated name)
// ---------------------------------------------------------------------------
// cb                       → UIEvents
// JX                       → PlayGraphEvents
// ZFa                      → ServerEvents
// PlayerEvents             → PlayerEvents  (already named)
// rCa                      → AdEvents
// pacingTargetBufferStrategy → PlayerState
// zh                       → BufferingState
// setState                 → PresentingState
// streamState              → RepositionReason
