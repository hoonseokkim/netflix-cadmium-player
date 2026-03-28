/**
 * Netflix Cadmium Playercore - Module 30962
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: omc
 */

// Webpack module 30962
// Parameters: t (module), b (exports), a (require)

var p;
function d(c) {
    for (var g = 5381, f = 0; f < c.length; f++)
        g = (g << 5) + g + c.charCodeAt(f) | 0;
    return g >>> 0;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function omc(c) {
    var g;
    g = d(c);
    return function() {
        var f;
        g |= 0;
        g = g + 1831565813 | 0;
        f = (0,
        p.gJb)(g ^ g >>> 15, 1 | g);
        f ^= f + (0,
        p.gJb)(f ^ f >>> 7, 61 | f);
        return ((f ^ f >>> 14) >>> 0) / 4294967296;
    }
    ;
}
;
p = a(9117

// Detected exports: omc
