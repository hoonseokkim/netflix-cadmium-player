/**
 * @module Module_98589
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 98589
 * Deobfuscated size: 2568 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 98589
{
                        var p;
                        function d(c, g) {
                            var f, e, h, k, n, r;
                            if (!c || 0 === c.length)
                                return [];
                            e = g.Lp;
                            g = g.Wu;
                            h = [];
                            k = 0;
                            try {
                                for (var l = p.__values(c), m = l.next(); !m.done; m = l.next()) {
                                    n = m.value;
                                    h.push(k);
                                    k += n.eb - n.Va;
                                }
                            } catch (u) {
                                var q;
                                q = {
                                    error: u
                                };
                            } finally {
                                try {
                                    m && !m.done && (f = l.return) && f.call(l);
                                } finally {
                                    if (q)
                                        throw q.error;
                                }
                            }
                            q = Array(c.length);
                            for (c = c.length - 1; 0 <= c; c--) {
                                f = h[c];
                                l = f - g - e;
                                r = undefined !== r ? Math.min(l, r - e) : l;
                                q[c] = {
                                    N1: f - r,
                                    Mbd: f,
                                    x_a: r
                                };
                            }
                            return q;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.ttb = d;
                        b.ofc = function(c, g) {
                            if (!c || 0 === c.length)
                                return 0;
                            c = d(c, g);
                            for (g = c.length - 1; 0 <= g; g--)
                                if (0 > c[g].x_a)
                                    return g + 1;
                            return 1;
                        }
                        ;
                        p = a(22970);
                    }
