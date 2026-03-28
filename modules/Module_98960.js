/**
 * @module Module_98960
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 98960
 * Deobfuscated size: 3316 chars
 * Functions: 14
 * Prototype definitions: 13
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 98960
{
                        var p, c, g, f;
                        function d(e, h, k) {
                            this.config = e;
                            this.Ctb = h;
                            this.lPc = k;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.mEa = undefined;
                        t = a(22970);
                        p = a(1079);
                        c = a(22674);
                        g = a(57657);
                        a = a(41605);
                        d.prototype.ADb = function(e) {
                            return this.TUa().BDb(e);
                        }
                        ;
                        d.prototype.CDb = function(e) {
                            return this.eM().BDb(e);
                        }
                        ;
                        d.prototype.TUa = function() {
                            this.nPa && this.nPa.type == this.config().oPa || (this.nPa = this.Ctb.Pkc(this.config().oPa));
                            return this.nPa;
                        }
                        ;
                        d.prototype.eM = function() {
                            this.DBa && this.DBa.type == this.config().EBa || (this.DBa = this.Ctb.Cmc(this.config().EBa),
                            this.DBa.wOa(this.lPc.Awc()));
                            return this.DBa;
                        }
                        ;
                        d.prototype.FV = function(e) {
                            return this.eM().FV(e);
                        }
                        ;
                        d.prototype.uZ = function(e) {
                            return this.eM().uZ(e);
                        }
                        ;
                        d.prototype.Wba = function() {
                            return this.eM().Wba();
                        }
                        ;
                        d.prototype.Eha = function() {
                            return this.eM().Eha();
                        }
                        ;
                        d.prototype.SAa = function() {
                            return this.TUa().SAa();
                        }
                        ;
                        d.prototype.Dha = function() {
                            return this.TUa().Dha();
                        }
                        ;
                        d.prototype.TAa = function() {
                            return this.eM().TAa();
                        }
                        ;
                        d.prototype.Fha = function() {
                            return this.eM().Fha();
                        }
                        ;
                        d.prototype.hca = function() {
                            return this.eM().hca();
                        }
                        ;
                        f = d;
                        b.mEa = f;
                        b.mEa = f = t.__decorate([(0,
                        c.aa)(), t.__param(0, (0,
                        c.v)(p.TW)), t.__param(1, (0,
                        c.v)(a.Hab)), t.__param(2, (0,
                        c.v)(g.Mcb))], f);
                    }
