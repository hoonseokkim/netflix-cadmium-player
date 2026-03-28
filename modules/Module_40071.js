/**
 * @module Module_40071
 * @description ES module
 * @categories Network, Media
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 40071
 * Deobfuscated size: 5393 chars
 * Functions: 10
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 40071
{
                        var e;
                        function d(h) {
                            return Object.keys(h.segments).some(function(k) {
                                return undefined !== f(h.segments[k]);
                            });
                        }
                        function p(h) {
                            return "delayedSeamless" === h ? "lazy" : h;
                        }
                        function c(h) {
                            return Object.keys(h).reduce(function(k, l) {
                                var m, n;
                                m = h[l];
                                n = m.weight;
                                m = m.transitionType || m.transitionHint;
                                l = k[l] = {};
                                undefined !== n && (l.weight = n);
                                m && (l.fe = p(m));
                                return k;
                            }, {});
                        }
                        function g(h) {
                            var k, l;
                            k = Object.keys(h);
                            l = k.length;
                            return l ? k.reduce(function(m, n) {
                                return m + (h[n].weight || 0);
                            }, 0) / l : undefined;
                        }
                        function f(h) {
                            var k;
                            if (h.ui) {
                                k = h.ui.interactionZones;
                                if ((null === k || undefined === k ? 0 : k.length) && k[0].length)
                                    return k[0][0] - h.startTimeMs;
                                h = h.ui.interactionZonesV2;
                                if ((null === h || undefined === h ? 0 : h.length) && h[0].length)
                                    return h[0][0];
                            } else if (undefined !== h.earliestSkipRequestOffset)
                                return h.earliestSkipRequestOffset;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.yQa = function(h, k) {
                            var l, m, n, q, r, u;
                            l = undefined === k ? {} : k;
                            k = l.Uh;
                            m = l.Ef;
                            n = l.ba;
                            l = l.config;
                            q = !(!l || -1 === l.uba.indexOf(h.viewableId));
                            r = d(h) ? 0 : (null === l || undefined === l ? undefined : l.tba) || 0;
                            l = new e.Cv();
                            u = n || h.segments;
                            l.BF(null !== m && undefined !== m ? m : h.initialSegment).B5a(k || h.mediaTypes).eAa(q ? "immediate" : p(h.transitionType)).J5a(Object.keys(u).reduce(function(v, w) {
                                var x, y, A, z, B, C;
                                x = u[w];
                                if (null === (y = x.weight) || undefined === y) {
                                    y = x.next && (q || (null === (z = x.exitZones) || undefined === z ? 0 : z.length)) ? g(x.next) : undefined;
                                }
                                z = y;
                                if (y = x.exitZones)
                                    B = undefined;
                                else
                                    a: {
                                        if (q && x.endTimeMs) {
                                            B = x.endTimeMs - x.startTimeMs;
                                            C = f(x);
                                            if (C && C < B) {
                                                B = [[C, B]];
                                                break a;
                                            }
                                            if (r && B > r) {
                                                B = [[B - r, B]];
                                                break a;
                                            }
                                        }
                                        B = undefined;
                                    }
                                C = q ? B ? undefined : x.transitionHint || "lazy" : x.transitionHint;
                                z = {
                                    J: h.viewableId,
                                    Va: x.startTimeMs,
                                    eb: null !== (A = x.endTimeMs) && undefined !== A ? A : Infinity,
                                    fe: p(C),
                                    km: y || B,
                                    weight: z
                                };
                                x.defaultNext && (z.Oc = x.defaultNext);
                                x.next && (z.next = c(x.next));
                                v[w] = z;
                                return v;
                            }, {}));
                            return l.build();
                        }
                        ;
                        e = a(48456);
                    }
