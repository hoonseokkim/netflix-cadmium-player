/**
 * Netflix Cadmium Player -- MediaRequestEventReporter
 *
 * Reports streaming lifecycle events (stream selection, server switches,
 * location selections, download completions, Ella relay events, etc.)
 * to the player's event dispatcher. Each event is typed and dispatched
 * through the central event bus for telemetry and logging.
 *
 * @module streaming/MediaRequestEventReporter
 * @original Module_73861
 * @dependencies
 *   Module 22970 - tslib (__importDefault)
 *   Module 91176 - TimeUtil (fromMilliseconds, lowestWaterMarkLevelBufferRelaxed)
 *   Module 66164 - platform globals (storage, performance.now())
 *   Module 26388 - media type display names (DT)
 *   Module 14282 - media type constants (pq = { U, V, TEXT_MEDIA_TYPE })
 *   Module 65161 - MediaType enum (U = video, V = audio)
 *   Module 69575 - dispatchTypedEvent
 *   Module 40497 - bandwidth confidence singleton
 */

import { TimeUtil } from '../utils/ObjectUtils';                           // Module 91176
import { platform } from '../utils/PlatformGlobals';                       // Module 66164
import { MediaTypeDisplayNames } from '../media/MediaType';                // Module 26388
import MediaTypeConstants from '../media/MediaTypeConstants';              // Module 14282
import { MediaType } from '../streaming/PlaybackState';                    // Module 65161
import { dispatchTypedEvent } from '../events/EventBusClass';             // Module 69575
import BandwidthConfidence from '../abr/BandwidthConfidence';             // Module 40497

const VIDEO = MediaTypeConstants.mediaTypes.VIDEO;
const AUDIO = MediaTypeConstants.mediaTypes.AUDIO;

/**
 * Reports media request lifecycle events to the event dispatcher.
 */
class MediaRequestEventReporter {
    /**
     * @param {Object} sessionContext - The playback session context (me)
     * @param {Object} eventDispatcher - Event dispatcher for publishing events
     * @param {Object} config - Streaming configuration
     * @param {Object} console - Logger instance
     * @param {number} mediaType - MediaType enum value for this reporter
     */
    constructor(sessionContext, eventDispatcher, config, console, mediaType) {
        this.sessionContext = sessionContext;
        this.eventDispatcher = eventDispatcher;
        this.config = config;
        this.console = console;
        this.mediaType = mediaType;
    }

    /**
     * Whether event reporting is enabled (not cancelled).
     * @returns {boolean}
     */
    isEnabled() {
        return !this.sessionContext.isLive.isCancelledFlag;
    }

    /**
     * Report a streaming PTS update and download completion event.
     * Also updates the playgraph position tracker if applicable.
     *
     * @param {Object} requestInfo - Download request metadata
     */
    reportStreamingPtsUpdate(requestInfo) {
        // Update playgraph segment tracking for video/audio
        if (!requestInfo.isEndOfStream && requestInfo.size > 0 &&
            (this.mediaType === MediaType.VIDEO || this.mediaType === MediaType.AUDIO)) {
            const playbackSegment = requestInfo.segmentMetadata?.playbackSegment;
            if (playbackSegment !== undefined && playbackSegment > 0) {
                BandwidthConfidence.instance()?.updateSegment(playbackSegment);
                BandwidthConfidence.instance()?.refreshEstimate();
            }
        }

        if (!this.isEnabled()) return;

        const segment = requestInfo.currentSegment;
        const ptsUpdateEvent = {
            type: "updateStreamingPts",
            mediaType: requestInfo.mediaType,
            position: {
                segmentId: segment.id,
                offset: TimeUtil.fromMilliseconds(this.sessionContext.currentPts)
                    .toSegmentRelative(segment.startTime),
            },
            completePlayerStreamingTimestamp: TimeUtil.fromMilliseconds(this.sessionContext.streamingEndPts),
            trackIndex: requestInfo.stream.track.STREAMING,
            bufferLevelMs: this.sessionContext.isLive.getStartTime(requestInfo.mediaType),
        };

        dispatchTypedEvent(this.eventDispatcher, ptsUpdateEvent.type, ptsUpdateEvent);

        // Also report download completion for non-EOS segments with data
        if (!requestInfo.isEndOfStream && requestInfo.size > 0) {
            const downloadEvent = {
                type: "downloadComplete",
                mediaType: requestInfo.mediaType,
                bytes: requestInfo.size,
                durationMs: requestInfo.offset.playbackSegment,
            };
            dispatchTypedEvent(this.eventDispatcher, downloadEvent.type, downloadEvent);
        }
    }

