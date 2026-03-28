/**
 * @module Module_49825
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 49825
 * Deobfuscated size: 3978 chars
 * Functions: 15
 * Prototype definitions: 10
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 49825
{
                        var d, p, c, g;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        d = a(25640);
                        p = a(5493);
                        c = a(61142);
                        g = a(75714);
                        t = (function() {
                            function f(e) {
                                this.vd = e;
                            }
                            f.prototype.to = function(e) {
                                this.vd.type = p.Lm.Instance;
                                this.vd.$q = e;
                                return new c.$$a(this.vd);
                            }
                            ;
                            f.prototype.hVb = function() {
                                if ("function" !== typeof this.vd.ti)
                                    throw Error("" + d.T1b);
                                this.to(this.vd.ti);
                            }
                            ;
                            f.prototype.hq = function(e) {
                                this.vd.type = p.Lm.abb;
                                this.vd.cache = e;
                                this.vd.w_ = null;
                                this.vd.$q = null;
                                new g.eP(this.vd);
                            }
                            ;
                            f.prototype.DO = function(e) {
                                this.vd.type = p.Lm.Ybb;
                                this.vd.cache = null;
                                this.vd.w_ = e;
                                this.vd.$q = null;
                                return new c.$$a(this.vd);
                            }
                            ;
                            f.prototype.v1c = function(e) {
                                this.vd.type = p.Lm.bbb;
                                this.vd.$q = e;
                                new g.eP(this.vd);
                            }
                            ;
                            f.prototype.gg = function(e) {
                                this.vd.type = p.Lm.eFa;
                                this.vd.Au = e;
                                new g.eP(this.vd);
                            }
                            ;
                            f.prototype.w1c = function(e) {
                                if ("function" !== typeof e)
                                    throw Error(d.R1b);
                                this.hq(e);
                                this.vd.type = p.Lm.Function;
                            }
                            ;
                            f.prototype.eVb = function(e) {
                                this.vd.type = p.Lm.eFa;
                                this.vd.Au = function(h) {
                                    return function() {
                                        return h.Fb.get(e);
                                    }
                                    ;
                                }
                                ;
                                new g.eP(this.vd);
                            }
                            ;
                            f.prototype.bia = function(e) {
                                this.vd.type = p.Lm.pkb;
                                this.vd.IU = e;
                                new g.eP(this.vd);
                            }
                            ;
                            f.prototype.z1c = function(e) {
                                this.DO(function(h) {
                                    return h.Fb.get(e);
                                });
                            }
                            ;
                            return f;
                        }
                        )();
                        b.zZb = t;
                    }
