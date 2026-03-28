/**
 * Netflix Cadmium Playercore - Module 92020
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: B6b
 * Dependencies: 3992, 7376, 18797, 22699, 22970, 31496, 37494, 66827, 76495, 76851, 81824
 * Purpose: Subtitles/Captions, Buffer/Segment management, Encryption/Decryption, Logging
 */

// import dep_3992 from './Module_3992.js';
// import dep_7376 from './Module_7376.js';
// import dep_18797 from './Module_18797.js';
// import dep_22699 from './Module_22699.js';
// import dep_22970 from './Module_22970.js';
// import dep_31496 from './Module_31496.js';
// import dep_37494 from './Module_37494.js';
// import dep_66827 from './Module_66827.js';
// import dep_76495 from './Module_76495.js';
// import dep_76851 from './Module_76851.js';
// import dep_81824 from './Module_81824.js';

// Webpack module 92020
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n;
function d(q) {
    return -1 < ["simplesdh", "dfxp-ls-sdh", "imsc1.1"] /* simplesdh */.indexOf(q);
}

p = a(22970);
t = a(22699);
c = a(18797);
g = a(81824);
f = a(7376);
e = a(37494);
h = a(76851);
k = a(76495);
l = a(66827);
m = a(3992);
n = a(31496);
t = (function(q) {
    class r extends q {
    constructor(u, v) {
        var w, x, y, A, z, B, C, D, E;
        C = q.call(this) || this;
        C.gb = "paused";
        C.H8 = [];
        C.oo = 0;
        C.ypb = true;
        D = u.xE || false;
        C.ya = u.va || console;
        C.AQ = u.request;
        C.lD = u.Myc;
        C.Xma = u.igd || (function(G, F) {
            return G - (null !== F && undefined !== F ? F : C.lD());
        }
        );
        C.gb = "paused";
        C.H8 = [];
        C.X8 = v.profile;
        C.Sg = v.url;
        C.yQ = v.yd;
        C.oo = C.yQ || 0;
        C.ypb = null !== (w = v.Jkd) && undefined !== w ? w : true;
        C.iY = null !== (x = v.Bed) && undefined !== x ? x : false;
        w = {
            url: C.Sg,
            request: C.AQ,
            yd: null !== (y = C.yQ) && undefined !== y ? y : 0,
            va: C.ya,
            xE: D,
            bufferSize: v.bufferSize,
            Pfa: v.Pfa || 0,
            ctb: v.ctb,
            Da: null !== (A = v.Da) && undefined !== A ? A : false
        };
        C.iY && (C.zna = new l.kEa(),
        C.$ma = new l.kEa());
        if ("nflx-cmisc" === v.profile) {
            E = p.__assign(p.__assign({}, w), {
                offset: v.Z_a,
                size: v.XJb,
                KB: v.KB,
                Mza: v.Mza,
                Ayb: v.Ayb
            });
            C.bf = new m(E);
        } else if ((C.Qv = v.preferences,
        C.Mv = v.ke,
        y = null !== (B = null !== (z = v.Ybd) && undefined !== z ? z : v.Da) && undefined !== B && B ? g.$Gc : g.R_c,
        (z = null !== (E = v.LXa) && undefined !== E ? E : false) && C.ya.debug("ignoreUserTextPreferences was true, ignoring preferences"),
        C.FQ = new f.fmb(y,C.Mv || ({}),C.Qv || ({}),z),
        E = p.__assign(p.__assign({}, w), {
            profile: v.profile,
            xml: v.xml,
            M6a: C.FQ
        }),
        v.Da && d(C.X8) && undefined === E.xml))
            C.bf = v.fnd ? new h.Ihb(E,k.u7.Ea) : new e.Sfb(E);
        else if (d(C.X8) && "function" === typeof c.TFa)
            C.bf = new c.TFa(E);
        else
            throw Error("SubtitleManager: " + C.X8 + " is an unsupported profile");
        C.bf.on("ready", function() {
            var F, H, J;
            function G() {
                return "paused" === C.gb || "stopped" === C.gb;
            }
            F = !!v.ysb;
            C.ya.info("ready event fired by subtitle stream");
            C.emit("ready");
            H = C.bf.ZL.bind(C.bf);
            if (u.kWa && u.Uxa) {
                J = a(17972).x$a;
                C.wf = new J(C.lD,H,C.Xma,C.ya,G,u.kWa,u.Uxa,v);
            } else
                C.wf = new n(C.lD,H,C.Xma,G,C.ya,v);
            if ("dfxp-ls-sdh" === C.X8 && "function" === typeof c.TFa)
                C.wf.on("stagesubtitle", C.r6a.bind(C));
            C.wf.on("showsubtitle", C.d6a.bind(C));
            C.wf.on("removesubtitle", C.W3a.bind(C));
            C.wf.on("underflow", C.Mr.bind(C));
            C.wf.on("bufferingComplete", C.ln.bind(C));
            F && (C.ya.info("autostarting subtitles"),
            setTimeout(function() {
                "stopped" !== C.gb && C.LJ(C.lD());
            }, 10));
        });
        C.bf.on("error", C.emit.bind(C, "error"));
        return C;
    }
    start() {
        this.bf.start();
    }
    SOb() {
        "running" === this.gb && (this.gb = "paused",
        this.Pyb(this.oo));
    }
    LJ(u) {
        "stopped" === this.gb ? this.ya.debug("updatePts called when stopped") : (this.ypb && "running" === this.gb && 1E4 < Math.abs(u - this.oo) && (this.ya.warn("Detected an unexpected pts jump larger than", 1E4, "at", u, ". If this is a seamless segment transition then the ptsShift API", "should have been called before the pts change was reflected."),
        this.SOb()),
        this.oo = u,
        "paused" === this.gb && (this.gb = "running",
        this.NZc(u)),
        this.wf && (this.V2c(u),
        this.wf.LJ(0)));
    }
    stop(u) {
        var v, w, x;
        this.ya.info("stop called");
        "running" === this.gb && this.pause(u);
        this.bf.removeAllListeners(["ready"]);
        null === (v = this.wf) || undefined === v ? undefined : v.stop();
        u = this.Oba();
        this.iY && u && (u.VYc = null === (w = this.zna) || undefined === w ? undefined : w.Bsa(),
        u.DBc = null === (x = this.$ma) || undefined === x ? undefined : x.Bsa());
        w = this.H8.reduce(function(y, A) {
            y.eTb += A.jha;
            y.ora += A.pra || 0;
            y.Ss.push(A);
            return y;
        }, {
            eTb: 0,
            ora: 0,
            Ss: []
        });
        "object" === typeof this.bf && this.bf.close();
        this.ya.debug("metrics: " + JSON.stringify(w));
        this.gb = "stopped";
        return w;
    }
    pause(u) {
        var v;
        u = undefined !== u ? u : this.lD();
        "paused" === this.gb || "stopped" === this.gb ? this.ya.warn("pause called on subtitle manager, but it was already paused/stopped!") : (this.ya.info("pause called at " + u),
        this.gb = "paused",
        this.Pyb(u));
        null === (v = this.wf) || undefined === v ? undefined : v.pause();
    }
    Nsa(u, v) {
        return "function" === typeof this.bf.Nsa ? this.bf.Nsa(u, v) : [];
    }
    Zq(u, v) {
        return this.bf.Zq(u, v);
    }
    ZL(u) {
        return this.bf.ZL(u);
    }
    oO(u) {
        var w;
        function v() {
            w.ya.info("bufferingComplete from setStreamStartPosition");
            w.emit("bufferingComplete");
        }
        w = this;
        "function" === typeof this.bf.oO ? this.bf.oO(u, v) : v();
    }
    Wn(u, v) {
        "function" === typeof this.bf.Wn && this.bf.Wn(u, v);
    }
    Pl(u, v) {
        "function" === typeof this.bf.Pl && this.bf.Pl(u, v);
    }
    v3a(u) {
        "function" === typeof this.bf.w3a && this.bf.w3a(u);
    }
    Oba() {
        return this.H8[this.H8.length - 1];
    }
    d6a(u) {
        var v, w, x, y, B;
        x = 0;
        this.ya.info("show subtitle called at undefined for displayTime " + u.displayTime);
        this.emit("showsubtitle", u);
        y = this.Oba();
        y.pC || (y.pC = {});
        if (d(this.X8))
            try {
                for (var A = p.__values(u.blocks), z = A.next(); !z.done; z = A.next()) {
                    B = z.value;
                    y.pC.hasOwnProperty(B.id) || x++;
                    y.pC[B.id] = u.endTime;
                }
            } catch (D) {
                var C;
                C = {
                    error: D
                };
            } finally {
                try {
                    z && !z.done && (v = A.return) && v.call(A);
                } finally {
                    if (C)
                        throw C.error;
                }
            }
        else
            (y.pC.hasOwnProperty(u.id) || x++,
            y.pC[u.id] = u.endTime);
        this.oic();
        y.jha += x;
        this.iY && (null === (w = this.zna) || undefined === w ? undefined : w.Lqb(u.startTime, this.lD()));
    }
    oic() {
        var u, v, w;
        u = this.Oba();
        if (null === u || undefined === u ? 0 : u.pC) {
            v = u.pC;
            w = Object.keys(u.pC);
            30 < w.length && (w = w.sort(function(x, y) {
                return v[y] - v[x];
            }),
            w.splice(19, Math.max(w.length - 20, 0)),
            u.pC = {},
            w.forEach(function(x) {
                u.pC[x] = v[x];
            }));
        }
    }
    W3a(u) {
        var v;
        this.ya.info("remove subtitle called at undefined for remove time " + (u.displayTime + u.duration));
        this.emit("removesubtitle", u);
        this.iY && (null === (v = this.$ma) || undefined === v ? undefined : v.Lqb(u.endTime, this.lD()));
    }
    r6a(u) {
        this.ya.info("stage subtitle called at " + this.lD() + " for displayTime " + u.displayTime);
        this.emit("stagesubtitle", u);
    }
    Mr() {
        this.ya.info("underflow fired by the subtitle timer");
        this.emit("underflow");
    }
    ln() {
        this.ya.info("bufferingComplete fired by the subtitle timer");
        this.emit("bufferingComplete");
    }
    NZc(u) {
        var v, w;
        this.ya.debug("creating a new subtitle interval at " + u);
        this.iY && (null === (v = this.zna) || undefined === v ? undefined : v.reset(u),
        null === (w = this.$ma) || undefined === w ? undefined : w.reset(u));
        this.H8.push({
            Nb: u,
            jha: 0
        });
    }
    V2c(u) {
        var v;
        v = this.Oba();
        v && (v.AZa = u);
    }
    Pyb(u) {
        var v, w, x;
        this.ya.debug("ending subtitle interval at " + u);
        x = this.Oba();
        x && (x.Xg = u,
        this.iY && (x.VYc = null === (v = this.zna) || undefined === v ? undefined : v.Bsa(),
        x.DBc = null === (w = this.$ma) || undefined === w ? undefined : w.Bsa()),
        x.Xg < x.Nb && (this.ya.warn("correcting for interval where endPts is smaller than startPts"),
        x.Nb = 0 < x.Xg ? x.Xg - 1 : 0),
        x.pra = this.bf.Zq(x.Nb, x.Xg),
        delete x.pC,
        x.pra > x.jha && x.AZa && 500 > x.Xg - x.AZa && (x.pra = this.bf.Zq(x.Nb, x.AZa)),
        this.ya.debug("showed " + x.jha + " during this interval"),
        this.ya.debug("expected " + x.pra + " for this interval"));
    }
}
p.return r;
}
)(t.EventEmitter);
export const B6b = t;
b["default"] = t;

// Detected exports: B6b
