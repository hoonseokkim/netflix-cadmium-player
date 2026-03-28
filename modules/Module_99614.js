/**
 * Netflix Cadmium Playercore - Module 99614
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Pfc, Ofc
 */

// Webpack module 99614
// Parameters: t, b

var a, d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Pfc(p) {
    var c, g, f;
    c = p.Pga;
    g = p.QRa;
    f = p.Kwb;
    return g < p.c0a ? Infinity : g >= p.b7a ? 1E3 / c : 1E3 * (d / Math.pow(g / (p.Hwb / (Math.pow(2, 1 / f) - a)) + a, f) + 1) / c;
}
;
export function Ofc(p) {
    var c, g;
    c = p.Pga;
    g = p.QRa;
    return g < p.c0a ? Infinity : g > p.b7a ? 1E3 / c : 1E3 * (p.Cec + 1) / c;
}
;
a = .001;
d = 9;

// Detected exports: Pfc, Ofc
