/**
 * @module Module_68157
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 68157
 * Deobfuscated size: 1691 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 68157
{
                        function a(d) {
                            var p, c;
                            p = Math.abs(d);
                            c = 1 / (1 + p / 2);
                            p = c * Math.exp(-p * p - 1.26551223 + c * (1.00002368 + c * (.37409196 + c * (.09678418 + c * (-.18628806 + c * (.27886807 + c * (-1.13520398 + c * (1.48851587 + c * (-.82215223 + .17087277 * c)))))))));
                            return 0 <= d ? p : 2 - p;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Vaa = a;
                        b.cCc = function(d) {
                            var p, c, f;
                            if (2 <= d)
                                return -100;
                            if (0 >= d)
                                return 100;
                            p = 1 > d ? d : 2 - d;
                            c = Math.sqrt(-2 * Math.log(p / 2));
                            c = -.70711 * ((2.30753 + .27061 * c) / (1 + c * (.99229 + .04481 * c)) - c);
                            for (var g = 0; 2 > g; g++) {
                                f = a(c) - p;
                                c += f / (1.1283791670955126 * Math.exp(-(c * c)) - c * f);
                            }
                            return 1 > d ? c : -c;
                        }
                        ;
                        b.Led = function(d) {
                            return 1 - a(d);
                        }
                        ;
                    }
