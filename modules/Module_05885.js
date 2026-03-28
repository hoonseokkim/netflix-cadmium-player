/**
 * @module Module_5885
 * @description Class/prototype module
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 5885
 * Deobfuscated size: 2839 chars
 * Functions: 1
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 5885
{
                        var d, p, c, g, f;
                        d = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator;
                        p = a(53919);
                        c = a(9680);
                        g = a(54277);
                        f = a(88705);
                        t.exports = function(e) {
                            var h, k, l;
                            if (p(e))
                                return e;
                            h = "default";
                            1 < arguments.length && (arguments[1] === String ? h = "string" : arguments[1] === Number && (h = "number"));
                            if (d)
                                if (Symbol.toPrimitive) {
                                    k = Symbol.toPrimitive;
                                    l = e[k];
                                    if (null !== l && "undefined" !== typeof l) {
                                        if (!c(l))
                                            throw new TypeError(l + " returned for property " + String(k) + " of object " + e + " is not a function");
                                        k = l;
                                    } else
                                        k = undefined;
                                } else
                                    f(e) && (k = Symbol.prototype.valueOf);
                            if ("undefined" !== typeof k) {
                                h = k.call(e, h);
                                if (p(h))
                                    return h;
                                throw new TypeError("unable to convert exotic object to primitive");
                            }
                            "default" === h && (g(e) || f(e)) && (h = "string");
                            a: {
                                h = "default" === h ? "number" : h;
                                if ("undefined" === typeof e || null === e)
                                    throw new TypeError("Cannot call method on " + e);
                                if ("string" !== typeof h || "number" !== h && "string" !== h)
                                    throw new TypeError('hint must be "string" or "number"');
                                h = "string" === h ? ["toString", "valueOf"] : ["valueOf", "toString"];
                                for (k = 0; k < h.length; ++k)
                                    if ((l = e[h[k]],
                                    c(l) && (l = l.call(e),
                                    p(l))))
                                        break a;
                                throw new TypeError("No default value");
                            }
                            return l;
                        }
                        ;
                    }
