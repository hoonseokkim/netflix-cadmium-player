/**
 * Netflix Cadmium Playercore - Module 28600
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: cRb; Dependencies: [66164]
 * Original signature: function(t, b, a)
 */

// Webpack module 28600
// Parameters: t (module), b (exports), a (require)
var d;
export function cRb(p, c) {
    p = d.platform.storage.get(p);
    return c ? c(p) : p;
}
;
d = a(66164);
