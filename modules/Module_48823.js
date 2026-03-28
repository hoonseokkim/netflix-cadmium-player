/**
 * @module Module_48823
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 48823
 * Deobfuscated size: 1890 chars
 * Functions: 3
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 48823
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.HEa = undefined;
                        d = a(22970);
                        p = a(72905);
                        t = (function(c) {
                            function g() {
                                return null !== c && c.apply(this, arguments) || this;
                            }
                            d.__extends(g, c);
                            g.prototype.parse = function(f) {
                                var e;
                                this.F0b = this.N.sg();
                                e = this.N.Hd();
                                this.dUb = !!(e & 128);
                                this.enb = !!(e & 64);
                                this.Qhb = !!(e & 32);
                                this.C_c = e & 31;
                                this.coc = this.dUb ? this.N.sg() : undefined;
                                this.enb && this.N.KU(this.N.Hd());
                                this.P3b = this.Qhb ? this.N.sg() : undefined;
                                p.u && this.N.console.trace("ESDescriptor: ES_ID=" + this.F0b + ", streamDependenceFlag=" + this.dUb + ", URL_Flag=" + this.enb + ", OCRstreamFlag=" + this.Qhb + ", streamPriority=" + this.C_c + ", dependsOn_ES_ID=" + this.coc + ", OCR_ES_Id=" + this.P3b);
                                this.zpb(f);
                                return true;
                            }
                            ;
                            g.tag = 3;
                            return g;
                        }
                        )(a(91578).Yja);
                        b.HEa = t;
                    }
