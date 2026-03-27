/**
 * Netflix Cadmium Playercore - Module 16290
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 16290
// Parameters: t (module), b (exports), a (require)


var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.lLa = void 0;
d = a(79048);
p = a(91176);
c = a(66164);
g = a(65161);
t = (function() {
    function f(e, h) {
        this.console = e;
        this.Z = h;
    }
    f.prototype.vAa = function(e, h, k, l, m, n, q) {
        var r, u;
        void 0 === m && (m = !1);
        void 0 === n && (n = void 0);
        void 0 === q && (q = !1);
        r = e.K;
        u = this.Ivc(r);
        this.transition = {
            startTime: c.platform.time.fa(),
            FZc: e,
            EZc: k.G,
            Lqa: h,
            fe: this.pxc(l, h, q),
            K1c: this.Wzc(l, m),
            ESc: n,
            Tnc: m,
            qf: l,
            nhc: u,
            HKc: this.Wxc(r, k)
        };
    }
    ;
    f.prototype.UXa = function() {
        return !!this.transition;
    }
    ;
    Object.defineProperties(f.prototype, {
        Lqa: {
            get: function() {
                var e;
                return null === (e = this.transition) || void 0 === e ? void 0 : e.Lqa;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    f.prototype.XVa = function(e) {
        var h, k, l, m, n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F, H, J;
        if (this.transition && e === this.transition.Lqa) {
            v = this.transition;
            w = v.nhc;
            x = v.HKc;
            y = v.Tnc;
            A = v.qf;
            z = v.FZc;
            B = v.EZc;
            C = v.startTime;
            D = v.fe;
            E = v.K1c;
            v = v.ESc;
            this.transition = void 0;
            G = this.aVa(e).LPa;
            F = this.evc(z.K.id, e, w);
            G = this.KIb(F.weight, G);
            H = {};
            for (J in w)
                J !== e && (H[J] = w[J].details);
            w = c.platform.time.fa() - C;
            C = A ? 0 : w;
            J = {
                offset: this.uzc(z, B, A, y),
                M: z.K.id
            };
            B = {
                offset: p.I.Ca(B),
                M: z.K.id
            };
            x = {
                segment: e,
                destPosition: {
                    M: e,
                    offset: p.I.ia
                },
                srcsegment: z.K.id,
                srcTransitionPosition: J,
                srcStartPosition: B,
                srcsegmentduration: z.kia.G,
                srcoffset: J.offset.G,
                seamlessRequested: this.$Ya(A, y),
                atRequest: F,
                atTransition: G,
                discard: H,
                transitionType: D,
                transitionTypeAtRequest: E,
                delayToTransition: this.awc(w, A, y),
                durationOfTransition: C,
                nextExitPositionAtRequest: x
            };
            v && (x.reasonCodes = v);
            y = null !== (k = null === (h = this.Z.Z.ba[e]) || void 0 === h ? void 0 : h.type) && void 0 !== k ? k : d.ed.content;
            h = null !== (m = null === (l = this.Z.Z.ba[z.K.id]) || void 0 === l ? void 0 : l.type) && void 0 !== m ? m : d.ed.content;
            e = null !== (q = null === (n = this.Z.Z.ba[e]) || void 0 === n ? void 0 : n.J) && void 0 !== q ? q : void 0;
            n = null !== (u = null === (r = this.Z.Z.ba[z.K.id]) || void 0 === r ? void 0 : r.J) && void 0 !== u ? u : void 0;
            e && n && (e !== n || -1 < [y, h].indexOf("adBreak") || -1 < [y, h].indexOf("ad")) && (x.auxMidType = y,
            x.auxSrcmidType = h,
            x.auxMid = e,
            x.auxSrcmid = n);
            return x;
        }
    }
    ;
    f.prototype.evc = function(e, h, k) {
        var l, m, n, q;
        n = {};
        k = k[h];
        q = this.Z.Z.ba[e];
        if (k)
            n = k.details;
        else {
            (0,
            p.assert)(this.Z);
            if (!q)
                return n;
            n.weight = null === (m = null === (l = this.Z.Z.ba[e].next) || void 0 === l ? void 0 : l[h]) || void 0 === m ? void 0 : m.weight;
        }
        return n;
    }
    ;
    f.prototype.awc = function(e, h, k) {
        var l;
        k || (l = h ? e : 0);
        return l;
    }
    ;
    f.prototype.Wxc = function(e, h) {
        var k, l, m;
        l = e.nb.add(h);
        null === (k = e.kz) || void 0 === k ? void 0 : k.some(function(n) {
            l.lessThan(n.qa) && (m = n.qa.G);
        });
        return m;
    }
    ;
    f.prototype.uzc = function(e, h, k, l) {
        return this.$Ya(k, l) ? e.kia : p.I.Ca(h);
    }
    ;
    f.prototype.pxc = function(e, h, k) {
        return e ? "perfect" : k ? "long" : this.aVa(h).eEb ? "reset" : "long";
    }
    ;
    f.prototype.$Ya = function(e, h) {
        return e || h;
    }
    ;
    f.prototype.Wzc = function(e, h) {
        return this.$Ya(e, h) ? "lazy" : "immediate";
    }
    ;
    f.prototype.Ivc = function(e) {
        var h, k;
        h = this;
        k = {};
        e.PB.forEach(function(l) {
            var m, n;
            m = e.QKc[l];
            n = h.aVa(l).LPa;
            k[l] = {
                details: h.KIb(m, n)
            };
        });
        return k;
    }
    ;
    f.prototype.aVa = function(e) {
        var h, k;
        e = this.Z.q0(e);
        h = 0 < e.length ? e[0] : void 0;
        e = null === h || void 0 === h ? void 0 : h.sS();
        if (!h || !e)
            return {
                eEb: !1,
                LPa: {
                    jW: 0,
                    MQ: 0,
                    PO: 0,
                    TK: 0
                }
            };
        k = h.gta(g.l.V) && !e.MQ;
        h = h.gta(g.l.U) && !e.jW;
        return {
            eEb: !k && !h,
            LPa: e
        };
    }
    ;
    f.prototype.KIb = function(e, h) {
        return {
            weight: e,
            vbuflmsec: h.jW,
            abuflmsec: h.MQ,
            vbuflbytes: h.PO,
            abuflbytes: h.TK
        };
    }
    ;
    return f;
}
)();
b.lLa = t;


// Detected exports: lLa