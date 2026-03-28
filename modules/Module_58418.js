/**
 * Netflix Cadmium Playercore - Module 58418
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: yDb
 * Original signature: function(t, b)
 */

// Webpack module 58418
// Parameters: t (module), b (exports)
export function yDb(a) {
    var d, p, c, g, f;
    d = a.wUc;
    p = a.dfc;
    c = a.KHc;
    g = a.Ued;
    f = c / a.Smc;
    return Math.min(p * a.CJc, p - (a.Da ? d * c * 1E3 / 8 : p * f)) - (undefined === g ? 150 : g) / 1E3 * (p / d);
}
;
