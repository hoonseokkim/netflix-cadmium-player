/**
 * @module Module_78719
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 78719
 * Deobfuscated size: 1715 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 78719
{
                        var d, p, c, g, f;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.L0b = function(e, h) {
                            function k(m) {
                                var n, q;
                                n = m.error || m;
                                q = (0,
                                c.Yj)(n);
                                h.error("uncaught exception", n, q);
                                (n = (n = n && n.stack) && d.config.cWb && d.config.n2c ? 0 <= n.indexOf(d.config.cWb) : undefined) && (m && m.stopImmediatePropagation && m.stopImmediatePropagation(),
                                e.Gg(g.ea.Xmb));
                            }
                            function l() {
                                p.Ce.removeListener(p.Ysa, k);
                                e.removeEventListener(f.ja.Fh, l);
                                e.removeEventListener(f.ja.YB, l);
                            }
                            try {
                                p.Ce.addListener(p.Ysa, k);
                                e.addEventListener(f.ja.Fh, l);
                                d.config.iCc && e.addEventListener(f.ja.YB, l);
                            } catch (m) {
                                h.error("exception in exception handler ", m);
                            }
                        }
                        ;
                        d = a(29204);
                        p = a(37509);
                        c = a(3887);
                        g = a(36129);
                        f = a(85001);
                    }
