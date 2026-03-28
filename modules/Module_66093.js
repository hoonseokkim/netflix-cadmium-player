/**
 * @module Module_66093
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 66093
 * Deobfuscated size: 3282 chars
 * Functions: 12
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 66093
{
                        var d, p, c, g, f, e, h, k, l;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.BD = undefined;
                        d = a(33096);
                        p = a(29204);
                        t = a(36129);
                        c = a(31276);
                        g = a(22365);
                        f = a(11479);
                        e = a(32687);
                        h = a(59818);
                        k = a(5021);
                        a = c.Za.get(f.vk);
                        l = c.Za.get(h.qG);
                        a.register(t.ea.geb, function(m) {
                            var u, v;
                            function n() {
                                m(d.ai);
                                n = d.lK;
                            }
                            function q(w) {
                                if (!(w instanceof EventTarget))
                                    throw "batteryManager is not an instaceof EventTarget";
                                ["addEventListener", "removeEventListener"].forEach(function(x) {
                                    if (!(0,
                                    e.Gy)(w[x]))
                                        throw x + " is not a function";
                                });
                            }
                            function r() {
                                return Promise.resolve().then(function() {
                                    var w;
                                    w = g.Lg.getBattery();
                                    if (!(0,
                                    e.Gy)(w.then))
                                        throw "getBattery did not return a promise";
                                    return w;
                                });
                            }
                            u = (0,
                            c.An)("BatteryManager");
                            b.BD = {
                                VZb: "chargingchange",
                                nCb: function() {
                                    return v ? v.level : null;
                                },
                                dVa: function() {
                                    return v ? v.charging : null;
                                },
                                addEventListener: function(w, x) {
                                    v && v.addEventListener(w, x);
                                },
                                removeEventListener: function(w, x) {
                                    v && v.removeEventListener(w, x);
                                }
                            };
                            p.config.B$ && (0,
                            e.Gy)(g.Lg.getBattery) ? l.tt((0,
                            k.pc)(p.config.svc), r()).then(function(w) {
                                q(w);
                                v = w;
                            }).catch(function(w) {
                                u.error("getBattery failed", w);
                            }).then(n) : n();
                        });
                    }
