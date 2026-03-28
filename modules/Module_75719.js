/**
 * Netflix Cadmium Playercore - Module 75719
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: jcc, aYc
 */

// Webpack module 75719
// Parameters: t (module), b (exports), a (require)

var d, p;
export function jcc(c, g, f) {
    var e, h;
    e = c.read(16);
    (0,
    d.assert)(2935 === e);
    e = 2 * ((c.read(16) & 2047) + 1);
    c.advance(13);
    h = c.read(5);
    c.reverse(5);
    f && (g *= -h / f);
    c.write(5, Math.min(31, Math.max(1, Math.floor(h + g))));
    return {
        puc: e
    };
}
;
export function aYc(c) {
    var g;
    g = (0,
    p.Mkc)(c.subarray(2, c.length - 2));
    c[c.length - 2] = g >> 8;
    c[c.length - 1] = g & 255;
}
;
d = a(87606);  // import from Module_87606
p = a(2515

// Detected exports: jcc, aYc
