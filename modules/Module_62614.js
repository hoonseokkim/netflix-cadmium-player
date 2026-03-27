/**
 * Netflix Cadmium Playercore - Module 62614
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 62614
// Parameters: t (module), b (exports), N/A (require)


Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Fxc = function(a) {
    var d;
    a = a.Vi;
    if (!a)
        return 0;
    d = a.iV;
    return 1E3 * Object.keys(d).reduce(function(p, c) {
        c = d[c];
        return Math.max(p, c.duration / c.O);
    }, 0);
}
;


// Detected exports: Fxc