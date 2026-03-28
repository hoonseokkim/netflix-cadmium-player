/**
 * Netflix Cadmium Playercore - Module 54277
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [8435, 67226]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 54277
// Parameters: t (module), b (exports), a (require)
var d, p, c;
b = a(8435);
d = b("Date.prototype.getDay");
p = b("Object.prototype.toString");
c = a(67226)();
t.exports = function(g) {
    if ("object" !== typeof g || null === g)
        g = false;
    else if (c)
        try {
            d(g);
            g = true;
        } catch (f) {
            g = false;
        }
    else
        g = "[object Date]" === p(g);
    return g;
}
;
