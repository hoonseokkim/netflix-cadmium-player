/**
 * Netflix Cadmium Playercore - Module 8414
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 8414
// Parameters: t (module), b (exports), a (require)

var d, p;
d = a(84357);  // import from Module_84357
p = a(11972);  // import from Module_11972
t.exports = function(c, g, f) {
    return function() {
        var e, h;
        if (0 === arguments.length)
            return f();
        e = Array.prototype.slice.call(arguments, 0);
        h = e.pop();
        if (!d(h)) {
            for (var k = 0; k < c.length; ) {
                if ("function" === typeof h[c[k]])
                    return h[c[k]].apply(h, e);
                k += 1;
            }
            if (p(h))
                return g.apply(null, e)(h);
        }
        return f.apply(this, arguments);
    }
    ;
}

