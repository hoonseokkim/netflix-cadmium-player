/**
 * @module Module_96222
 * @description CommonJS module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 96222
 * Deobfuscated size: 795 chars
 * Functions: 1
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 96222
{
                        var d;
                        d = a(5158);
                        t.exports = function(p) {
                            if (null === p)
                                return "Null";
                            if ("undefined" === typeof p)
                                return "Undefined";
                            if (d(p))
                                return "Object";
                            if ("number" === typeof p)
                                return "Number";
                            if ("boolean" === typeof p)
                                return "Boolean";
                            if ("string" === typeof p)
                                return "String";
                        }
                        ;
                    }
