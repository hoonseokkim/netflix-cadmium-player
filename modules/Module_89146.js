/**
 * @module Module_89146
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 89146
 * Deobfuscated size: 2891 chars
 * Functions: 7
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 89146
{
                        var p, c, g, f;
                        function d(e, h) {
                            this.Je = h;
                            this.O7a = "ssl";
                            this.log = e.zb("SslTransport");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.QKa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(5021);
                        g = a(87386);
                        a = a(32934);
                        d.prototype.send = function(e, h) {
                            var k, l;
                            k = this;
                            l = {
                                url: e.url.href,
                                EL: "nq-" + e.so,
                                gOb: JSON.stringify(h),
                                Dpa: e.timeout.na(c.Ba),
                                headers: e.headers,
                                withCredentials: true,
                                ox: "pbo"
                            };
                            false;
                            return new Promise(function(m, n) {
                                k.Je.download(l, function(q) {
                                    q.success ? m(q) : n(q);
                                });
                            }
                            ).then(function(m) {
                                return {
                                    body: m.content,
                                    headers: m.headers
                                };
                            }).catch(function(m) {
                                var n;
                                if (!m.error)
                                    throw (m.subCode = m.Ya || m.subCode,
                                    m);
                                n = m.error;
                                n.headers = m.headers;
                                k.log.error("Error sending SSL request", {
                                    subCode: n.subCode,
                                    data: n.content,
                                    message: n.message
                                });
                                throw n;
                            });
                        }
                        ;
                        d.prototype.Gpa = function() {
                            return {};
                        }
                        ;
                        f = d;
                        b.QKa = f;
                        b.QKa = f = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(g.Bb)), t.__param(1, (0,
                        p.v)(a.Sz))], f);
                    }
