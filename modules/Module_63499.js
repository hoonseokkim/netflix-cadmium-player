/**
 * Netflix Cadmium Playercore - Module 63499
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [22970, 13550, 75498]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 63499
// Parameters: t (module), b (exports), a (require)
var d, p;
d = a(22970);
p = a(13550);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.Uf = function(f) {
        f = f.el.first;
        return new p.ih(f[f.length - 1]);
    }
    ;
    return g;
}
)(a(75498).cA);
b["default"] = t;
