/**
 * Netflix Cadmium Playercore - Module 26827
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [45736]
 * Original signature: function(t, b, a)
 */

// Webpack module 26827
// Parameters: t (module), b (exports), a (require)
var d;
d = a(45736);
t.exports = function(p) {
    return "bigint" === typeof p ? p : d(p);
}
;
