/**
 * Netflix Cadmium Playercore - Module 20451
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 20451
// Parameters: t (module), b (exports), a (require)

var d, p, c;
d = a(90982)("%Reflect.construct%", true);
b = a(794);  // import from Module_00794
try {
    b({}, "", {
        "[[Get]]": function() {}
    });
} catch (g) {
    b = null;
}
if (b && d) {
    p = {};
    c = {};
    b(c, "length", {
        "[[Get]]": function() {
            throw p;
        },
        "[[Enumerable]]": true
    });
    t.exports = function(g) {
        try {
            d(g, c);
        } catch (f) {
            return f === p;
        }
    }
    ;
} else
    t.exports = function(g) {
        return "function" === typeof g && !!g.prototype;
    }

