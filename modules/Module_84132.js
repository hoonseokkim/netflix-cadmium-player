/**
 * @module Module_84132
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 84132
 * Deobfuscated size: 1264 chars
 * Functions: 4
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 84132
{
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Lcb = undefined;
                        t = (function() {
                            function a(d, p) {
                                this.config = d;
                                this.console = p;
                            }
                            a.prototype.Oh = function(d) {
                                var p;
                                if (0 === d.length)
                                    return d;
                                p = this.config.NTa[d[0].R];
                                return undefined !== p ? (false,
                                d = d.filter(function(c) {
                                    return ("").concat(c.id) === ("").concat(p);
                                }),
                                0 === d.length && false,
                                d) : d;
                            }
                            ;
                            return a;
                        }
                        )();
                        b.Lcb = t;
                    }
