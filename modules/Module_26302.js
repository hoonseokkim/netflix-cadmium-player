/**
 * Netflix Cadmium Playercore - Module 26302
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 26302
// Parameters: t (module), b (exports), a (require)

var d, p, c;
b = a(8435);  // import from Module_08435
d = b("String.prototype.valueOf");
p = b("Object.prototype.toString");
c = a(67226)();
t.exports = function(g) {
    if ("string" === typeof g)
        g = true;
    else if (g && "object" === typeof g) {
        if (c)
            try {
                d(g);
                g = true;
            } catch (f) {
                g = false;
            }
        else
            g = "[object String]" === p(g);
    } else
        g = false;
    return g;
}

