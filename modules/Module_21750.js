/**
 * Netflix Cadmium Playercore - Module 21750
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [78354, 2938, 5141]
 * Original signature: function(t, b, a)
 */

// Webpack module 21750
// Parameters: t (module), b (exports), a (require)
var d, p, c;
d = a(78354);
p = a(2938);
c = a(5141);
t.exports = d ? function(g) {
    return d(g);
}
: p ? function(g) {
    if (!g || "object" !== typeof g && "function" !== typeof g)
        throw new TypeError("getProto: not an object");
    return p(g);
}
: c ? function(g) {
    return c(g);
}
: null;
