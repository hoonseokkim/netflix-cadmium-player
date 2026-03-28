/**
 * @module Module_97368
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 97368
 * Deobfuscated size: 1041 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 97368
{
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.PRc = function(a) {
                            var d, p;
                            d = false;
                            p = false;
                            return function() {
                                if (d)
                                    p = true;
                                else
                                    for (p = true; p; ) {
                                        p = false;
                                        d = true;
                                        try {
                                            a();
                                        } finally {
                                            d = false;
                                        }
                                    }
                            }
                            ;
                        }
                        ;
                    }
