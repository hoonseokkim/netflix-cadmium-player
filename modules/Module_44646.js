/**
 * @module Module_44646
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 44646
 * Deobfuscated size: 2278 chars
 * Functions: 4
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 44646
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.bmb = undefined;
                        d = a(91176);
                        p = a(48170);
                        t = (function() {
                            function c(g) {
                                this.console = g;
                                this.pxa = d.I.ia;
                                this.Fxb = false;
                                this.jF = d.I.ia;
                            }
                            c.prototype.yt = function(g) {
                                var f;
                                f = g.ci ? g.Ge : d.I.ia;
                                this.Fxb || (this.pxa = f,
                                this.Fxb = true);
                                this.jF = f.da(this.pxa);
                                p.u && this.console.debug("StreamingProfileTimestampOffset initialized with profile timestamp offset:", {
                                    pxa: this.pxa.ca(),
                                    ecd: f.ca(),
                                    jF: this.jF.ca(),
                                    Oa: g.Oa
                                });
                            }
                            ;
                            c.prototype.append = function(g) {
                                var f, e, h;
                                if (g.Ih)
                                    return g;
                                f = g.qf;
                                e = g.Ih;
                                h = g.Sh;
                                return {
                                    Na: g.Na,
                                    offset: g.offset.add(this.jF),
                                    qf: f,
                                    Ih: e,
                                    Sh: h
                                };
                            }
                            ;
                            return c;
                        }
                        )();
                        b.bmb = t;
                    }
