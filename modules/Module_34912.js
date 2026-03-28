/**
 * @module Module_34912
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 34912
 * Deobfuscated size: 4791 chars
 * Functions: 8
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 34912
{
                        var f, e, h, k, l, m;
                        function d(n, q, r, u) {
                            var v, w, x, y, z, B, C, D, E, G, F, H;
                            v = n.GBb(r);
                            w = v.Tub;
                            if (undefined === w)
                                throw Error(e.O2b + " " + q + ".");
                            v = v.J3c;
                            x = Object.keys(v);
                            y = 0 === r.length && 0 < x.length ? x.length : r.length;
                            x = [];
                            for (var A = 0; A < y; A++) {
                                z = A;
                                B = u;
                                C = q;
                                D = w;
                                E = v[z.toString()] || [];
                                G = g(E);
                                F = true !== G.uv;
                                D = D[z];
                                H = G.v || G.KI;
                                D = H ? H : D;
                                D instanceof f.sGa && (D = D.KO());
                                if (F) {
                                    F = D === Function;
                                    F = D === Object || F || undefined === D;
                                    if (!B && F)
                                        throw Error(e.P2b + " argument " + z + " in class " + C + ".");
                                    z = new m.kma(h.wG.cbb,G.Pha,D);
                                    z.xa = E;
                                    E = z;
                                } else
                                    E = null;
                                null !== E && x.push(E);
                            }
                            n = p(n, r);
                            return x.concat(n);
                        }
                        function p(n, q) {
                            var x, y, A;
                            for (var r = n.Kyc(q), u = [], v = 0, w = Object.keys(r); v < w.length; v++) {
                                x = w[v];
                                y = r[x];
                                A = g(r[x]);
                                x = new m.kma(h.wG.Oab,A.Pha || x,A.v || A.KI);
                                x.xa = y;
                                u.push(x);
                            }
                            q = Object.getPrototypeOf(q.prototype).constructor;
                            q !== Object && (n = p(n, q),
                            u = u.concat(n));
                            return u;
                        }
                        function c(n, q) {
                            var r, u;
                            q = Object.getPrototypeOf(q.prototype).constructor;
                            if (q !== Object) {
                                r = l.getFunctionName(q);
                                r = d(n, r, q, true);
                                u = r.map(function(v) {
                                    return v.xa.filter(function(w) {
                                        return w.key === k.r8;
                                    });
                                });
                                u = [].concat.apply([], u).length;
                                r = r.length - u;
                                return 0 < r ? r : c(n, q);
                            }
                            return 0;
                        }
                        function g(n) {
                            var q;
                            q = {};
                            n.forEach(function(r) {
                                q[r.key.toString()] = r.value;
                            });
                            return {
                                v: q[k.j7],
                                KI: q[k.JP],
                                Pha: q[k.Zka],
                                uv: q[k.r8]
                            };
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        f = a(29385);
                        e = a(25640);
                        h = a(5493);
                        k = a(37425);
                        l = a(48530);
                        b.getFunctionName = l.getFunctionName;
                        m = a(23927);
                        b.bwc = function(n, q) {
                            var r;
                            r = l.getFunctionName(q);
                            return d(n, r, q, false);
                        }
                        ;
                        b.qvc = c;
                    }
