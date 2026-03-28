/**
 * @module Module_74371
 * @description Class module with ES module exports
 * @categories ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 74371
 * Deobfuscated size: 5562 chars
 * Functions: 12
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 74371
{
                        var p, c, g, f, e, h;
                        function d(k, l) {
                            return k > l.JHc ? e.xdb : k > l.Omc ? e.t7 : 0 < k ? e.m_b : e.EMPTY;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Xvb = b.cjb = undefined;
                        p = a(22970);
                        c = a(91176);
                        g = a(90745);
                        f = a(54520);
                        (function(k) {
                            k[k.EMPTY = 0] = "EMPTY";
                            k[k.m_b = 1] = "CRITICAL";
                            k[k.t7 = 2] = "LOW";
                            k[k.xdb = 3] = "HEALTHY";
                        }
                        )(e || (b.cjb = e = {}));
                        h = (function() {
                            function k() {
                                this.xN = this.buffer = e.EMPTY;
                            }
                            Object.defineProperties(k.prototype, {
                                lR: {
                                    get: function() {
                                        return Math.min(this.buffer, this.xN);
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            return k;
                        }
                        )();
                        b.Xvb = function(k) {
                            var m, n, q, r, u;
                            function l() {
                                var v, w, A, z, B, C, D, E, G;
                                w = k.tyc();
                                try {
                                    for (var x = p.__values(w), y = x.next(); !y.done; y = x.next()) {
                                        A = y.value;
                                        if (!A.Dk) {
                                            w = A;
                                            z = n[w.n2a] || new h();
                                            B = (0,
                                            f.NI)(new h(), n[w.n2a]);
                                            C = k.iE();
                                            D = w.Hk.da(C).G;
                                            B.xN = d(D, k);
                                            E = w.IZ.G;
                                            G = d(E, k);
                                            B.buffer = G;
                                            r && B.lR < e.xdb || (r && (r = false),
                                            B.lR !== z.lR && (n[w.n2a] = B,
                                            m.emit("healthChange", {
                                                ABc: B.lR,
                                                yoc: B.lR < z.lR,
                                                me: w,
                                                ISc: Math.min(E, D)
                                            })));
                                        }
                                    }
                                } catch (H) {
                                    var F;
                                    F = {
                                        error: H
                                    };
                                } finally {
                                    try {
                                        y && !y.done && (v = x.return) && v.call(x);
                                    } finally {
                                        if (F)
                                            throw F.error;
                                    }
                                }
                            }
                            m = new g.EventEmitter();
                            n = {};
                            q = null;
                            r = false;
                            u = {
                                get Ho() {
                                    return !(null === q || undefined === q || !q.Ho);
                                },
                                start: function() {
                                    return p.__awaiter(undefined, undefined, undefined, function() {
                                        return p.__generator(this, function() {
                                            if (u.Ho)
                                                return [2];
                                            q = k.tc.Opa(l, c.I.Ca(k.$Jc));
                                            return [2];
                                        });
                                    });
                                },
                                stop: function() {
                                    return null === q || undefined === q ? undefined : q.La();
                                },
                                gxa: function() {
                                    r = true;
                                },
                                addListener: m.addListener.bind(m),
                                removeListener: m.removeListener.bind(m)
                            };
                            return u;
                        }
                        ;
                    }
