/**
 * Netflix Cadmium Playercore - Module 81307
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: Abb
 */

// Webpack module 81307
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Abb = undefined;
d = a(22970);  // import from Module_22970
p = a(52571);  // import from Module_52571
c = a(28871);  // import from Module_28871
t = (function() {
    function g() {}
    g.Zf = function(f) {
        var e, h;
        e = f.ba;
        f = f.Ef;
        h = e[f].J;
        Object.keys(e).forEach(function(k) {
            return (0,
            p.assert)(e[k].J === h);
        });
        return e[f].J;
    }
    ;
    g.prototype.jAb = function(f, e) {
        var h;
        h = Object.keys(e.Z.ba).length;
        return d.__read(f.filter(function(k) {
            var l;
            return g.Zf(e.Z) === (0,
            c.Zf)(k.context.Nd.key) && (1 === h || h === Object.keys((null === (l = k.Z) || undefined === l ? undefined : l.Z.ba) || ({})).length);
        }), 1)[0];
    }
    ;
    return g;
}
)();
b.Abb =

// Detected exports: Abb
