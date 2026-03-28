/**
 * @module Module_65691
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 65691
 * Deobfuscated size: 2932 chars
 * Functions: 5
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 65691
{
                        var d, p, c;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.fmc = function(g, f) {
                            var e, h, k, l, m, n;
                            l = new c();
                            l.cf(("").concat(g, "-preprogram"), {
                                J: g,
                                Va: 0,
                                eb: 0 < f.length ? null === (e = f[0].Yk) || undefined === e ? undefined : e.Ga.G : null,
                                type: p.ed.content
                            });
                            for (e = 0; e < f.length; ++e) {
                                m = f[e];
                                l.cf(("").concat(g, "-").concat(m.id), {
                                    J: g,
                                    Xe: m.id,
                                    Va: m.Yk.Ga.G,
                                    eb: null === (h = m.Xk) || undefined === h ? undefined : h.Ga.G,
                                    type: p.ed.content
                                });
                                n = e < f.length - 1 ? f[e + 1] : undefined;
                                (!n && m.Xk || n && n.Yk.Ga.greaterThan(m.Xk.Ga)) && l.cf(("").concat(g, "-").concat(m.id, "-postprogram"), {
                                    J: g,
                                    Va: m.Xk.Ga.G,
                                    eb: null === (k = null === n || undefined === n ? undefined : n.Yk) || undefined === k ? undefined : k.Ga.G,
                                    type: p.ed.content
                                });
                            }
                            return l.build();
                        }
                        ;
                        d = a(48456);
                        p = a(58304);
                        c = (function() {
                            function g() {
                                this.lb = new d.Cv();
                            }
                            g.prototype.cf = function(f, e, h) {
                                this.VA || (this.VA = f);
                                (h = h && this.lb.uEb(h) ? h : this.LN) && this.lb.ASb(f, h);
                                this.lb.cf(f, e);
                                this.LN = f;
                            }
                            ;
                            g.prototype.build = function() {
                                this.LN = undefined;
                                this.VA && this.lb.BF(this.VA);
                                return this.lb.build();
                            }
                            ;
                            return g;
                        }
                        )();
                    }
