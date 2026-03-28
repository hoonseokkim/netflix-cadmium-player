/**
 * @module Module_46383
 * @description ES module
 * @categories MSL, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 46383
 * Deobfuscated size: 7376 chars
 * Functions: 10
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 46383
{
                        var c, g, f, e, h, k;
                        function d(l, m) {
                            var n, q, r, u, v;
                            if (l === m)
                                return true;
                            if (null == l || null == m)
                                return false;
                            n = l.Xba();
                            q = m.Xba();
                            if (n !== q && (null == n || null == q || n.length != q.length || !k.default.T$(n, q)))
                                return false;
                            for (q = 0; q < n.length; ++q) {
                                r = n[q];
                                u = l.Hf(r);
                                v = m.Hf(r);
                                if (u !== v) {
                                    if (null == u || null == v)
                                        return false;
                                    if (u instanceof Uint8Array || v instanceof Uint8Array) {
                                        if ((u = l.Ed(r),
                                        r = m.Ed(r),
                                        !k.default.equal(u, r)))
                                            return false;
                                    } else if (u instanceof g.nj && v instanceof g.nj) {
                                        if (!d(u, v))
                                            return false;
                                    } else if (u instanceof f.ml && v instanceof f.ml) {
                                        if (!p(u, v))
                                            return false;
                                    } else if (typeof u !== typeof v || u != v)
                                        return false;
                                }
                            }
                            return true;
                        }
                        function p(l, m) {
                            var q, r;
                            if (l === m)
                                return true;
                            if (null == l || null == m || l.size() != m.size())
                                return false;
                            for (var n = 0; n < l.size(); ++n) {
                                q = l.Hf(n);
                                r = m.Hf(n);
                                if (q !== r) {
                                    if (null == q || null == r)
                                        return false;
                                    if (q instanceof Uint8Array || r instanceof Uint8Array) {
                                        if ((q = l.Ed(n),
                                        r = m.Ed(n),
                                        !k.default.equal(q, r)))
                                            return false;
                                    } else if (q instanceof g.nj && r instanceof g.nj) {
                                        if (!d(q, r))
                                            return false;
                                    } else if (q instanceof f.ml && r instanceof f.ml) {
                                        if (!p(q, r))
                                            return false;
                                    } else if (typeof q !== typeof r || q != r)
                                        return false;
                                }
                            }
                            return true;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Jn = b.Qrc = b.$yb = b.azb = b.W$ = undefined;
                        t = a(22970);
                        c = t.__importDefault(a(42979));
                        g = a(9E3);
                        f = a(77633);
                        e = a(48235);
                        h = t.__importDefault(a(6838));
                        k = t.__importDefault(a(14945));
                        b.W$ = function(l, m, n) {
                            function q(r, u, v, w) {
                                c.default(w, function() {
                                    var x;
                                    if (v >= m.length)
                                        return u;
                                    x = m[v];
                                    if (x instanceof Boolean || "boolean" === typeof x || x instanceof Uint8Array || x instanceof Number || "number" === typeof x || x instanceof g.nj || x instanceof f.ml || x instanceof String || "string" === typeof x || x instanceof Object && x.constructor === Object || x instanceof Array || null === x)
                                        (u.put(-1, x),
                                        q(r, u, v + 1, w));
                                    else if (x instanceof e.fp)
                                        x.bo(r, r.cDb(), {
                                            result: function(y) {
                                                c.default(w, function() {
                                                    var A;
                                                    A = r.Qp(y);
                                                    u.put(-1, A);
                                                    q(r, u, v + 1, w);
                                                });
                                            },
                                            error: w.error
                                        });
                                    else
                                        throw new h.default("Class " + typeof x + " is not MSL encoding-compatible.");
                                });
                            }
                            c.default(n, function() {
                                var r, u;
                                r = l.Og;
                                u = r.W$();
                                q(r, u, 0, n);
                            });
                        }
                        ;
                        b.azb = d;
                        b.$yb = p;
                        b.Qrc = function(l, m) {
                            if (l == m)
                                return true;
                            if (null == l || null == m || l.size() != m.size())
                                return false;
                            for (var n = [], q = [], r = 0; r < l.size(); ++r)
                                (n[r] = l.Hf(r),
                                q[r] = m.Hf(r));
                            return k.default.T$(n, q);
                        }
                        ;
                        b.Jn = function(l, m) {
                            var r;
                            if (!l && !m)
                                return null;
                            l = l ? new g.nj(l.xCb()) : new g.nj();
                            if (!m)
                                return l;
                            for (var n = m.Xba(), q = 0; q < n.length; ++q) {
                                r = n[q];
                                l.put(r, m.get(r));
                            }
                            return l;
                        }
                        ;
                    }
