/**
 * @module Module_73403
 * @description Class module with ES module exports
 * @categories Media
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 73403
 * Deobfuscated size: 6957 chars
 * Functions: 15
 * Prototype definitions: 11
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 73403
{
                        var p, c, g;
                        function d() {
                            this.Xm = [];
                            this.yc = this.Mc = this.Cc = null;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.wJa = undefined;
                        p = a(26388);
                        c = a(45146);
                        g = a(51344);
                        d.prototype.xz = function(f) {
                            var e;
                            if (f !== this.yc) {
                                e = this.yc;
                                this.yc = f;
                                this.Gwa({
                                    M4: true,
                                    YT: e,
                                    RQ: false
                                });
                            }
                        }
                        ;
                        d.prototype.mO = function(f, e) {
                            var h, k;
                            if (f !== this.Cc) {
                                k = this.Cc;
                                this.Cc = f;
                                f = {
                                    XE: k,
                                    bZ: true,
                                    RQ: null !== (h = null === e || undefined === e ? undefined : e.RQ) && undefined !== h ? h : false
                                };
                                this.Gwa(f);
                            }
                        }
                        ;
                        d.prototype.U5a = function(f) {
                            var e;
                            if (f !== this.Mc) {
                                e = this.Mc;
                                this.Mc = f;
                                this.Gwa({
                                    FLb: e,
                                    Lia: true
                                });
                            }
                        }
                        ;
                        d.prototype.zt = function(f) {
                            var e, h, k, l, m, n;
                            e = undefined !== f.Mc && this.Mc !== f.Mc;
                            h = undefined !== f.Cc && this.Cc !== f.Cc;
                            k = undefined !== f.yc && this.yc !== f.yc;
                            if (e || h || k) {
                                l = this.Mc;
                                e && (this.Mc = f.Mc);
                                m = this.Cc;
                                h && (this.Cc = f.Cc);
                                n = this.yc;
                                k && (this.yc = f.yc);
                                this.Gwa({
                                    FLb: l,
                                    Lia: e,
                                    XE: m,
                                    bZ: h,
                                    YT: n,
                                    M4: k
                                });
                            }
                        }
                        ;
                        d.prototype.EBb = function(f, e, h) {
                            return "v3" !== h ? this.Ovc(f, e) : {
                                Cc: this.Cc,
                                yc: this.yc,
                                Mc: this.Mc
                            };
                        }
                        ;
                        d.prototype.Ovc = function(f, e) {
                            var h, k, l;
                            l = f.type === g.mj.audio ? f : null !== (h = e.find(function(m) {
                                return m.type === g.mj.audio;
                            })) && undefined !== h ? h : this.Cc;
                            f = f.type === g.mj.zJ ? f : null !== (k = e.find(function(m) {
                                return m.type === g.mj.zJ;
                            })) && undefined !== k ? k : this.yc;
                            (0,
                            c.ta)(l && f && this.Mc, "assert tracks are defined for track switching");
                            this.NEc(l, f) || (f = l.sk[0]);
                            return {
                                Mc: this.Mc,
                                Cc: l,
                                yc: f
                            };
                        }
                        ;
                        d.prototype.NEc = function(f, e) {
                            return 0 <= f.sk.indexOf(e);
                        }
                        ;
                        d.prototype.addListener = function(f, e) {
                            (0,
                            c.haa)(e);
                            (0,
                            c.ta)(0 > this.dAb(e));
                            this.Xm = this.Xm.slice();
                            this.Xm.push({
                                Uh: f,
                                listener: e
                            });
                        }
                        ;
                        d.prototype.removeListener = function(f) {
                            var e;
                            (0,
                            c.haa)(f);
                            this.Xm = this.Xm.slice();
                            0 <= (e = this.dAb(f)) && this.Xm.splice(e, 1);
                        }
                        ;
                        d.prototype.dAb = function(f) {
                            return this.Xm.findIndex(function(e) {
                                return e.listener === f;
                            });
                        }
                        ;
                        d.prototype.Gwa = function(f) {
                            var l, m;
                            f = Object.assign({
                                M4: false,
                                YT: this.yc,
                                dv: this.yc,
                                bZ: false,
                                XE: this.Cc,
                                UE: this.Cc,
                                Lia: false,
                                FLb: this.Mc,
                                qwa: this.Mc,
                                RQ: false
                            }, f);
                            for (var e = this.Xm, h = e.length, k = 0; k < h; k++) {
                                l = e[k];
                                m = l.Uh;
                                l = l.listener;
                                (m.includes(p.l.V) && f.bZ || m.includes(p.l.U) && f.Lia || m.includes(p.l.Ea) && f.M4) && l(f);
                            }
                        }
                        ;
                        b.wJa = d;
                    }
