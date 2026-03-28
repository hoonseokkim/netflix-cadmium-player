/**
 * @module Module_95136
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 95136
 * Deobfuscated size: 9867 chars
 * Functions: 17
 * Prototype definitions: 5
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 95136
{
                        var p, c, g, f, e, h, k;
                        function d(l, m, n, q, r) {
                            var u;
                            u = this;
                            this.j = l;
                            this.Ua = m;
                            this.va = n;
                            this.$a = q;
                            this.Qwa = {};
                            this.v_ = {};
                            this.o4 = [];
                            this.KFb = 1E3;
                            this.DAa = p.kgb;
                            this.v1a = function() {
                                var v;
                                v = u.j.bc.value === f.Qb.Bg && u.j.state.value === f.Nc.Lf && u.j.R === u.Ua.R;
                                u.ada ? v || (clearInterval(u.ada),
                                u.ada = undefined,
                                u.Eda = undefined) : v && (u.ada = Da.setInterval(u.c1c, u.KFb));
                            }
                            ;
                            this.c1c = function() {
                                var v, w, x, y;
                                w = u.j.Fe.value;
                                w = w && w.stream;
                                w = null !== (v = w && w.height) && undefined !== v ? v : null;
                                if (null !== w && 0 < w) {
                                    v = u.$a.Fc().na(h.Ba);
                                    x = u.j.ae.vS();
                                    if (x) {
                                        if (u.Eda && v - u.Eda.time < 2 * u.KFb && w === u.Eda.height) {
                                            y = x - u.Eda.kpc;
                                            u.DOa(w, y);
                                            u.Kac(w, y);
                                        }
                                        u.Eda = {
                                            time: v,
                                            kpc: x,
                                            height: w
                                        };
                                        u.j.Vxa && u.j.Vxa.mXc(u.Qwa);
                                    }
                                }
                            }
                            ;
                            this.XUa = function() {
                                var v;
                                v = {};
                                u.v_ && u.o4.forEach(function(w) {
                                    var x, y, A;
                                    x = u.v_[w];
                                    if (x) {
                                        y = 0;
                                        A = 0;
                                        (0,
                                        e.Qi)(x, function(z, B) {
                                            A += (0,
                                            e.wm)(z);
                                            y += B;
                                        });
                                        v[w] = A / y;
                                    }
                                });
                                return v;
                            }
                            ;
                            this.gca = function(v) {
                                var w;
                                w = {};
                                v.forEach(function(x) {
                                    w[x] = {};
                                });
                                u.v_ && ((0,
                                c.FCa)(v),
                                u.o4.forEach(function(x) {
                                    var y, A, z, B;
                                    y = u.v_[x];
                                    if (y) {
                                        A = 0;
                                        z = 0;
                                        (0,
                                        e.Qi)(y, function(F, H) {
                                            A += H;
                                        });
                                        B = Object.keys(y).map(Number);
                                        (0,
                                        c.FCa)(B);
                                        for (var C = B.length - 1, D = B[C], E = v.length - 1; 0 <= E; E--) {
                                            for (var G = v[E]; D >= G && 0 <= C; )
                                                ((D = y[D]) && (z += D),
                                                D = B[--C]);
                                            w[G][x] = (0,
                                            g.Tt)(z / A * 100);
                                        }
                                    }
                                }));
                                return w;
                            }
                            ;
                            this.hVc = function(v) {
                                false === v.oldValue && true === v.newValue && (u.j.lza(),
                                u.KQb.set(false));
                            }
                            ;
                            this.log = this.va.zb("DFF", l);
                            this.J2a = r().opc;
                            this.HIc = r().mpc;
                            this.kKb = r().npc;
                            this.Ua.QSa = {
                                XUa: this.XUa,
                                gca: this.gca
                            };
                            this.KQb = new k.Ac(false,this.hVc);
                            l.state.addListener(this.v1a);
                            l.bc.addListener(this.v1a);
                            l.addEventListener(f.ja.ZM, this.v1a);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Ubb = undefined;
                        p = a(33096);
                        c = a(52569);
                        g = a(22365);
                        f = a(85001);
                        e = a(3887);
                        h = a(5021);
                        k = a(81734);
                        d.prototype.nJ = function(l) {
                            return l.lower && l.height > this.kKb ? l.height >= this.Dzc() : false;
                        }
                        ;
                        d.prototype.DOa = function(l, m) {
                            var n;
                            n = this.Qwa[l];
                            n || (this.Qwa[l] = n = [],
                            l > this.kKb && (this.o4.push(l),
                            (0,
                            c.FCa)(this.o4)));
                            0 < m && !(this.Aea && this.Aea < l) && (this.Aea = l);
                            n.push(m);
                            n.length > this.HIc && n.shift();
                        }
                        ;
                        d.prototype.Kac = function(l, m) {
                            var n;
                            n = this.v_[l];
                            n || (this.v_[l] = n = {});
                            l = n[m];
                            n[m] = l ? l + 1 : 1;
                        }
                        ;
                        d.prototype.Dzc = function() {
                            var n, q;
                            if (this.Aea) {
                                for (var l = this.o4.length, m = 0; m < l; m++) {
                                    n = this.o4[m];
                                    if (n >= this.Aea && n < this.DAa) {
                                        q = this.Qwa[n];
                                        if (q && this.Xgc(this.J2a, q) && this.DAa != n)
                                            return (this.log.warn("Restricting resolution due to high number of dropped frames", {
                                                MaxHeight: n
                                            }),
                                            this.Ua.fw.set({
                                                reason: "droppedFrames",
                                                height: n
                                            }),
                                            this.KQb.set(true),
                                            this.DAa = n);
                                    }
                                }
                                this.Aea = undefined;
                            }
                            return this.DAa;
                        }
                        ;
                        d.prototype.Xgc = function(l, m) {
                            var u, v;
                            for (var n = l.length, q = m.length, r = 0; r < n; r++) {
                                u = l[r];
                                v = u[0];
                                u = u[1];
                                for (var w = 0; w < q; w++)
                                    if (m[w] >= u && 0 >= --v)
                                        return true;
                            }
                            return false;
                        }
                        ;
                        Ha.Object.defineProperties(d.prototype, {
                            xra: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return "df";
                                }
                            }
                        });
                        b.Ubb = d;
                    }
