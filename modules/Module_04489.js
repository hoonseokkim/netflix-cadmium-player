/**
 * Netflix Cadmium Playercore - Module 4489
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 4489
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.sBb = void 0;
d = a(59839);
b.sBb = function(p, c) {
    return p.reduce(function(g, f) {
        var e;
        e = c(f);
        f.$A().forEach(function(h) {
            return g.AOa(h.mediaType, h.bL, !e);
        });
        return g;
    }, new d.Mjb());
}
;


// Detected exports: sBb