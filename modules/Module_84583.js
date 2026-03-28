/**
 * @module Module_84583
 * @description Class/prototype module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 84583
 * Deobfuscated size: 1826 chars
 * Functions: 1
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 84583
{
                        var d, p, c, g, f, e, h, k, l, m, n, q, r;
                        d = a(67286);
                        p = a(5408);
                        c = d("%Number%");
                        b = d("%RegExp%");
                        g = d("%parseInt%");
                        f = a(8435);
                        d = a(63671);
                        e = a(45819);
                        h = f("String.prototype.slice");
                        k = d(/^0b[01]+$/i);
                        l = d(/^0o[0-7]+$/i);
                        m = d(/^[-+]0x[0-9a-f]+$/i);
                        b = new b("[​￾]","g");
                        n = d(b);
                        q = a(11341);
                        r = a(99197);
                        t.exports = function w(v) {
                            var x;
                            v = e(v) ? v : r(v, c);
                            if ("symbol" === typeof v)
                                throw new p("Cannot convert a Symbol value to a number");
                            if ("bigint" === typeof v)
                                throw new p("Conversion from 'BigInt' to 'number' is not allowed.");
                            if ("string" === typeof v) {
                                if (k(v))
                                    return w(g(h(v, 2), 2));
                                if (l(v))
                                    return w(g(h(v, 2), 8));
                                if (n(v) || m(v))
                                    return NaN;
                                x = q(v);
                                if (x !== v)
                                    return w(x);
                            }
                            return +v;
                        }
                        ;
                    }
