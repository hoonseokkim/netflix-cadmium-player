/**
 * Netflix Cadmium Playercore - Module 96989
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 96989
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.prototype.parse = function(g) {
        var f, e, h, k, l, m, n;
        l = null === (k = null === (h = null === (e = null === (f = this.parent) || void 0 === f ? void 0 : f.parent) || void 0 === e ? void 0 : e.wn("tkhd")) || void 0 === h ? void 0 : h.Uc) || void 0 === k ? void 0 : k.trackId;
        if ("undefined" === typeof l)
            return !0;
        this.oi();
        f = this.N.dc();
        this.Jaa = [];
        for (e = 0; e < f; e++) {
            h = 1 === this.version ? this.N.Am() : this.N.dc();
            k = 1 === this.version ? this.N.Am() : this.N.dc();
            m = this.N.sg();
            n = this.N.sg();
            this.Jaa.push({
                vld: h,
                fJc: k,
                Yid: m,
                Wid: n
            });
        }
        if (null === g || void 0 === g || !g.yh || !g.yh[l])
            return !0;
        g.yh[l].Jaa = this.Jaa;
        return !0;
    }
    ;
    c.Ae = "elst";
    c.Fd = !1;
    return c;
}
)(a(72905).Kf);
b["default"] = t;
