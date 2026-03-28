/**
 * Netflix Cadmium Playercore - Module 18468
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 18468
// Parameters: t (module), b (exports), a (require)

var c, g, f, e;
function d(h, k, l) {
    for (var m = l.next(); !m.done; ) {
        if ((k = h["@@transducer/step"](k, m.value)) && k["@@transducer/reduced"]) {
            k = k["@@transducer/value"];
            break;
        }
        m = l.next();
    }
    return h["@@transducer/result"](k);
}
function p(h, k, l, m) {
    return h["@@transducer/result"](l[m](f(h["@@transducer/step"], h), k));
}
c = a(33905);  // import from Module_33905
g = a(71402);  // import from Module_71402
f = a(23614);  // import from Module_23614
e = "undefined" !== typeof Symbol ? Symbol.iterator : "@@iterator";
t.exports = function(h, k, l) {
    "function" === typeof h && (h = g(h));
    if (c(l)) {
        for (var m = 0, n = l.length; m < n; ) {
            if ((k = h["@@transducer/step"](k, l[m])) && k["@@transducer/reduced"]) {
                k = k["@@transducer/value"];
                break;
            }
            m += 1;
        }
        return h["@@transducer/result"](k);
    }
    if ("function" === typeof l["fantasy-land/reduce"])
        return p(h, k, l, "fantasy-land/reduce");
    if (null != l[e])
        return d(h, k, l[e]());
    if ("function" === typeof l.next)
        return d(h, k, l);
    if ("function" === typeof l.reduce)
        return p(h, k, l, "reduce");
    throw new TypeError("reduce: list must be array or iterable");
}

