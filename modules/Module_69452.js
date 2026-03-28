/**
 * Netflix Cadmium Playercore - Module 69452
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 69452
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n;
d = a(76113);  // import from Module_76113
p = a(69808);  // import from Module_69808
c = a(48668);  // import from Module_48668
g = a(99939);  // import from Module_99939
f = a(97911);  // import from Module_97911
e = a(51832);  // import from Module_51832
b = a(67286);  // import from Module_67286
h = a(62680);  // import from Module_62680
k = a(26302);  // import from Module_26302
l = h("String.prototype.charAt");
m = b("%Array.prototype.indexOf%");
n = b("%Math.max%");
t.exports = function(q) {
    var r, u, v;
    r = 1 < arguments.length ? d(arguments[1]) : 0;
    if (m && !f(q) && e(r) && "undefined" !== typeof q)
        return -1 < m.apply(this, arguments);
    u = c(this);
    v = p(u.length);
    if (0 === v)
        return false;
    for (r = 0 <= r ? r : n(0, v + r); r < v; ) {
        if (g(q, k(u) ? l(u, r) : u[r]))
            return true;
        r += 1;
    }
    return false;
}

