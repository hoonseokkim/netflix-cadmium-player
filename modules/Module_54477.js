/**
 * Netflix Cadmium Playercore - Module 54477
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 54477
// Parameters: t (module), b (exports), a (require)


var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.qFa = void 0;
t = a(22970);
d = a(66164);
p = a(65161);
c = t.__importDefault(a(40497));
g = a(8149);
a = (function() {
    function f(e, h, k, l, m) {
        this.config = e;
        this.hZc = h;
        this.navigator = k;
        this.events = l;
        this.console = m;
    }
    f.prototype.Oh = function(e, h, k, l, m, n) {
        return n ? n.Oh(e, h, k.da(l), m) : e;
    }
    ;
    f.prototype.hqc = function(e, h, k) {
        this.events.emit("streamSelection", {
            type: "streamSelection",
            mediaType: e,
            result: h,
            streamList: k
        });
    }
    ;
    f.prototype.gqc = function(e, h, k, l) {
        e = {
            type: "maxVideoBitrateChanged",
            time: d.platform.time.fa(),
            streaming: l,
            maxvb_old: e,
            maxvb: h,
            reason: k
        };
        this.events.emit(e.type, e);
    }
    ;
    f.prototype.Pxa = function(e, h) {
        return e.L.gj.sBa(e.L.J, e.Xd, h);
    }
    ;
    f.prototype.$ra = function(e, h) {
        var A;
        for (var k, l = h.da(this.hZc), m = [], n = e, q = h, r, u, v = 0, w = 0, x = (0,
        g.Gn)(e.track), y = !0; n; ) {
            A = n.aCb(l);
            if (!y && !n.Dk && !x)
                break;
            0 < A.Ta.length && (q = A.Ta[0].Vb,
            void 0 === r && (r = A.Ta[A.Ta.length - 1].Sb,
            u = A.Ixa >= A.Ta.length ? r : A.Ta[A.Ixa].Vb),
            m = A.Ta.concat(m),
            v += 0 < A.Zw ? A.Zw : 0,
            w += A.z3);
            n = this.navigator.parent(n);
            y = !1;
        }
        return {
            ru: d.platform.C0()[e.mediaType],
            Nb: Math.floor(q.G),
            Ld: h.G,
            fl: Math.floor(null !== (k = null === r || void 0 === r ? void 0 : r.G) && void 0 !== k ? k : h.G),
            yl: Math.floor(u ? u.G : h.G),
            jq: m.reduce(function(z, B) {
                return z + B.la;
            }, 0),
            Zw: v,
            z3: w,
            qfd: m.length,
            Ta: m
        };
    }
    ;
    f.prototype.awb = function(e, h, k, l, m) {
        var n, q, r;
        e = (0,
        p.D2a)(e);
        n = this.$ra(l, h);
        q = l.mediaType === p.l.U ? this.config.Jia : this.config.V9;
        r = c.default.instance();
        h = {
            state: e,
            Ky: e === p.Yb.Bg,
            Ve: l.Dj,
            playbackRate: k,
            buffer: n,
            Jqa: q,
            A_: m,
            bn: null === r || void 0 === r ? void 0 : r.bn,
            mediaType: l.mediaType,
            Ld: h.G,
            I3a: 0
        };
        this.e3c(h, void 0 !== l.bq.Ro.El);
        return h;
    }
    ;
    f.prototype.Xtb = function(e, h, k) {
        var n, q;
        if (e === p.l.U) {
            e = "manifest";
            for (var l = 0, m = h.length - 1; 0 <= m; --m) {
                n = h[m];
                q = n.bitrate;
                if (n.oI) {
                    l = Math.max(l, q);
                    break;
                } else
                    n.Fp ? n.Go && (e = "hf") : e = "av";
            }
            this.DJb !== l && (this.gqc(this.DJb, l, e, k),
            this.DJb = l);
        }
    }
    ;
    f.prototype.e3c = function(e, h) {
        switch (e.state) {
        case p.Yb.Xf:
        case p.Yb.Qm:
        case p.Yb.Bg:
        case p.Yb.aj:
            if (h)
                break;
            e.state = p.Yb.Ul;
        case p.Yb.Ul:
            h && (e.state = p.Yb.Xf);
        }
    }
    ;
    return f;
}
)();
b.qFa = a;


// Detected exports: qFa