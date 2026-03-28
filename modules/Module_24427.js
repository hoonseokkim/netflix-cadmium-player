/**
 * @module Module_24427
 * @description ES module
 * @categories Network
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 24427
 * Deobfuscated size: 983 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 24427
{
                        var d, p;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.l1b = function(c) {
                            function g(f) {
                                c.fireEvent(d.ja.HR, {
                                    response: f,
                                    R: c.ga.R
                                });
                            }
                            return {
                                download: function(f, e) {
                                    f.j = c;
                                    f = p.Je.download(f, e);
                                    f.Mna(g);
                                    return f;
                                }
                            };
                        }
                        ;
                        d = a(85001);
                        p = a(61726);
                    }
