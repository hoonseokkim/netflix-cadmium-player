/**
 * @module Module_95480
 * @description Class module with ES module exports
 * @categories DRM, Media, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 95480
 * Deobfuscated size: 11815 chars
 * Functions: 29
 * Prototype definitions: 14
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 95480
{
                        var g, f, e, h, k, l, m, n, q, r;
                        function d() {}
                        function p() {}
                        function c(u, v, w, x, y) {
                            var A;
                            A = this;
                            this.is = u;
                            this.Ht = v;
                            this.config = w;
                            this.DR = x;
                            this.SOc = y;
                            this.dia = function() {
                                return new d().encode({
                                    version: A.version,
                                    data: A.sU
                                });
                            }
                            ;
                            this.y3c = function(z) {
                                z = A.upgrade(z);
                                A.SOc.validate(z);
                                return z;
                            }
                            ;
                            this.upgrade = function(z) {
                                var B;
                                if (A.is.Zx(z))
                                    return A.z3c(z);
                                B = z.version;
                                if (undefined != B && A.is.mp(B) && 1 == B)
                                    return A.A3c(z);
                                B = z.version;
                                if (undefined != B && A.is.mp(B) && 2 == B)
                                    return new d().decode(z);
                                if (z.version && A.is.mp(z.version))
                                    throw new k.we(e.ea.cK,e.Y.RZb,undefined,undefined,undefined,"Version number is not supported. Version: " + z.version,undefined,z);
                                throw new k.we(e.ea.cK,e.Y.xja,undefined,undefined,undefined,"The format of the playdata is inconsistent with what is expected.",undefined,z);
                            }
                            ;
                            this.vz = new l.Aeb(2,this.config().RNb,"" !== this.config().RNb && 0 < this.config().yPc,this.Ht,this.dia);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.BIa = undefined;
                        t = a(22970);
                        g = a(22674);
                        f = a(4203);
                        e = a(36129);
                        h = a(42207);
                        k = a(31149);
                        l = a(52657);
                        m = a(17892);
                        n = a(33554);
                        q = a(23048);
                        a = a(36258);
                        c.prototype.zSc = function() {
                            return this.vz.load(this.y3c).catch(function(u) {
                                throw new k.we(e.ea.cK,u.Ya || u.subCode,undefined,undefined,undefined,"Unable to load persisted playdata.",undefined,u);
                            });
                        }
                        ;
                        c.prototype.Pac = function(u) {
                            return this.vz.add(u);
                        }
                        ;
                        c.prototype.VPb = function(u) {
                            return this.vz.remove(u, function(v, w) {
                                return v.Ia === w.Ia;
                            });
                        }
                        ;
                        c.prototype.j8a = function(u) {
                            return this.vz.update(u, function(v, w) {
                                return v.Ia === w.Ia;
                            });
                        }
                        ;
                        c.prototype.toString = function() {
                            return JSON.stringify(this.dia(), null, "  ");
                        }
                        ;
                        c.prototype.SWb = function(u) {
                            return u ? "/events?playbackContextId=" + u + "&esn=" + this.DR().wj : "";
                        }
                        ;
                        c.prototype.t8a = function(u) {
                            return u.map(function(v) {
                                return {
                                    ob: v.downloadableId,
                                    duration: v.duration
                                };
                            });
                        }
                        ;
                        c.prototype.TWb = function(u) {
                            var v;
                            return u ? {
                                total: u.playTimes.total,
                                UV: null !== (v = u.playTimes.totalContentTime) && undefined !== v ? v : u.playTimes.total,
                                U4: u.playTimes.total,
                                FC: 0,
                                HC: 0,
                                WV: 0,
                                VV: 0,
                                XV: 0,
                                audio: this.t8a(u.playTimes.audio || []),
                                video: this.t8a(u.playTimes.video || []),
                                text: this.t8a(u.playTimes.timedtext || []),
                                Il: {}
                            } : {
                                total: 0,
                                UV: 0,
                                U4: 0,
                                FC: 0,
                                HC: 0,
                                WV: 0,
                                VV: 0,
                                XV: 0,
                                audio: [],
                                video: [],
                                text: [],
                                Il: {}
                            };
                        }
                        ;
                        c.prototype.z3c = function(u) {
                            var v, w, x;
                            v = this;
                            u = JSON.parse(u);
                            w = {
                                rf: "VOD",
                                href: this.SWb(u.playbackContextId),
                                Ia: u.xid ? u.xid.toString() : "",
                                R: u.movieId,
                                position: u.position,
                                sH: u.timestamp,
                                al: u.playback ? 1E3 * u.playback.startEpoch : -1,
                                Z1: u.mediaId,
                                XB: this.TWb(u.playback),
                                trackId: "",
                                Dr: {},
                                o3: u.accountKey
                            };
                            x = JSON.stringify({
                                keySessionIds: u.keySessionIds,
                                movieId: u.movieId,
                                xid: u.xid,
                                licenseContextId: u.licenseContextId,
                                profileId: u.profileId
                            });
                            this.Ht.create().then(function(y) {
                                y.save(v.config().NSa, x, false);
                            });
                            if ("" === w.href || "" === w.Ia)
                                throw new k.we(e.ea.cK,e.Y.xja);
                            return {
                                version: 2,
                                data: [w]
                            };
                        }
                        ;
                        c.prototype.A3c = function(u) {
                            var v;
                            v = this;
                            if (!u.playdata || !this.is.SQ(u.playdata))
                                throw new k.we(e.ea.cK,e.Y.xja,undefined,undefined,undefined,"The version 1 playdata is corrupted.",undefined,u);
                            return {
                                version: 2,
                                data: (function(w) {
                                    return w.map(function(x) {
                                        var y;
                                        return {
                                            rf: null !== (y = x.streamingType) && undefined !== y ? y : "VOD",
                                            href: v.SWb(x.playbackContextId),
                                            Ia: x.xid ? x.xid.toString() : "",
                                            R: x.movieId,
                                            position: x.position,
                                            sH: x.timestamp,
                                            al: x.playback ? 1E3 * x.playback.startEpoch : -1,
                                            Z1: x.mediaId,
                                            XB: v.TWb(x.playback),
                                            trackId: "",
                                            Dr: {},
                                            o3: x.profileId
                                        };
                                    });
                                }
                                )(u.playdata)
                            };
                        }
                        ;
                        Ha.Object.defineProperties(c.prototype, {
                            version: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.vz.version;
                                }
                            },
                            sU: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.vz.As;
                                }
                            }
                        });
                        r = c;
                        b.BIa = r;
                        b.BIa = r = t.__decorate([(0,
                        g.aa)(), t.__param(0, (0,
                        g.v)(h.Zi)), t.__param(1, (0,
                        g.v)(m.PJ)), t.__param(2, (0,
                        g.v)(f.Pc)), t.__param(3, (0,
                        g.v)(n.QC)), t.__param(4, (0,
                        g.v)(a.Wib))], r);
                        p.prototype.encode = function(u) {
                            var v;
                            v = new q.qla();
                            return u.map(v.encode);
                        }
                        ;
                        p.prototype.decode = function(u) {
                            var v;
                            v = new q.qla();
                            return u.map(v.decode);
                        }
                        ;
                        d.prototype.encode = function(u) {
                            return {
                                version: u.version,
                                data: new p().encode(u.data)
                            };
                        }
                        ;
                        d.prototype.decode = function(u) {
                            return {
                                version: u.version,
                                data: new p().decode(u.data)
                            };
                        }
                        ;
                    }
