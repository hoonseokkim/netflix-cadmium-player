/**
 * @module Module_49217
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 49217
 * Deobfuscated size: 1536 chars
 * Functions: 6
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 49217
{
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.c$a = undefined;
                        t = (function() {
                            function a() {}
                            a.prototype.Cha = function(d) {
                                return new TextEncoder().encode(d);
                            }
                            ;
                            a.prototype.I8a = function(d) {
                                return new TextDecoder().decode(d);
                            }
                            ;
                            a.prototype.mZ = function(d) {
                                return btoa(String.fromCharCode.apply(null, d)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
                            }
                            ;
                            a.prototype.$Q = function(d) {
                                d = d.replace(/-/g, "+").replace(/_/g, "/").padEnd(d.length + (4 - d.length % 4) % 4, "=");
                                d = atob(d);
                                for (var p = d.length, c = new Uint8Array(p), g = 0; g < p; g++)
                                    c[g] = d.charCodeAt(g);
                                return c;
                            }
                            ;
                            return a;
                        }
                        )();
                        b.c$a = t;
                    }
