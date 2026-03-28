/**
 * @module Module_2010
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 2010
 * Deobfuscated size: 2552 chars
 * Functions: 9
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 2010
{
                        var p, c;
                        function d() {}
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.TEa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(90030);
                        d.prototype.Q_ = function(g, f) {
                            var e;
                            e = this;
                            g && Object.entries(f).forEach(function(h) {
                                var k, l, m;
                                k = Fa(h);
                                h = k.next().value;
                                k = k.next().value;
                                if (e.BDc(k)) {
                                    l = Fa(k);
                                    k = l.next().value;
                                    m = l.next().value;
                                    l = g[k];
                                    Array.isArray(l) ? (e.pSa(g, h, k),
                                    l.forEach(function(n) {
                                        e.Q_(n, m);
                                    })) : k === c.Mj ? Object.values(g).forEach(function(n) {
                                        e.Q_(n, m);
                                    }) : (e.pSa(g, h, k),
                                    "object" === typeof l && e.Q_(l, m));
                                } else
                                    e.pSa(g, h, k);
                            });
                        }
                        ;
                        d.prototype.BDc = function(g) {
                            return Array.isArray(g);
                        }
                        ;
                        d.prototype.pSa = function(g, f, e) {
                            g.hasOwnProperty(f) || f === e || Object.defineProperty(g, f, {
                                get: function() {
                                    return g[e];
                                },
                                set: function(h) {
                                    return g[e] = h;
                                },
                                enumerable: true
                            });
                        }
                        ;
                        a = d;
                        b.TEa = a;
                        b.TEa = a = t.__decorate([(0,
                        p.aa)()], a);
                    }
