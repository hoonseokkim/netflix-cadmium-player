/**
 * @module Module_99306
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 99306
 * Deobfuscated size: 3140 chars
 * Functions: 6
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 99306
{
                        var p, c, g, f;
                        function d(e, h) {
                            this.wV = h;
                            this.O7a = "sr";
                            this.log = e.zb("SocketRouterTransport");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.LKa = b.KKa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(87386);
                        g = a(54861);
                        f = a(70885);
                        d.prototype.send = function(e, h) {
                            var k, l;
                            k = this;
                            l = e.so;
                            h = {
                                type: l,
                                payload: h,
                                options: f.Dnb[l]
                            };
                            false;
                            return this.wV.request(h).then(function(m) {
                                var n;
                                null === (n = e.M8a) || undefined === n ? undefined : n.call(e, m);
                                return {
                                    body: JSON.stringify(m.body),
                                    headers: k.djc(m.headers)
                                };
                            }).catch(function(m) {
                                k.log.warn("Error sending SocketRouter request", {
                                    subCode: m.subCode,
                                    message: m.message
                                });
                                throw m;
                            });
                        }
                        ;
                        d.prototype.Gpa = function() {
                            return {
                                socketRouterOpen: this.wV.iua
                            };
                        }
                        ;
                        d.prototype.djc = function(e) {
                            var h, l, m;
                            h = {};
                            e = Fa(null !== e && undefined !== e ? e : []);
                            for (var k = e.next(); !k.done; k = e.next()) {
                                l = k.value;
                                m = l.indexOf(":");
                                0 < m && (k = l.substring(0, m).trim(),
                                l = l.substring(m + 1).trim(),
                                h[k] = l);
                            }
                            return h;
                        }
                        ;
                        a = d;
                        b.KKa = a;
                        b.KKa = a = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(c.Bb)), t.__param(1, (0,
                        p.v)(g.fma))], a);
                        b.LKa = "SocketRouterTransportSymbol";
                    }
