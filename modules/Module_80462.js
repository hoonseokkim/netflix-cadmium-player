/**
 * @module Module_80462
 * @description ES module
 * @categories DRM
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 80462
 * Deobfuscated size: 913 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 80462
{
                        var p;
                        function d(c) {
                            return "object" === typeof c && ("scheme"in c) && (0,
                            p.sYa)(c.scheme) && (!(("data"in c)) || "object" === typeof c.data);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.aEc = b.$Dc = b.xib = undefined;
                        p = a(2802);
                        b.xib = 1;
                        b.$Dc = function(c) {
                            return "object" === typeof c && ("ver"in c) && ("scheme"in c) && ("type"in c) && ("keyx"in c) && (0,
                            p.tYa)(c.scheme) && "string" == typeof c.type && d(c.keyx);
                        }
                        ;
                        b.aEc = d;
                    }
