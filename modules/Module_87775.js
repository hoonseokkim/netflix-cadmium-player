/**
 * @module Module_87775
 * @description ES module
 * @categories ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 87775
 * Deobfuscated size: 1653 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 87775
{
                        var d;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.aid = function(p, c, g, f, e, h, k, l) {
                            var m;
                            m = e.length;
                            p.log("==================================================================================");
                            p.log(("Selecting stream : state = ").concat(d.Yb[c.state], " : stream list length = ").concat(f.length, " : current bitrate = ").concat(0 < m ? e[m - 1].bitrate : null === h || undefined === h ? undefined : h.bitrate, " : streaming index = ").concat(c.Ve, " : currentSelectedStream = ").concat(h));
                            p.log(("  Buffer : capacity = ").concat(g.ru, " : startPts = ").concat(g.Nb, " : currentPts = ").concat(g.Ld, " : completePts = ").concat(g.yl, " : streamingPts = ").concat(g.fl, " : level = ").concat(g.yl - g.Ld, " : partial bytes = ").concat(g.Zw, " : fragment count = ").concat(g.Ta.length));
                            k && (!l || k > l) && p.log(("  Last switch was DOWN, ").concat(g.fl - k, "ms ago"));
                            l && (!k || k < l) && p.log(("  Last switch was UP, ").concat(g.fl - l, "ms ago"));
                            p.log(("  Available bitrates ").concat(f.map(function(n) {
                                return n.DPa();
                            })));
                        }
                        ;
                        d = a(65161);
                    }
