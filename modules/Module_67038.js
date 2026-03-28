/**
 * Netflix Cadmium Playercore - Module 67038
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: uRc
 */

// Webpack module 67038
// Parameters: t (module), b (exports), a (require)

var d, p;
export function uRc(c, g, f) {
    var e, h, k;
    if (4095 === c.read(12)) {
        c.advance(3);
        e = !!c.read(1);
        h = c.read(2) + 1;
        f = c.read(4);
        c.advance(8);
        k = c.read(13);
        c.advance(13 + (e ? 0 : 16));
        e = {
            dw: h,
            yza: f,
            nuc: k
        };
    } else
        c.reverse(12);
    (0,
    d.assert)(undefined !== f);
    (0,
    p.CRc)(c, f, g);
    return e;
}
;
d = a(87606);  // import from Module_87606
p = a(97

// Detected exports: uRc
