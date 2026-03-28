/**
 * @module Module_62613
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 62613
 * Deobfuscated size: 1197 chars
 * Functions: 6
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 62613
{
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.$F = undefined;
                        b.$F = (function() {
                            function a() {}
                            a.vM = function(d, p) {
                                var f;
                                function c(e) {
                                    return g(f++)(e, c);
                                }
                                function g(e) {
                                    return e >= p.length ? function() {
                                        throw Error(("The last delegate in the chain should not invoke next() nextDelegateIndex ").concat(e));
                                    }
                                    : p[e];
                                }
                                f = 0;
                                return c(d);
                            }
                            ;
                            return a;
                        }
                        )();
                    }
