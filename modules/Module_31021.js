/**
 * @module Module_31021
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 31021
 * Deobfuscated size: 2386 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 31021
{
                        var d;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.ydd = function(p) {
                            var c, g, f, e, h, k;
                            c = p.qkd;
                            g = p.jg;
                            p = p.mha;
                            f = new d.Cv();
                            e = p.split(" ");
                            h = /\d+/;
                            k = new Map();
                            g.forEach(function(l) {
                                k.set(l, 0);
                            });
                            e.forEach(function(l, m) {
                                var n, q, r, u, v, w, x, y;
                                w = Number(l.split(".")[0].match(h)[0]);
                                x = Number(l.split(".")[1].match(h)[0]);
                                w = g[w];
                                l = k.get(w);
                                y = ("").concat(w, "-").concat(l);
                                k.set(w, l + 1);
                                x = {
                                    J: w,
                                    Va: null !== (r = null === (q = c.get(w)) || undefined === q ? undefined : q[x]) && undefined !== r ? r : 0,
                                    eb: null !== (v = null === (u = c.get(w)) || undefined === u ? undefined : u[x + 1]) && undefined !== v ? v : undefined
                                };
                                e.length > m + 1 && (q = Number(e[m + 1].split(".")[0].match(h)[0]),
                                q = g[q],
                                r = k.get(q),
                                q = ("").concat(q, "-").concat(r),
                                x.Oc = q,
                                x.next = (n = {},
                                n[q] = {},
                                n),
                                k.set(w, l + 1));
                                0 === m && f.BF(y);
                                f.cf(y, x);
                            });
                            return f.build();
                        }
                        ;
                        d = a(48456);
                    }
