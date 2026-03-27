/**
 * Netflix Cadmium Playercore - Module 53158
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 53158
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(93334);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function(f) {
        var e, h, k, l, m, n;
        if ("nclx" === this.N.gC()) {
            k = this.N.sg();
            l = this.N.sg();
            m = this.N.sg();
            n = this.N.ib(1);
            this.N.ib(7);
            this.Oub = {
                idd: k,
                Mmd: l,
                Eid: m,
                Afd: n
            };
        }
        if (null === f || void 0 === f ? 0 : f.yh) {
            k = void 0;
            for (l = this.parent; l; ) {
                k = null === (h = null === (e = l.wn("tkhd")) || void 0 === e ? void 0 : e.Uc) || void 0 === h ? void 0 : h.trackId;
                if (void 0 !== k)
                    break;
                l = l.parent;
            }
            (0,
            p.assert)(void 0 !== k, "Failed to find trackId in track hierarchy");
            f = f.yh[k];
            if (!f)
                return !0;
            f.Oub = this.Oub;
        }
        return !0;
    }
    ;
    g.Ae = "colr";
    return g;
}
)(a(72905).Kf);
b["default"] = t;
