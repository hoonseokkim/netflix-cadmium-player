/**
 * @module Module_5141
 * @description Class/prototype module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 5141
 * Deobfuscated size: 848 chars
 * Functions: 1
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 5141
{
                        var d, p, c;
                        b = a(68381);
                        a = a(50326);
                        try {
                            d = [].__proto__ === Array.prototype;
                        } catch (g) {
                            if (!(g && "object" === typeof g && ("code"in g)) || "ERR_PROTO_ACCESS" !== g.code)
                                throw g;
                        }
                        d = !!d && a && a(Object.prototype, "__proto__");
                        p = Object;
                        c = p.getPrototypeOf;
                        t.exports = d && "function" === typeof d.get ? b([d.get]) : "function" === typeof c ? function(g) {
                            return c(null == g ? g : p(g));
                        }
                        : false;
                    }
