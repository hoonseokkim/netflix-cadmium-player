/**
 * Netflix Cadmium Playercore - Module 84419
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: gJb
 * Original signature: function(t, b)
 */

// Webpack module 84419
// Parameters: t (module), b (exports)
export function gJb(a, d) {
    var p, c;
    p = a & 65535;
    c = d & 65535;
    return p * c + (((a >>> 16 & 65535) * c + p * (d >>> 16 & 65535) & 65535) << 16) | 0;
}
;
