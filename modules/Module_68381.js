/**
 * Netflix Cadmium Playercore - Module 68381
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [4090, 5408, 68418, 29919]
 * Original signature: function(t, b, a)
 */

// Webpack module 68381
// Parameters: t (module), b (exports), a (require)
var d, p, c, g;
d = a(4090);
p = a(5408);
c = a(68418);
g = a(29919);
t.exports = function(f) {
    if (1 > f.length || "function" !== typeof f[0])
        throw new p("a function is required");
    return g(d, c, f);
}
;
