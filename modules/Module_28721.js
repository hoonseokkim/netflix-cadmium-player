/**
 * Netflix Cadmium Playercore - Module 28721
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 28721
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(32296);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function(f) {
        var e, h, k, l, m;
        this.oi();
        this.Uc = this.qF([{
            skd: "int32"
        }, {
            lXa: "int32"
        }, {
            offset: 96,
            type: "offset"
        }, {
            name: "string"
        }]);
        this.Uc.lXa = (0,
        p.wK)(this.Uc.lXa);
        if (f && f.yh) {
            m = null === (l = null === (k = null === (h = null === (e = this.parent) || void 0 === e ? void 0 : e.parent) || void 0 === h ? void 0 : h.wn("tkhd")) || void 0 === k ? void 0 : k.Uc) || void 0 === l ? void 0 : l.trackId;
            "number" === typeof m && f.yh[m] && (f.yh[m].sE = this.Uc.lXa);
        }
        return !0;
    }
    ;
    g.Ae = "hdlr";
    g.Fd = !1;
    return g;
}
)(a(72905).Kf);
b["default"] = t;
