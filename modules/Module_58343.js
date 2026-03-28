/**
 * @module Module_58343
 * @description Class module with ES module exports
 * @categories DRM, Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 58343
 * Deobfuscated size: 15631 chars
 * Functions: 81
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 58343
{
                        var p, c;
                        function d(g, f) {
                            var e;
                            e = this;
                            this.lk = g;
                            this.Vh = f;
                            this.addEventListener = function(h, k, l) {
                                return e.Vh.addListener(h, e.Zwb(h, k), l);
                            }
                            ;
                            this.removeEventListener = function(h, k) {
                                return e.Vh.removeListener(h, e.Zwb(h, k));
                            }
                            ;
                            this.getReady = function() {
                                return e.Vh.Ws();
                            }
                            ;
                            this.getXid = function() {
                                return e.Rb().cB();
                            }
                            ;
                            this.getPlaybackContextId = function() {
                                return e.Rb().VCb();
                            }
                            ;
                            this.getMovieId = function() {
                                return e.Rb().ICb();
                            }
                            ;
                            this.getElement = function() {
                                return e.Vh.Vq();
                            }
                            ;
                            this.isPlaying = function() {
                                return e.Rb().Ky();
                            }
                            ;
                            this.isPaused = function() {
                                return e.Rb().qda();
                            }
                            ;
                            this.isMuted = function() {
                                return e.Rb().KYa();
                            }
                            ;
                            this.isReady = function() {
                                return e.Rb().Ws();
                            }
                            ;
                            this.isBackground = function() {
                                return e.Rb().QFb();
                            }
                            ;
                            this.setBackground = function(h) {
                                return e.Rb().w5a(h);
                            }
                            ;
                            this.startInactivityMonitor = function() {
                                return e.Rb().q4();
                            }
                            ;
                            this.setTransitionTime = function(h) {
                                return e.Rb().S5a(h);
                            }
                            ;
                            this.getDiagnostics = function() {
                                return e.Rb().OBb();
                            }
                            ;
                            this.getTextTrackList = function(h) {
                                return e.Rb().NWa(h);
                            }
                            ;
                            this.getMaxRecommendedTextIndex = function(h) {
                                return e.Rb().TVa(h);
                            }
                            ;
                            this.getTextTrack = function() {
                                return e.Rb().MWa();
                            }
                            ;
                            this.setTextTrack = function(h) {
                                return e.Rb().xz(h);
                            }
                            ;
                            this.getVolume = function() {
                                return e.Rb().SDb();
                            }
                            ;
                            this.isEnded = function() {
                                return e.Rb().AYa();
                            }
                            ;
                            this.getBusy = function() {
                                return e.Rb().ak();
                            }
                            ;
                            this.getError = function() {
                                return e.Rb().getError();
                            }
                            ;
                            this.getCurrentTime = function() {
                                return e.Rb().XA();
                            }
                            ;
                            this.getAdManager = function() {
                                return e.Rb().lm();
                            }
                            ;
                            this.getLivePlaybackManager = function() {
                                var h;
                                h = e.Rb().Do();
                                (0,
                                c.ta)(h, "Unexpected call to getLivePlaybackManager()");
                                if (h.Da && !h.FYc())
                                    return {
                                        seekToLiveEdge: function() {
                                            return h.W3();
                                        },
                                        isAtLiveEdge: function() {
                                            return h.Fy();
                                        },
                                        getLiveEventState: function() {
                                            return h.aM();
                                        },
                                        isLiveEventEnded: function() {
                                            return h.ZS();
                                        }
                                    };
                            }
                            ;
                            this.getBufferedTime = function() {
                                return e.Rb().wBb();
                            }
                            ;
                            this.getSegmentTime = function() {
                                return e.Rb().XH();
                            }
                            ;
                            this.getDuration = function() {
                                return e.Rb().YL();
                            }
                            ;
                            this.getVideoSize = function() {
                                return e.Rb().PDb();
                            }
                            ;
                            this.getAudioTrackList = function() {
                                return e.Rb().nBb();
                            }
                            ;
                            this.getMaxRecommendedAudioIndex = function() {
                                return e.Rb().ACb();
                            }
                            ;
                            this.getAudioTrack = function() {
                                return e.Rb().mBb();
                            }
                            ;
                            this.getTimedTextTrackList = function(h) {
                                return e.Rb().NWa(h);
                            }
                            ;
                            this.getMaxRecommendedTimedTextIndex = function(h) {
                                return e.Rb().TVa(h);
                            }
                            ;
                            this.getTimedTextTrack = function() {
                                return e.Rb().MWa();
                            }
                            ;
                            this.getAdditionalLogInfo = function() {
                                return e.Rb().lBb();
                            }
                            ;
                            this.getTrickPlayFrame = function(h) {
                                return e.Rb().KDb(h);
                            }
                            ;
                            this.getSessionSummary = function() {
                                return e.Rb().CWa();
                            }
                            ;
                            this.getTimedTextSettings = function() {
                                return e.Rb().sca();
                            }
                            ;
                            this.setMuted = function(h) {
                                return e.Rb().tSb(h);
                            }
                            ;
                            this.setVolume = function(h) {
                                return e.Rb().MSb(h);
                            }
                            ;
                            this.getPlaybackRate = function() {
                                return e.Rb().F0();
                            }
                            ;
                            this.getTimeCodes = function() {
                                return e.Rb().HDb();
                            }
                            ;
                            this.getChapters = function() {
                                return e.Rb().gE();
                            }
                            ;
                            this.setPlaybackRate = function(h) {
                                return e.Rb().Zza(h);
                            }
                            ;
                            this.setAudioTrack = function(h) {
                                return e.Rb().mO(h);
                            }
                            ;
                            this.setTimedTextTrack = function(h) {
                                return e.Rb().xz(h);
                            }
                            ;
                            this.setTimedTextSettings = function(h) {
                                return e.Rb().i4(h);
                            }
                            ;
                            this.prepare = function() {
                                return e.Rb().CU();
                            }
                            ;
                            this.load = function() {
                                return e.Rb().load();
                            }
                            ;
                            this.close = function(h) {
                                return e.Prb(e.Vh.close(), h);
                            }
                            ;
                            this.play = function() {
                                return e.Rb().play();
                            }
                            ;
                            this.pause = function() {
                                return e.Rb().pause();
                            }
                            ;
                            this.seek = function() {
                                throw Error("Seek by graph position has not been implemented");
                            }
                            ;
                            this.transition = function() {
                                throw Error("Transition segment has not been implemented");
                            }
                            ;
                            this.engage = function(h, k) {
                                return e.Prb(e.Rb().O_(h), k);
                            }
                            ;
                            this.induceError = function(h) {
                                return e.Rb().gFb(h);
                            }
                            ;
                            this.loadCustomTimedTextTrack = function(h, k, l, m) {
                                return e.Rb().mIb(h, k, l, m);
                            }
                            ;
                            this.tryRecoverFromStall = function() {}
                            ;
                            this.getCropAspectRatio = function() {
                                return e.Rb().fsa();
                            }
                            ;
                            this.generateScreenshots = function(h) {
                                return e.Rb().gBb(h);
                            }
                            ;
                            this.getPlaygraphManager = function() {
                                return {
                                    getPlaygraphId: function() {
                                        return e.Vh.lWa();
                                    },
                                    getCurrentSegmentId: function() {
                                        return e.Vh.KBb();
                                    },
                                    getPlaygraphMap: function() {
                                        return e.Vh.CS();
                                    },
                                    updatePlaygraphMap: function(h) {
                                        return e.Vh.MO(h);
                                    },
                                    getSegmentOffset: function() {
                                        return e.Vh.rDb();
                                    },
                                    getPlaygraphSessionOffset: function() {
                                        return e.Vh.Cyc();
                                    },
                                    getPlaygraphDuration: function() {
                                        return e.Vh.Byc();
                                    }
                                };
                            }
                            ;
                            this.DTa = new Map();
                            this.log = (0,
                            p.An)("VideoPlayer");
                            Object.defineProperty(this, "diagnostics", {
                                get: this.getDiagnostics
                            });
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.tma = undefined;
                        p = a(31276);
                        a(24550);
                        c = a(45146);
                        d.prototype.Rb = function() {
                            return this.Vh.Rb();
                        }
                        ;
                        d.prototype.Zwb = function(g, f) {
                            var e;
                            this.DTa.has(g) || this.DTa.set(g, new Map());
                            e = this.DTa.get(g);
                            e.has(f) || e.set(f, this.snc(g, f));
                            return e.get(f);
                        }
                        ;
                        d.prototype.snc = function(g, f) {
                            var e;
                            e = this;
                            return function(h) {
                                return f(Object.assign({}, h, {
                                    type: g,
                                    target: e
                                }));
                            }
                            ;
                        }
                        ;
                        d.prototype.Prb = function(g, f) {
                            return f ? g.then(f, f) : g;
                        }
                        ;
                        b.tma = d;
                    }
