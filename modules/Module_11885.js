/**
 * Netflix Cadmium Playercore - Module 11885
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [67286, 5408]
 * Original signature: function(t, b, a)
 */

// Webpack module 11885
// Parameters: t (module), b (exports), a (require)
var d, p;
d = a(67286)("%String%");
p = a(5408);
t.exports = function(c) {
    if ("symbol" === typeof c)
        throw new p("Cannot convert a Symbol value to a string");
    return d(c);
}
;
