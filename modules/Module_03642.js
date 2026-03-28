/**
 * Netflix Cadmium Playercore - Module 3642
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 3642
// Parameters: t (module), b (exports), a (require)

var d, p, c;
d = a(5408);  // import from Module_05408
p = a(72196);  // import from Module_72196
c = {
    __proto__: null,
    "[[Configurable]]": true,
    "[[Enumerable]]": true,
    "[[Get]]": true,
    "[[Set]]": true,
    "[[Value]]": true,
    "[[Writable]]": true
};
t.exports = function(g) {
    if (!g || "object" !== typeof g)
        return false;
    for (var f in g)
        if (p(g, f) && !c[f])
            return false;
    f = p(g, "[[Value]]") || p(g, "[[Writable]]");
    g = p(g, "[[Get]]") || p(g, "[[Set]]");
    if (f && g)
        throw new d("Property Descriptors may not be both accessor and data descriptors");
    return true;
}

