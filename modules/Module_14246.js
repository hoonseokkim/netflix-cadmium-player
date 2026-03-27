/**
 * Netflix Cadmium Playercore - Module 14246
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 14246
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(93731);
p = a(8367);
c = a(93928);
g = a(53809);
f = a(50612);
Object.defineProperties(b, {
    TJ: {
        enumerable: true,
        get: function() {
            return f.TJ;
        }
    }
});
export function pWa(e) {
    switch (e.sva) {
    case "manifold":
        return new d.oHa(e);
    case "stddev":
        return new c.Vlb(e);
    case "ci":
        return new g.Xab(e);
    default:
        return new p.Flb(e);
    }
}
;

// Detected exports: pWa, TJ