/**
 * @module Module_78857
 * @description ES module
 * @categories DRM, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 78857
 * Deobfuscated size: 1366 chars
 * Functions: 1
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 78857
{
                        var d, p;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.h5c = function(c) {
                            var g, f;
                            if ((0,
                            p.n1)(c)) {
                                g = new DOMParser().parseFromString(c, "text/xml");
                                f = g.getElementsByTagName("parsererror");
                                if (f && f[0]) {
                                    try {
                                        d.log.error("parser error details", {
                                            errornode: new XMLSerializer().serializeToString(f[0]),
                                            xmlData: c.slice(0, 300),
                                            fileSize: c.length
                                        });
                                    } catch (e) {}
                                    throw Error("xml parser error");
                                }
                                return g;
                            }
                            throw Error("bad xml text");
                        }
                        ;
                        d = a(31276);
                        p = a(32687);
                    }
