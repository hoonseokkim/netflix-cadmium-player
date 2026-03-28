/**
 * @module Module_12394
 * @description Class module with ES module exports
 * @categories Network, Media
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 12394
 * Deobfuscated size: 4413 chars
 * Functions: 17
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 12394
{
                        var p, c;
                        function d(g) {
                            this.va = g.zb("CdnPartitionerImpl");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.BDa = undefined;
                        t = a(22970);
                        p = a(22674);
                        a = a(87386);
                        d.prototype.Fvc = function(g) {
                            var e, h, k, l, m, n, q;
                            function f(r, u, v) {
                                var w, x, y;
                                w = r.map(function(A) {
                                    return A.Ug;
                                });
                                w.sort(function(A, z) {
                                    return u[A] - u[z];
                                });
                                if (1 === w.length)
                                    (false,
                                    k.set(v, {
                                        m3: r[0],
                                        Gza: r[0]
                                    }));
                                else {
                                    x = w.find(function(A) {
                                        return e.has(A);
                                    });
                                    x || ((x = w.find(function(A) {
                                        return !h.has(A);
                                    })) ? e.add(x) : (x = w[0],
                                    false));
                                    y = w.find(function(A) {
                                        return h.has(A) && A !== x;
                                    });
                                    y || ((y = w.find(function(A) {
                                        return !e.has(A) && A !== x;
                                    })) ? h.add(y) : (y = w.find(function(A) {
                                        return A !== x;
                                    }),
                                    false));
                                    k.set(v, {
                                        m3: r.find(function(A) {
                                            return A.Ug === x;
                                        }),
                                        Gza: r.find(function(A) {
                                            return A.Ug === y;
                                        })
                                    });
                                }
                            }
                            e = new Set();
                            h = new Set();
                            k = new Map();
                            l = g.video;
                            m = g.audio;
                            n = g.text;
                            q = g.$k.reduce(function(r, u) {
                                r[u.id] = u.Gc;
                                return r;
                            }, {});
                            l.forEach(function(r) {
                                r = r.stream;
                                f(r.urls, q, r.sh);
                            });
                            m.forEach(function(r) {
                                r = r.stream;
                                f(r.urls, q, r.sh);
                            });
                            n.forEach(function(r) {
                                var u, v;
                                if (!r.track.Jy || r.track.mda) {
                                    u = r.stream;
                                    r = r.id;
                                    v = u.urls.reduce(function(w, x, y) {
                                        w[x.Ug] = y + 1;
                                        return w;
                                    }, {});
                                    f(u.urls, v, r);
                                }
                            });
                            return k;
                        }
                        ;
                        c = d;
                        b.BDa = c;
                        b.BDa = c = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(a.Bb))], c);
                    }
