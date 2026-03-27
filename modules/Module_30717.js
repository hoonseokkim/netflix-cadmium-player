/**
 * Netflix Cadmium Playercore - Module 30717
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 30717
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
        var f, e, h, k, l;
        this.oi();
        f = this.qF([{
            Y4: "int32"
        }, {
            jSa: "int32"
        }, {
            YD: "int32"
        }, {
            ZD: "int32"
        }, {
            AH: "int32"
        }]);
        e = f.Y4;
        h = f.jSa;
        k = f.YD;
        l = f.AH;
        f = f.ZD;
        this.Uc = {
            trackId: e,
            Rdd: h,
            iqa: k,
            Sdd: l,
            Tdd: f
        };
        (null === g || void 0 === g ? 0 : g.yh) && g.yh[e] && (g.yh[e].jSa = h,
        g.yh[e].YD = k,
        g.yh[e].AH = l,
        g.yh[e].ZD = f);
        this.Y4 = e;
        this.jSa = h;
        this.YD = k;
        this.ZD = f;
        this.AH = l;
        return !0;
    }
    ;
    c.Ae = "trex";
    c.Fd = !1;
    return c;
}
)(a(72905).Kf);
b["default"] = t;
