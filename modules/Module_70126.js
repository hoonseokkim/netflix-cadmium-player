/**
 * Netflix Cadmium Playercore - Module 70126
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [5408, 3642, 84902]
 * Original signature: function(t, b, a)
 */

// Webpack module 70126
// Parameters: t (module), b (exports), a (require)
var d, p, c;
d = a(5408);
p = a(3642);
c = a(84902);
t.exports = function(g) {
    if ("undefined" !== typeof g && !p(g))
        throw new d("Assertion failed: `Desc` must be a Property Descriptor");
    return c(g);
}
;
