/**
 * Netflix Cadmium Playercore - Module 57349
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: k_
 * Purpose: Encryption/Decryption, Logging, Error handling
 */

// Webpack module 57349
// Parameters: t (module), b (exports)

var a, d;
a = this && this.__read || (function(p, c) {
    var g, f, e;
    g = "function" === typeof Symbol && p[Symbol.iterator];
    if (!g)
        return p;
    p = g.call(p);
    e = [];
    try {
        for (; (undefined === c || 0 < c--) && !(f = p.next()).done; )
            e.push(f.value);
    } catch (k) {
        var h;
        h = {
            error: k
        };
    } finally {
        try {
            f && !f.done && (g = p["return"]) && g.call(p);
        } finally {
            if (h)
                throw h.error;
        }
    }
    return e;
}
);
d = this && this.__values || (function(p) {
    var c, g, f;
    c = "function" === typeof Symbol && Symbol.iterator;
    g = c && p[c];
    f = 0;
    if (g)
        return g.call(p);
    if (p && "number" === typeof p.length)
        return {
            next: function() {
                p && f >= p.length && (p = undefined);
                return {
                    value: p && p[f++],
                    done: !p
                };
            }
        };
    throw new TypeError(c ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
);

export const k_ = (function() {
    var c, g, f, e, h, k;
    function p(l, m) {
        "function" === typeof m && (k[l] = null,
        g(('Invoking factory for "').concat(l, '"')),
        Promise.resolve(m()).then(function(n) {
            g(('Exporting "').concat(l, '" from factory'));
            delete k[l];
            b.k_.msc(l, n);
        }));
    }
    c = "undefined" !== typeof globalThis ? globalThis : Function("return this")();
    g = c.Nwa ? function(l) {
        return c.Nwa.log.info(l, "DALI");
    }
    : function() {}
    ;
    f = c.k_;
    if (f)
        return (g(("Found global v").concat(f.version, ", we are v").concat(1)),
        g(("Exported components ").concat(JSON.stringify(f.nsc))),
        f);
    g(("Installing v").concat(1));
    e = {};
    h = {};
    k = {};
    f = {
        get version() {
            return 1;
        },
        get nsc() {
            return Object.keys(e);
        },
        get: function(l) {
            return e[l];
        },
        import: function(l) {
            var m, n;
            m = e[l];
            if (m)
                return Promise.resolve(m);
            m = a(h[l] || [], 1)[0];
            if (!m) {
                m = new Promise(function(q) {
                    n = q;
                }
                );
                h[l] = [m, n];
                g(('First import for "').concat(l, '" awaiting'));
            }
            p(l, k[l]);
            return m;
        },
        msc: function(l, m) {
            var n;
            if ((l in e))
                return (g(('Ignoring duplicate export of "').concat(l, '"')),
                false);
            if ((l in k))
                return (g(('Ignoring export of "').concat(l, '" because a factory exists')),
                false);
            e[l] = m;
            g(('Exported "').concat(l, '"'));
            n = a(h[l] || [], 2)[1];
            delete h[l];
            null === n || undefined === n ? undefined : n(m);
            return true;
        },
        QRc: function(l, m) {
            if ((l in e))
                return (g(('Ignoring factory for "').concat(l, '" since it has already been exported')),
                false);
            if ((l in k))
                return (g(('Ignoring duplicate factory for "').concat(l, '"')),
                false);
            k[l] = m;
            g(('Installed factory for "').concat(l, '"'));
            (l in h) && p(l, m);
            return true;
        },
        Ue: function() {
            var l, m, n, u;
            try {
                for (var q = d(Object.keys(e)), r = q.next(); !r.done; r = q.next()) {
                    u = r.value;
                    delete e[u];
                }
            } catch (C) {
                var v;
                v = {
                    error: C
                };
            } finally {
                try {
                    r && !r.done && (l = q.return) && l.call(q);
                } finally {
                    if (v)
                        throw v.error;
                }
            }
            try {
                for (var w = d(Object.keys(h)), x = w.next(); !x.done; x = w.next())
                    (u = x.value,
                    delete h[u]);
            } catch (C) {
                var y;
                y = {
                    error: C
                };
            } finally {
                try {
                    x && !x.done && (m = w.return) && m.call(w);
                } finally {
                    if (y)
                        throw y.error;
                }
            }
            try {
                for (var A = d(Object.keys(k)), z = A.next(); !z.done; z = A.next())
                    (u = z.value,
                    delete k[u]);
            } catch (C) {
                var B;
                B = {
                    error: C
                };
            } finally {
                try {
                    z && !z.done && (n = A.return) && n.call(A);
                } finally {
                    if (B)
                        throw B.error;
                }
            }
        }
    };
    return c.k_ = f;
}
)();

// Detected exports: k_
