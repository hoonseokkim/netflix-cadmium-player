/**
 * @module Module_58304
 * @description ES module
 * @categories Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 58304
 * Deobfuscated size: 4358 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 58304
{
                        var p, c;
                        function d(g) {
                            return g.map(function(f) {
                                return [f[0], f[1]];
                            });
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.ed = b.vla = undefined;
                        b.pRa = function(g) {
                            var f, e, h, k, l, m, n, u, v, w, x, B;
                            e = g.J;
                            h = g.Va;
                            k = g.Oc;
                            if (g.next) {
                                l = g.next;
                                n = {};
                                try {
                                    for (var q = p.__values(Object.keys(l)), r = q.next(); !r.done; r = q.next()) {
                                        u = r.value;
                                        v = u;
                                        w = l[u];
                                        x = {};
                                        undefined !== w.weight && (x.weight = w.weight);
                                        undefined !== w.fe && (x.fe = w.fe);
                                        n[v] = x;
                                    }
                                } catch (D) {
                                    var y;
                                    y = {
                                        error: D
                                    };
                                } finally {
                                    try {
                                        r && !r.done && (m = q.return) && m.call(q);
                                    } finally {
                                        if (y)
                                            throw y.error;
                                    }
                                }
                                l = n;
                            } else
                                l = g.next;
                            e = {
                                J: e,
                                Va: h,
                                Oc: k,
                                next: l
                            };
                            try {
                                for (var A = p.__values(c), z = A.next(); !z.done; z = A.next()) {
                                    B = z.value;
                                    undefined !== g[B] && (e[B] = g[B]);
                                }
                            } catch (D) {
                                var C;
                                C = {
                                    error: D
                                };
                            } finally {
                                try {
                                    z && !z.done && (f = A.return) && f.call(A);
                                } finally {
                                    if (C)
                                        throw C.error;
                                }
                            }
                            g.km && (e.km = d(g.km));
                            return e;
                        }
                        ;
                        p = a(22970);
                        b.vla = {
                            video: "video",
                            audio: "audio",
                            text: "text"
                        };
                        b.ed = {
                            vc: "ad",
                            Sa: "adBreak",
                            content: "content",
                            padding: "padding"
                        };
                        c = Object.keys({
                            eb: undefined,
                            playbackRate: undefined,
                            weight: undefined,
                            fe: undefined,
                            J8a: undefined,
                            type: undefined,
                            Ls: undefined,
                            Sq: undefined,
                            Xe: undefined
                        });
                    }
