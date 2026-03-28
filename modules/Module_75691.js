/**
 * Netflix Cadmium Playercore - Module 75691
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 75691
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m;
if (!Object.keys) {
    d = Object.prototype.hasOwnProperty;
    p = Object.prototype.toString;
    c = a(30801);  // import from Module_30801
    b = Object.prototype.propertyIsEnumerable;
    g = !b.call({
        toString: null
    }, "toString");
    f = b.call(function() {}, "prototype");
    e = ("toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor").split(" ");
    h = function(n) {
        var q;
        q = n.constructor;
        return q && q.prototype === n;
    }
    ;
    k = {
        l5c: true,
        m5c: true,
        n5c: true,
        o5c: true,
        p5c: true,
        q5c: true,
        r5c: true,
        s5c: true,
        t5c: true,
        u5c: true,
        v5c: true,
        w5c: true,
        x5c: true,
        y5c: true,
        z5c: true,
        A5c: true,
        B5c: true,
        C5c: true,
        D5c: true,
        E5c: true,
        F5c: true,
        G5c: true,
        H5c: true
    };
    l = (function() {
        if ("undefined" === typeof Da)
            return false;
        for (var n in Da)
            try {
                if (!k["$" + n] && d.call(Da, n) && null !== Da[n] && "object" === typeof Da[n])
                    try {
                        h(Da[n]);
                    } catch (q) {
                        return true;
                    }
            } catch (q) {
                return true;
            }
        return false;
    }
    )();
    m = function(n) {
        var q, r, u, v, w, y;
        q = null !== n && "object" === typeof n;
        r = "[object Function]" === p.call(n);
        u = c(n);
        v = q && "[object String]" === p.call(n);
        w = [];
        if (!q && !r && !u)
            throw new TypeError("Object.keys called on a non-object");
        q = f && r;
        if (v && 0 < n.length && !d.call(n, 0))
            for (v = 0; v < n.length; ++v)
                w.push(String(v));
        if (u && 0 < n.length)
            for (u = 0; u < n.length; ++u)
                w.push(String(u));
        else
            for (var x in n)
                q && "prototype" === x || !d.call(n, x) || w.push(String(x));
        if (g) {
            if ("undefined" !== typeof Da && l)
                try {
                    y = h(n);
                } catch (A) {
                    y = false;
                }
            else
                y = h(n);
            for (u = 0; u < e.length; ++u)
                y && "constructor" === e[u] || !d.call(n, e[u]) || w.push(e[u]);
        }
        return w;
    }
    ;
}
t.exports =

