/**
 * Netflix Cadmium Playercore - Module 14087
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 14087
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
d = a(22970);  // import from Module_22970
p = a(13550);  // import from Module_13550
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.Uf = function(f) {
        f = f.el.first.filter(function(e) {
            return e.er;
        });
        return f.length ? new p.ih(f[Math.floor(Math.random() * f.length)]) : new p.ih();
    }
    ;
    return g;
}
)(a(75498).cA);
b["default"] =

