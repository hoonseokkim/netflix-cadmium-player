/**
 * @module Module_73861
 * @description Class module with ES module exports
 * @categories Network, Media, ABR, Manifest, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 73861
 * Deobfuscated size: 14269 chars
 * Functions: 16
 * Prototype definitions: 14
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 73861
{
                        var d, p, c, g, f, e, h, k, l;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.djb = undefined;
                        t = a(22970);
                        d = a(91176);
                        p = a(66164);
                        c = a(26388);
                        g = t.__importDefault(a(14282));
                        f = g.default.pq;
                        e = g.default.aA;
                        h = a(65161);
                        k = a(69575);
                        l = t.__importDefault(a(40497));
                        a = (function() {
                            function m(n, q, r, u, v) {
                                this.me = n;
                                this.Js = q;
                                this.config = r;
                                this.console = u;
                                this.mediaType = v;
                            }
                            m.prototype.enabled = function() {
                                return !this.me.ma.fd;
                            }
                            ;
                            m.prototype.lLc = function(n) {
                                var q, r, u, v;
                                if (!n.Ee && 0 < n.la && (this.mediaType === h.l.U || this.mediaType === h.l.V)) {
                                    v = null === (q = n.SAb) || undefined === q ? undefined : q.G;
                                    undefined !== v && 0 < v && (null === (r = l.default.instance()) || undefined === r ? undefined : r.HOa(v),
                                    null === (u = l.default.instance()) || undefined === u ? undefined : u.uOa());
                                }
                                this.enabled() && (q = n.K,
                                q = {
                                    type: "updateStreamingPts",
                                    mediaType: n.mediaType,
                                    position: {
                                        M: q.id,
                                        offset: d.I.Ca(this.me.UQa).da(q.nb)
                                    },
                                    completePlayerStreamingTimestamp: d.I.Ca(this.me.L$),
                                    trackIndex: n.stream.track.SK,
                                    bufferLevelMs: this.me.ma.zn(n.mediaType)
                                },
                                (0,
                                k.Jq)(this.Js, q.type, q),
                                !n.Ee && 0 < n.la && (n = {
                                    type: "downloadComplete",
                                    mediaType: n.mediaType,
                                    bytes: n.la,
                                    durationMs: n.Ob.G
                                },
                                (0,
                                k.Jq)(this.Js, n.type, n)));
                            }
                            ;
                            m.prototype.oLb = function(n, q, r) {
                                var u, v, w;
                                if (this.enabled()) {
                                    v = this.mediaType;
                                    w = this.me.bq.Lk(v);
                                    w.oV(n);
                                    n.mediaType !== h.l.V && n.mediaType !== h.l.U || !this.config.Iga || (undefined === w.DZa ? w.FSb(p.platform.time.fa()) : p.platform.time.fa() - w.DZa > this.config.Iga && (n.bitrate !== w.DHb && (n.mediaType === h.l.U ? (p.platform.storage.set("vb", n.bitrate),
                                    w.ESb(n.bitrate)) : n.mediaType === h.l.V && (p.platform.storage.set("ab", n.bitrate),
                                    w.ESb(n.bitrate))),
                                    w.FSb(p.platform.time.fa())));
                                    w.Hua && w.Hua === n || (this.me.bq.gUb(q, w.Hua, n),
                                    w.JXc(n),
                                    q = 0,
                                    n.Db && n.Db.confidence && n.Db.sb && (q = n.Db.sb.Fa),
                                    r = {
                                        M: this.me.ma.K.id,
                                        offset: d.I.Ca(r).da(this.me.ma.K.nb)
                                    },
                                    n = {
                                        type: "streamSelected",
                                        nativetime: p.platform.time.fa(),
                                        mediaType: v,
                                        streamId: n.id,
                                        trackIndex: n.track.SK,
                                        streamIndex: n.It,
                                        bandwidth: q,
                                        longtermBw: q,
                                        rebuffer: 0,
                                        position: r,
                                        stream: n,
                                        manifest: null === (u = n.L) || undefined === u ? undefined : u.S
                                    },
                                    (0,
                                    k.Jq)(this.Js, n.type, n));
                                }
                            }
                            ;
                            m.prototype.H0a = function(n, q, r, u) {
                                this.enabled() && (n = {
                                    type: "ellaRelaySwitch",
                                    moffms: r || 0,
                                    relayNode: n,
                                    channelName: q,
                                    reason: u || "unknown"
                                },
                                (0,
                                k.Jq)(this.Js, n.type, n));
                            }
                            ;
                            m.prototype.WT = function(n, q, r, u) {
                                this.enabled() && (n = {
                                    type: "ellaRelayFailure",
                                    moffms: r || 0,
                                    relayNode: n,
                                    channelName: q,
                                    reason: u || "unknown"
                                },
                                (0,
                                k.Jq)(this.Js, n.type, n));
                            }
                            ;
                            m.prototype.G0a = function(n, q) {
                                this.enabled() && (n = {
                                    type: "ellaFailure",
                                    mediaType: n,
                                    reason: q
                                },
                                (0,
                                k.Jq)(this.Js, n.type, n));
                            }
                            ;
                            m.prototype.I0a = function(n, q, r, u, v) {
                                this.enabled() && (n = {
                                    type: "ellaSuccess",
                                    mediaType: n,
                                    receivedsegmentcnt: q,
                                    relayNode: r,
                                    channelName: u,
                                    networkstat: v
                                },
                                (0,
                                k.Jq)(this.Js, n.type, n));
                            }
                            ;
                            m.prototype.hLc = function(n, q, r) {
                                var u, v, w, x, y;
                                if (this.enabled()) {
                                    u = q.L;
                                    v = u.gj;
                                    w = this.me.bq.Lk(q.mediaType);
                                    x = u.YEc(q);
                                    y = x.gZa;
                                    x = x.ZEc;
                                    r && q.Hb && !w.PM ? (x = e.dD,
                                    q.pv = e.name[x],
                                    this.nLb(n, q.Hb, q.pv, q.location, q.bitrate),
                                    w.PM = q.Hb) : !r && q.Hb && q.Hb !== w.PM && (x = x ? undefined === w.PM ? e.dD : v.a4 === e.rIa ? e.$5b : e.WCa : e.Z5b,
                                    q.pv = e.name[x],
                                    this.nLb(n, q.Hb, q.pv, q.location, q.bitrate),
                                    w.PM = q.Hb);
                                    !w.y1 && q.location && (x = {
                                        type: "logdata",
                                        target: "startplay",
                                        fields: {}
                                    },
                                    this.mediaType === f.V ? x.fields.alocid = q.location : this.mediaType === f.U && (x.fields.locid = q.location),
                                    (0,
                                    k.Jq)(this.Js, x.type, x));
                                    r && q.location && !w.y1 ? (x = e.dD,
                                    q.pv = e.name[x],
                                    this.kLb(n, q.location, q.b_a, q.Hb, q.Zga, q.pv, q.iF, u.S),
                                    w.y1 = q.location) : !r && q.location && q.location !== w.y1 && (x = y ? undefined === w.y1 ? e.dD : v.a4 === e.rIa ? e.h2b : e.WCa : e.g2b,
                                    q.pv = e.name[x],
                                    this.kLb(n, q.location, q.b_a, q.Hb, q.Zga, q.pv, q.iF, u.S),
                                    q.iF = undefined,
                                    w.y1 = q.location);
                                    this.config.YI || (q.vHb = q.location,
                                    q.BHb = q.Hb);
                                }
                            }
                            ;
                            m.prototype.Kwa = function(n) {
                                n = {
                                    type: "requestsPruned",
                                    requests: n
                                };
                                (0,
                                k.Jq)(this.Js, n.type, n);
                            }
                            ;
                            m.prototype.nLb = function(n, q, r, u, v) {
                                var w, x;
                                if (this.enabled())
                                    if (this.mediaType === f.Ea)
                                        this.console.warn("notifyServerSwitch ignored for MediaType.TEXT");
                                    else {
                                        w = c.DT[this.mediaType];
                                        x = l.default.instance().get();
                                        n = {
                                            type: "serverSwitch",
                                            segmentId: n,
                                            mediatype: w,
                                            server: q,
                                            reason: r,
                                            location: u,
                                            bitrate: v,
                                            confidence: x.confidence
                                        };
                                        x.confidence && (n.throughput = x.sb.Fa);
                                        x = this.me.bq.Lk(this.mediaType).PM;
                                        undefined !== x && (n.oldserver = x);
                                        (0,
                                        k.Jq)(this.Js, n.type, n);
                                    }
                            }
                            ;
                            m.prototype.kLb = function(n, q, r, u, v, w, x, y) {
                                this.enabled() && (this.mediaType === f.Ea ? this.console.warn("notifyLocationSelected ignored for MediaType.TEXT") : (n = {
                                    type: "locationSelected",
                                    segmentId: n,
                                    mediatype: c.DT[this.mediaType],
                                    location: q,
                                    locationlv: r,
                                    serverid: u,
                                    servername: v,
                                    selreason: w,
                                    seldetail: x,
                                    manifest: y
                                },
                                (0,
                                k.Jq)(this.Js, "locationSelected", n)));
                            }
                            ;
                            m.prototype.v9b = function(n, q) {
                                this.enabled() && (n = {
                                    type: "lastSegmentPts",
                                    segmentId: n.id,
                                    pts: Math.floor(q)
                                },
                                (0,
                                k.Jq)(this.Js, n.type, n));
                            }
                            ;
                            m.prototype.wUa = function(n) {
                                (0,
                                k.Jq)(this.Js, "transportReport", n);
                            }
                            ;
                            m.prototype.iuc = function(n) {
                                this.enabled() && (0,
                                k.Jq)(this.Js, "mediaRequestComplete", n);
                            }
                            ;
                            return m;
                        }
                        )();
                        b.djb = a;
                    }
