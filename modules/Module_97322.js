/**
 * @module Module_97322
 * @description ES module
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 97322
 * Deobfuscated size: 1050 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 97322
{
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Jhd = function(a) {
                            var d, p;
                            d = a.next();
                            do {
                                if (!d.done)
                                    p = d.value;
                                d = a.next();
                            } while (!d.done);
                            return p;
                        }
                        ;
                        b.Ij = function(a) {
                            if (Array.isArray(a))
                                return a;
                            for (var d = [], p = a.next(); !p.done; )
                                (d.push(p.value),
                                p = a.next());
                            return d;
                        }
                        ;
                    }
