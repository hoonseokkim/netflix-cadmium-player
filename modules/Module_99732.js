/**
 * @module Module_99732
 * @description ES module
 * @categories Crypto
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 99732
 * Deobfuscated size: 2433 chars
 * Functions: 4
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 99732
{
                        var d, p, c, g, f, e;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.IIb = undefined;
                        d = a(29204);
                        p = a(33096);
                        c = a(24066);
                        t = a(36129);
                        g = a(22365);
                        f = a(32687);
                        e = a(31276);
                        a = a(11479);
                        e.Za.get(a.vk).register(t.ea.keb, function(h) {
                            var m, n, q, r, u;
                            function k() {
                                return (0,
                                g.uX)((0,
                                c.jy)() / q);
                            }
                            function l() {
                                var v;
                                v = k();
                                if (v != u) {
                                    for (var w = (0,
                                    g.kG)(v - u, 30); w--; )
                                        r.push(0);
                                    (w = (0,
                                    g.Tz)(r.length - 31, 0)) && r.splice(0, w);
                                    u = v;
                                }
                                r[r.length - 1]++;
                            }
                            m = d.config.MHc;
                            n = -6 / (m - 2 - 2);
                            q = p.Ur;
                            r = [];
                            u = k();
                            (0,
                            f.UYa)(m) && (setInterval(l, 1E3 / m),
                            b.IIb = {
                                rsa: function() {
                                    var x;
                                    for (var v = [], w = r.length - 1; w--; ) {
                                        x = r[w];
                                        v.unshift(0 >= x ? 9 : 1 >= x ? 8 : x >= m - 1 ? 0 : (0,
                                        g.Tt)((x - 2) * n + 7));
                                    }
                                    return v;
                                }
                            });
                            h(p.ai);
                        });
                    }
