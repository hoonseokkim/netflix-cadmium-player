/**
 * Netflix Cadmium Playercore - Module 64280
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 64280
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
t = a(75589);
a = a(72905);
p = t.SHa;
a = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function() {
        var f, k, l;
        this.oi();
        1 <= this.version && this.N.Mya();
        f = this.N.dc();
        this.Tp = {};
        for (var e = this.startOffset + this.length, h = 0; h < f; ++h) {
            k = this.N.gC();
            "uuid" === k && (k = this.N.Mya());
            l = this.N.Am();
            this.Tp[k] = {
                offset: e,
                size: l
            };
            e += l;
        }
        return !0;
    }
    ;
    g.Ae = p;
    g.Fd = !1;
    return g;
}
)(a.Kf);
b["default"] = a;
