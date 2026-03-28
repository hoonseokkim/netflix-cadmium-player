/**
 * @module Module_660
 * @description Class module with ES module exports
 * @categories DRM, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 660
 * Deobfuscated size: 2047 chars
 * Functions: 5
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 660
{
                        var p, c, g, f, e;
                        function d(h, k, l, m) {
                            this.$$b = h;
                            this.FUc = l;
                            this.eVc = m;
                            this.va = k.zb("LicenseProviderImpl");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.yGa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(87386);
                        g = a(81378);
                        a(24674);
                        f = a(16257);
                        a = a(829);
                        d.prototype.wA = function(h) {
                            var k, l;
                            k = this;
                            false;
                            l = this.FUc.G1c(h);
                            return this.$$b.ef({
                                log: this.va,
                                links: h.Kp,
                                J: h.J
                            }, l).then(function(m) {
                                m.map(function(n) {
                                    return n.aGc;
                                });
                                return k.eVc.CVb(m);
                            }).catch(function(m) {
                                k.va.error("PBO license failed", m);
                                return Promise.reject(m);
                            });
                        }
                        ;
                        e = d;
                        b.yGa = e;
                        b.yGa = e = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(g.wIa)), t.__param(1, (0,
                        p.v)(c.Bb)), t.__param(2, (0,
                        p.v)(f.Qib)), t.__param(3, (0,
                        p.v)(a.JIa))], e);
                    }
