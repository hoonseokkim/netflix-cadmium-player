/**
 * Netflix Cadmium Playercore - Module 33905
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [16805, 84357, 86807]
 * Original signature: function(t, b, a)
 */

// Webpack module 33905
// Parameters: t (module), b (exports), a (require)
var d, p;
b = a(16805);
d = a(84357);
p = a(86807);
a = b(function(c) {
    return d(c) ? true : !c || "object" !== typeof c || p(c) ? false : 1 === c.nodeType ? !!c.length : 0 === c.length ? true : 0 < c.length ? c.hasOwnProperty(0) && c.hasOwnProperty(c.length - 1) : false;
});
t.exports = a;
