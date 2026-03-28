/**
 * @module Module_39480
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 39480
 * Deobfuscated size: 4822 chars
 * Functions: 9
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 39480
{
                        var d, p, c, g, f, e, h, k;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.l5b = function(l) {
                            var r, u, v, w, x, y;
                            function m() {
                                return l.state.value === k.Nc.LOADING || l.state.value === k.Nc.Lf && l.bc.value === k.Qb.Bh;
                            }
                            function n() {
                                m() ? y || (y = setInterval(q, 100)) : y && (clearInterval(y),
                                y = undefined,
                                (0,
                                e.gi)(q));
                            }
                            function q() {
                                var A, z, B, C, D, E, G, F;
                                A = (0,
                                c.jy)();
                                z = r.value;
                                B = z ? z.progress : 0;
                                C = l.state.value == k.Nc.LOADING || m() && A - u > p.config.Xec;
                                if (C && l.state.value == k.Nc.Lf) {
                                    if (l.se.value === k.zh.dlb)
                                        (D = B,
                                        E = true);
                                    else {
                                        G = A;
                                        v = v || A;
                                        w = w || v + p.config.GJc + 1;
                                        (0,
                                        h.wc)(G) && (G = (0,
                                        f.Tz)(G, w),
                                        D = (0,
                                        f.Tt)(1E3 * (0,
                                        g.oG)((A - v) / (G - v), 0, .99)) / 1E3);
                                    }
                                    if (D < B)
                                        if (B - D < p.config.MRc / 100)
                                            (D = B,
                                            x = undefined);
                                        else if (x) {
                                            if (A - x > p.config.LRc) {
                                                F = true;
                                                x = undefined;
                                            } else
                                                D = B;
                                        } else
                                            (x = A,
                                            D = B);
                                } else
                                    x = w = v = undefined;
                                A = C ? {
                                    Et: E,
                                    progress: D,
                                    NRc: F
                                } : null;
                                (!A || !r || !z || (0,
                                h.wc)(A.progress) && !(0,
                                h.wc)(z.progress) || (0,
                                h.wc)(A.progress) && (0,
                                h.wc)(z.progress) && .01 < (0,
                                f.Tka)(A.progress - z.progress) || A.Et !== z.Et) && r.set(A);
                            }
                            r = l.RPa;
                            u = 0;
                            l.state.addListener(function() {
                                n();
                                q();
                            }, d.eIa);
                            l.bc.addListener(function(A) {
                                if (A.oldValue !== k.Qb.Bh || A.newValue !== k.Qb.Bh)
                                    u = (0,
                                    c.jy)();
                                n();
                            });
                            l.se.addListener(function() {
                                n();
                            });
                            l.ju.addListener(function() {
                                n();
                            });
                            l.Zn.addListener(function() {
                                n();
                            });
                            y || (y = setInterval(q, 100));
                        }
                        ;
                        d = a(33096);
                        p = a(29204);
                        c = a(24066);
                        g = a(8825);
                        f = a(22365);
                        e = a(32219);
                        h = a(32687);
                        k = a(85001);
                    }
