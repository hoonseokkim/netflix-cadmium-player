/**
 * Netflix Cadmium Playercore - Module 62680
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [67286, 89429]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 62680
// Parameters: t (module), b (exports), a (require)
var d, p, c;
d = a(67286);
p = a(89429);
c = p(d("String.prototype.indexOf"));
t.exports = function(g, f) {
    f = d(g, !!f);
    return "function" === typeof f && -1 < c(g, ".prototype.") ? p(f) : f;
}
;
