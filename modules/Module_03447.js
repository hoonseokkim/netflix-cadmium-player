/**
 * Netflix Cadmium Playercore - Module 3447
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 */

// Webpack module 3447
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
        var h, k, l, m, n, q;
        h = e.config;
        k = e.rn;
        l = e.GHb;
        m = e.el.first;
        n = e.player.buffer.fl;
        e = "forward" === h.yVc;
        if (undefined === k)
            return (k = e ? m[(0,
            c.e0)(m)] : m[(0,
            c.e0)(m, m.length)],
            new c.ih(k));
        if (!k.oI) {
            q = (0,
            p.hn)(m, function(r) {
                return r.isEqual(k);
            });
            q = (0,
            c.e0)(m, q);
            k = m[q];
        }
        if (!k)
            return new c.ih();
        if (undefined === l || n > l + h.e1c) {
            l = m.filter(function(r) {
                return r.er;
            });
            if (!l.length)
                return new c.ih();
            h = (0,
            p.hn)(l, function(r) {
                return r.isEqual(k);
            });
            h = (l.length + h + (e ? 1 : -1)) % l.length;
            return new c.ih(l[h]);
        }
        return new c.ih(k);
    }
    ;
    return f;
}
)(a(75498).cA);
b["default"] =

