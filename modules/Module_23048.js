/**
 * @module Module_23048
 * @description Class module with ES module exports
 * @categories Media, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 23048
 * Deobfuscated size: 14130 chars
 * Functions: 28
 * Prototype definitions: 17
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 23048
{
                        var k, l, m, n, q, r;
                        function d(u, v, w, x) {
                            this.Qa = u;
                            this.vca = v;
                            this.$a = w;
                            this.profile = x;
                        }
                        function p() {}
                        function c() {}
                        function g() {}
                        function f() {}
                        function e() {}
                        function h() {}
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.SIa = b.qla = undefined;
                        t = a(22970);
                        k = a(22674);
                        l = a(30869);
                        m = a(5021);
                        n = a(4203);
                        q = a(81918);
                        a = a(71501);
                        h.prototype.encode = function(u) {
                            return {
                                downloadableId: u.ob,
                                duration: u.duration
                            };
                        }
                        ;
                        h.prototype.decode = function(u) {
                            return {
                                ob: u.downloadableId,
                                duration: u.duration
                            };
                        }
                        ;
                        e.prototype.encode = function(u) {
                            return {
                                totalDuration: u.kq,
                                totalAdDuration: u.FC,
                                totalOtherDuration: u.HC
                            };
                        }
                        ;
                        e.prototype.decode = function(u) {
                            return {
                                kq: u.totalDuration,
                                FC: u.totalAdDuration,
                                HC: u.totalOtherDuration
                            };
                        }
                        ;
                        f.prototype.encode = function(u) {
                            var v;
                            return {
                                total: u.total,
                                totalContentTime: u.UV,
                                totalAdDuration: u.FC,
                                totalCombinedDuration: u.U4,
                                totalOtherDuration: u.HC,
                                totalStartSlateDuration: u.XV,
                                totalLiveEdgeDuration: u.WV,
                                totalLiveEdgeAdDuration: u.VV,
                                audio: u.audio.map(new h().encode),
                                video: u.video.map(new h().encode),
                                text: u.text.map(new h().encode),
                                programs: Object.entries(null !== (v = u.Il) && undefined !== v ? v : {}).reduce(function(w, x) {
                                    var y;
                                    y = Fa(x);
                                    x = y.next().value;
                                    y = y.next().value;
                                    w[x] = new e().encode(y);
                                    return w;
                                }, {})
                            };
                        }
                        ;
                        f.prototype.decode = function(u) {
                            var v, w;
                            return {
                                total: u.total,
                                UV: null !== (v = u.totalContentTime) && undefined !== v ? v : u.total,
                                FC: u.totalAdDuration,
                                U4: u.totalCombinedDuration,
                                HC: u.totalOtherDuration,
                                XV: u.totalStartSlateDuration,
                                WV: u.totalLiveEdgeDuration,
                                VV: u.totalLiveEdgeAdDuration,
                                audio: u.audio.map(new h().decode),
                                video: u.video.map(new h().decode),
                                text: u.text.map(new h().decode),
                                Il: Object.entries(null !== (w = u.programs) && undefined !== w ? w : {}).reduce(function(x, y) {
                                    var A;
                                    A = Fa(y);
                                    y = A.next().value;
                                    A = A.next().value;
                                    x[y] = new e().decode(A);
                                    return x;
                                }, {})
                            };
                        }
                        ;
                        g.prototype.encode = function(u) {
                            var v;
                            v = new c();
                            return {
                                audio: v.encode(u.audio),
                                video: v.encode(u.video),
                                timedtext: v.encode(u.zJ),
                                mediaevents: v.encode(u.Lva)
                            };
                        }
                        ;
                        g.prototype.decode = function(u) {
                            var v;
                            v = new c();
                            return {
                                audio: v.decode(u.audio),
                                video: v.decode(u.video),
                                zJ: v.decode(u.timedtext),
                                Lva: v.decode(u.mediaevents)
                            };
                        }
                        ;
                        c.prototype.encode = function(u) {
                            return {
                                streamingCdnId: u.Bha,
                                presentingCdnId: u.pya
                            };
                        }
                        ;
                        c.prototype.decode = function(u) {
                            return {
                                Bha: u.streamingCdnId,
                                pya: u.presentingCdnId
                            };
                        }
                        ;
                        p.prototype.encode = function(u) {
                            return {
                                streamingType: u.rf,
                                href: u.href,
                                xid: u.Ia,
                                movieId: u.R,
                                programId: u.Xe,
                                position: u.position,
                                clientTime: u.sH,
                                sessionStartTime: u.al,
                                videoTrackId: u.eo,
                                audioTrackId: u.ew,
                                timedTextTrackId: u.Cz,
                                mediaId: u.Z1,
                                playTimes: new f().encode(u.XB),
                                trackId: u.trackId,
                                sessionId: u.sessionId,
                                appId: u.appId,
                                sessionParams: u.Dr,
                                profileId: u.o3,
                                cdnDownloadableInfos: u.C$ ? new g().encode(u.C$) : undefined
                            };
                        }
                        ;
                        p.prototype.decode = function(u) {
                            return {
                                rf: u.streamingType,
                                href: u.href,
                                Ia: u.xid,
                                R: u.movieId,
                                Xe: u.programId,
                                position: u.position,
                                sH: u.clientTime,
                                al: u.sessionStartTime,
                                eo: u.videoTrackId,
                                ew: u.audioTrackId,
                                Cz: u.timedTextTrackId,
                                Z1: u.mediaId,
                                XB: new f().decode(u.playTimes),
                                trackId: u.trackId,
                                sessionId: u.sessionId,
                                appId: u.appId,
                                Dr: u.sessionParams,
                                o3: u.profileId,
                                C$: u.cdnDownloadableInfos ? new g().decode(u.cdnDownloadableInfos) : undefined
                            };
                        }
                        ;
                        b.qla = p;
                        d.prototype.create = function(u) {
                            var v, w, x, y, A, z, B, C, D;
                            D = Object.assign(Object.assign({}, null !== (v = u.qb.Dr) && undefined !== v ? v : {}), {
                                uiVersion: this.vca().tw.uiVersion
                            });
                            v = null !== (w = u.Hc.Da ? u.Hc.Tsa() : u.Gs) && undefined !== w ? w : 0;
                            w = null === (x = u.fb) || undefined === x ? undefined : x.hWa();
                            return {
                                href: u.S && u.S.Kp ? u.S.Kp.A0("events").href : "",
                                rf: null !== (A = null === (y = u.S) || undefined === y ? undefined : y.Aa.rf) && undefined !== A ? A : "VOD",
                                Ia: u.Ia.toString(),
                                R: u.R,
                                Xe: u.Xe.value,
                                position: Math.floor(v),
                                sH: this.Qa.kJ.na(m.Ba),
                                al: u.kI ? u.kI.na(m.Ba) : -1,
                                eo: null === (z = u.oa.Mc) || undefined === z ? undefined : z.trackId,
                                ew: null === (B = u.oa.Cc) || undefined === B ? undefined : B.trackId,
                                Cz: null === (C = u.oa.yc) || undefined === C ? undefined : C.trackId,
                                Z1: undefined,
                                XB: this.jWa(u),
                                trackId: undefined !== u.co ? u.co.toString() : "",
                                sessionId: this.vca().sessionId || this.$a.id,
                                appId: this.vca().appId || this.$a.id,
                                Dr: D,
                                o3: this.profile,
                                C$: null === w || undefined === w ? undefined : w.C$
                            };
                        }
                        ;
                        d.prototype.load = function(u) {
                            return new p().decode(u);
                        }
                        ;
                        d.prototype.oWa = function(u) {
                            return u.map(function(v) {
                                return {
                                    ob: v.downloadableId,
                                    duration: v.duration
                                };
                            });
                        }
                        ;
                        d.prototype.jWa = function(u) {
                            return (u = u.Rp) ? (u = u.xyc(),
                            {
                                total: u.total,
                                UV: u.totalContentTime,
                                FC: u.totalAdDuration,
                                HC: u.totalOtherDuration,
                                U4: u.totalCombinedDuration,
                                WV: u.totalLiveEdgeDuration,
                                VV: u.totalLiveEdgeAdDuration,
                                XV: u.totalStartSlateDuration,
                                audio: this.oWa(u.audio),
                                video: this.oWa(u.video),
                                text: this.oWa(u.timedtext),
                                Il: this.sWa(u.programs)
                            }) : {
                                total: 0,
                                UV: 0,
                                FC: 0,
                                U4: 0,
                                HC: 0,
                                WV: 0,
                                VV: 0,
                                XV: 0,
                                video: [],
                                audio: [],
                                text: [],
                                Il: {}
                            };
                        }
                        ;
                        d.prototype.sWa = function(u) {
                            return Object.entries(u).reduce(function(v, w) {
                                var x;
                                x = Fa(w);
                                w = x.next().value;
                                x = x.next().value;
                                v[w] = {
                                    kq: x.totalDuration,
                                    FC: x.totalAdDuration,
                                    HC: x.totalOtherDuration
                                };
                                return v;
                            }, {});
                        }
                        ;
                        r = d;
                        b.SIa = r;
                        b.SIa = r = t.__decorate([(0,
                        k.aa)(), t.__param(0, (0,
                        k.v)(l.Yi)), t.__param(1, (0,
                        k.v)(n.Pc)), t.__param(2, (0,
                        k.v)(q.re)), t.__param(3, (0,
                        k.v)(a.SP))], r);
                    }
