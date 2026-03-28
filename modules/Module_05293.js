/**
 * @module Module_5293
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 5293
 * Deobfuscated size: 1432 chars
 * Functions: 6
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 5293
{
                        var d;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.efd = function(p, c) {
                            var g;
                            return Object.keys(p.ba).some(function(f) {
                                var e;
                                return null === (e = (g = p.ba[f]).next) || undefined === e ? undefined : e[c];
                            }) ? g : undefined;
                        }
                        ;
                        b.ffd = function(p, c) {
                            return (0,
                            d.kc)(Object.keys(p.ba), function(g) {
                                var f;
                                return null === (f = p.ba[g].next) || undefined === f ? undefined : f[c];
                            });
                        }
                        ;
                        b.cfd = function(p, c) {
                            return Object.keys(p.ba).filter(function(g) {
                                var f;
                                return null === (f = p.ba[g].next) || undefined === f ? undefined : f[c];
                            });
                        }
                        ;
                        d = a(91176);
                    }
