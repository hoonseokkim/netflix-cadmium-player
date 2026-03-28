/**
 * Netflix Cadmium Playercore - Module 19705
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: VL
 * Original signature: function(t, b)
 */

// Webpack module 19705
// Parameters: t (module), b (exports)
export function VL(a, d) {
    var p;
    a = Math.abs(a);
    for (d = Math.abs(d); d; ) {
        p = d;
        d = a % d;
        a = p;
    }
    return a;
}
;
