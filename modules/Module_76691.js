/**
 * @module Module_76691
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 76691
 * Deobfuscated size: 2075 chars
 * Functions: 4
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 76691
{
                        var p, c, g, f, e, h;
                        function d(k, l) {
                            this.ki = k;
                            this.Rk = l;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.aKa = undefined;
                        t = a(22970);
                        c = a(22674);
                        g = a(72574);
                        f = a(5021);
                        e = a(45118);
                        a = a(31850);
                        d.prototype.Zya = function(k) {
                            k = this.Rk.tu("ftlProbeError", "info", p.U4c({
                                url: k.url,
                                sc: k.status,
                                pf_err: k.zNb
                            }, k));
                            this.ki.bd(k);
                        }
                        ;
                        d.U4c = function(k, l) {
                            l.Of && (l = l.Of,
                            p.gu(k, "d", l.duration),
                            p.gu(k, "dns", l.Oxb),
                            p.gu(k, "tcp", l.e7a),
                            p.gu(k, "tls", l.x7a),
                            p.gu(k, "ttfb", l.q7a),
                            p.gu(k, "client_send_ts", l.qQb),
                            p.gu(k, "client_recv_ts", l.FQb),
                            k.sz = l.size.na(g.Rz));
                            return k;
                        }
                        ;
                        d.gu = function(k, l, m) {
                            m && (k[l] = m.na(f.Ba));
                        }
                        ;
                        h = p = d;
                        b.aKa = h;
                        b.aKa = h = p = t.__decorate([(0,
                        c.aa)(), t.__param(0, (0,
                        c.v)(e.oq)), t.__param(1, (0,
                        c.v)(a.hG))], h);
                    }
