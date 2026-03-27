/**
 * Netflix Cadmium Player - Module 41893
 */
export default function module_41893(t, b, a) {
var p, c, g, f, e, h, k, l;
    function d(m, n, q, r, u, v, w, x, y, A, z, B, C, D, E) {
        var G;
        G = this;
        this.eventBus = m;
        this.downloadReportInterval = n;
        this.nextState = r;
        this.ZB = v;
        this.H$ = w;
        this.hBb = x;
        this.config = A;
        this.viewableConfig = B;
        this.currentSegment = C;
        this.playerState = z.create(C.R, C.timeOffset, y, D, E, C.manifestSessionData, C.id, C.manifestRef);
        this.playerState.background.set(!0);
        this.log = q.createSubLogger("VideoPlayer", this.playerState);
        /* @type {array} */ this.tNb = [];
        this.timecodes = [];
        this.ended = !1;
        this.queueWorker();
        this.playerState.state.addListener(function(F) {
            F.newValue === c.pacingTargetBufferStrategy.NORMAL && G.getState(c.cb.XYa, {
                movieId: C.R
            });
        });
        this.playerState.sessionContext.isSeeking && (this.hZ = u.internal_Tkc(this, this.playerState),
        this.playerState.addEventListener(c.PlayerEvents.iO, function(F) {
            F = F.position.segmentId;
            G.LFc !== F && (G.LFc = F,
            G.getState(c.cb.wWc, {
                segmentId: F
            }));
        }));
    }
    Object.defineProperty(b, "__esModule", {
        value: !0
    });
    b.internal_Jeb = void 0;
    p = a(36129);
    c = a(85001);
    g = a(5021);
    f = a(22365);
    e = a(87607);
    h = a(3887);
    k = a(26388);
    l = a(45146);
    d.prototype.isReady = function() {
        return this.playerState.state.value === c.pacingTargetBufferStrategy.NORMAL;
    }
    ;
    d.prototype.ICb = function() {
        return this.playerState.R;
    }
    ;
    d.prototype.cB = function() {
        return this.playerState.sourceTransactionId;
    }
    ;
    d.prototype.VCb = function() {
        var m;
        return null === (m = this.playerState.manifestRef) || void 0 === m ? void 0 : m.manifestContent.playbackContextId;
    }
    ;
    d.prototype.getConfiguration = function() {
        return this.playerState.containerElement;
    }
    ;
    d.prototype.isCurrentlyPlaying = function() {
        return this.playerState.mk.value;
    }
    ;
    d.prototype.qda = function() {
        return this.playerState.paused.value;
    }
    ;
    d.prototype.AYa = function() {
        return this.ended;
    }
    ;
    d.prototype.getUpdatingState = function() {
        var m;
        m = this.playerState.currentRequestedTime.value;
        return m ? {
            networkStalled: !!m.endedEvent,
            stalled: !!m.endedEvent,
            progress: m.progress,
            progressRollback: !!m.NRc
        } : null;
    }
    ;
    d.prototype.getError = function() {
        var m;
        m = this.playerState.lastError;
        return m ? m.cia() : null;
    }
    ;
    d.prototype.getPlaybackContainer = function() {
        var m;
        return null === (m = this.playerState.getPlaybackContainer()) || void 0 === m ? void 0 : m.VR;
    }
    ;
    d.prototype.livePlaybackManager = function() {
        return this.playerState.liveController;
    }
    ;
    d.prototype.XA = function() {
        var m;
        return this.livePlaybackManager().isLive ? null !== (m = this.livePlaybackManager().getUIAdjustedCurrentContentPts()) && void 0 !== m ? m : null : this.null();
    }
    ;
    d.prototype.null = function() {
        return this.playerState.mediaTime.value;
    }
    ;
    d.prototype.wBb = function() {
        var m;
        m = (this.XH() || 0) + this.playerState.getBufferedTime();
        return Math.min(m, this.YL());
    }
    ;
    d.prototype.XH = function() {
        var m;
        return this.livePlaybackManager().isLive ? null !== (m = this.livePlaybackManager().getUIAdjustedCurrentContentPts()) && void 0 !== m ? m : null : this.playerState.bM();
    }
    ;
    d.prototype.YL = function() {
        return this.livePlaybackManager().isLive ? this.livePlaybackManager().getLiveContentDuration() : this.playerState.segmentTimestamp.toUnit(g.MILLISECONDS);
    }
    ;
    d.prototype.PDb = function() {
        var m;
        m = this.playerState.containerDimensions.value;
        return m ? {
            width: m.width,
            height: m.height
        } : null;
    }
    ;
    d.prototype.fsa = function() {
        return this.playerState.fsa();
    }
    ;
    d.prototype.gBb = function(m) {
        var n, q;
        return (null === (n = this.playerState.manifestRef) || void 0 === n ? 0 : n.links.A0("generateScreenshots")) ? this.hBb.execute({
            log: this.log,
            links: this.playerState.manifestRef.links
        }, m) : (n = null === (q = this.playerState.sessionContext) || void 0 === q ? void 0 : q.qcPackageId) ? this.hBb.execute({
            log: this.log
        }, Object.assign({
            packageId: n
        }, m)) : Promise.reject("Unknown packageId");
    }
    ;
    d.prototype.OBb = function() {
        return this.fwc(this.playerState.adContentManager);
    }
    ;
    d.prototype.nBb = function() {
        var m;
        m = this;
        return this.playerState.supportedKeySystemList.map(function(n) {
            return m.mapTrackToExposedFormat(n);
        });
    }
    ;
    d.prototype.ACb = function() {
        var m;
        return this.bca(this.playerState.supportedKeySystemList, null === (m = this.playerState.manifestRef) || void 0 === m ? void 0 : m.manifestContent.wJb);
    }
    ;
    d.prototype.NWa = function(m) {
        var n;
        n = this;
        return this.getAudioTracksForMode(m).map(function(q) {
            return n.mapTrackToExposedFormat(q);
        });
    }
    ;
    d.prototype.TVa = function(m) {
        var n;
        return this.bca(this.getAudioTracksForMode(m), null === (n = this.playerState.manifestRef) || void 0 === n ? void 0 : n.manifestContent.xJb);
    }
    ;
    d.prototype.KYa = function() {
        return this.playerState.muted.value;
    }
    ;
    d.prototype.SDb = function() {
        return this.playerState.volume.value;
    }
    ;
    d.prototype.mBb = function() {
        var m, n;
        n = (null === (m = this.pendingTrackHydration) || void 0 === m ? void 0 : m.audioTrackSelection) || this.playerState.tracks.audioTrackSelection;
        return n && this.mapTrackToExposedFormat(n);
    }
    ;
    d.prototype.MWa = function() {
        var m, n;
        n = (null === (m = this.pendingTrackHydration) || void 0 === m ? void 0 : m.xJ) || this.playerState.tracks.textTrackSelection;
        return n && this.mapTrackToExposedFormat(n);
    }
    ;
    d.prototype.QFb = function() {
        return this.playerState.background.value;
    }
    ;
    d.prototype.tSb = function(m) {
        this.playerState.muted.set(!!m);
    }
    ;
    d.prototype.MSb = function(m) {
        this.playerState.volume.set(this.vLc(m));
    }
    ;
    d.prototype.internal_Zza = function(m) {
        this.playerState.playbackRate.set(m);
    }
    ;
    d.prototype.fetchData = function() {
        return this.playerState.playbackRate.value;
    }
    ;
    d.prototype.setAudioTrack = function(m) {
        var n, q, r, u, v;
        m = this.findTrackById(m);
        v = (null === (n = this.pendingTrackHydration) || void 0 === n ? void 0 : n.videoTrack) || this.playerState.tracks.videoTrack;
        n = (null === (q = this.pendingTrackHydration) || void 0 === q ? void 0 : q.xJ) || this.playerState.tracks.textTrackSelection;
        if (m) {
            q = [];
            v && q.push(v);
            n && q.push(n);
            q = this.playerState.tracks.EBb(m, q, null !== (u = null === (r = this.playerState.manifestRef) || void 0 === r ? void 0 : r.manifestContent.YIb) && void 0 !== u ? u : "v1");
            (0,
            l.assert)(q.audioTrackSelection && q.textTrackSelection && q.videoTrack, "All tracks should be defined for track switching");
            if (!Object.values(q).some(function(w) {
                return !1 === w.isMissing;
            }))
                return (this.log.info("Setting compatible tracks for audio track, \n                        video track: " + q.videoTrack.trackId + ", \n                        audio track: " + q.audioTrackSelection.trackId + ", \n                        text track: " + q.textTrackSelection.trackId),
                this.playerState.tracks.canResume(q),
                Promise.resolve());
            this.pendingTrackHydration = {
                Cc: q.audioTrackSelection,
                xJ: q.textTrackSelection,
                videoTrack: q.videoTrack
            };
            this.getState(c.cb.eventCallback);
            this.getState(c.cb.EC);
            q.textTrackSelection !== n && this.getState(c.cb.gq);
            return this.applyPendingTrackHydration();
        }
        this.log.error("Invalid setAudioTrack call");
        return Promise.reject(Error("Invalid setAudioTrack call"));
    }
    ;
    d.prototype.setTextTrack = function(m) {
        var n, q, r, u, v;
        v = (null === (n = this.pendingTrackHydration) || void 0 === n ? void 0 : n.audioTrackSelection) || this.playerState.tracks.audioTrackSelection;
        n = (null === (q = this.pendingTrackHydration) || void 0 === q ? void 0 : q.videoTrack) || this.playerState.tracks.videoTrack;
        if (null !== v)
            for (var w = v.sk, x = 0; x < w.length; x++)
                if ((q = w[x],
                this.mapTrackToExposedFormat(q) === m)) {
                    m = [];
                    n && m.push(n);
                    m.push(v);
                    v = this.playerState.tracks.EBb(q, m, null !== (u = null === (r = this.playerState.manifestRef) || void 0 === r ? void 0 : r.manifestContent.YIb) && void 0 !== u ? u : "v1");
                    (0,
                    l.assert)(v.audioTrackSelection && v.textTrackSelection && v.videoTrack, "All tracks should be defined for track switching");
                    if (!Object.values(v).some(function(y) {
                        return !1 === y.isMissing;
                    }))
                        return (this.log.info("Setting compatible tracks for text track, \n                                video track: " + v.videoTrack.trackId + ", \n                                audio track: " + v.audioTrackSelection.trackId + ", \n                                text track: " + v.textTrackSelection.trackId),
                        this.playerState.tracks.canResume(v),
                        this.playerState.currentViewableId && this.playerState.q3c(v.textTrackSelection),
                        Promise.resolve());
                    this.pendingTrackHydration = {
                        Cc: v.audioTrackSelection,
                        xJ: v.textTrackSelection,
                        videoTrack: v.videoTrack
                    };
                    this.getState(c.cb.gq);
                    return this.applyPendingTrackHydration();
                }
        this.log.error("Invalid setTextTrack call");
        return Promise.reject(Error("Invalid setTextTrack call"));
    }
    ;
    d.prototype.applyPendingTrackHydration = function() {
        var m, n;
        m = this;
        (0,
        l.assert)(this.pendingTrackHydration, "pendingTrackHydration tracks should be defined");
        n = this.pendingTrackHydration;
        return this.playerState.XBc(n.audioTrackSelection.trackId, n.xJ.trackId, n.videoTrack.trackId).then(function(q) {
            var r, u;
            r = q.audioTrackSelection;
            u = q.xJ;
            q = q.videoTrack;
            m.pendingTrackHydration = void 0;
            m.log.info("Setting hydrated tracks, \n                        video track: " + q.trackId + ", \n                        audio track: " + r.trackId + ", \n                        text track: " + u.trackId);
            m.playerState.tracks.canResume({
                Cc: r,
                textTrackSelection: u,
                videoTrack: q
            });
        }).catch(function(q) {
            q = m.eventBus.initializeModel(q);
            m.log.error(q);
            m.closing(m.viewableConfig(p.ea.MANIFEST, {
                Ya: p.EventTypeEnum.MANIFEST_HYDRATION_FAILURE,
                configFlag: q,
                T0: {
                    Lgd: n.audioTrackSelection.trackId,
                    ZBc: n.audioTrackSelection.languageCode,
                    Mgd: n.xJ.trackId,
                    $Bc: n.xJ.languageCode,
                    Ngd: n.videoTrack.trackId,
                    Ogd: n.videoTrack.languageCode
                }
            }));
            m.pendingTrackHydration = void 0;
        });
    }
    ;
    d.prototype.w5a = function(m) {
        this.playerState.background.set(m);
    }
    ;
    d.prototype.q4 = function() {
        this.playerState.q4();
    }
    ;
    d.prototype.qBa = function(m) {
        this.playerState.qBa(m);
    }
    ;
    d.prototype.getPlaybackSegment = function(m) {
        return this.playerState.getPlaybackSegment(m);
    }
    ;
    d.prototype.WCb = function() {
        return this.playerState.sessionContext;
    }
    ;
    d.prototype.$E = function() {
        this.playerState.$E();
    }
    ;
    d.prototype.initializeHandler = function(m) {
        this.playerState.initializeHandler(m);
    }
    ;
    d.prototype.xca = function(m, n, q) {
        return this.playerState.xca(m, n, q);
    }
    ;
    d.prototype.EOa = function(m, n) {
        this.playerState.addEventListener(m, n, void 0);
    }
    ;
    d.prototype.UPb = function(m, n) {
        this.playerState.removeEventListener(m, n);
    }
    ;
    d.prototype.addEventListener = function(m, n, q) {
        this.nextState.addListener(m, n, q);
    }
    ;
    d.prototype.removeEventListener = function(m, n) {
        this.nextState.removeListener(m, n);
    }
    ;
    d.prototype.CU = function() {}
    ;
    d.prototype.loading = function() {
        var m;
        m = this;
        this.loaded || (this.loaded = !0,
        this.playerState.loading(function(n, q) {
            try {
                m.getState(c.cb.rIb, void 0, !0);
                n.manifestRef && (n.manifestRef.manifestContent.watermarkInfo && m.getState(c.cb.I4c, n.manifestRef.manifestContent.watermarkInfo, !0),
                n.manifestRef.manifestContent.choiceMap && m.getState(c.cb.vWc, {
                    segmentMap: n.manifestRef.manifestContent.choiceMap
                }, !0),
                n.manifestRef.manifestContent.timecodeAnnotations && (m.timecodes = n.manifestRef.manifestContent.timecodeAnnotations,
                m.getState(c.cb.s7a, {
                    timecodes: m.timecodes
                }, !0)));
                q({
                    success: !0
                });
            } catch (r) {
                q({
                    Ya: p.EventTypeEnum.EXCEPTION,
                    configFlag: m.eventBus.initializeModel(r)
                });
            }
        }));
    }
    ;
    d.prototype.HDb = function() {
        return this.timecodes;
    }
    ;
    d.prototype.getChapters = function() {
        var m, n;
        return null !== (n = null === (m = this.playerState.streamingSession) || void 0 === m ? void 0 : m.getChapters(this.playerState.R)) && void 0 !== n ? n : [];
    }
    ;
    d.prototype.closing = function(m) {
        var n;
        n = this;
        this.promiseInstance || (this.promiseInstance = new Promise(function(q) {
            m ? n.playerState.tL(m, q) : n.playerState.closing(q);
        }
        ));
        return this.promiseInstance;
    }
    ;
    d.prototype.playing = function() {
        this.playerState.recordPlayDelay("uiCalledPlay");
        this.playerState.logBlobEvent ? this.playerState.fireEvent(c.PlayerEvents.internal_Fga) : (this.loading(),
        this.playerState.paused.value && (this.playerState.paused.set(!1),
        this.playerState.fireEvent(c.PlayerEvents.mXb)));
    }
    ;
    d.prototype.pause = function() {
        this.loading();
        this.playerState.paused.value || (this.playerState.paused.set(!0),
        this.playerState.fireEvent(c.PlayerEvents.G8a));
    }
    ;
    d.prototype.lNb = function() {
        this.loading();
        this.playerState.paused.value || this.playerState.paused.set(!0, {
            QB: !0
        });
    }
    ;
    d.prototype.seek = function(m, n, q, r) {
        n = void 0 === n ? c.streamState.SEEK : n;
        this.playerState.hR() && (this.livePlaybackManager().isLive && this.livePlaybackManager().isWithinUILiveEdgeThreshold(this.livePlaybackManager().revertUIAdjustedTime(m)) && !this.livePlaybackManager().isLiveEventEnded(!0) ? this.livePlaybackManager().seekToLiveEdge() : this.playerState.mediaSourceManager ? (this.livePlaybackManager().isLive && (m = this.livePlaybackManager().revertUIAdjustedTime(m)),
        this.playerState.mediaSourceManager.seek(m, n, q, r)) : (this.livePlaybackManager().isLive && (m = this.livePlaybackManager().getLiveBookmark(m).hashQuery),
        this.playerState.hashQuery = m));
    }
    ;
    d.prototype.playing = function(m) {
        return this.hZ ? (this.log.pauseTrace("Playing a segment", m),
        this.hZ.playing(m)) : Promise.resolve();
    }
    ;
    d.prototype.queueing = function(m) {
        return this.hZ ? (this.log.pauseTrace("Queueing a segment", m),
        this.hZ.queueing(m)) : Promise.resolve();
    }
    ;
    d.prototype.applyConfig = function(m, n) {
        return this.hZ ? (this.log.pauseTrace("Updating next segment weights", m, n),
        this.hZ.applyConfig(m, n)) : Promise.resolve();
    }
    ;
    d.prototype.getSubtitleConfiguration = function() {
        var m;
        m = this.playerState.subtitlePlayer.getSubtitleConfiguration();
        return {
            bounds: m.o$,
            margins: m.margins,
            size: m.size,
            visibility: m.visibility
        };
    }
    ;
    d.prototype.setTimedTextConfig = function(m) {
        var n, q, r;
        n = m.bounds;
        q = m.margins;
        r = m.size;
        m = m.visibility;
        this.playerState.textRenderer && (n && this.playerState.textRenderer.N5a(n),
        q && this.playerState.textRenderer.O5a(q),
        "boolean" === typeof m && this.playerState.textRenderer.P5a(m));
        this.playerState.subtitlePlayer && r && this.playerState.subtitlePlayer.bYc(r);
    }
    ;
    d.prototype.S5a = function(m) {
        this.playerState.transitionTime = m;
    }
    ;
    d.prototype.KDb = function(m) {
        return this.playerState.trickplayDownloader && this.playerState.trickplayDownloader.internal_Mwc(m) || null;
    }
    ;
    d.prototype.lBb = function() {
        return this.eventBus.mergeConfig({
            playerver: this.config.version,
            jssid: this.config.oFc,
            groupName: this.config.internal_Qwc(),
            xid: this.playerState.sourceTransactionId,
            pbi: this.playerState.index
        }, this.config.nPc, {
            prefix: "pi_"
        });
    }
    ;
    d.prototype.gFb = function(m) {
        this.playerState.fireError(p.ea.EXTERNAL, p.EventTypeEnum.UNKNOWN, m);
    }
    ;
    d.prototype.mIb = function(m, n, q, r) {
        if (!this.downloadReportInterval.isNonEmptyArray(m))
            throw Error("invalid url");
        this.tNb.push({
            url: m,
            name: n,
            internal_Edc: q,
            options: r
        });
        this.JOb();
    }
    ;
    d.prototype.CWa = function() {
        var m, n, q, r, u, v, w, x;
        m = {};
        n = this.playerState.contentPlaygraphPresent;
        try {
            if ((this.playerState.lastError && (m.errorCode = this.playerState.lastError.ErrorCode,
            m.errorType = n ? "endplay" : "startplay"),
            m.playdelay = (0,
            h.formatInteger)(this.playerState.x$()),
            m.xid = this.playerState.sourceTransactionId,
            this.playerState.manifestRef && this.downloadReportInterval.filterPredicate(this.playerState.manifestRef.manifestContent.qcPackageId) && (m.packageId = Number(this.playerState.manifestRef.manifestContent.qcPackageId)),
            m.auth = this.playerState.lvc(),
            n)) {
                m.totaltime = this.playerState.playDelayMetrics ? this.formatSeconds(this.playerState.playDelayMetrics.getElementByType("content")) : 0;
                m.abrdel = this.playerState.playDelayMetrics ? this.playerState.playDelayMetrics.getAbrDelay() : 0;
                q = this.playerState.mediaSourceManager;
                r = q ? q.vS() : null;
                this.downloadReportInterval.mapTransform(r) && (m.totdfr = r);
                r = q ? q.getCorruptedFrameCount() : null;
                this.downloadReportInterval.mapTransform(r) && (m.totcfr = r);
                u = q ? q.$wc() : null;
                u && (m.rbfrs_decoder = u.dqa,
                m.rbfrs_network = u.lwa);
                m.rbfrs_delay = this.playerState.playDelayMetrics ? this.playerState.playDelayMetrics.rYa : 0;
                m.init_vbr = this.playerState.internal_Lta;
                v = this.G0();
                this.downloadReportInterval.p_(v) && (m.pdltime = v);
                w = this.playerState.targetBuffer.value;
                x = w && w.stream;
                x && (m.vbr = x.bitrate,
                m.vdlid = x.downloadableStreamId);
                m.bufferedTime = this.playerState.getBufferedTime();
            }
        } catch (y) {
            this.log.error("error capturing session summary", y);
        }
        return m;
    }
    ;
    d.prototype.O_ = function(m) {
        this.playerState.sessionContext.sessionParams && (this.playerState.sessionContext.sessionParams.userEngageAction = 1);
        return this.downloadReportInterval.mapTransform(this.playerState.mediaTime.value) ? (m = Object.assign(Object.assign({}, this.ZB.create(this.playerState)), {
            action: m
        }),
        this.H$(e.$o.O_).execute({
            log: this.log,
            links: this.playerState.manifestRef.links
        }, m).then(function() {
            return {
                success: !0
            };
        }).catch(function(n) {
            return {
                success: !1,
                errorCode: n.code,
                errorSubCode: n.errorSubCode,
                errorExternalCode: n.errorExternalCode,
                errorData: n.data,
                errorDetails: n.details
            };
        })) : Promise.resolve({
            success: !1
        });
    }
    ;
    d.prototype.fwc = function(m) {
        return {
            register: m.register.bind(m),
            notifyUpdated: m.pLb.bind(m),
            getModel: m.getModel.bind(m),
            getGroups: m.getGroups.bind(m),
            addEventListener: m.addEventListener.bind(m),
            removeEventListener: m.removeEventListener.bind(m),
            getTime: m.getTime.bind(m)
        };
    }
    ;
    d.prototype.mapTrackToExposedFormat = function(m) {
        var n;
        n = m.r3a = m.r3a || ({
            trackId: m.trackId,
            bcp47: m.languageCode,
            displayName: m.displayName,
            trackType: m.language,
            rawTrackType: m.rawTrackType,
            channels: m.channels
        });
        this.QYa(m) && (n.isNative = m.isNative,
        n.surroundFormatLabel = m.internal_Gha);
        this.RYa(m) && (n.isNoneTrack = m.dr(),
        n.isForcedNarrative = m.checkMethod(),
        n.isImageBased = m.isImageBased);
        n.subType = m.EV;
        n.variant = m.variant;
        return n;
    }
    ;
    d.prototype.QYa = function(m) {
        return "undefined" !== typeof m.isNative;
    }
    ;
    d.prototype.RYa = function(m) {
        return "undefined" !== typeof m.dr && "undefined" !== typeof m.checkMethod;
    }
    ;
    d.prototype.findTrackById = function(m) {
        var n;
        n = this;
        return m && this.playerState.supportedKeySystemList.find(function(q) {
            return n.mapTrackToExposedFormat(q) === m;
        });
    }
    ;
    d.prototype.getAudioTracksForMode = function(m) {
        var n, q;
        m = this.findTrackById(m) || (null === (n = this.pendingTrackHydration) || void 0 === n ? void 0 : n.audioTrackSelection) || this.playerState.tracks.audioTrackSelection;
        return null !== (q = null === m || void 0 === m ? void 0 : m.sk) && void 0 !== q ? q : [];
    }
    ;
    d.prototype.bca = function(m, n) {
        var q;
        q = m.length - 1;
        if ("number" !== typeof n)
            return q;
        m = m.findIndex(function(r) {
            return r.rank > n;
        });
        return -1 === m ? q : m - 1;
    }
    ;
    d.prototype.vLc = function(m) {
        return 0 <= m ? 1 >= m ? m : 1 : 0;
    }
    ;
    d.prototype.formatSeconds = function(m) {
        return this.downloadReportInterval.mapTransform(m) ? (m / 1E3).toFixed(0) : "";
    }
    ;
    d.prototype.getState = function(m, n, q) {
        n = n || ({});
        n.target = this;
        this.nextState.emit(m, n, !q);
    }
    ;
    d.prototype.queueWorker = function() {
        var m;
        m = this;
        this.playerState.addEventListener(c.PlayerEvents.l7a, function() {
            m.getState(c.cb.currentTimeChanged);
        });
        this.playerState.containerDimensions.addListener(function() {
            m.getState(c.cb.P8a);
        });
        this.playerState.addEventListener(c.PlayerEvents.lWb, function() {
            m.getState(c.cb.kWb);
        });
        this.playerState.addEventListener(c.PlayerEvents.sea, function() {
            m.getState(c.cb.internal_Toa);
        });
        this.playerState.addEventListener(c.PlayerEvents.pt, function() {
            m.getState(c.cb.internal_Toa);
        });
        this.playerState.addEventListener(c.PlayerEvents.U0, function(n) {
            m.getState(c.cb.U0, {
                errorCode: n
            });
        });
        this.playerState.addEventListener(c.PlayerEvents.internal_Hoa, function() {
            m.getState(c.cb.xsb);
        });
        this.playerState.addEventListener(c.PlayerEvents.logBlobEvent, function(n) {
            m.getState(c.cb.internal_Ioa, n);
        });
        this.playerState.addEventListener(c.PlayerEvents.zVb, function() {
            m.getState(c.cb.internal_Doa);
            m.getState(c.cb.EC);
        });
        this.playerState.addEventListener(c.PlayerEvents.iIb, function(n) {
            var q, r;
            if (m.livePlaybackManager().isLive && m.currentSegment.R === n.J) {
                q = n.jitteredStart;
                if (void 0 !== q) {
                    r = "execute" === n.action ? "ending" : "prefetch";
                    m.timecodes = m.timecodes.filter(function(u) {
                        return u.type !== r;
                    });
                    m.timecodes.push({
                        type: r,
                        startOffsetMs: q,
                        endOffsetMs: q
                    });
                    m.getState(c.cb.s7a, {
                        timecodes: m.timecodes
                    }, !0);
                }
            }
        });
        this.playerState.addEventListener(c.PlayerEvents.jpa, function() {
            m.getState(c.cb.jpa, {
                chapters: m.getChapters()
            });
        });
        this.playerState.addEventListener(c.PlayerEvents.internal_Tfa, function() {
            m.getState(c.cb.internal_Tfa);
        });
        this.playerState.mk.addListener(function() {
            m.getState(c.cb.I2a);
        });
        this.playerState.paused.addListener(function() {
            m.getState(c.cb.mNb);
        });
        this.playerState.muted.addListener(function() {
            m.getState(c.cb.EKb);
        });
        this.playerState.volume.addListener(function() {
            m.getState(c.cb.HXb);
        });
        this.playerState.presentingState.addListener(function() {
            m.tWb();
        });
        this.playerState.state.addListener(function() {
            m.tWb();
        });
        this.playerState.currentRequestedTime.addListener(function(n) {
            m.pHc || m.playerState.state.value != c.pacingTargetBufferStrategy.NORMAL || n.newValue || (m.pHc = !0,
            m.getState(c.cb.loaded),
            setTimeout(function() {
                m.log.debug.bind(m.log, "summary ", m.CWa());
            }));
            m.getState(c.cb.kZ);
        });
        this.playerState.tracks.addListener([k.MediaType.V, k.MediaType.TEXT_MEDIA_TYPE], function(n) {
            n.bZ && (m.getState(c.cb.eventCallback),
            m.getState(c.cb.EC));
            n.M4 && m.getState(c.cb.gq);
        });
        this.playerState.addEventListener(c.PlayerEvents.EC, function() {
            m.getState(c.cb.EC);
        });
        this.playerState.addEventListener(c.PlayerEvents.lia, function() {
            m.getState(c.cb.lia);
        });
        this.playerState.state.addListener(function(n) {
            switch (n.newValue) {
            case c.pacingTargetBufferStrategy.NORMAL:
                m.getState(c.cb.RSa);
                m.getState(c.cb.P8a);
                m.getState(c.cb.internal_Doa);
                m.getState(c.cb.EC);
                m.getState(c.cb.qIb);
                m.JOb();
                m.N4c();
                break;
            case c.pacingTargetBufferStrategy.CLOSING:
                m.playerState.lastError && m.getState(c.cb.HFb, m.playerState.lastError);
                break;
            case c.pacingTargetBufferStrategy.CLOSED:
                (m.getState(c.cb.closed),
                m.nextState.cleanup());
            }
        });
        this.playerState.addEventListener(c.PlayerEvents.LIVE_EVENT_TIMES_CHANGED, function() {
            m.getState(c.cb.LIVE_EVENT_TIMES_CHANGED);
            m.getState(c.cb.currentTimeChanged);
            m.getState(c.cb.internal_Toa);
            m.getState(c.cb.RSa);
        });
    }
    ;
    d.prototype.N4c = function() {
        var m, n, q, r, u;
        m = this;
        this.playerState.subtitlePlayer.addEventListener("showsubtitle", function(v) {
            m.getState(c.cb.d6a, v, !0);
        });
        this.playerState.subtitlePlayer.addEventListener("removesubtitle", function(v) {
            m.getState(c.cb.W3a, v, !0);
        });
        r = this.playerState.getPlaybackContainer();
        r.onAdPresenting.addListener(function(v) {
            r.dTa && m.getState(c.cb.vbc, {
                state: v.newValue ? "start" : "stop"
            });
        });
        u = null === (n = this.playerState.streamingSession) || void 0 === n ? void 0 : n.getPlaybackContainer();
        n = null === u || void 0 === u ? void 0 : u.sr.events;
        null === n || void 0 === n ? void 0 : n.addListener("adPlaygraphUpdated", function() {
            m.getState(c.cb.prb);
        });
        null === (q = this.playerState.streamingSession) || void 0 === q ? void 0 : q.addEventListener("adMetadataUpdated", function() {
            m.getState(c.cb.prb);
        });
    }
    ;
    d.prototype.JOb = function() {
        if (this.playerState.state.value == c.pacingTargetBufferStrategy.NORMAL) {
            for (var m, n, q; n = this.tNb.shift(); )
                (m = this.playerState.subtitlePlayer.sOa(n.url, n.name, n.options),
                n.internal_Edc && (q = m));
            q && this.playerState.tracks.setTextTrack(q);
        }
    }
    ;
    d.prototype.tWb = function() {
        var m, n, q, r;
        n = this.ended;
        q = this.playerState.state.value == c.pacingTargetBufferStrategy.NORMAL && this.playerState.presentingState.value == c.setState.ENDED;
        r = !1;
        q && this.playerState.streamingSession && (r = null === (m = this.playerState.streamingSession) || void 0 === m ? void 0 : m.internal_Ayc());
        n === q || r || (this.ended = q,
        this.playerState.debugLog("Ended changed: " + q),
        (q || this.playerState.state.value === c.pacingTargetBufferStrategy.CLOSING) && this.getState(c.cb.internal_Syb));
    }
    ;
    d.prototype.G0 = function() {
        var m, n;
        try {
            m = /playercore.*js/;
            n = f.$C.getEntriesByType("resource").filter(function(q) {
                return null !== m.exec(q.name);
            });
            if (n && 0 < n.length)
                return JSON.stringify(Math.round(n[0].duration));
        } catch (q) {}
    }
    ;
    b.internal_Jeb = d;
}
