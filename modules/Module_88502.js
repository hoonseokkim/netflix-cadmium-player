/**
 * @module Module_88502
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 88502
 * Deobfuscated size: 1031 chars
 * Functions: 1
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 88502
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.yvc = function(c, g, f, e) {
                            var h;
                            h = 1;
                            f = f.fj(d.l.U);
                            if ((0,
                            p.dk)(f))
                                switch (e) {
                                case "loose":
                                    h = Math.min(1, c / Math.max(g - f.track.Tj.G, f.track.Tj.G));
                                    break;
                                default:
                                    h = Math.min(1, c / g);
                                }
                            return h;
                        }
                        ;
                        d = a(65161);
                        p = a(8149);
                    }
