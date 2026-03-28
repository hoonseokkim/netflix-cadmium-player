/**
 * Netflix Cadmium Playercore - Module 32249
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 32249
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
b = a(81181);  // import from Module_81181
d = a(70999);  // import from Module_70999
p = b.$Ac();
c = p && a(27595);
g = a(8435)("Object.prototype.propertyIsEnumerable");
t.exports = function(f, e, h, k, l, m) {
    if (!d) {
        if (!f(m) || !m["[[Configurable]]"] || !m["[[Writable]]"] || (l in k) && g(k, l) !== !!m["[[Enumerable]]"])
            return false;
        f = m["[[Value]]"];
        k[l] = f;
        return e(k[l], f);
    }
    if (p && "length" === l && ("[[Value]]"in m) && c(k) && k.length !== m["[[Value]]"])
        return (k.length = m["[[Value]]"],
        k.length === m["[[Value]]"]);
    d(k, l, h(m));
    return true;
}

