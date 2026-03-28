/**
 * Netflix Cadmium Playercore - Module 88562
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [68806]
 * Original signature: function(t, b, a)
 */

// Webpack module 88562
// Parameters: t (module), b (exports), a (require)
var d;
d = a(68806);
t.exports = function(p) {
    return ("number" === typeof p || "bigint" === typeof p) && !d(p) && Infinity !== p && -Infinity !== p;
}
;
