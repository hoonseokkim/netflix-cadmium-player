/**
 * Netflix Cadmium Playercore - Module 27595
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [67286, 8435]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 27595
// Parameters: t (module), b (exports), a (require)
var d;
b = a(67286)("%Array%");
d = !b.isArray && a(8435)("Object.prototype.toString");
t.exports = b.isArray || (function(p) {
    return "[object Array]" === d(p);
}
);
