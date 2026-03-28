/**
 * Netflix Cadmium Playercore - Module 32887
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [57897, 61386]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 32887
// Parameters: t (module), b (exports), a (require)
var d, p;
d = a(57897);
p = a(61386);
t.exports = function() {
    d();
    return "function" === typeof Promise.prototype["finally"] ? Promise.prototype["finally"] : p;
}
;
