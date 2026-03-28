/**
 * Netflix Cadmium Playercore - Module 67288
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: aGb, ahd, kda, yjb
 * Dependencies: 22970, 37564, 48170, 52571, 66164, 69575, 79048, 90745, 91176
 * Purpose: Buffer/Segment management, Encryption/Decryption, Logging, Event handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_37564 from './Module_37564.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_66164 from './Module_66164.js';
// import dep_69575 from './Module_69575.js';
// import dep_79048 from './Module_79048.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 67288
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n;
function d(q, r) {
    return p.__assign(p.__assign({}, {
        No: r || f.I.ia,
        position: q.position,
        Sa: q.Sa.xf
    }), {
        Sa: q.Sa.xf
    });
}

export function aGb(q) {
    return !!q.Tqa;
}
;
export function kda(q) {
    return !!q.presentingInfo;
}
;
export function ahd(q) {
    return !q.Tqa && !q.presentingInfo;
}
;
p = a(22970);
c = a(90745);
g = a(79048);
f = a(91176);
e = a(91176);
h = a(66164);
k = a(48170);
l = a(69575);
m = a(52571);
n = a(37564);
t = (function() {
    class q {
    constructor(r, u, v, w) {
        var x;
        x = this;
        this.Dc = r;
        this.za = u;
        this.Lz = w;
        this.eS = new c.sf();
        this.ARb = this.qsb = false;
        this.console = (0,
        l.Nf)(h.platform, v, "PLAYERADMANAGER");
        this.events = new c.EventEmitter();
        this.za.events.on("playerChanged", this.SNb.bind(this));
        this.SNb();
        this.za.events.on("cancelingStreaming", function() {
            var y;
            k.u && x.console.trace("PlayerAdManager received cancelStreaming");
            if (x.vR) {
                y = x.za.player.z1;
                y ? x.dOa(y.position) : (k.u && x.console.error("Missing last position for cancel streaming call"),
                x.vR = undefined);
            }
        });
        this.Dc.Lna.on("adPlaygraphUpdated", function(y) {
            return x.events.emit("adPlaygraphUpdated", y);
        });
        this.od.events.on("adSegmentDropped", function(y) {
            x.VLc(y);
        });
        this.od.events.on("advertsMismatch", function(y) {
            return x.events.emit("advertsMismatch", y);
        });
    }
    vl(r) {
        var u;
        if (!this.za.En)
            return (k.u && this.console.debug("PlayerAdManager.canSkip(): no player"),
            false);
        u = this.za.player;
        if (!u.Fba(r))
            return (k.u && this.console.debug("PlayerAdManager.canSkip() false, no branch spanning playerTimestamp:", r),
            false);
        k.u && this.console.debug(("PlayerAdManager.canSkip(): ").concat(u.Rd.ca(), " -> ").concat(r.ca()));
        r = r.greaterThan(u.Rd) ? (0,
        l.Zzb)(u.bb, u.Rd, r) : (0,
        l.Zzb)(u.bb, r, u.Rd);
        u = !r.some(function(v) {
            return v.K.type !== g.ed.content;
        });
        k.u && this.console.debug(("PlayerAdManager.canSkip(): ").concat(u, "; ").concat(r.map(function(v) {
            return ("").concat(v.K.id, " ").concat(v.K.type, " ").concat(v.Vb.G, "..").concat(v.Vb.G);
        })));
        return u;
    }
    hR() {
        var r, u;
        if (this.za.En && this.za.player.Sd)
            u = (u = this.Wi.aB(this.za.player.Wg)) ? "embedded" === u.Sa.type ? {
                reason: "In an embedded ad-break",
                result: true
            } : u.Sa.xf.bya.pz ? {
                reason: "Seek enabled ad-break",
                result: true
            } : {
                reason: "Seek disabled ad-break",
                result: false
            } : {
                reason: "not within an adbreak",
                result: true
            };
        else
            (k.u && this.console.debug("PlayerAdManager.canSeek(): no player"),
            u = {
                reason: "no player or position",
                result: true
            });
        k.u && this.console.debug("PlayerAdManager.canSeek():", u);
        return null !== (r = u.result) && undefined !== r ? r : true;
    }
    ica() {
        var r;
        return (null === (r = this.vR) || undefined === r ? undefined : r.bya) || ({
            pz: undefined,
            UI: undefined,
            pI: undefined
        });
    }
    SNb() {
        var r, u;
        r = this;
        this.console.trace("Player changed", this.za.En);
        this.eS.clear();
        if (this.za.En) {
            u = this.za.player;
            this.eS.addListener(u.events, "segmentPresenting", function(v) {
                return r.RB(v);
            });
            this.eS.addListener(u.events, "playbackEnding", function(v) {
                return r.l1a(v);
            });
        }
    }
    RB(r) {
        var u, v, w, x, y, A, z, B, C, D, E;
        k.u && this.console.trace("Got Segment presenting", {
            K: r.position.M,
            position: r.position.offset.ca(),
            seek: r.seek
        });
        B = r.$0 ? r.$0.position.M : r.position.M;
        C = this.za.q0(B)[0];
        D = (C = (null === (D = null === C || undefined === C ? undefined : C.L) || undefined === D ? undefined : D.jk) || (null === C || undefined === C ? undefined : C.L)) ? null === (v = null === (u = C.S) || undefined === u ? undefined : u.wd) || undefined === v ? undefined : v.eZ : undefined;
        !this.qsb && D && h.platform.ping && (h.platform.ping(D),
        this.qsb = true);
        u = this.Wi.aB(r.position);
        k.u && this.console.trace("Checked segment presenting", {
            Ub: null === u || undefined === u ? undefined : u.index,
            zkd: u
        });
        if (v = (null === u || undefined === u ? undefined : u.Sa.xf) || this.Wi.uwc(r.position, !!r.seek))
            if ((D = null === (w = null === u || undefined === u ? undefined : u.XK) || undefined === w ? undefined : w.vc,
            this.ARb || (null === C || undefined === C ? 0 : C.pda) || v.mIc(),
            k.u && this.console.trace(("Got segment presenting event: adBreak: ").concat(v.Ub), {
                vc: D,
                M: B,
                L: C.J
            }),
            (0,
            m.assert)(u || v.empty, "Should have presenting info for event corresponding to ad break, or ad break should be empty"),
            u)) {
                E = false;
                this.Lz.forEach(function(G) {
                    var F;
                    G.Ab && (null === (F = G.S.wd) || undefined === F ? 0 : F.Uj) && (E = true);
                });
                if (!this.Rca || "embedded" === (null === (x = this.vR) || undefined === x ? undefined : x.type) || E && r.seek)
                    v.empty ? v.De || D ? (k.u && this.console.trace("We are no longer in an adbreak or past an embedded ad (1)"),
                    this.lsc(u, r.playerTimestamp)) : k.u && this.console.trace("Passed an unhydrated ad break; assume it was skipped intentionally") : this.kac(u, r.playerTimestamp);
                D && (D.id === C.J && "dynamic" === (null === (y = this.vR) || undefined === y ? undefined : y.type) && (k.u && this.console.trace("Detected fallback from dynamic to embedded ad, forcing new ad break"),
                this.jac(u, r.playerTimestamp)),
                (0,
                m.assert)((null === (A = u.XK) || undefined === A ? undefined : A.vc) === D, "Presenting Info should point to same ad as adInfo"),
                this.Cq(u, r.playerTimestamp));
            } else
                (k.u && this.console.trace("We are no longer in an adbreak or past an embedded ad (2)"),
                v.De && this.jqc(v, r.position, r.playerTimestamp));
        !this.Rca || u && "end" !== (null === (z = u.U1a) || undefined === z ? undefined : z.wxa) || (k.u && this.console.trace("We are in end padding / next segment"),
        this.Crb(r.position));
        this.Rca && !u && (k.u && this.console.trace("onSegmentPresenting calling adBreakEnding"),
        this.dOa(r.position));
        this.ARb = true;
    }
    l1a(r) {
        this.Rca && this.JDc(r.position) && (this.Crb(r.position),
        k.u && this.console.trace("onPlaybackEnding calling adBreakEnding"),
        this.dOa(r.position));
    }
    o6a(r) {
        r.Sa = r.Sa.clone();
        return r;
    }
    kac(r, u) {
        (0,
        m.assert)(r, "Should have presenting info for event corresponding to ad break");
        k.u && this.console.trace("Emitting adBreakPresenting:", r);
        this.vR = r.Sa.xf;
        this.events.emit("adBreakPresenting", {
            type: "adBreakPresenting",
            eventInfo: d(r, u),
            presentingInfo: this.o6a(r),
            playerControlState: this.ica(),
            No: u
        });
    }
    Cq(r, u) {
        var v, w, x;
        k.u && this.console.trace("Emitting adPresenting:", r);
        v = this.events;
        w = v.emit;
        x = this.o6a(r);
        r = p.__assign(p.__assign({}, d(r, u)), {
            vc: r.XK.vc
        });
        w.call(v, "adPresenting", {
            type: "adPresenting",
            presentingInfo: x,
            Oed: r,
            No: u
        });
    }
    jac(r, u) {
        r = {
            type: "adBreakFallback",
            presentingInfo: this.o6a(r),
            No: u
        };
        k.u && this.console.trace("Emitting adBreakFallback:", r);
        this.events.emit(r.type, r);
    }
    lsc(r, u) {
        k.u && this.console.trace("Emitting explicit adBreakComplete");
        this.events.emit("adBreakComplete", {
            type: "adBreakComplete",
            presentingInfo: r,
            No: u
        });
    }
    jqc(r, u, v) {
        k.u && this.console.trace("Emitting empty adBreakComplete");
        this.events.emit("adBreakComplete", {
            type: "adBreakComplete",
            Tqa: r,
            position: u,
            No: v
        });
    }
    Crb(r) {
        k.u && this.console.trace("Emitting anonymous adBreakComplete");
        this.events.emit("adBreakComplete", {
            type: "adBreakComplete",
            position: r
        });
    }
    dOa(r) {
        this.vR = undefined;
        k.u && this.console.trace("Emitting adBreakEnded");
        this.events.emit("adBreakEnded", {
            type: "adBreakEnded",
            eventInfo: {
                position: r
            },
            playerControlState: this.ica()
        });
    }
    Gw(r) {
        var u, v, w, x;
        u = this;
        v = {
            ZOa: [],
            result: {}
        };
        w = new Set(this.od.Vra());
        x = Object.keys(this.od.cc).filter(function(y) {
            return w.has(y);
        });
        if (null === r || undefined === r ? 0 : r.Kz)
            x = x.filter(function(y) {
                var A;
                return -1 !== (null === (A = r.Kz) || undefined === A ? undefined : A.indexOf(y));
            });
        v.ZOa = x;
        x.forEach(function(y) {
            var A;
            v.result[y] = 0 < (null === (A = u.od.cc[y]) || undefined === A ? undefined : A.length);
        });
        return v;
    }
    WH(r) {
        var u, v, w, x;
        u = this;
        v = {
            ZOa: [],
            result: {}
        };
        w = this.od.Vra();
        if (null === r || undefined === r ? 0 : r.Kz)
            w = w.filter(function(y) {
                var A;
                return -1 !== (null === (A = r.Kz) || undefined === A ? undefined : A.indexOf(y));
            });
        v.ZOa = w;
        x = this.za.config.dba;
        w.forEach(function(y) {
            var A, z, B, C, D;
            z = u.od.RUa(y);
            if (z) {
                z = z.map(n.IUa);
                B = u.Lz.get(Number(y));
                C = !(null === B || undefined === B || !B.Ab) && !(null === (A = null === B || undefined === B ? undefined : B.S.wd) || undefined === A || !A.Uj);
                D = u.od.cc[y];
                A = x ? z : u.Xsc(y, z);
                v.result[("").concat(y)] = A.map(function(E, G) {
                    var F, H;
                    H = D[G];
                    G = null === (F = E.ads) || undefined === F ? undefined : F.map(function(J) {
                        var M, K, L;
                        L = (0,
                        e.kc)(H.yb, function(O) {
                            return O.id === J.id;
                        });
                        return p.__assign(p.__assign({}, J), {
                            hasPlayed: null !== (M = null === L || undefined === L ? undefined : L.ah) && undefined !== M ? M : false,
                            startTime: (null === L || undefined === L ? undefined : L.startTime) || f.I.Ca(J.Va),
                            endTime: (null === L || undefined === L ? undefined : L.endTime) || f.I.Ca(J.eb),
                            isError: null !== (K = null === L || undefined === L ? undefined : L.yE) && undefined !== K ? K : false
                        });
                    });
                    return p.__assign(p.__assign({}, E), {
                        ads: G,
                        hasCompletedPlayback: H.eGb || C,
                        isHiddenFromUser: H.eGb || C,
                        unnormalizedLocationMs: E.kj,
                        locationMs: E.Xu,
                        location: E.location,
                        adBreakToken: E.Pj,
                        contentTimestamp: E.Ga,
                        type: E.type
                    });
                });
            }
        });
        return v;
    }
    Xsc(r, u) {
        var v, w;
        v = [];
        w = [];
        this.od.cc[r].forEach(function(x) {
            return x.yb.forEach(function(y) {
                y.yE && -1 === w.indexOf(y.id) && w.push(y.id);
            });
        });
        u.forEach(function(x) {
            var y, A;
            x = p.__assign({}, x);
            A = null === (y = x.ads) || undefined === y ? undefined : y.filter(function(z) {
                return -1 === w.indexOf(z.id);
            });
            x.ads = A;
            v.push(x);
        });
        return v;
    }
    VLc(r) {
        var u, v, w;
        u = this;
        v = r.adId;
        r = this.od.Vra();
        w = this.za.Z.ba;
        r.forEach(function(x) {
            var y;
            null === (y = u.od.RUa(x)) || undefined === y ? undefined : y.forEach(function(A, z) {
                var B;
                null === (B = A.xa.yb) || undefined === B ? undefined : B.forEach(function(C, D) {
                    C.id === v && (C = (0,
                    e.kc)(Object.keys(w), function(E) {
                        E = u.Wi.WL(E);
                        return !E || E.BM ? false : D === E.WK && z === E.Ub;
                    })) && u.events.emit("segmentDropped", {
                        type: "segmentDropped",
                        auxMid: v,
                        auxMidType: g.ed.vc,
                        adBreakLocationMs: A.xa.kj,
                        reason: "network_error",
                        sev: "error",
                        segmentId: C
                    });
                });
            });
        });
    }
    JDc(r) {
        r = this.za.Ib.get(r.M);
        return !(!r || 0 < r.FF);
    }
}
Object.defineProperties(q.prototype, {
        Rca: {
            get: function() {
                return !!this.vR;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(q.prototype, {
        od: {
            get: function() {
                return this.Dc.od;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(q.prototype, {
        Wi: {
            get: function() {
                return this.Dc.Wi;
            },
            enumerable: false,
            configurable: true
        }
    });
    return q;
}
)();
export const yjb = t;

// Detected exports: aGb, ahd, kda, yjb
