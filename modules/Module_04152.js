/**
 * @module Module_4152
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 4152
 * Deobfuscated size: 1458 chars
 * Functions: 4
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 4152
{
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Y1b = b.Mla = undefined;
                        b.EYa = function(a) {
                            return "immediate" === a;
                        }
                        ;
                        t = (function() {
                            function a(d, p, c) {
                                this.region = d;
                                this.qa = p;
                                this.wa = c;
                            }
                            a.prototype.toJSON = function() {
                                return {
                                    region: this.region,
                                    Nb: this.qa.$B,
                                    Xg: this.wa.$B
                                };
                            }
                            ;
                            return a;
                        }
                        )();
                        b.Mla = t;
                        b.Y1b = {
                            SH: "forwards",
                            wPa: "backwards",
                            FF: "successors",
                            yU: "predecessors",
                            Oq: "distance"
                        };
                    }
