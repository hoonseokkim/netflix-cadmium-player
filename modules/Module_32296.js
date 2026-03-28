/**
 * @module Module_32296
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 32296
 * Deobfuscated size: 1046 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 32296
{
                        var d;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.wK = function(p) {
                            (0,
                            d.assert)("number" === typeof p);
                            return String.fromCharCode(p >>> 24 & 255) + String.fromCharCode(p >>> 16 & 255) + String.fromCharCode(p >>> 8 & 255) + String.fromCharCode(p & 255);
                        }
                        ;
                        b.jMa = function(p) {
                            return p.charCodeAt(3) + (p.charCodeAt(2) << 8) + (p.charCodeAt(1) << 16) + (p.charCodeAt(0) << 24);
                        }
                        ;
                        b.zbd = function(p, c) {
                            return Math.floor(1E3 * p / c);
                        }
                        ;
                        d = a(93334);
                    }
