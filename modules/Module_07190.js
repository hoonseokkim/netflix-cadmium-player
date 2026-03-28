/**
 * @module Module_7190
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 7190
 * Deobfuscated size: 1180 chars
 * Functions: 5
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 7190
{
                        var d;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        d = a(1003);
                        a(41146);
                        t = (function() {
                            function p(c) {
                                this.vd = c;
                            }
                            p.prototype.when = function(c) {
                                this.vd.pR = c;
                                return new d.tja(this.vd);
                            }
                            ;
                            p.prototype.Wia = function() {
                                this.vd.pR = function(c) {
                                    return null !== c.target && !c.target.LYa() && !c.target.cZa();
                                }
                                ;
                                return new d.tja(this.vd);
                            }
                            ;
                            return p;
                        }
                        )();
                        b.bDa = t;
                    }
