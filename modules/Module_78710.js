/**
 * @module Module_78710
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 78710
 * Deobfuscated size: 2370 chars
 * Functions: 5
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 78710
{
                        var p, c;
                        function d(g) {
                            var f;
                            g = p.__assign({}, g);
                            g.retry || (g.retry = function(e, h) {
                                if (5 < e)
                                    throw c.Sla(e);
                                h = c.Dsc(h);
                                if (h.unauthorized)
                                    throw c.Sla(e);
                                if (1 === e && h["ale-failure"])
                                    throw c.Sla(e);
                                return new Promise(function(k) {
                                    return setTimeout(k, 500 * Math.pow(2, e - 1));
                                }
                                );
                            }
                            );
                            g.connect || (g.connect = b.kbb);
                            g.disconnect || (g.disconnect = b.lbb);
                            if (!g.bJ) {
                                f = 0;
                                g.bJ = function() {
                                    if (4 <= f)
                                        return (f = 0,
                                        false);
                                    f++;
                                    return true;
                                }
                                ;
                            }
                            return g;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.lbb = b.kbb = undefined;
                        b.p_b = function(g) {
                            return d(g);
                        }
                        ;
                        p = a(22970);
                        c = a(62411);
                        b.kbb = {
                            count: 3,
                            dU: 12E4,
                            reset: 6E5
                        };
                        b.lbb = {
                            count: 3,
                            dU: 3E4,
                            reset: 6E4
                        };
                    }
