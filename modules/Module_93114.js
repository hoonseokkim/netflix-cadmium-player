/**
 * @module Module_93114
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 93114
 * Deobfuscated size: 2957 chars
 * Functions: 5
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 93114
{
                        var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        d = a(82956);
                        p = a(33096);
                        c = a(29204);
                        g = a(13044);
                        f = a(24066);
                        t = a(36129);
                        e = a(31276);
                        h = a(77134);
                        k = a(22365);
                        l = a(32219);
                        m = a(32687);
                        n = a(45118);
                        q = a(31850);
                        a = a(11479);
                        v = e.Za.get(a.vk);
                        v.register(t.ea.jeb, function(w) {
                            var y;
                            function x() {
                                var A, z, B;
                                A = v.startTime;
                                z = {
                                    browserua: k.yX,
                                    browserhref: k.bla.href,
                                    initstart: A,
                                    initdelay: v.endTime - A
                                };
                                (A = k.$i.documentMode) && (z.browserdm = "" + A);
                                (0,
                                m.n1)(c.config.Kzb) && (z.fesn = c.config.Kzb);
                                Object.assign(z, (0,
                                d.oDb)());
                                B = k.$C && k.$C.timing;
                                B && c.config.BHc.map(function(C) {
                                    var D;
                                    D = B[C];
                                    D && (z["pt_" + C] = D - (0,
                                    f.Shc)());
                                });
                                A = y.Bxc();
                                Object.entries(A).forEach(function(C) {
                                    var D;
                                    D = Fa(C);
                                    C = D.next().value;
                                    D = D.next().value;
                                    return z["m_" + C] = D;
                                });
                                A = u.tu("startup", "info", z, g.Yz.jUa);
                                r.bd(A);
                            }
                            u = e.Za.get(q.hG);
                            r = e.Za.get(n.oq);
                            y = e.Za.get(h.ZX);
                            v.Nda(function() {
                                r.Gb();
                                (0,
                                l.gi)(x);
                            });
                            w(p.ai);
                        });
                    }
