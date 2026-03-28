/**
 * Netflix Cadmium Playercore - Module 93358
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 93358
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
b = a(16805);  // import from Module_16805
d = a(58380);  // import from Module_58380
p = a(46546);  // import from Module_46546
c = !({
    toString: null
}).propertyIsEnumerable("toString");
g = ("constructor valueOf isPrototypeOf toString propertyIsEnumerable hasOwnProperty toLocaleString").split(" ");
f = (function() {
    return arguments.propertyIsEnumerable("length");
}
)();
a = b("function" !== typeof Object.keys || f ? function(e) {
    var h, k, l, m;
    if (Object(e) !== e)
        return [];
    h = [];
    k = f && p(e);
    for (l in e)
        !d(l, e) || k && "length" === l || (h[h.length] = l);
    if (c)
        for (k = g.length - 1; 0 <= k; ) {
            l = g[k];
            if (m = d(l, e)) {
                a: {
                    for (m = 0; m < h.length; ) {
                        if (h[m] === l) {
                            m = true;
                            break a;
                        }
                        m += 1;
                    }
                    m = false;
                }
                m = !m;
            }
            m && (h[h.length] = l);
            --k;
        }
    return h;
}
: function(e) {
    return Object(e) !== e ? [] : Object.keys(e);
}
);
t.exports =

