/**
 * Netflix Cadmium Playercore - Module 22894
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: T0b
 */

// Webpack module 22894
// Parameters: t, b

export function T0b(a) {
    var c, g, f, e;
    function d() {
        if (f)
            for (var h; h = c.pop(); )
                h(e);
    }
    function p(h) {
        f = true;
        e = h;
        d();
    }
    c = [];
    return function(h) {
        c.push(h);
        g || (g = true,
        a(p));
        d();
    }
    ;
}
;

// Detected exports: T0b
