/**
 * Netflix Cadmium Playercore - Module 47407
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Data parsing / serialization
 * Exports: p7
 */

// Webpack module 47407
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const p7 = undefined;
d = a(22970);  // import from Module_22970
t = a(87349);  // import from Module_87349
p = a(89931);  // import from Module_89931
a = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.pa = function(f) {
        var e, h, k, l;
        e = this;
        if (!this.parse().done)
            return false;
        h = this.Se.moov;
        if (!h || 0 === h.length)
            return false;
        k = h[0].wn("tenc");
        if (!k)
            return false;
        l = new Uint8Array(k.xB);
        f.forEach(function(m) {
            for (var n = m.from, q = true, r = 0; r < n.length; r++)
                if (l[r] !== n[r]) {
                    q = false;
                    break;
                }
            q && e.We.Yya(m.from.length, m.to, k.pZa);
        });
        return (0,
        p.concat)(this.We.pa().Na);
    }
    ;
    return g;
}
)(t.Wz);
b.p7 =

// Detected exports: p7
