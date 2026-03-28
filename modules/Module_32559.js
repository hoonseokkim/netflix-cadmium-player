/**
 * Netflix Cadmium Playercore - Module 32559
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: MUa
 * Original signature: function(t, b)
 */

// Webpack module 32559
// Parameters: t (module), b (exports)
export function MUa(a) {
    var c;
    for (var d = "", p = 0; 6 > p; p++) {
        c = Math.floor(36 * a());
        d += ("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")[c];
    }
    return d;
}
;
