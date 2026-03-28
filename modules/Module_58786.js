/**
 * Netflix Cadmium Playercore - Module 58786
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 58786
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;
b = a(8435);  // import from Module_08435
d = a(67226)();
p = a(72196);  // import from Module_72196
c = a(50326);  // import from Module_50326
if (d) {
    g = b("RegExp.prototype.exec");
    f = {};
    a = function() {
        throw f;
    }
    ;
    e = {
        toString: a,
        valueOf: a
    };
    "symbol" === typeof Symbol.toPrimitive && (e[Symbol.toPrimitive] = a);
    a = function(k) {
        var l;
        if (!k || "object" !== typeof k)
            return false;
        l = c(k, "lastIndex");
        if (!l || !p(l, "value"))
            return false;
        try {
            g(k, e);
        } catch (m) {
            return m === f;
        }
    }
    ;
} else {
    h = b("Object.prototype.toString");
    a = function(k) {
        return !k || "object" !== typeof k && "function" !== typeof k ? false : "[object RegExp]" === h(k);
    }
    ;
}
t.exports =

