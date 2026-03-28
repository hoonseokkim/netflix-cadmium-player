/**
 * @module Module_44858
 * @description Class module with ES module exports
 * @categories Media, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 44858
 * Deobfuscated size: 3443 chars
 * Functions: 10
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 44858
{
                        var p, c, g, f;
                        function d(e) {
                            return c.E7.call(this, e) || this;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.ynb = undefined;
                        p = a(45266);
                        c = a(28518);
                        g = a(51344);
                        f = a(35128);
                        Ia(d, c.E7);
                        d.prototype.iNb = function(e, h) {
                            var k, l;
                            k = this;
                            h = Fa((0,
                            p.zN)(function(m) {
                                return m.streams && 0 < m.streams.length;
                            }, h));
                            l = h.next().value;
                            h.next().value.forEach(function(m) {
                                return k.log.warn("Video track is missing streams", {
                                    trackId: m.ff
                                });
                            });
                            h = l.map(function(m) {
                                var n, q, r;
                                r = m.jj;
                                r = Object.assign(Object.assign({}, e), {
                                    type: g.mj.video,
                                    trackId: m.ff,
                                    jj: f.nma[r.toLowerCase()] || f.Fv.FX,
                                    SN: r,
                                    streams: [],
                                    Bj: {},
                                    uya: m.uya,
                                    Gc: null !== (n = m.Gc) && undefined !== n ? n : -1,
                                    De: null !== (q = m.De) && undefined !== q ? q : true
                                });
                                r.streams = k.DVb(m.streams, r);
                                k.log.trace("Transformed video track", {
                                    StreamCount: r.streams.length
                                });
                                return r;
                            });
                            if (!h.length)
                                throw Error("No valid video tracks");
                            this.log.trace("Transformed video tracks", {
                                Count: h.length
                            });
                            return h;
                        }
                        ;
                        d.prototype.zOc = function(e) {
                            var h;
                            h = e.map(function(k) {
                                return k.uya;
                            }).filter(Boolean);
                            h = [].concat.apply([], Ba(h)).map(function(k) {
                                return k.la;
                            });
                            e = e.map(function(k) {
                                return k.dyb;
                            }).filter(Boolean).map(function(k) {
                                return k.la;
                            });
                            return 0 < h.length ? h : e;
                        }
                        ;
                        b.ynb = d;
                    }
