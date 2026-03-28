/**
 * Netflix Cadmium Playercore - Module 79602
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: sRc; Dependencies: [50539]
 * Original signature: function(t, b, a)
 */

// Webpack module 79602
// Parameters: t (module), b (exports), a (require)
var d;
export function sRc(p, c, g) {
    var f, e;
    f = p.read(1);
    if (f) {
        e = new d.zeb(p,f,c);
        1 === p.read(2) && p.advance(e.x2 * e.rea);
    }
    (0,
    d.EOb)(p, c, e, g);
    (0,
    d.EOb)(p, c, e, g);
}
;
d = a(50539);
