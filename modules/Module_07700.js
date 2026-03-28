/**
 * @module Module_7700
 * @description Class module with ES module exports
 * @categories Network, MSL, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 7700
 * Deobfuscated size: 5099 chars
 * Functions: 9
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 7700
{
                        var p, c, g, f, e, h;
                        function d(k, l, m, n) {
                            k = f.Yf.call(this, k, undefined === n ? "AppInfoConfigImpl" : n) || this;
                            k.config = l;
                            k.N7a = m;
                            return k;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.ACa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(34231);
                        g = a(12501);
                        f = a(64174);
                        e = a(83767);
                        a = a(70865);
                        Ia(d, f.Yf);
                        d.prototype.dyc = function(k) {
                            return "" + this.Uyb + (this.rV(k) ? "/msl_v1" : "");
                        }
                        ;
                        d.prototype.wyc = function(k) {
                            return "" + this.host + (this.rV(k) ? "/msl" : "") + "/playapi";
                        }
                        ;
                        d.prototype.rV = function(k) {
                            return this.N7a.rV(k);
                        }
                        ;
                        Ha.Object.defineProperties(d.prototype, {
                            endpoint: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.host + "/api";
                                }
                            },
                            Uyb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.host + "/nq";
                                }
                            },
                            Tyb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    var k;
                                    switch (this.config.aS) {
                                    case c.UC.cLa:
                                    case c.UC.YFa:
                                        k = "logs.test.netflix.com";
                                        break;
                                    default:
                                        k = "logs.netflix.com";
                                    }
                                    return "https://" + k + "/log";
                                }
                            },
                            host: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    var k;
                                    switch (this.config.aS) {
                                    case c.UC.x6b:
                                        k = "www.stage";
                                        break;
                                    case c.UC.cLa:
                                        k = "www-qa.test";
                                        break;
                                    case c.UC.YFa:
                                        k = "www-int.test";
                                        break;
                                    default:
                                        k = "www";
                                    }
                                    return "https://" + k + ".netflix.com";
                                }
                            },
                            Tsb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return "pbo_config";
                                }
                            }
                        });
                        h = d;
                        b.ACa = h;
                        t.__decorate([g.config(g.string, "apiEndpoint")], h.prototype, "endpoint", null);
                        t.__decorate([g.config(g.string, "nqEndpoint")], h.prototype, "Uyb", null);
                        t.__decorate([g.config(g.string, "logsEndpoint")], h.prototype, "Tyb", null);
                        t.__decorate([g.config(g.string, "bindService")], h.prototype, "Tsb", null);
                        b.ACa = h = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(e.gp)), t.__param(1, (0,
                        p.v)(c.Rt)), t.__param(2, (0,
                        p.v)(a.q8)), t.__param(3, (0,
                        p.v)(e.Kja)), t.__param(3, (0,
                        p.optional)())], h);
                    }
