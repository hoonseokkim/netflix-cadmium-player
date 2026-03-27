/**
 * Netflix Cadmium Playercore - Module 35503
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 35503
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
        this.Uc = this.qF([{
            IBc: "int32"
        }, {
            c4c: "int32"
        }]);
        if (null === g || void 0 === g ? 0 : g.ce)
            (g.ce.mgd = this.Uc.IBc,
            g.ce.mnd = this.Uc.c4c);
        return !0;
    }
    ;
    c.Ae = "pasp";
    c.Fd = !1;
    return c;
}
)(a(72905).Kf);
b["default"] = t;
