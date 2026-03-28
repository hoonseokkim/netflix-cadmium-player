/**
 * Netflix Cadmium Playercore - Module 18132
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [96222]
 * Original signature: function(t, b, a)
 */

// Webpack module 18132
// Parameters: t (module), b (exports), a (require)
var d;
d = a(96222);
t.exports = function(p) {
    return "symbol" === typeof p ? "Symbol" : "bigint" === typeof p ? "BigInt" : d(p);
}
;
