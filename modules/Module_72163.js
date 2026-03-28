/**
 * @module Module_72163
 * @description ES module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 72163
 * Deobfuscated size: 2054 chars
 * Functions: 6
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 72163
{
                        var p, c;
                        function d(g) {
                            var k, l;
                            function f() {
                                for (var m = [], n = 0; n < arguments.length; n++)
                                    m[n] = arguments[n];
                                return l ? k.trace.apply(k, p.__spreadArray([l], m, false)) : k.trace.apply(k, m);
                            }
                            for (var e = [], h = 1; h < arguments.length; h++)
                                e[h - 1] = arguments[h];
                            k = "string" === typeof g ? new c.platform.Console(g) : g;
                            l = e.filter(function(m) {
                                return m;
                            }).map(function(m) {
                                return ("").concat(m);
                            }).join(":");
                            f.console = k;
                            f.extend = function() {
                                for (var m = [], n = 0; n < arguments.length; n++)
                                    m[n] = arguments[n];
                                return d.apply(undefined, p.__spreadArray([k], p.__spreadArray([l], m, true), false));
                            }
                            ;
                            f.error = function() {
                                for (var m = [], n = 0; n < arguments.length; n++)
                                    m[n] = arguments[n];
                                return k.error.apply(k, p.__spreadArray([l], m, false));
                            }
                            ;
                            return f;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.kb = d;
                        p = a(22970);
                        c = a(66164);
                    }
