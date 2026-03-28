/**
 * @module Module_57141
 * @description ES module
 * @categories Media
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 57141
 * Deobfuscated size: 1177 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 57141
{
                        function a(d) {
                            return "globalAudioMemoryLimit" === d || "globalVideoMemoryLimit" === d ? "global" : "staticAudioMemoryLimit" === d || "staticVideoMemoryLimit" === d ? "static" : false;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.qPb = function(d) {
                            return "globalMemoryLimit" === d ? "global" : "staticMemoryLimit" === d ? "static" : a(d);
                        }
                        ;
                        b.FSc = a;
                        b.Zld = function(d) {
                            return ("IStreamable: ").concat(d.identifier, " [").concat(d.mediaType, "] ").concat(d.groupId, " ") + ("p:").concat(JSON.stringify(d.xh), " sp:").concat(d.nx, " ") + ("pssp:").concat(d.WI, " ") + ("state:").concat(d.se, " path-complete:").concat(d.gv, " ") + ("streaming:").concat(d.So, " current:").concat(d.vp);
                        }
                        ;
                    }
