/**
 * @module Module_86398
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 86398
 * Deobfuscated size: 8593 chars
 * Functions: 13
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 86398
{
                        var c, g, f, e;
                        function d(h, k, l) {
                            var m, n;
                            if (!l)
                                return false;
                            l = l[k];
                            h = h[k];
                            k = !(null === (m = h.yb) || undefined === m || !m.length);
                            "embedded" === h.type && (k || (k = h.duration.greaterThan(c.I.ia)));
                            m = !k;
                            Array.isArray(l) && (null === (n = h.yb) || undefined === n ? 0 : n.length) && (0,
                            c.dPa)(l, h.yb.map(function(q, r) {
                                return r;
                            })).length === h.yb.length && (m = true);
                            "boolean" === typeof l && l && (m = true);
                            return m;
                        }
                        function p(h, k, l) {
                            var m, n;
                            n = "dynamic" === h.type && (null === (m = h.Zk) || undefined === m ? undefined : m.greaterThan(c.I.ia));
                            return "embedded" === h.type || n || l || !h.yb && "embedded" !== h.type ? {
                                ITb: 0,
                                Qyb: 0,
                                xzb: !n && !l && "embedded" !== h.type
                            } : {
                                ITb: k,
                                Qyb: k,
                                xzb: true
                            };
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Xr = undefined;
                        b.Nkc = function(h, k, l, m, n, q) {
                            function r(y) {
                                var A, z, B, C, D, E, G, F, H;
                                A = k[y];
                                z = d(k, y, m);
                                B = !!A.yb || "embedded" === A.type;
                                C = p(A, n, z);
                                D = C.ITb;
                                E = C.Qyb;
                                C = C.xzb;
                                G = 0 === A.Xu;
                                A.Ga.G > v && u.cf(("").concat(h, "-").concat(y), {
                                    J: h,
                                    Va: v,
                                    eb: A.Ga.G,
                                    type: f.ed.content,
                                    Ls: w,
                                    Sq: C
                                });
                                B || u.dbc(C);
                                !D || G && !q || u.cf(("padstart-").concat(y), {
                                    J: b.Xr,
                                    Va: 0,
                                    eb: D,
                                    type: f.ed.padding
                                });
                                v = A.Ga.G;
                                if (!z)
                                    if ("embedded" === A.type && A.duration.greaterThan(c.I.ia))
                                        (z = A.Ga.add(A.duration).G,
                                        u.cf(("ad-").concat(y, "-").concat(0), {
                                            J: h,
                                            Va: A.Ga.G,
                                            eb: z,
                                            type: f.ed.Sa
                                        }));
                                    else if (A.yb) {
                                        F = null === m || undefined === m ? undefined : m[y];
                                        H = 0;
                                        A.yb.forEach(function(J, M) {
                                            var K;
                                            K = false;
                                            Array.isArray(F) && (K = -1 < F.indexOf(M));
                                            K ? H++ : (K = J.id === h,
                                            undefined === K && (K = false),
                                            M = A.hb && A.Ub !== y ? ("q-[").concat(A.hb, "]-").concat(M).concat(K ? "-F" : "") : ("ad-").concat(y, "-").concat(M),
                                            u.cf(M, {
                                                J: J.id,
                                                Va: J.Va,
                                                eb: J.eb,
                                                type: f.ed.vc
                                            }));
                                        });
                                        E && H !== A.yb.length && u.cf(("padend-").concat(y), {
                                            J: b.Xr,
                                            Va: 0,
                                            eb: E,
                                            type: f.ed.padding
                                        });
                                    }
                                v = A.Ga.add("embedded" === A.type ? A.duration : A.Zk || c.I.ia).G;
                                w = C;
                            }
                            undefined === n && (n = 0);
                            undefined === q && (q = false);
                            for (var u = new e(), v = 0, w = false, x = 0; x < k.length; ++x)
                                r(x);
                            u.cf(("").concat(h, "-").concat(k.length), {
                                J: h,
                                Va: v,
                                eb: null,
                                type: f.ed.content,
                                Ls: w
                            });
                            l.forEach(function(y) {
                                var A, z, B;
                                A = y[0];
                                z = ("").concat(h, "-").concat(k.length);
                                if (A && A.yb && A.hb) {
                                    B = ("[").concat(A.hb, "]");
                                    A.yb.forEach(function(C, D) {
                                        u.cf(("q-").concat(B, "-").concat(D), {
                                            J: C.id,
                                            Va: C.Va,
                                            eb: C.eb,
                                            type: f.ed.vc
                                        }, z);
                                        z = ("q-[").concat(A.hb, "]-").concat(D);
                                    });
                                }
                            });
                            return u.build();
                        }
                        ;
                        c = a(91176);
                        g = a(48456);
                        f = a(58304);
                        b.Xr = -1;
                        e = (function() {
                            function h() {
                                this.lb = new g.Cv();
                            }
                            h.prototype.cf = function(k, l, m) {
                                this.VA || (this.VA = k);
                                (m = m && this.lb.uEb(m) ? m : this.LN) && this.lb.ASb(k, m);
                                this.lb.cf(k, l);
                                this.LN = k;
                            }
                            ;
                            h.prototype.dbc = function(k) {
                                var l;
                                if (this.LN) {
                                    l = this.lb.Hu(this.LN);
                                    l && l.type === f.ed.content && (l.Sq = k,
                                    this.lb.cf(this.LN, l));
                                }
                            }
                            ;
                            h.prototype.build = function() {
                                this.LN = undefined;
                                this.VA && this.lb.BF(this.VA);
                                return this.lb.build();
                            }
                            ;
                            return h;
                        }
                        )();
                    }
