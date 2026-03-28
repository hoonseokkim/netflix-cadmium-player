/**
 * Netflix Cadmium Playercore - Module 75462
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: sfb
 * Dependencies: 22970, 60028, 65161, 66164, 90745, 91176
 * Purpose: Network/HTTP, Manifest handling, Audio handling, Video handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_60028 from './Module_60028.js';
// import dep_65161 from './Module_65161.js';
// import dep_66164 from './Module_66164.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 75462
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;

d = a(22970);
p = a(90745);
c = a(91176);
g = a(66164);
f = a(65161);
e = a(60028);
t = (function() {
    class h {
    constructor(k, l, m, n, q, r) {
        this.Z = k;
        this.jg = l;
        this.Eh = n;
        this.Wi = q;
        this.FB = "liveadbreak";
        this.GD = c.I.uh;
        this.events = new p.EventEmitter();
        this.F$ = e.Z7.gma;
        this.aoa = [];
        this.xD = new Map();
        this.console = (0,
        c.Nf)(g.platform, r, "LiveAdBreakGenerationReporter");
        m.addListener("adBreakEvent", this.ULc.bind(this));
        m.addListener("adEvent", this.T0a.bind(this));
        k.events.addListener("streamSelected", this.fNc.bind(this));
        k.events.addListener("locationSelected", this.xMc.bind(this));
    }
    fNc(k) {
        var l, m;
        l = Number(k.manifest.R);
        m = {};
        this.xD.has(l) && (m = this.xD.get(l));
        switch (k.mediaType) {
        case f.l.V:
            m.K9 || (m.K9 = new Set());
            m.K9.add(Number(k.streamId));
            break;
        case f.l.U:
            (m.kW || (m.kW = new Set()),
            m.kW.add(Number(k.streamId)));
        }
        this.xD.set(l, m);
        false;
    }
    xMc(k) {
        var l, m;
        l = this.Wi.pS(k.M);
        if (l) {
            false;
            m = l.M2a;
            if (!m.BM && (l = l.xf.yb[m.WK])) {
                l = l.id;
                m = {
                    M: k.segmentId
                };
                this.xD.has(l) && (m = this.xD.get(l),
                m.M = k.segmentId);
                switch (k.Zid) {
                case "audio":
                    undefined === m.uAb && (m.uAb = k.serverid);
                    break;
                case "video":
                    undefined === m.DAb && (m.DAb = k.serverid);
                }
                this.xD.set(l, m);
                false;
            }
        }
    }
    T0a(k) {
        var l, m, n, q, r, u, v;
        if ("adStart" === k.event) {
            m = Number(k.S.R);
            n = this.xD.get(m);
            if (n && n.M) {
                q = 0;
                r = 0;
                u = 0;
                v = 0;
                this.Z.bb.yn(n.M).forEach(function(w) {
                    var x, y, A, z;
                    w = w.sS();
                    q += null !== (x = w.MQ) && undefined !== x ? x : 0;
                    r += null !== (y = w.jW) && undefined !== y ? y : 0;
                    u += null !== (A = w.TK) && undefined !== A ? A : 0;
                    v += null !== (z = w.PO) && undefined !== z ? z : 0;
                });
                n.MQ = q;
                n.jW = r;
                n.TK = u;
                n.PO = v;
                this.xD.set(m, n);
                false;
            }
        } else if ("adComplete" === k.event || "adStop" === k.event) {
            m = Number(k.S.R);
            (n = this.xD.get(m)) ? this.xD.delete(m) : false;
            m = this.Z.player;
            k = {
                liveAdInsertionType: k.eu,
                auxMid: k.S.R,
                duration: k.XB.total,
                auxSoffms: g.platform.time.fa() - m.al,
                auxMoffms: k.F2a.G,
                auxPlaybackcontextid: k.S.de,
                pbcid: null === (l = k.S.FA) || undefined === l ? undefined : l.Sf,
                firstAudioCdnId: null === n || undefined === n ? undefined : n.uAb,
                firstVideoCdnId: null === n || undefined === n ? undefined : n.DAb,
                abuflmsec: null === n || undefined === n ? undefined : n.MQ,
                vbuflmsec: null === n || undefined === n ? undefined : n.jW,
                abuflbytes: null === n || undefined === n ? undefined : n.TK,
                vbuflbytes: null === n || undefined === n ? undefined : n.PO
            };
            if (null === n || undefined === n ? 0 : n.K9)
                k.adlid = d.__spreadArray([], d.__read(n.K9), false);
            if (null === n || undefined === n ? 0 : n.kW)
                k.vdlid = d.__spreadArray([], d.__read(n.kW), false);
            this.aoa.push(k);
            false;
        }
    }
    ULc(k) {
        var l, m;
        if ("adBreakComplete" === k.event || "adBreakStop" === k.event) {
            m = this.jg.get(k.pXb);
            m && m.Ab && ((m = this.Eh.Vuc(m.J, k.Wv)) ? (this.Yu = {
                adBreakTriggerId: k.hb,
                adBreakLocationMs: k.Wv,
                wasPrefetched: "daiPrefetch" === m.source,
                wasHydrated: "hydration" === m.source,
                lastEvent: k.event,
                isAutoskip: m.qo,
                plannedAdBreakDuration: m.yb.reduce(function(n, q) {
                    return n.add(q.endTime.da(q.startTime));
                }, c.I.ia).G,
                adBreakDurationSCTE: null === (l = m.Zk) || undefined === l ? undefined : l.G,
                scteCancellationTriggered: m.L4,
                fallbackAuxMidType: "content",
                plannedAdCount: m.yb.length
            },
            k.vn && (this.Yu.embeddedReason = k.vn),
            0 < this.aoa.length && (this.Yu.adsRendered = this.aoa,
            this.aoa = []),
            false,
            this.events.emit("collectionRequested")) : this.console.warn("Missing adBreakData for impression event", {
                graphPosition: k.ii,
                adBreakLocationMs: k.Wv
            }));
        }
    }
    ef() {
        var k;
        if (this.Yu) {
            k = this.Yu;
            this.Yu = undefined;
            return {
                qO: true,
                event: d.__assign({
                    type: "logblob",
                    FB: "liveadbreak"
                }, k)
            };
        }
        return {
            qO: false
        };
    }
}
return h;
}
)();
export const sfb = t;

// Detected exports: sfb
