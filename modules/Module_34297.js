/**
 * @module Module_34297
 * @description ES module
 * @categories Network, Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 34297
 * Deobfuscated size: 1713 chars
 * Functions: 5
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 34297
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Wjb = undefined;
                        d = a(48170);
                        p = a(82475);
                        b.Wjb = (function() {
                            function c() {}
                            c.aUc = function(g, f, e, h) {
                                g.events.once("seeking", function(k) {
                                    var l, m;
                                    l = k.position;
                                    m = e.length;
                                    k.duplicate || (e.ega(function(n) {
                                        return "segmentNormalized" !== n.yw;
                                    }),
                                    d.u && h.log(("Discarding ").concat(m - e.length, " events from prefetched playgraph") + (" for original seek postition ").concat((0,
                                    p.gXa)(f)) + (" due to seek to ").concat((0,
                                    p.gXa)(l))));
                                    d.u && h.log(("Replaying ").concat(e.length, " events from prefetched playgraph") + ("for seek postition ").concat((0,
                                    p.gXa)(l)));
                                    e.e4a();
                                    e.La();
                                });
                            }
                            ;
                            return c;
                        }
                        )();
                    }
