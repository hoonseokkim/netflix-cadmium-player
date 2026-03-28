/**
 * @module Module_33464
 * @description Class/prototype module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 33464
 * Deobfuscated size: 1049 chars
 * Functions: 4
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 33464
{
                        var d, p, c, g, f;
                        d = Array.prototype.slice;
                        p = a(30801);
                        c = Object.keys;
                        g = c ? function(e) {
                            return c(e);
                        }
                        : a(75691);
                        f = Object.keys;
                        g.rYc = function() {
                            Object.keys ? (function() {
                                var e;
                                e = Object.keys(arguments);
                                return e && e.length === arguments.length;
                            }
                            )(1, 2) || (Object.keys = function(e) {
                                return p(e) ? f(d.call(e)) : f(e);
                            }
                            ) : Object.keys = g;
                            return Object.keys || g;
                        }
                        ;
                        t.exports = g;
                    }
