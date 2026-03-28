/**
 * Netflix Cadmium Playercore - Module 38733
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [5408, 72196, 3642]
 * Original signature: function(t, b, a)
 */

// Webpack module 38733
// Parameters: t (module), b (exports), a (require)
var d, p, c;
d = a(5408);
p = a(72196);
c = a(3642);
t.exports = function(g) {
    if ("undefined" === typeof g)
        return false;
    if (!c(g))
        throw new d("Assertion failed: `Desc` must be a Property Descriptor");
    return p(g, "[[Value]]") || p(g, "[[Writable]]") ? true : false;
}
;
