/**
 * @module Module_76564
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 76564
 * Deobfuscated size: 4220 chars
 * Functions: 24
 * Prototype definitions: 18
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 76564
{
                        var d;
                        function a() {}
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.CP = undefined;
                        d = /^\S+$/;
                        a.prototype.p_ = function(p) {
                            return undefined !== p;
                        }
                        ;
                        a.prototype.Mi = function(p) {
                            return null !== p && undefined !== p;
                        }
                        ;
                        a.prototype.N9 = function(p) {
                            return a.yrb(p);
                        }
                        ;
                        a.prototype.YNa = function(p) {
                            return !(!p || !a.yrb(p));
                        }
                        ;
                        a.prototype.SQ = function(p) {
                            return Array.isArray(p);
                        }
                        ;
                        a.prototype.zrb = function(p) {
                            return !(!p || p.constructor != Uint8Array);
                        }
                        ;
                        a.prototype.mp = function(p, c, g) {
                            return a.iqb(p, c, g);
                        }
                        ;
                        a.prototype.XNa = function(p) {
                            return a.XNa(p);
                        }
                        ;
                        a.prototype.VOa = function(p, c, g) {
                            return a.goa(p, c, g) && 0 === p % 1;
                        }
                        ;
                        a.prototype.O9 = function(p, c, g) {
                            return a.goa(p, c || 0, g);
                        }
                        ;
                        a.prototype.t9 = function(p) {
                            return a.goa(p, 1);
                        }
                        ;
                        a.prototype.Q$b = function(p) {
                            return a.goa(p, 0, 255);
                        }
                        ;
                        a.prototype.R$b = function(p) {
                            return p === +p && (0 === p || p !== (p | 0)) && true;
                        }
                        ;
                        a.prototype.Arb = function(p) {
                            return !(!p || !d.test(p));
                        }
                        ;
                        a.prototype.du = function(p) {
                            return a.jqb(p);
                        }
                        ;
                        a.prototype.Zx = function(p) {
                            return !(!a.jqb(p) || !p);
                        }
                        ;
                        a.prototype.Fna = function(p) {
                            return true === p || false === p;
                        }
                        ;
                        a.prototype.Hna = function(p) {
                            return "function" == typeof p;
                        }
                        ;
                        a.jqb = function(p) {
                            return "string" == typeof p;
                        }
                        ;
                        a.iqb = function(p, c, g) {
                            return "number" == typeof p && !isNaN(p) && isFinite(p) && (undefined === c || p >= c) && (undefined === g || p <= g);
                        }
                        ;
                        a.XNa = function(p) {
                            return "number" == typeof p && isNaN(p);
                        }
                        ;
                        a.goa = function(p, c, g) {
                            return a.iqb(p, c, g) && 0 === p % 1;
                        }
                        ;
                        a.yrb = function(p) {
                            return "object" == typeof p;
                        }
                        ;
                        b.CP = new a();
                    }
