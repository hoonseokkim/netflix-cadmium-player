/**
 * Netflix Cadmium Playercore - Module 47669
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 47669
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
b = a(67286);  // import from Module_67286
d = a(75195);  // import from Module_75195
p = a(81181)();
c = a(50326);  // import from Module_50326
g = a(5408);  // import from Module_05408
f = b("%Math.floor%");
t.exports = function(e, h) {
    var k, l, m, n;
    if ("function" !== typeof e)
        throw new g("`fn` is not a function");
    if ("number" !== typeof h || 0 > h || 4294967295 < h || f(h) !== h)
        throw new g("`length` must be a positive 32-bit integer");
    k = 2 < arguments.length && !!arguments[2];
    l = true;
    m = true;
    if (("length"in e) && c) {
        n = c(e, "length");
        n && !n.configurable && (l = false);
        n && !n.writable && (m = false);
    }
    if (l || m || !k)
        p ? d(e, "length", h, true, true) : d(e, "length", h);
    return e;
}

