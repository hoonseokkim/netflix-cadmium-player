/**
 * Netflix Cadmium Playercore - Module 46382
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [14383]
 * Original signature: function(t, b, a)
 */

// Webpack module 46382
// Parameters: t (module), b (exports), a (require)
var d;
d = a(14383);
t.exports = function(p) {
    return "bigint" === typeof p ? BigInt(d(Number(p))) : d(p);
}
;
