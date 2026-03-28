/**
 * Netflix Cadmium Playercore - Module 89429
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [47669, 70999, 68381, 26497]
 * Original signature: function(t, b, a)
 */

// Webpack module 89429
// Parameters: t (module), b (exports), a (require)
var d, p;
d = a(47669);
b = a(70999);
p = a(68381);
a = a(26497);
t.exports = function(c) {
    var g, f;
    g = p(arguments);
    f = c.length - (arguments.length - 1);
    return d(g, 1 + (0 < f ? f : 0), true);
}
;
b ? b(t.exports, "apply", {
    value: a
}) : t.exports.apply = a;
