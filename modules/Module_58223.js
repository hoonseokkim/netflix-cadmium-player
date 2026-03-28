/**
 * Netflix Cadmium Playercore - Module 58223
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 58223
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
c = a(13550);  // import from Module_13550
t = (function(g) {
    function f() {
        return null !== g && g.apply(this, arguments) || this;
    }
    d.__extends(f, g);
    f.prototype.Uf = function(e) {
        var h, k;
        h = e.rn;
        e = e.el.first;
        if (undefined === h)
            h = e[(0,
            c.e0)(e)];
        else if (!h.oI) {
            k = (0,
            p.hn)(e, function(l) {
                return l.isEqual(h);
            });
            h = e[(0,
            c.e0)(e, k)];
            if (undefined === h)
                return new c.ih();
        }
        return new c.ih(h);
    }
    ;
    return f;
}
)(a(75498).cA);
b["default"] =

