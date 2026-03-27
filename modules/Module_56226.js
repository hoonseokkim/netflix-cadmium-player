/**
 * Netflix Cadmium Playercore - Module 56226
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 56226
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
        var e, h;
        this.N.ib(1);
        this.N.ib(7);
        this.VRb = this.N.ib(3);
        this.URb = this.N.ib(5);
        this.WRb = this.N.ib(1);
        this.HEb = this.N.ib(1);
        this.SVb = this.N.ib(1);
        this.xKb = this.N.ib(1);
        this.fub = this.N.ib(1);
        this.gub = this.N.ib(1);
        this.eub = this.N.ib(2);
        this.N.ib(3);
        (this.mYa = this.N.ib(1)) ? this.pFb = this.N.ib(4) : this.N.ib(4);
        if (null === f || void 0 === f ? 0 : f.yh) {
            for (var k = void 0, l = this.parent; l; ) {
                k = null === (h = null === (e = l.wn("tkhd")) || void 0 === e ? void 0 : e.Uc) || void 0 === h ? void 0 : h.trackId;
                if (void 0 !== k)
                    break;
                l = l.parent;
            }
            (0,
            p.assert)(void 0 !== k, "trackId is undefined");
            f.yh[k].lcd = {
                VRb: this.VRb,
                URb: this.URb,
                WRb: this.WRb,
                HEb: this.HEb,
                SVb: this.SVb,
                xKb: this.xKb,
                fub: this.fub,
                gub: this.gub,
                eub: this.eub,
                mYa: this.mYa,
                pFb: this.pFb
            };
        }
        return !0;
    }
    ;
    g.Ae = "av1C";
    return g;
}
)(a(72905).Kf);
b["default"] = t;
