/**
 * Netflix Cadmium Playercore - Module 16500
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 16500
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f, e) {
    return function() {
        var n;
        for (var h = [], k = 0, l = g, m = 0; m < f.length || k < arguments.length; ) {
            if (m < f.length && (!c(f[m]) || k >= arguments.length))
                n = f[m];
            else
                (n = arguments[k],
                k += 1);
            h[m] = n;
            c(n) || --l;
            m += 1;
        }
        return 0 >= l ? e.apply(this, h) : p(l, d(g, h, e));
    }
    ;
}
p = a(35375);  // import from Module_35375
c = a(28198);  // import from Module_28198
t.exports =

