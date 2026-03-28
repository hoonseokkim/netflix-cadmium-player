/**
 * @module Module_128
 * @description Class module with ES module exports
 * @categories DRM, Media, Manifest, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 128
 * Deobfuscated size: 9496 chars
 * Functions: 32
 * Prototype definitions: 13
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 128
{
                        var p, c, g, f, e, h, k, l, m, n;
                        function d(q, r, u, v, w, x) {
                            u = h.sja.call(this, u, v) || this;
                            u.config = q;
                            u.yg = r;
                            u.u_ = w;
                            u.Jva = x;
                            u.log = (0,
                            c.Fo)(u.j, "LicenseBroker");
                            u.PZa = new Set();
                            u.R_a = false;
                            return u;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.wGa = undefined;
                        t = a(22970);
                        p = a(36129);
                        c = a(31276);
                        g = a(28289);
                        f = a(5021);
                        e = a(22674);
                        h = a(20124);
                        k = a(85001);
                        l = a(82100);
                        m = a(56039);
                        n = a(54973);
                        Ia(d, h.sja);
                        d.prototype.SLb = function() {
                            var q, r;
                            q = this;
                            r = this.j.ga;
                            this.PZa.has(r.R) || (this.PZa.add(r.R),
                            r.qg("drm_start"),
                            this.gcc(r).catch(function() {
                                return q.lQb(r);
                            }).then(function() {
                                return q.Rrb(r);
                            }).catch(function(u) {
                                return q.Qrb(r, u);
                            }).catch(function(u) {
                                return q.Gg(u.code, u, u.extCode);
                            }));
                        }
                        ;
                        d.prototype.gcc = function(q) {
                            var r;
                            r = this;
                            return Promise.all([this.yg.Avc(q.R), this.u_()]).then(function(u) {
                                var v, w;
                                u = Fa(u);
                                v = u.next().value;
                                w = u.next().value;
                                return v.Tza.then(function(x) {
                                    var y;
                                    y = r.Jva.mediaKeys;
                                    if (y && y !== x.mediaKeys)
                                        return (r.log.warn("Cannot use cached license session as its uses different MediaKeys"),
                                        Promise.reject());
                                    "manifest" === v.QZa.source && (y = r.pCb(q),
                                    w.uKb(y, x));
                                    return x;
                                }).then(function(x) {
                                    return r.kcc(x, q, v.QZa);
                                });
                            }).catch(function(u) {
                                r.log.warn("eme not in cache", u);
                                throw u;
                            });
                        }
                        ;
                        d.prototype.kcc = function(q, r, u) {
                            this.DOb(q, r);
                            r.qZ = u;
                            this.Jva.Rqb(q.mediaKeys);
                            return q.$Oa();
                        }
                        ;
                        d.prototype.huc = function(q) {
                            var r;
                            r = {};
                            q.forEach(function(u) {
                                r[(0,
                                g.gpc)(u.yea)] = u.time.na(f.Ba);
                            });
                            return r;
                        }
                        ;
                        d.prototype.DOb = function(q, r) {
                            var u;
                            u = this;
                            r.hm = q;
                            q.qXc(function(v) {
                                u.Gg(v.code, v, v.extCode);
                            });
                        }
                        ;
                        d.prototype.Rrb = function(q) {
                            this.log.info("Successfully applied license for xid: " + q.Ia + ", viewable: " + q.R + ", segment: " + q.M);
                            this.lM(q);
                            this.R_a ? this.cUa(q.R) : this.setMediaKeys(q);
                        }
                        ;
                        d.prototype.Qrb = function(q, r) {
                            this.lM(q);
                            throw r;
                        }
                        ;
                        d.prototype.lM = function(q) {
                            q.hm && q.lM(this.huc(q.hm.Pf));
                        }
                        ;
                        d.prototype.pCb = function(q) {
                            var r, u, v;
                            u = q.Jz[0];
                            v = u.streams[0].Zc;
                            v = (0,
                            l.XFb)(v);
                            u = (0,
                            m.JVa)(u.streams);
                            return {
                                type: (0,
                                n.Yba)(this.config, false),
                                initData: q.JU.map(function(w) {
                                    return (0,
                                    c.eH)(w);
                                }),
                                Zta: v,
                                wB: u,
                                kt: {
                                    R: q.R,
                                    Ia: q.Ia,
                                    de: q.de,
                                    Is: q.Is,
                                    Kp: q.S.Kp,
                                    rf: q.S.Aa.rf,
                                    eo: (null === (r = q.oa.Mc) || undefined === r ? undefined : r.trackId) || q.dd.saa.trackId
                                }
                            };
                        }
                        ;
                        d.prototype.lQb = function(q) {
                            var r;
                            r = this;
                            return this.u_().then(function(u) {
                                var v;
                                v = r.pCb(q);
                                r.PZa.add(q.R);
                                return u.Vu(v, r.Jva).then(function(w) {
                                    r.DOb(w, q);
                                    r.j.fireEvent(k.ja.RZa, {
                                        R: q.R
                                    });
                                    return w.$Oa();
                                });
                            });
                        }
                        ;
                        d.prototype.setMediaKeys = function(q) {
                            var r;
                            r = this;
                            if (this.R_a)
                                this.log.trace("Media Keys already set");
                            else
                                try {
                                    this.jc.Ja ? (this.R_a = true,
                                    this.jc.Ja.setMediaKeys(q.hm.mediaKeys).then(function() {
                                        r.cUa(q.R);
                                    }).catch(function(u) {
                                        u = r.bAc(u);
                                        r.Gg(p.ea.sib, u, u.Yg);
                                    })) : this.cUa(q.R);
                                } catch (u) {
                                    this.Gg(p.ea.sib, u, undefined);
                                }
                        }
                        ;
                        d.prototype.tUc = function(q) {
                            var r;
                            r = this;
                            q = undefined === q ? this.j : q;
                            return this.lQb(q).then(function() {
                                return r.Rrb(q);
                            }).catch(function(u) {
                                return r.Qrb(q, u);
                            });
                        }
                        ;
                        d.prototype.close = function() {
                            this.Jva.QTc();
                        }
                        ;
                        Ha.Object.defineProperties(d.prototype, {
                            yB: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.config.yB;
                                }
                            }
                        });
                        a = d;
                        b.wGa = a;
                        b.wGa = a = t.__decorate([(0,
                        e.aa)()], a);
                    }
