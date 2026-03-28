/**
 * @module Module_14128
 * @description Class/prototype module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 14128
 * Deobfuscated size: 972 chars
 * Functions: 4
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 14128
{
                        var d, p;
                        b = a(31187);
                        d = a(18610);
                        p = (function() {
                            function c(g, f) {
                                this.Zia = f;
                                this.f = g;
                            }
                            c.prototype["@@transducer/init"] = d.Gb;
                            c.prototype["@@transducer/result"] = d.result;
                            c.prototype["@@transducer/step"] = function(g, f) {
                                return this.f(f) ? this.Zia["@@transducer/step"](g, f) : g;
                            }
                            ;
                            return c;
                        }
                        )();
                        a = b(function(c, g) {
                            return new p(c,g);
                        });
                        t.exports = a;
                    }
