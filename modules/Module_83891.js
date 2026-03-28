/**
 * @module Module_83891
 * @description CommonJS module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 83891
 * Deobfuscated size: 1837 chars
 * Functions: 1
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 83891
{
                        var d, p, c, g, f;
                        d = a(72196);
                        p = a(5408);
                        c = a(5158);
                        g = a(83317);
                        f = a(14463);
                        t.exports = function(e) {
                            var h, k;
                            if (!c(e))
                                throw new p("ToPropertyDescriptor requires an object");
                            h = {};
                            d(e, "enumerable") && (h["[[Enumerable]]"] = f(e.enumerable));
                            d(e, "configurable") && (h["[[Configurable]]"] = f(e.configurable));
                            d(e, "value") && (h["[[Value]]"] = e.value);
                            d(e, "writable") && (h["[[Writable]]"] = f(e.writable));
                            if (d(e, "get")) {
                                k = e.get;
                                if ("undefined" !== typeof k && !g(k))
                                    throw new p("getter must be a function");
                                h["[[Get]]"] = k;
                            }
                            if (d(e, "set")) {
                                e = e.set;
                                if ("undefined" !== typeof e && !g(e))
                                    throw new p("setter must be a function");
                                h["[[Set]]"] = e;
                            }
                            if ((d(h, "[[Get]]") || d(h, "[[Set]]")) && (d(h, "[[Value]]") || d(h, "[[Writable]]")))
                                throw new p("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute");
                            return h;
                        }
                        ;
                    }
