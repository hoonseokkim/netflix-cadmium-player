/**
 * Netflix Cadmium Playercore - Module 8435
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [67286, 68381]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 8435
// Parameters: t (module), b (exports), a (require)
var d, p, c;
d = a(67286);
p = a(68381);
c = p([d("%String.prototype.indexOf%")]);
t.exports = function(g, f) {
    f = d(g, !!f);
    return "function" === typeof f && -1 < c(g, ".prototype.") ? p([f]) : f;
}
;
