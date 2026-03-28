/**
 * @module Module_2734
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 2734
 * Deobfuscated size: 745 chars
 * Functions: 1
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 2734
{
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        t = a(31276);
                        b = a(36410);
                        a = a(34126);
                        t.Za.get(b.oX).Qya(a.TGa.g_b, function(d) {
                            var p, c;
                            p = d.level;
                            if (!Da._cad_global.config || p <= Da._cad_global.config.DHc) {
                                d = d.eBa();
                                c = Da.console;
                                1 >= p ? c.error(d) : 2 >= p ? c.warn(d) : c.log(d);
                            }
                        });
                    }
