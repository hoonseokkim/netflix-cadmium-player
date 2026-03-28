/**
 * Netflix Cadmium Playercore - Module 75195
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 75195
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
d = a(70999);  // import from Module_70999
p = a(48342);  // import from Module_48342
c = a(5408);  // import from Module_05408
g = a(50326);  // import from Module_50326
t.exports = function(f, e, h) {
    var k, l, m, n, q;
    if (!f || "object" !== typeof f && "function" !== typeof f)
        throw new c("`obj` must be an object or a function`");
    if ("string" !== typeof e && "symbol" !== typeof e)
        throw new c("`property` must be a string or a symbol`");
    if (3 < arguments.length && "boolean" !== typeof arguments[3] && null !== arguments[3])
        throw new c("`nonEnumerable`, if provided, must be a boolean or null");
    if (4 < arguments.length && "boolean" !== typeof arguments[4] && null !== arguments[4])
        throw new c("`nonWritable`, if provided, must be a boolean or null");
    if (5 < arguments.length && "boolean" !== typeof arguments[5] && null !== arguments[5])
        throw new c("`nonConfigurable`, if provided, must be a boolean or null");
    if (6 < arguments.length && "boolean" !== typeof arguments[6])
        throw new c("`loose`, if provided, must be a boolean");
    k = 3 < arguments.length ? arguments[3] : null;
    l = 4 < arguments.length ? arguments[4] : null;
    m = 5 < arguments.length ? arguments[5] : null;
    n = 6 < arguments.length ? arguments[6] : false;
    q = !!g && g(f, e);
    if (d)
        d(f, e, {
            configurable: null === m && q ? q.configurable : !m,
            enumerable: null === k && q ? q.enumerable : !k,
            value: h,
            writable: null === l && q ? q.writable : !l
        });
    else if (n || !k && !l && !m)
        f[e] = h;
    else
        throw new p("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}

