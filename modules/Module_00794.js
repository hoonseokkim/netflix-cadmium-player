/**
 * Netflix Cadmium Playercore - Module 794
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 */

// Webpack module 794
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;
d = a(5408);  // import from Module_05408
p = a(5158);  // import from Module_05158
c = a(3642);  // import from Module_03642
g = a(32249);  // import from Module_32249
f = a(70126);  // import from Module_70126
e = a(38733);  // import from Module_38733
h = a(51461);  // import from Module_51461
k = a(4);
l = a(83891);  // import from Module_83891
t.exports = function(m, n, q) {
    if (!p(m))
        throw new d("Assertion failed: Type(O) is not Object");
    if (!h(n))
        throw new d("Assertion failed: P is not a Property Key");
    q = c(q) ? q : l(q);
    if (!c(q))
        throw new d("Assertion failed: Desc is not a valid Property Descriptor");
    return g(e, k, f, m, n, q);
}

