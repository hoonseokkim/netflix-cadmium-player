/**
 * Netflix Cadmium Playercore - Module 59458
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: ePb
 * Original signature: function(t, b)
 */

// Webpack module 59458
// Parameters: t (module), b (exports)
export function ePb(a, d, p) {
    undefined === p && (p = {});
    a = Math.random() * (d - a) + a;
    return p.aDc ? p.uCc ? Math.round(a) : Math.floor(a) : a;
}
;
