/**
 * @module Module_43813
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 43813
 * Deobfuscated size: 1165 chars
 * Functions: 1
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 43813
{
                        var d;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Lld = function(p, c, g) {
                            var f;
                            f = new d.Cv();
                            f.BF("s0").eAa("immediate").B5a(g).cf("s0", {
                                J: p,
                                Va: 0,
                                eb: 1E3 * c,
                                weight: .5,
                                next: {
                                    s1: {
                                        weight: .5
                                    }
                                }
                            }).cf("s1", {
                                J: p,
                                Va: 1E3 * c,
                                eb: Infinity
                            });
                            return f.build();
                        }
                        ;
                        d = a(48456);
                    }
