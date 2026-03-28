/**
 * Netflix Cadmium Playercore - Module 6312
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Error handling
 * Exports: IH
 */

// Webpack module 6312
// Parameters: t, b

var a;
a = this && this.__values || (function(d) {
    var p, c, g;
    p = "function" === typeof Symbol && Symbol.iterator;
    c = p && d[p];
    g = 0;
    if (c)
        return c.call(d);
    if (d && "number" === typeof d.length)
        return {
            next: function() {
                d && g >= d.length && (d = undefined);
                return {
                    value: d && d[g++],
                    done: !d
                };
            }
        };
    throw new TypeError(p ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
);
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const IH = undefined;
export function IH(d) {
    var p, c, e;
    if (!Array.isArray(d))
        return d;
    c = {};
    try {
        for (var g = a(d), f = g.next(); !f.done; f = g.next()) {
            e = f.value;
            c[e] = e;
        }
    } catch (k) {
        var h;
        h = {
            error: k
        };
    } finally {
        try {
            f && !f.done && (p = g.return) && p.call(g);
        } finally {
            if (h)
                throw h.error;
        }
    }
    return c;
}
;

// Detected exports: IH
