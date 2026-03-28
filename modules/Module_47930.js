/**
 * @module Module_47930
 * @description Class module with ES module exports
 * @categories Manifest
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 47930
 * Deobfuscated size: 3323 chars
 * Functions: 7
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 47930
{
                        var p, c, g, f, e, h, k;
                        function d(l, m, n) {
                            this.UHb = l;
                            this.VHc = m;
                            this.XHc = n;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.hHa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(81025);
                        g = a(60042);
                        f = a(31149);
                        e = a(36129);
                        h = a(91176);
                        a = a(704);
                        d.prototype.create = function(l) {
                            var m, n, q, r;
                            m = this;
                            if (l && !this.dEc(l)) {
                                if (this.iEc(l))
                                    throw f.we.T4c(e.ea.qX, e.Y.q6b, l);
                                this.XHc.forEach(function(u) {
                                    var v;
                                    u.YJb(l);
                                    null === (v = l.auxiliaryManifests) || undefined === v ? undefined : v.forEach(function(w) {
                                        u.YJb(w);
                                    });
                                });
                                (0,
                                h.UQb)(l, h.XIb);
                                r = this.UHb();
                                r.yOa(l.links);
                                this.VHc.Q_(l);
                                return {
                                    Aa: l,
                                    Kp: r,
                                    FYa: false,
                                    Gq: null !== (q = null === (n = l.Gq) || undefined === n ? undefined : n.map(function(u) {
                                        var v;
                                        v = m.UHb();
                                        v.yOa(u.links);
                                        return {
                                            Aa: u,
                                            Kp: v,
                                            FYa: false,
                                            Gq: []
                                        };
                                    })) && undefined !== q ? q : []
                                };
                            }
                        }
                        ;
                        d.prototype.iEc = function(l) {
                            return ("type"in l) && "muxed" === l.type;
                        }
                        ;
                        d.prototype.dEc = function(l) {
                            return ("runtime"in l) && !!l.runtime;
                        }
                        ;
                        k = d;
                        b.hHa = k;
                        b.hHa = k = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(c.Rib)), t.__param(1, (0,
                        p.v)(g.ugb)), t.__param(2, (0,
                        p.KI)(a.vgb))], k);
                    }
