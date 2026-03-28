/**
 * @module Module_82924
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 82924
 * Deobfuscated size: 3673 chars
 * Functions: 5
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 82924
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.G$a = undefined;
                        d = a(91176);
                        p = a(7559);
                        t = (function() {
                            function c(g, f, e) {
                                this.config = g;
                                this.Fg = f;
                                this.console = e;
                            }
                            c.prototype.yt = function(g) {
                                this.Ha = g.Ha;
                            }
                            ;
                            c.prototype.append = function(g, f) {
                                var e, h, k, l, m, n, q, r, u, v, w, x, y;
                                if (g.Ih)
                                    return g;
                                e = false;
                                h = (0,
                                p.GCb)(this.config, this.Fg);
                                k = g.Na;
                                l = g.offset;
                                m = g.qf;
                                n = g.Sh;
                                q = k.Sb;
                                r = k.Vb;
                                u = k.AB;
                                u = k.Si || u;
                                if (!g.Na.pa || !u || m)
                                    return g;
                                v = k.wa.da(k.qa);
                                u = Math.floor(v.Af(this.Ha));
                                w = f.p0a || q.da(this.Ha.wh(2));
                                x = w.da(r);
                                q = u;
                                y = false;
                                f.p0a && (f = this.vtb(v, x, x),
                                q = f.Kl,
                                y = f.aLb);
                                h = w.da(d.I.Ca(h));
                                r = d.I.max(h.da(r), d.I.ia);
                                y || (r = this.vtb(v, r, x),
                                q = r.Kl,
                                r.aLb && (--q,
                                this.Ha.wh(q)));
                                q < (this.config.OJc || 1) ? e = true : 0 < u - q && g.Na.Kqa(u - q);
                                return {
                                    Na: k,
                                    offset: l,
                                    qf: m,
                                    Ih: e,
                                    Sh: n
                                };
                            }
                            ;
                            c.prototype.vtb = function(g, f, e) {
                                var h;
                                g = d.I.min(g, f);
                                g = Math.floor(g.Af(this.Ha));
                                f = this.Ha.wh(g);
                                e = e.da(f);
                                h = 0 < g && e.lessThan(d.I.bz);
                                return {
                                    Kl: g,
                                    hld: f,
                                    Cfd: e,
                                    aLb: h
                                };
                            }
                            ;
                            return c;
                        }
                        )();
                        b.G$a = t;
                    }
