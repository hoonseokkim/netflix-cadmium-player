/**
 * @module Module_42654
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 42654
 * Deobfuscated size: 2438 chars
 * Functions: 5
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 42654
{
                        var d, p, c, g, f, e, h, k, l;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.W1b = function(m) {
                            var q, r, u, v;
                            function n() {
                                m.state.value !== h.Nc.Lf || m.bc.value !== h.Qb.aj && m.bc.value !== h.Qb.Ix ? r.Er() : r.OL();
                            }
                            q = d.config.POc;
                            if (!m.l1() && q) {
                                r = k.Za.get(l.n8)(q, function() {
                                    m.fireEvent(h.ja.U0, c.ea.mla);
                                });
                                m.bc.addListener(n);
                                m.state.addListener(n);
                                if (d.config.VXa) {
                                    u = (0,
                                    p.jy)();
                                    v = new g.Akb(d.config.VXa,function() {
                                        var w, x;
                                        w = (0,
                                        p.jy)();
                                        x = w - u;
                                        x > q && (m.fireEvent(h.ja.U0, c.ea.yka),
                                        v.yub());
                                        x > 2 * d.config.VXa && (m.WXa = (0,
                                        f.Tz)(x, m.WXa || 0));
                                        u = w;
                                    }
                                    );
                                    v.cYc();
                                }
                                m.addEventListener(h.ja.Fh, function() {
                                    r.Er();
                                    (0,
                                    e.gd)(v) && v.yub();
                                });
                            }
                        }
                        ;
                        d = a(29204);
                        p = a(24066);
                        c = a(36129);
                        g = a(981);
                        f = a(22365);
                        e = a(32687);
                        h = a(85001);
                        k = a(31276);
                        l = a(4246);
                    }
