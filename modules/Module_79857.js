/**
 * Netflix Cadmium Playercore - Module 79857
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Afb
 * Dependencies: 22970, 48912, 52571, 54366, 61996, 66164, 75539, 91176, 91967
 * Purpose: Network/HTTP, Encryption/Decryption, Logging, Event handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_48912 from './Module_48912.js';
// import dep_52571 from './Module_52571.js';
// import dep_54366 from './Module_54366.js';
// import dep_61996 from './Module_61996.js';
// import dep_66164 from './Module_66164.js';
// import dep_75539 from './Module_75539.js';
// import dep_91176 from './Module_91176.js';
// import dep_91967 from './Module_91967.js';

// Webpack module 79857
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m;
function d(n) {
    var q;
    q = n.indexOf("?");
    return -1 !== q ? n.slice(0, q) : n;
}

p = a(22970);
c = a(66164);
g = a(91176);
f = a(75539);
e = a(61996);
h = a(91967);
k = a(54366);
l = a(52571);
m = a(48912);
t = (function() {
    class n {
    constructor(q, r, u, v) {
        var w;
        this.console = q;
        this.config = r;
        this.L = u;
        this.jB = v;
        this.mga = false;
        this.FZa = {};
        this.EZ = false;
        this.ve = new e.Tm({
            Ig: 10,
            Ej: this,
            source: "LiveOCSideChannel",
            console: this.console
        });
        (0,
        l.assert)(null === (w = this.L.S.FA) || undefined === w ? undefined : w.Sf, "Missing pbcid for OC side channel message decryption.");
        this.opa = new m.zma(this.L.S.FA.Sf);
    }
    Xc(q) {
        this.mga || (q.Xc(new k.ko(this.ve)),
        this.mga = true);
    }
    Ue() {
        this.TN && (clearTimeout(this.TN),
        this.TN = undefined);
        this.BQa();
        this.EZ = true;
    }
    decode(q, r, u) {
        var v, w, x, y, A, z, B, C, D, E;
        undefined === u && (u = true);
        if (r && (r = null === (v = (0,
        g.kc)(r.split(";"), function(G) {
            return 0 === G.indexOf("sc=");
        })) || undefined === v ? undefined : v.slice(3)) && (!u || this.EYc(q))) {
            q = this.opa.decrypt(r, true);
            try {
                w = JSON.parse(q);
            } catch (G) {
                this.console.error("Failed to parse decrypted OC side channel message. " + ("decryptedMessage: ").concat(q));
                return;
            }
            q = Number(w.time || undefined);
            isNaN(q) && (this.console.error(("Invalid live server time in OC side channel message. time: ").concat(w.time)),
            q = undefined);
            u = w["live-msg-start"];
            v = w["live-msg-end"];
            r = u ? new Date(u).getTime() : undefined;
            x = v ? new Date(v).getTime() : undefined;
            undefined !== r && isNaN(r) || undefined !== x && isNaN(x) ? this.console.error("Invalid live event times in OC side channel message. " + ("live-msg-start: ").concat(u, ", live-msg-end: ").concat(v)) : y = {
                startTime: u,
                Va: r,
                endTime: v,
                eb: x
            };
            u = w["encoder-tag"];
            v = w["encoder-region"];
            u && v || this.console.error("Invalid encoder info in OC side channel message. " + ("encoder-tag: ").concat(u, ", encoder-region: ").concat(v));
            r = (x = w.maxBitrate) ? Number(x || undefined) : 0;
            undefined !== r && isNaN(r) && (this.console.error(("Invalid maxBitrate in OC side channel message: ").concat(x)),
            r = undefined);
            x = w["live-msg-prefetch-start"];
            A = w["live-msg-prefetch-dur"];
            z = x ? new Date(x).getTime() : undefined;
            B = A ? Number(A) : undefined;
            if (undefined !== z && isNaN(z) || undefined !== B && isNaN(B))
                (this.console.error("Invalid postplay prefetch info in OC side channel message. " + ("live-msg-prefetch-start: ").concat(x, ", live-msg-prefetch-dur: ").concat(A)),
                B = z = undefined);
            C = w["live-msg-pp-start"];
            w = w["live-msg-pp-dur"];
            D = C ? new Date(C).getTime() : undefined;
            E = w ? Number(w) : undefined;
            if (undefined !== D && isNaN(D) || undefined !== E && isNaN(E))
                (this.console.error("Invalid postplay transition info in OC side channel message. " + ("live-msg-pp-start: ").concat(C, ", live-msg-pp-dur: ").concat(w)),
                E = D = undefined);
            return {
                Bo: u,
                Ao: v,
                maxBitrate: r,
                Wf: q,
                Rh: y,
                V2a: z,
                BU: x,
                U2a: B,
                zU: A,
                P2a: D,
                wU: C,
                O2a: E,
                vU: w
            };
        }
    }
    EYc(q) {
        var r;
        r = c.platform.time.fa();
        if (undefined !== this.FZa[q] && r - this.FZa[q] < (undefined === this.L.Rh.endTime ? this.config.n_ : Math.max(this.config.n_, this.config.fqa)))
            return false;
        this.FZa[q] = r;
        return true;
    }
    i3a(q, r, u, v, w, x, y) {
        var A, z, B;
        A = this;
        w = this.decode(v, w);
        undefined !== w && (undefined === w.Wf || isNaN(w.Wf) || undefined === x || isNaN(x) || this.L.wia(w.Wf, x),
        undefined !== w.Rh && this.L.tia(w.Rh.startTime, w.Rh.endTime),
        this.L.AWb(v, {
            Bo: w.Bo,
            Ao: w.Ao,
            Nza: y,
            ob: q.Oa
        }),
        w.maxBitrate && !isNaN(w.maxBitrate) && (q.track.SM = w.maxBitrate,
        q.track.g4(h.XP.hTb, w.maxBitrate)),
        undefined === w.BU || undefined === w.V2a || isNaN(w.V2a) || undefined === w.zU || undefined === w.U2a || isNaN(w.U2a) || this.L.e5("prefetch", w.BU, w.zU),
        undefined === w.wU || undefined === w.P2a || isNaN(w.P2a) || undefined === w.vU || undefined === w.O2a || isNaN(w.O2a) || this.L.e5("execute", w.wU, w.vU),
        this.ve.J9("processMessage", {
            parsed: true,
            url: d(u),
            pbcid: null === (z = this.L.S.FA) || undefined === z ? undefined : z.Sf,
            time: c.platform.time.now(),
            encoderTag: w.Bo,
            encoderRegion: w.Ao,
            maxBitrate: w.maxBitrate,
            serverTimeMs: w.Wf,
            liveEventTimes: w.Rh,
            prefetchStartMs: w.V2a,
            prefetchDurationMs: w.U2a,
            postplayStartMs: w.P2a,
            postplayDurationMs: w.O2a
        }),
        this.TN && (clearTimeout(this.TN),
        this.TN = undefined),
        this.config.E_ && (this.EHb = q,
        this.JZa = u,
        this.EFc = y,
        undefined !== r && (this.Jua = r),
        undefined === (null === (B = w.Rh) || undefined === B ? undefined : B.endTime) && undefined !== this.Jua && (this.TN = setTimeout(function() {
            A.Oya();
        }, this.config.F1))));
    }
    Oya() {
        var q, r, u;
        q = this;
        r = false;
        u = this.EHb;
        u && !this.EZ && ((0,
        l.assert)(this.Jua),
        (0,
        l.assert)(this.JZa),
        this.BQa(),
        this.Pya = new f.XHa(u,this.JZa,this.jB.Jd.track,"refreshOC",{
            responseType: 0
        },{
            offset: 0,
            la: 8
        },this,this.Jua,this.config,this.console),
        this.Pya.open() ? r = true : (this.BQa(),
        r = false));
        this.ve.Eg({
            time: c.platform.time.now(),
            issued: r
        });
        this.config.E_ && (this.TN = setTimeout(function() {
            q.Oya();
        }, this.config.F1));
    }
    BQa() {
        this.Pya && (this.Pya.Ue(),
        this.Pya = undefined);
    }
    uN(q) {
        var r, u;
        u = q.getResponseHeader("X-TCP-Info", false);
        null === (r = q.stream.L.tI) || undefined === r ? undefined : r.i3a(this.EHb, this.Jua, this.JZa, q.mediaType, u, undefined, this.EFc);
        q.abort();
    }
    cz(q) {
        var r;
        r = this;
        q.abort();
        this.config.E_ && (this.TN = setTimeout(function() {
            r.Oya();
        }, this.config.F1));
    }
    lxa() {}
    vN() {}
    aF() {}
    Ko() {}
    M2() {}
    aU() {}
    kxa() {}
    mxa() {}
}
p.__decorate([(0,
    e.kb)({
        methodName: "refreshOCSideChannel",
        df: false
    })], n.prototype, "Oya", null);
    return n;
}
)();
export const Afb = t;

// Detected exports: Afb