    /**
     * Report that a new stream (bitrate) has been selected.
     *
     * @param {Object} segmentId - Current segment identifier
     * @param {Object} stream - The newly selected stream
     * @param {number} pts - Current PTS
     */
    reportStreamSelected(segmentId, stream, pts) {
        if (!this.isEnabled()) return;

        const mediaType = this.mediaType;
        const bundle = this.sessionContext.streamSelector.streamBundle(mediaType);

        // Update the bundle's current stream
        bundle.updateCurrentStream(stream);

        // Save bitrate to storage periodically for quick start
        if (stream.mediaType === MediaType.AUDIO || stream.mediaType === MediaType.VIDEO) {
            if (this.config.saveBitrateMs) {
                if (bundle.lastSaveTimestamp === undefined) {
                    bundle.setLastSaveTimestamp(platform.platform.now());
                } else if (platform.platform.now() - bundle.lastSaveTimestamp > this.config.saveBitrateMs) {
                    if (stream.bitrate !== bundle.lastSavedBitrate) {
                        if (stream.mediaType === MediaType.VIDEO) {
                            platform.storage.set("vb", stream.bitrate);
                        } else if (stream.mediaType === MediaType.AUDIO) {
                            platform.storage.set("ab", stream.bitrate);
                        }
                        bundle.updateSavedBitrate(stream.bitrate);
                    }
                    bundle.setLastSaveTimestamp(platform.platform.now());
                }
            }
        }

        // Skip if stream hasn't changed
        if (bundle.currentStream && bundle.currentStream === stream) return;

        this.sessionContext.streamSelector.onStreamChange(segmentId, bundle.currentStream, stream);
        bundle.setCurrentStream(stream);

        let bandwidth = 0;
        if (stream.getConfig && stream.getConfig.confidence && stream.getConfig.bufferLength) {
            bandwidth = stream.getConfig.bufferLength.average;
        }

        const position = {
            segmentId: this.sessionContext.isLive.currentSegment.id,
            offset: TimeUtil.fromMilliseconds(pts)
                .toSegmentRelative(this.sessionContext.isLive.currentSegment.startTime),
        };

        const event = {
            type: "streamSelected",
            nativetime: platform.platform.now(),
            mediaType: mediaType,
            streamId: stream.id,
            trackIndex: stream.track.STREAMING,
            streamIndex: stream.streamIndex,
            bandwidth: bandwidth,
            longtermBw: bandwidth,
            rebuffer: 0,
            position: position,
            stream: stream,
            manifest: stream.viewableSession?.manifestRef,
        };

        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Report an Ella relay switch event.
     *
     * @param {string} relayNode - New relay node identifier
     * @param {string} channelName - Channel name
     * @param {number} [mediaOffsetMs=0] - Media offset in milliseconds
     * @param {string} [reason="unknown"] - Reason for the switch
     */
    reportEllaRelaySwitch(relayNode, channelName, mediaOffsetMs, reason) {
        if (!this.isEnabled()) return;
        const event = {
            type: "ellaRelaySwitch",
            moffms: mediaOffsetMs || 0,
            relayNode: relayNode,
            channelName: channelName,
            reason: reason || "unknown",
        };
        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Report an Ella relay failure event.
     *
     * @param {string} relayNode - Failed relay node
     * @param {string} channelName - Channel name
     * @param {number} [mediaOffsetMs=0] - Media offset in milliseconds
     * @param {string} [reason="unknown"] - Failure reason
     */
    reportRelayFailure(relayNode, channelName, mediaOffsetMs, reason) {
        if (!this.isEnabled()) return;
        const event = {
            type: "ellaRelayFailure",
            moffms: mediaOffsetMs || 0,
            relayNode: relayNode,
            channelName: channelName,
            reason: reason || "unknown",
        };
        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Report a general Ella failure.
     *
     * @param {number} mediaType - Media type that failed
     * @param {string} reason - Failure reason
     */
    reportEllaFailure(mediaType, reason) {
        if (!this.isEnabled()) return;
        const event = {
            type: "ellaFailure",
            mediaType: mediaType,
            reason: reason,
        };
        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Report a successful Ella session.
     *
     * @param {number} mediaType
     * @param {number} receivedSegmentCount
     * @param {string} relayNode
     * @param {string} channelName
     * @param {Object} networkStats
     */
    reportEllaSuccess(mediaType, receivedSegmentCount, relayNode, channelName, networkStats) {
        if (!this.isEnabled()) return;
        const event = {
            type: "ellaSuccess",
            mediaType: mediaType,
            receivedsegmentcnt: receivedSegmentCount,
            relayNode: relayNode,
            channelName: channelName,
            networkstat: networkStats,
        };
        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Report CDN location and server selection for a download request.
     * Handles both initial selection (startup) and mid-stream switches.
     *
     * @param {Object} segmentId
     * @param {Object} requestInfo - Download request metadata
     * @param {boolean} isFirstRequest - Whether this is the first request
     */
    reportLocationAndServerSelected(segmentId, requestInfo, isFirstRequest) {
        if (!this.isEnabled()) return;

        const viewableSession = requestInfo.viewableSession;
        const selectionInfo = viewableSession.selectionInfo;
        const bundle = this.sessionContext.streamSelector.streamBundle(requestInfo.mediaType);
        const cdnSelection = viewableSession.getCdnSelection(requestInfo);
        const isLocationNew = cdnSelection.isNewLocation;
        const isServerNew = cdnSelection.isNewServer;

        const STARTUP = AUDIO; // selection reason constants from MediaTypeConstants
        const selectionReasons = MediaTypeConstants.selectionReasons;

        // Server switch notification
        if (isFirstRequest && requestInfo.serverHostname && !bundle.currentServer) {
            requestInfo.selectionReason = selectionReasons.name[STARTUP];
            this._notifyServerSwitch(segmentId, requestInfo.serverHostname, requestInfo.selectionReason, requestInfo.location, requestInfo.bitrate);
            bundle.currentServer = requestInfo.serverHostname;
        } else if (!isFirstRequest && requestInfo.serverHostname && requestInfo.serverHostname !== bundle.currentServer) {
            const reason = isServerNew
                ? (bundle.currentServer === undefined ? STARTUP : (selectionInfo.lastSelectionReason === selectionReasons.FAILOVER ? selectionReasons.SERVER_FAILOVER : selectionReasons.CDN_SWITCH))
                : selectionReasons.SERVER_SAME;
            requestInfo.selectionReason = selectionReasons.name[reason];
            this._notifyServerSwitch(segmentId, requestInfo.serverHostname, requestInfo.selectionReason, requestInfo.location, requestInfo.bitrate);
            bundle.currentServer = requestInfo.serverHostname;
        }

        // Log start-play location for first request
        if (!bundle.currentLocation && requestInfo.location) {
            const logEvent = {
                type: "logdata",
                target: "startplay",
                fields: {},
            };
            if (this.mediaType === AUDIO) {
                logEvent.fields.alocid = requestInfo.location;
            } else if (this.mediaType === VIDEO) {
                logEvent.fields.locid = requestInfo.location;
            }
            dispatchTypedEvent(this.eventDispatcher, logEvent.type, logEvent);
        }

        // Location selection notification
        if (isFirstRequest && requestInfo.location && !bundle.currentLocation) {
            requestInfo.selectionReason = selectionReasons.name[STARTUP];
            this._notifyLocationSelected(segmentId, requestInfo.location, requestInfo.locationLevel, requestInfo.serverHostname, requestInfo.serverName, requestInfo.selectionReason, requestInfo.selectionDetail, viewableSession.manifestRef);
            bundle.currentLocation = requestInfo.location;
        } else if (!isFirstRequest && requestInfo.location && requestInfo.location !== bundle.currentLocation) {
            const reason = isLocationNew
                ? (bundle.currentLocation === undefined ? STARTUP : (selectionInfo.lastSelectionReason === selectionReasons.FAILOVER ? selectionReasons.LOCATION_FAILOVER : selectionReasons.CDN_SWITCH))
                : selectionReasons.LOCATION_SAME;
            requestInfo.selectionReason = selectionReasons.name[reason];
            this._notifyLocationSelected(segmentId, requestInfo.location, requestInfo.locationLevel, requestInfo.serverHostname, requestInfo.serverName, requestInfo.selectionReason, requestInfo.selectionDetail, viewableSession.manifestRef);
            requestInfo.selectionDetail = undefined;
            bundle.currentLocation = requestInfo.location;
        }

        // Track location/server for error probing
        if (!this.config.probeServerWhenError) {
            requestInfo.lastKnownLocation = requestInfo.location;
            requestInfo.lastKnownServer = requestInfo.serverHostname;
        }
    }

    /**
     * Report that requests have been pruned from the queue.
     * @param {Array} requests - The pruned requests
     */
    reportRequestsPruned(requests) {
        const event = {
            type: "requestsPruned",
            requests: requests,
        };
        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Notify that the CDN server has switched.
     * @private
     */
    _notifyServerSwitch(segmentId, server, reason, location, bitrate) {
        if (!this.isEnabled()) return;

        if (this.mediaType === MediaTypeConstants.TEXT_MEDIA_TYPE) {
            this.console.debug("notifyServerSwitch ignored for MediaType.TEXT");
            return;
        }

        const mediaTypeName = MediaTypeDisplayNames[this.mediaType];
        const bwInfo = BandwidthConfidence.instance().key();

        const event = {
            type: "serverSwitch",
            segmentId: segmentId,
            mediatype: mediaTypeName,
            server: server,
            reason: reason,
            location: location,
            bitrate: bitrate,
            confidence: bwInfo.confidence,
        };

        if (bwInfo.confidence) {
            event.throughput = bwInfo.bufferLength.average;
        }

        const previousServer = this.sessionContext.streamSelector.streamBundle(this.mediaType).currentServer;
        if (previousServer !== undefined) {
            event.oldserver = previousServer;
        }

        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Notify that a CDN location has been selected.
     * @private
     */
    _notifyLocationSelected(segmentId, location, locationLevel, serverId, serverName, selReason, selDetail, manifest) {
        if (!this.isEnabled()) return;

        if (this.mediaType === MediaTypeConstants.TEXT_MEDIA_TYPE) {
            this.console.debug("notifyLocationSelected ignored for MediaType.TEXT");
            return;
        }

        const event = {
            type: "locationSelected",
            segmentId: segmentId,
            mediatype: MediaTypeDisplayNames[this.mediaType],
            location: location,
            locationlv: locationLevel,
            serverid: serverId,
            servername: serverName,
            selreason: selReason,
            seldetail: selDetail,
            manifest: manifest,
        };

        dispatchTypedEvent(this.eventDispatcher, "locationSelected", event);
    }

    /**
     * Report the PTS of the last segment in a track.
     * @param {Object} segment
     * @param {number} pts
     */
    reportLastSegmentPts(segment, pts) {
        if (!this.isEnabled()) return;
        const event = {
            type: "lastSegmentPts",
            segmentId: segment.id,
            pts: Math.floor(pts),
        };
        dispatchTypedEvent(this.eventDispatcher, event.type, event);
    }

    /**
     * Forward a transport-level report event.
     * @param {Object} report
     */
    reportTransport(report) {
        dispatchTypedEvent(this.eventDispatcher, "transportReport", report);
    }

    /**
     * Report a media request completion event.
     * @param {Object} requestInfo
     */
    reportMediaRequestComplete(requestInfo) {
        if (!this.isEnabled()) return;
        dispatchTypedEvent(this.eventDispatcher, "mediaRequestComplete", requestInfo);
    }
}

export { MediaRequestEventReporter };
