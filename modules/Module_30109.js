/**
 * Netflix Cadmium Playercore - Module 30109
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: tRc
 * Original signature: function(t, b)
 */

// Webpack module 30109
// Parameters: t (module), b (exports)
export function tRc(a, d, p) {
    15 === d && (d += a.read(8) - 1);
    0 < d && 1 !== p.dH && !p.aV ? (a.write(4, 0),
    a.advance(8 * d - 4)) : a.advance(8 * d);
}
;
