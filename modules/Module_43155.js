/**
 * @module Module_43155
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 43155
 * Deobfuscated size: 2050 chars
 * Functions: 9
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 43155
{
                        var p;
                        function d(c) {
                            if (c.aborted)
                                throw c.reason;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.t9a = undefined;
                        b.xM = function(c) {
                            return "AbortError" === (null === c || undefined === c ? undefined : c.name);
                        }
                        ;
                        b.UUb = d;
                        b.ooa = function(c, g) {
                            function f() {}
                            undefined === g && (g = true);
                            g || (f = function() {
                                d(c);
                            }
                            );
                            return new Promise(function(e) {
                                var k;
                                function h() {
                                    return e();
                                }
                                c.aborted && e();
                                c.addListener ? c.addListener("abort", h) : null === (k = c.addEventListener) || undefined === k ? undefined : k.call(c, "abort", h);
                            }
                            ).then(f);
                        }
                        ;
                        p = a(22970);
                        t = (function(c) {
                            function g(f) {
                                f = c.call(this, f) || this;
                                f.name = "AbortError";
                                return f;
                            }
                            p.__extends(g, c);
                            return g;
                        }
                        )(Error);
                        b.t9a = t;
                    }
