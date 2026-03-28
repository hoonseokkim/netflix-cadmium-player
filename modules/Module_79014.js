/**
 * @module Module_79014
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 79014
 * Deobfuscated size: 4330 chars
 * Functions: 13
 * Prototype definitions: 7
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 79014
{
                        var p, c, g, f, e, h, k;
                        function d(l, m) {
                            var n, q, r, u;
                            n = this;
                            this.j = l;
                            this.gMc = function() {
                                var v;
                                g.Ce.removeListener(g.Zsa, n.eMb);
                                v = n.Ou.Vq();
                                v && v.parentNode && v.parentNode.removeChild(v);
                            }
                            ;
                            this.w1a = function(v) {
                                n.Ou.pXc(v.newValue);
                            }
                            ;
                            this.kNc = function(v) {
                                var w;
                                n.Ou.AXc(v.dv ? v.dv.hua : undefined);
                                n.Ou.BXc(null === (w = v.dv) || undefined === w ? undefined : w.oh);
                                n.Ou.Q2c(n.XBb(v.dv));
                            }
                            ;
                            this.eMb = function() {
                                n.Ou.QU();
                            }
                            ;
                            r = l.oa.yc ? l.oa.yc.hua : undefined;
                            u = null === (q = l.oa.yc) || undefined === q ? undefined : q.oh;
                            q = this.XBb(l.oa.yc);
                            this.Ou = new e.Cmb(m,q,r,u);
                            m = l.nW.value;
                            (0,
                            c.ta)(.1 < m.width / m.height);
                            this.Ou.$Wc(m.width / m.height);
                            l.nv.appendChild(this.Ou.Vq());
                            l.CC.addListener(this.w1a);
                            l.oa.addListener([k.l.Ea], this.kNc);
                            l.addEventListener(h.ja.Fh, this.gMc, p.DX);
                            g.Ce.addListener(g.Zsa, this.eMb);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Fmb = undefined;
                        p = a(33096);
                        c = a(45146);
                        g = a(37509);
                        f = a(29204);
                        e = a(97154);
                        h = a(85001);
                        k = a(26388);
                        d.prototype.P5a = function(l) {
                            this.Ou.P5a(l);
                        }
                        ;
                        d.prototype.RWa = function() {
                            return this.Ou.RWa();
                        }
                        ;
                        d.prototype.N5a = function(l) {
                            this.Ou.N5a(l);
                        }
                        ;
                        d.prototype.PWa = function() {
                            return this.Ou.PWa();
                        }
                        ;
                        d.prototype.O5a = function(l) {
                            this.Ou.O5a(l);
                        }
                        ;
                        d.prototype.QWa = function() {
                            return this.Ou.QWa();
                        }
                        ;
                        d.prototype.XBb = function(l) {
                            var m;
                            if (l && f.config.Rua && 0 <= f.config.Rua.indexOf(l.oh)) {
                                m = Object.assign({}, f.config.cBa);
                                Object.entries(m).forEach(function(n) {
                                    var q;
                                    q = Fa(n);
                                    n = q.next().value;
                                    q = q.next().value;
                                    m[n] = q.replace(/font-weight:bolder/g, "font-weight:normal");
                                });
                                return m;
                            }
                            return f.config.cBa;
                        }
                        ;
                        b.Fmb = d;
                    }
