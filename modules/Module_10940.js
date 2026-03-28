/**
 * @module Module_10940
 * @description Class module with ES module exports
 * @categories Network, Manifest, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 10940
 * Deobfuscated size: 14527 chars
 * Functions: 13
 * Prototype definitions: 9
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 10940
{
                        var d, p, c, g, f;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.tfb = undefined;
                        d = a(22970);
                        p = a(90745);
                        c = a(91176);
                        g = a(95407);
                        f = a(60028);
                        t = (function() {
                            function e(h, k) {
                                this.Z = h;
                                this.FB = "liveadbreakprep";
                                this.GD = c.I.uh;
                                this.events = new p.EventEmitter();
                                this.F$ = f.Z7.gma;
                                k.addListener("adBreakHydrated", this.Twa.bind(this));
                                k.addListener("adBreakHydrationFailed", this.HLb.bind(this));
                                k.addListener("adBreakHydrationSkipped", this.HLb.bind(this));
                                h.events.addListener("branchViewableReceived", this.dMc.bind(this));
                                h.events.addListener("branchViewableFailed", this.cMc.bind(this));
                            }
                            e.prototype.sac = function(h) {
                                h.addListener("daiPrefetchComplete", this.iMc.bind(this));
                                h.addListener("daiPrefetchFailed", this.jMc.bind(this));
                            }
                            ;
                            e.prototype.K0 = function(h, k) {
                                var l, m;
                                m = this.Z.player.al;
                                return {
                                    requestTime: (null === k || undefined === k ? 0 : k.jC) ? null === (l = h.Ic) || undefined === l ? undefined : l.q2a(k.jC) : undefined,
                                    requestSoffms: (null === k || undefined === k ? 0 : k.jC) ? k.jC - m : undefined,
                                    responseSoffms: (null === k || undefined === k ? 0 : k.mC) ? k.mC - m : undefined
                                };
                            }
                            ;
                            e.prototype.dMc = function(h) {
                                var k, l, m, n, q, r, u, v, w, x;
                                if (h.adc && h.L.jk && h.L.jk.Ab && (null === (l = null === (k = h.L.jk.S) || undefined === k ? undefined : k.wd) || undefined === l ? 0 : l.Uj)) {
                                    k = h.q4a;
                                    r = h.Ow;
                                    l = h.K;
                                    l = null === (n = null === (m = this.Z.Dc) || undefined === m ? undefined : m.Wi) || undefined === n ? undefined : n.pS(l.id);
                                    l = (null === l || undefined === l ? undefined : l.xf) || ({});
                                    m = l.hb;
                                    n = l.qo;
                                    l = l.kj;
                                    u = r || ({});
                                    r = u.Xia;
                                    v = u.TQ;
                                    w = u.K4;
                                    x = u.xC;
                                    u = u.GF;
                                    this.Yu = d.__assign(d.__assign({
                                        prep: "auxManifest",
                                        auxMid: h.L.J.toString(),
                                        auxPlaybackcontextid: null === (q = h.L.S) || undefined === q ? undefined : q.de
                                    }, this.K0(h.L.jk, k)), {
                                        windowDurationMs: r,
                                        anchorTime: v,
                                        targetOffsetMs: w,
                                        targetTime: x,
                                        timeRandomizationWasCalculated: u,
                                        adBreakTriggerId: m,
                                        autoskip: n,
                                        adBreakLocationMs: l
                                    });
                                    this.events.emit("collectionRequested");
                                }
                            }
                            ;
                            e.prototype.cMc = function(h) {
                                var k, l, m, n, q, r, u, v, w, x, y;
                                if (h.jk && h.jk.Ab && (null === (l = null === (k = h.jk.S) || undefined === k ? undefined : k.wd) || undefined === l ? 0 : l.Uj)) {
                                    k = h.q4a;
                                    r = h.Ow;
                                    u = h.K;
                                    l = h.error;
                                    u = null === (n = null === (m = this.Z.Dc) || undefined === m ? undefined : m.Wi) || undefined === n ? undefined : n.pS(u.id);
                                    u = (null === u || undefined === u ? undefined : u.xf) || ({});
                                    m = u.hb;
                                    n = u.qo;
                                    u = u.kj;
                                    v = r || ({});
                                    r = v.Xia;
                                    w = v.TQ;
                                    x = v.K4;
                                    y = v.xC;
                                    v = v.GF;
                                    l = null !== (q = g.bD.Sba(l)) && undefined !== q ? q : "failed";
                                    this.Yu = d.__assign(d.__assign({
                                        prep: "auxManifest",
                                        auxMid: h.J.toString()
                                    }, this.K0(h.jk, k)), {
                                        windowDurationMs: r,
                                        anchorTime: w,
                                        targetOffsetMs: x,
                                        targetTime: y,
                                        timeRandomizationWasCalculated: v,
                                        adBreakTriggerId: m,
                                        autoskip: n,
                                        adBreakLocationMs: u,
                                        errorCode: l
                                    });
                                    this.events.emit("collectionRequested");
                                }
                            }
                            ;
                            e.prototype.Twa = function(h) {
                                var k, l, m, n, q, r, u, v, w, x;
                                if (h.jn.Ab && null !== (k = h.jn.S.wd) && undefined !== k && k.Uj) {
                                    k = h.hb;
                                    l = h.B9;
                                    m = h.Ow || ({});
                                    n = m.Lxb;
                                    q = m.Mxb;
                                    r = m.Xia;
                                    u = m.K4;
                                    v = m.xC;
                                    m = m.GF;
                                    w = l.qo;
                                    l = l.yb;
                                    x = h.IO.kj;
                                    this.Yu = d.__assign(d.__assign({
                                        prep: "hydration"
                                    }, this.K0(h.jn, h.AJ)), {
                                        adBreakTriggerId: k,
                                        autoskip: w,
                                        adBreakLocationMs: x,
                                        adBreakDurationPlanned: null === l || undefined === l ? undefined : l.reduce(function(y, A) {
                                            return y + A.eb - A.Va;
                                        }, 0),
                                        distanceFromLiveEdgeMs: n,
                                        distanceToAdBreakMs: q,
                                        windowDurationMs: r,
                                        targetOffsetMs: u,
                                        targetTime: v,
                                        timeRandomizationWasCalculated: m
                                    });
                                    this.events.emit("collectionRequested");
                                }
                            }
                            ;
                            e.prototype.HLb = function(h) {
                                var k, l, m, n, q, r, u, v, w, x;
                                if (h.jn.Ab && null !== (k = h.jn.S.wd) && undefined !== k && k.Uj) {
                                    k = h.AJ;
                                    l = h.hb;
                                    m = h.Ow || ({});
                                    n = m.Lxb;
                                    q = m.Mxb;
                                    r = m.Xia;
                                    u = m.K4;
                                    v = m.xC;
                                    m = m.GF;
                                    w = h.IO.kj;
                                    x = h.errorCode;
                                    x || (x = "adBreakHydrationSkipped" === h.type ? "skipped" : "failed");
                                    this.Yu = d.__assign(d.__assign({
                                        prep: "hydration"
                                    }, this.K0(h.jn, k)), {
                                        adBreakTriggerId: l,
                                        autoskip: undefined,
                                        adBreakLocationMs: w,
                                        errorCode: x,
                                        distanceFromLiveEdgeMs: n,
                                        distanceToAdBreakMs: q,
                                        windowDurationMs: r,
                                        targetOffsetMs: u,
                                        targetTime: v,
                                        timeRandomizationWasCalculated: m
                                    });
                                    this.events.emit("collectionRequested");
                                }
                            }
                            ;
                            e.prototype.iMc = function(h) {
                                var k, l, m;
                                if (h.L.Ab) {
                                    k = h.AJ;
                                    l = h.Ow;
                                    m = Object.keys(h.lOb.A9).filter(function(n) {
                                        return "UPSERT" === h.lOb.A9[n].action;
                                    });
                                    this.Yu = d.__assign(d.__assign({
                                        prep: "prefetch"
                                    }, this.K0(h.L, k)), {
                                        adBreakTriggerIds: m,
                                        windowOffsetMs: l.SBa,
                                        windowDurationMs: l.cYb,
                                        presentationOffsetMs: l.nya,
                                        anchorSource: l.Brb,
                                        anchorTime: l.TQ.G,
                                        targetOffsetMs: l.xC - l.SBa,
                                        targetTime: l.TQ.G + l.nya + l.xC,
                                        timeRandomizationWasCalculated: l.GF
                                    });
                                    this.events.emit("collectionRequested");
                                }
                            }
                            ;
                            e.prototype.jMc = function(h) {
                                var k, l, m, n;
                                if (h.L.Ab) {
                                    l = h.AJ;
                                    m = h.Ow;
                                    n = null !== (k = h.errorCode) && undefined !== k ? k : "failed";
                                    this.Yu = d.__assign(d.__assign({
                                        prep: "prefetch"
                                    }, this.K0(h.L, l)), {
                                        adBreakTriggerIds: undefined,
                                        windowOffsetMs: m.SBa,
                                        windowDurationMs: m.cYb,
                                        presentationOffsetMs: m.nya,
                                        anchorSource: m.Brb,
                                        anchorTime: m.TQ.G,
                                        targetOffsetMs: m.xC - m.SBa,
                                        targetTime: m.TQ.G + m.nya + m.xC,
                                        timeRandomizationWasCalculated: m.GF,
                                        errorCode: n
                                    });
                                    this.events.emit("collectionRequested");
                                }
                            }
                            ;
                            e.prototype.ef = function() {
                                var h;
                                if (this.Yu) {
                                    h = this.Yu;
                                    this.Yu = undefined;
                                    return {
                                        qO: true,
                                        event: d.__assign({
                                            type: "logblob",
                                            FB: "liveadbreakprep"
                                        }, h)
                                    };
                                }
                                return {
                                    qO: false
                                };
                            }
                            ;
                            return e;
                        }
                        )();
                        b.tfb = t;
                    }
