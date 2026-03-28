/**
 * Netflix Cadmium Playercore - Module 76113
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: 6 dependencies
 * Original signature: function(t, b, a)
 */

// Webpack module 76113
// Parameters: t (module), b (exports), a (require)
var d, p, c, g, f, e;
d = a(46382);
p = a(26827);
c = a(84583);
g = a(68806);
f = a(88562);
e = a(82026);
t.exports = function(h) {
    var k;
    h = c(h);
    if (g(h) || 0 === h)
        return 0;
    if (!f(h))
        return h;
    k = p(d(h));
    return 0 === k ? 0 : e(h) * k;
}
;
