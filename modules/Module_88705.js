/**
 * Netflix Cadmium Playercore - Module 88705
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 88705
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
b = a(8435);  // import from Module_08435
d = b("Object.prototype.toString");
p = a(32636)();
a = a(63671);  // import from Module_63671
if (p) {
    c = b("Symbol.prototype.toString");
    g = a(/^Symbol\(.*\)$/);
    t.exports = function(f) {
        if ("symbol" === typeof f)
            return true;
        if (!f || "object" !== typeof f || "[object Symbol]" !== d(f))
            return false;
        try {
            return "symbol" !== typeof f.valueOf() ? false : g(c(f));
        } catch (e) {
            return false;
        }
    }
    ;
} else
    t.exports = function() {
        return false;
    }

