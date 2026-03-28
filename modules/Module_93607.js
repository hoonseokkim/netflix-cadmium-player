/**
 * Netflix Cadmium Playercore - Module 93607
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [81181, 75195, 33871]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 93607
// Parameters: t (module), b (exports), a (require)
var d, p, c;
d = a(81181)();
p = a(75195);
c = a(33871);
t.exports = function() {
    var g;
    g = c();
    String.prototype.trim !== g && (d ? p(String.prototype, "trim", g, true) : p(String.prototype, "trim", g));
    return g;
}
;
