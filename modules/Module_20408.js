/**
 * @module Module_20408
 * @description ES module
 * @categories DRM, Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 20408
 * Deobfuscated size: 1528 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 20408
{
                        var p;
                        function d(c) {
                            return "object" === typeof c && ("scheme"in c) && ("data"in c) && ("kid"in c) && (0,
                            p.sYa)(c.scheme) && "string" === typeof c.kid && "object" === typeof c.data;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.VMb = b.bEc = b.yib = undefined;
                        p = a(2802);
                        b.yib = 1;
                        b.bEc = d;
                        b.VMb = function(c) {
                            var g;
                            try {
                                g = JSON.parse(c);
                            } catch (f) {
                                throw Error("malformed JSON");
                            }
                            c = g;
                            if (!("object" === typeof c && ("token"in c) && ("scheme"in c) && ("ttl"in c) && ("keyx"in c) && ("ver"in c) && "string" === typeof c.token && (0,
                            p.tYa)(c.scheme) && "number" === typeof c.ttl) || undefined !== c.rw && "number" !== typeof c.rw || "object" !== typeof c.keyx || !d(c.keyx) || "number" !== typeof c.ver)
                                throw Error("unexpected key provision response contents");
                            return g;
                        }
                        ;
                    }
