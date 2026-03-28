/**
 * @module Module_43341
 * @description Class module with ES module exports
 * @categories Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 43341
 * Deobfuscated size: 16889 chars
 * Functions: 27
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 43341
{
                        var c, g;
                        function d(f, e) {
                            var h, k, n;
                            k = g.I.ia;
                            try {
                                for (var l = c.__values(f), m = l.next(); !m.done; m = l.next()) {
                                    n = m.value;
                                    if (n.J === e)
                                        return {
                                            K: n,
                                            Oq: k
                                        };
                                    k = k.add(n.Ob);
                                }
                            } catch (r) {
                                var q;
                                q = {
                                    error: r
                                };
                            } finally {
                                try {
                                    m && !m.done && (h = l.return) && h.call(l);
                                } finally {
                                    if (q)
                                        throw q.error;
                                }
                            }
                            return {
                                K: undefined,
                                Oq: g.I.ia
                            };
                        }
                        function p(f, e) {
                            var h, k, l;
                            return c.__generator(this, function(m) {
                                switch (m.label) {
                                case 0:
                                    (h = f,
                                    k = function() {
                                        var n;
                                        return c.__generator(this, function(q) {
                                            switch (q.label) {
                                            case 0:
                                                return [4, h];
                                            case 1:
                                                return (q.T(),
                                                h = (n = null !== (l = h.Oc) && undefined !== l ? l : undefined) ? (0,
                                                g.kc)(e, function(r) {
                                                    return r.id === n;
                                                }) : undefined,
                                                [2]);
                                            }
                                        });
                                    }
                                    ,
                                    m.label = 1);
                                case 1:
                                    return h ? [5, k()] : [3, 3];
                                case 2:
                                    return (m.T(),
                                    [3, 1]);
                                case 3:
                                    return [2];
                                }
                            });
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.CJa = undefined;
                        c = a(22970);
                        g = a(91176);
                        t = (function() {
                            function f(e, h, k) {
                                undefined === k && (k = {});
                                this.upper = e;
                                this.lower = h;
                                this.u8a = k;
                            }
                            f.prototype.IJ = function(e) {
                                return this.u8a[e];
                            }
                            ;
                            f.prototype.GR = function(e) {
                                var h;
                                h = this;
                                return Object.keys(this.u8a).filter(function(k) {
                                    return h.u8a[k] === e;
                                });
                            }
                            ;
                            f.prototype.tWc = function(e) {
                                return (e = this.IJ(e.id)) ? this.upper.get(e) : undefined;
                            }
                            ;
                            f.prototype.lWc = function(e) {
                                var h;
                                h = this;
                                return this.GR(e.id).map(function(k) {
                                    return h.lower.get(k);
                                });
                            }
                            ;
                            f.prototype.YPc = function(e) {
                                var h, k, l, m, n, q;
                                h = this;
                                k = this.lower.get(e.M);
                                (0,
                                g.assert)(k && k.Uic(e.offset));
                                l = this.tWc(k);
                                if (l) {
                                    if (l.J === k.J)
                                        return (e = l.q3a(k.ELb(e.offset)),
                                        {
                                            M: l.id,
                                            offset: e
                                        });
                                    if (e.offset.equal(g.I.ia) && 0 === c.__spreadArray([], c.__read(this.lower.CE.yU(e.M)), false).filter(function(r) {
                                        return h.IJ(r.id) === l.id;
                                    }).length)
                                        return {
                                            M: l.id,
                                            offset: g.I.ia
                                        };
                                    if (0 === c.__spreadArray([], c.__read(this.lower.CE.FF(e.M)), false).filter(function(r) {
                                        return h.IJ(r.id) === l.id;
                                    }).length)
                                        return {
                                            M: l.id,
                                            offset: l.Ob
                                        };
                                    (0,
                                    g.assert)(k.$b.isFinite());
                                    k = d(this.lower.CE.SH(e.M), l.J);
                                    m = k.K;
                                    k = k.Oq;
                                    n = d(this.lower.CE.wPa(e.M), l.J);
                                    q = n.K;
                                    n = n.Oq;
                                    m = m ? m.nb : l.$b;
                                    (0,
                                    g.assert)(m);
                                    q = q ? q.$b : l.nb;
                                    (0,
                                    g.assert)(q);
                                    k = n.add(k);
                                    e = e.offset.add(n).Af(k);
                                    e = q.add(m.da(q).wh(e));
                                    e = l.q3a(e);
                                    return {
                                        M: l.id,
                                        offset: e
                                    };
                                }
                            }
                            ;
                            f.prototype.XPc = function(e) {
                                var h, k, l, m, n, q, r, u, v, w, x, y, A, z, D, F, H, J, M, K;
                                q = this.upper.get(e.M);
                                (0,
                                g.assert)(q);
                                r = q.J;
                                u = q.jub(e.offset);
                                v = q.ELb(u);
                                (0,
                                g.assert)(v);
                                w = this.lWc(q);
                                x = w.filter(function(I) {
                                    return I.J === r;
                                }).filter(function(I) {
                                    return I.J_c(v);
                                });
                                if (x.length) {
                                    y = x[0];
                                    return {
                                        M: y.id,
                                        offset: y.q3a(v)
                                    };
                                }
                                if (u.equal(g.I.ia) && !this.upper.oBc(e.M))
                                    return {
                                        M: w[0].id,
                                        offset: g.I.ia
                                    };
                                if (u.equal(q.Ob) && !this.upper.tBc(e.M)) {
                                    A = w[w.length - 1];
                                    return {
                                        M: A.id,
                                        offset: A.Ob
                                    };
                                }
                                z = new Set(w.map(function(I) {
                                    return I.Oc;
                                }).filter(function(I) {
                                    return !!I;
                                }));
                                e = w.filter(function(I) {
                                    return !z.has(I.id);
                                });
                                w = w.filter(function(I) {
                                    return z.has(I.id);
                                });
                                try {
                                    for (var B = c.__values(e), C = B.next(); !C.done; C = B.next()) {
                                        D = c.__spreadArray([], c.__read(p(C.value, w)), false);
                                        e = [];
                                        y = u = undefined;
                                        try {
                                            for (var E = (k = undefined,
                                            c.__values(D)), G = E.next(); !G.done; G = E.next())
                                                (y = G.value,
                                                u && e.push({
                                                    tx: u,
                                                    K: y,
                                                    ida: false
                                                }),
                                                u = undefined,
                                                y.J === r ? (e.push({
                                                    tx: y.nb,
                                                    K: y,
                                                    ida: false
                                                }),
                                                u = y.$b) : 0 === e.length && e.push({
                                                    tx: q.nb,
                                                    K: y,
                                                    ida: false
                                                }));
                                        } catch (I) {
                                            k = {
                                                error: I
                                            };
                                        } finally {
                                            try {
                                                G && !G.done && (l = E.return) && l.call(E);
                                            } finally {
                                                if (k)
                                                    throw k.error;
                                            }
                                        }
                                        y && (u ? e.push({
                                            tx: u,
                                            K: y,
                                            ida: true
                                        }) : e.push({
                                            tx: q.$b,
                                            K: y,
                                            ida: true
                                        }));
                                        F = (0,
                                        g.cPa)(e, function(I) {
                                            return I.tx.Hn(v);
                                        });
                                        H = (0,
                                        g.kc)(e, function(I) {
                                            return I.tx.$f(v);
                                        });
                                        if (F && H && F.tx.Hn(v) && H.tx.$f(v)) {
                                            if (F.K.id === H.K.id)
                                                return {
                                                    M: F.K.id,
                                                    offset: g.I.ia
                                                };
                                            if (F.tx.G === H.tx.G)
                                                return {
                                                    M: H.K.id,
                                                    offset: g.I.ia
                                                };
                                            J = v.da(F.tx).Af(H.tx.da(F.tx));
                                            M = D.slice(D.indexOf(F.K), D.indexOf(H.K) + (H.ida ? 1 : 0));
                                            K = M.reduce(function(I, N) {
                                                return I.add(N.Ob);
                                            }, g.I.ia).wh(J);
                                            try {
                                                for (var L = (m = undefined,
                                                c.__values(M)), O = L.next(); !O.done && (y = O.value,
                                                !K.lessThan(y.Ob)); O = L.next())
                                                    K = K.da(y.Ob);
                                            } catch (I) {
                                                m = {
                                                    error: I
                                                };
                                            } finally {
                                                try {
                                                    O && !O.done && (n = L.return) && n.call(L);
                                                } finally {
                                                    if (m)
                                                        throw m.error;
                                                }
                                            }
                                            if (y && K.lessThan(null === y || undefined === y ? undefined : y.Ob))
                                                return {
                                                    M: y.id,
                                                    offset: K
                                                };
                                        }
                                    }
                                } catch (I) {
                                    A = {
                                        error: I
                                    };
                                } finally {
                                    try {
                                        C && !C.done && (h = B.return) && h.call(B);
                                    } finally {
                                        if (A)
                                            throw A.error;
                                    }
                                }
                                (0,
                                g.assert)(false, "Upper playgraph position should always map to something in lower playgraph");
                            }
                            ;
                            return f;
                        }
                        )();
                        b.CJa = t;
                    }
