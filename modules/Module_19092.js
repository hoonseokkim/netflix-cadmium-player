/**
 * @module Module_19092
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 19092
 * Deobfuscated size: 1371 chars
 * Functions: 5
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 19092
{
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.A$a = undefined;
                        t = (function() {
                            function a(d) {
                                var p;
                                p = this;
                                d.w4 && d.w4.enabled && d.w4.profiles && d.w4.profiles.length && "keepLowest" === d.w4.action && (this.$Gb = {},
                                d.w4.profiles.forEach(function(c) {
                                    return p.$Gb[c] = true;
                                }));
                            }
                            a.prototype.Oh = function(d) {
                                var p, c;
                                p = {};
                                c = this.$Gb;
                                return undefined === c ? d : d.filter(function(g) {
                                    return !c[g.profile] || (p[g.profile] ? false : p[g.profile] = true);
                                });
                            }
                            ;
                            return a;
                        }
                        )();
                        b.A$a = t;
                    }
