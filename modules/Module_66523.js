/**
 * @module Module_66523
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 66523
 * Deobfuscated size: 1186 chars
 * Functions: 4
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 66523
{
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.K_c = b.xLb = undefined;
                        b.Rw = function(a, d) {
                            var p;
                            p = Object.getOwnPropertyDescriptor(a, d);
                            p && Object.defineProperty(a, d, {
                                configurable: p.configurable,
                                enumerable: false,
                                value: p.value,
                                writable: p.writable
                            });
                        }
                        ;
                        b.flatten = function(a) {
                            return [].concat.apply([], Ba(a));
                        }
                        ;
                        b.xLb = function(a, d) {
                            return a - d;
                        }
                        ;
                        b.K_c = function(a, d) {
                            return a.localeCompare(d);
                        }
                        ;
                    }
