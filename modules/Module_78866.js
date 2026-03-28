/**
 * @module Module_78866
 * @description Class module with ES module exports
 * @categories DRM, Network, Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 78866
 * Deobfuscated size: 20222 chars
 * Functions: 22
 * Prototype definitions: 12
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 78866
{
                        var p, c, g, f, e, h, k, l, m, n, q;
                        function d(r, u, v, w, x) {
                            this.config = r;
                            this.navigator = u;
                            this.Qw = v;
                            this.PE = w;
                            this.dy = x;
                            this.qPa = {};
                            this.vXb = {};
                            this.IOa = {};
                            this.log = this.Qw.zb("MediaCapabilityDetector");
                            this.qPa = this.Okc();
                            this.vXb = this.Bmc();
                            r = {};
                            this.arb = (r[this.qPa[c.Vc.hp].contentType] = this.dy.decode(q.L$a),
                            r);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.pHa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(75568);
                        g = a(87386);
                        f = a(63368);
                        e = a(21103);
                        h = a(1079);
                        k = a(82100);
                        l = a(22365);
                        m = a(73796);
                        n = a(2248);
                        q = a(33096);
                        d.prototype.gba = function(r) {
                            var u;
                            u = this;
                            return this.PE.ZH().then(function(v) {
                                return u.atc(r, v);
                            }).catch(function() {
                                return {
                                    supported: false,
                                    reason: "mc-ksa-exception"
                                };
                            });
                        }
                        ;
                        d.prototype.VDc = function(r) {
                            return !!r.colorGamut || !!r.hdrMetadataType || !!r.transferFunction;
                        }
                        ;
                        d.prototype.DYa = function() {
                            return Da.matchMedia("(dynamic-range: high)").matches || Da.matchMedia("(video-dynamic-range: high)").matches || this.config().QNc;
                        }
                        ;
                        d.prototype.SEc = function(r) {
                            return 1080 < r.height;
                        }
                        ;
                        d.prototype.TEc = function() {
                            return 1080 < Da.devicePixelRatio * Da.screen.height;
                        }
                        ;
                        d.prototype.atc = function(r, u) {
                            var v, w, x;
                            try {
                                v = {
                                    type: "media-source"
                                };
                                w = this.qPa[r];
                                x = this.vXb[r];
                                if (w)
                                    v.audio = w;
                                else if (x) {
                                    v.video = x;
                                    if (this.VDc(x) && !this.DYa())
                                        return Promise.resolve({
                                            supported: false,
                                            reason: "mc-non-hdr-display"
                                        });
                                    if (this.SEc(x) && !this.TEc())
                                        return Promise.resolve({
                                            supported: false,
                                            reason: "mc-non-uhd-display"
                                        });
                                    u && (v.keySystemConfiguration = this.ixc(u));
                                } else
                                    return Promise.resolve({
                                        supported: false,
                                        reason: "mc-missing-config"
                                    });
                                return Promise.all([this.Pgc(v), this.Lgc((w || x).contentType)]).then(function(y) {
                                    var A;
                                    A = Fa(y);
                                    y = A.next().value;
                                    A = A.next().value;
                                    return y ? A ? {
                                        supported: true
                                    } : {
                                        supported: false,
                                        reason: "mc-add-source-buffer"
                                    } : {
                                        supported: false,
                                        reason: "mc-decoding-info"
                                    };
                                });
                            } catch (y) {
                                return (this.log.error("mediaCapabilitiesIsTypeSupported failed", y),
                                Promise.resolve({
                                    supported: false,
                                    reason: "mc-exception"
                                }));
                            }
                        }
                        ;
                        d.prototype.Pgc = function(r) {
                            var u;
                            u = this;
                            return this.navigator.mediaCapabilities.decodingInfo(r).then(function(v) {
                                var w;
                                v.configuration || (v.configuration = r);
                                w = u.LEc(r, v);
                                w ? u.log.trace("mediaCapabilities.decodingInfo: " + JSON.stringify(v)) : u.log.warn("mediaCapabilities.decodingInfo: " + JSON.stringify(v));
                                return w;
                            }).catch(function(v) {
                                u.log.error("mediaCapabilities.decodingInfo failed", v);
                                return false;
                            });
                        }
                        ;
                        d.prototype.Lgc = function(r) {
                            var u;
                            u = this;
                            if (!this.config().Tqc)
                                return Promise.resolve(true);
                            this.IOa[r] || (this.IOa[r] = new Promise(function(v) {
                                var w;
                                try {
                                    w = new l.NP();
                                    document.createElement("video").src = URL.createObjectURL(w);
                                    w.addEventListener("sourceopen", function() {
                                        var x;
                                        try {
                                            x = w.addSourceBuffer(r);
                                            u.arb[r] ? (x.addEventListener("updateend", function() {
                                                u.log.trace("addSourceBuffer updateend for " + r);
                                                v(true);
                                            }),
                                            x.addEventListener("error", function() {
                                                u.log.warn("addSourceBuffer error for " + r);
                                                v(false);
                                            }),
                                            x.appendBuffer(u.arb[r])) : (u.log.trace("addSourceBuffer succeeded for " + r),
                                            v(true));
                                        } catch (y) {
                                            u.log.warn("addSourceBuffer failed", y);
                                            v(false);
                                        }
                                    });
                                } catch (x) {
                                    u.log.warn("addSourceBuffer failed", x);
                                    v(false);
                                }
                            }
                            ));
                            return this.IOa[r];
                        }
                        ;
                        d.prototype.ixc = function(r) {
                            this.keySystemConfiguration || (this.keySystemConfiguration = {
                                keySystem: r.keySystem
                            },
                            (r = (0,
                            k.BCb)(r)) && (this.keySystemConfiguration.video = {
                                robustness: r
                            }));
                            return this.keySystemConfiguration;
                        }
                        ;
                        d.prototype.Okc = function() {
                            var r, u;
                            r = {};
                            u = {
                                contentType: "audio/mp4;codecs=" + m.zc.ap
                            };
                            r[c.Vc.ap] = u;
                            r[c.Vc.oka] = u;
                            r[c.Vc.fG] = u;
                            r[c.Vc.hp] = {
                                contentType: "audio/mp4;codecs=" + m.zc.hp
                            };
                            u = {
                                contentType: "audio/mp4;codecs=ec-3"
                            };
                            this.config().BZc && (u.spatialRendering = true);
                            r[c.Vc.lP] = u;
                            r[c.Vc.mP] = u;
                            r[c.Vc.nP] = u;
                            return r;
                        }
                        ;
                        d.prototype.Bmc = function() {
                            var r, u, v, w, x, y, A, z, B, C, D, E, G, F, H, J, M, K, L, O, I, N, Q;
                            r = {
                                contentType: 'video/mp4; codecs="hev1.2.4.L120.B0"'
                            };
                            u = {
                                contentType: 'video/mp4; codecs="' + m.zc.YDa + '"'
                            };
                            v = {
                                width: 1920,
                                height: 1080
                            };
                            w = {
                                width: 3840,
                                height: 2160
                            };
                            x = Object.assign(Object.assign({}, v), {
                                bitrate: 12E6,
                                framerate: 30
                            });
                            y = Object.assign(Object.assign({}, v), {
                                bitrate: 2E7,
                                framerate: 60
                            });
                            A = Object.assign(Object.assign({}, w), {
                                bitrate: 25E6,
                                framerate: 30
                            });
                            z = Object.assign(Object.assign({}, w), {
                                bitrate: 4E7,
                                framerate: 60
                            });
                            B = {
                                hdrMetadataType: "smpteSt2086",
                                colorGamut: "rec2020",
                                transferFunction: "pq"
                            };
                            C = {
                                colorGamut: "rec2020",
                                transferFunction: "pq"
                            };
                            w = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="avc1.4D4028"'
                            }), x);
                            v = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="avc1.640028"'
                            }), x);
                            D = Object.assign(Object.assign({}, r), x);
                            E = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="hev1.2.4.L123.B0"'
                            }), y);
                            G = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="hev1.2.4.L150.B0"'
                            }), A);
                            F = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="hev1.2.4.L153.B0"'
                            }), z);
                            H = Object.assign(Object.assign(Object.assign({}, r), x), B);
                            J = Object.assign(Object.assign(Object.assign({}, r), y), B);
                            M = Object.assign(Object.assign(Object.assign({}, r), A), B);
                            r = Object.assign(Object.assign(Object.assign({}, r), z), B);
                            K = Object.assign(Object.assign(Object.assign({}, u), x), C);
                            L = Object.assign(Object.assign(Object.assign({}, u), y), C);
                            O = Object.assign(Object.assign(Object.assign({}, u), A), C);
                            u = Object.assign(Object.assign(Object.assign({}, u), z), C);
                            C = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.08M.10"'
                            }), x);
                            I = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.09M.10"'
                            }), y);
                            N = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.12M.10"'
                            }), A);
                            Q = Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.13M.10"'
                            }), z);
                            x = Object.assign(Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.08M.10.0.112.09.16.09.0"'
                            }), x), B);
                            y = Object.assign(Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.09M.10.0.112.09.16.09.0"'
                            }), y), B);
                            A = Object.assign(Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.12M.10.0.112.09.16.09.0"'
                            }), A), B);
                            z = Object.assign(Object.assign(Object.assign({}, {
                                contentType: 'video/mp4; codecs="av01.0.13M.10.0.112.09.16.09.0"'
                            }), z), B);
                            B = {};
                            return (B[c.H.wP] = w,
                            B[c.H.$W] = w,
                            B[c.H.nka] = w,
                            B[c.H.tFa] = w,
                            B[c.H.uFa] = w,
                            B[c.H.vFa] = w,
                            B[c.H.rFa] = v,
                            B[c.H.YJ] = v,
                            B[c.H.ZJ] = v,
                            B[c.H.$J] = v,
                            B[c.H.sFa] = v,
                            B[c.H.uP] = v,
                            B[c.H.vP] = v,
                            B[c.H.ZW] = v,
                            B[c.H.pka] = D,
                            B[c.H.qka] = D,
                            B[c.H.rka] = D,
                            B[c.H.ska] = E,
                            B[c.H.L6] = D,
                            B[c.H.O6] = D,
                            B[c.H.R6] = D,
                            B[c.H.U6] = E,
                            B[c.H.dX] = G,
                            B[c.H.eX] = F,
                            B[c.H.M6] = D,
                            B[c.H.P6] = D,
                            B[c.H.S6] = D,
                            B[c.H.V6] = E,
                            B[c.H.X6] = G,
                            B[c.H.Z6] = F,
                            B[c.H.K6] = D,
                            B[c.H.N6] = D,
                            B[c.H.Q6] = D,
                            B[c.H.T6] = E,
                            B[c.H.W6] = G,
                            B[c.H.Y6] = F,
                            B[c.H.u6] = H,
                            B[c.H.x6] = H,
                            B[c.H.cX] = H,
                            B[c.H.C6] = J,
                            B[c.H.F6] = M,
                            B[c.H.I6] = r,
                            B[c.H.v6] = H,
                            B[c.H.y6] = H,
                            B[c.H.A6] = H,
                            B[c.H.D6] = J,
                            B[c.H.G6] = M,
                            B[c.H.J6] = r,
                            B[c.H.t6] = H,
                            B[c.H.w6] = H,
                            B[c.H.z6] = H,
                            B[c.H.B6] = J,
                            B[c.H.E6] = M,
                            B[c.H.H6] = r,
                            B[c.H.Y5] = K,
                            B[c.H.a6] = K,
                            B[c.H.SW] = K,
                            B[c.H.d6] = L,
                            B[c.H.f6] = O,
                            B[c.H.h6] = u,
                            B[c.H.Pja] = K,
                            B[c.H.Qja] = L,
                            B[c.H.Rja] = O,
                            B[c.H.Sja] = u,
                            B[c.H.Z5] = K,
                            B[c.H.b6] = K,
                            B[c.H.c6] = K,
                            B[c.H.e6] = L,
                            B[c.H.g6] = O,
                            B[c.H.i6] = u,
                            B[c.H.jCa] = C,
                            B[c.H.kCa] = C,
                            B[c.H.zx] = C,
                            B[c.H.Bx] = C,
                            B[c.H.Dx] = C,
                            B[c.H.Fx] = I,
                            B[c.H.G5] = N,
                            B[c.H.I5] = Q,
                            B[c.H.YO] = x,
                            B[c.H.ZO] = x,
                            B[c.H.$O] = x,
                            B[c.H.aP] = y,
                            B[c.H.D5] = A,
                            B[c.H.E5] = z,
                            B[c.H.yx] = C,
                            B[c.H.Ax] = C,
                            B[c.H.Cx] = C,
                            B[c.H.Ex] = I,
                            B[c.H.F5] = N,
                            B[c.H.H5] = Q,
                            B);
                        }
                        ;
                        d.prototype.LEc = function(r, u) {
                            return r.video && this.config().$Pc ? u.supported && u.powerEfficient : u.supported;
                        }
                        ;
                        a = d;
                        b.pHa = a;
                        b.pHa = a = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(h.TW)), t.__param(1, (0,
                        p.v)(f.M7)), t.__param(2, (0,
                        p.v)(g.Bb)), t.__param(3, (0,
                        p.v)(e.Vz)), t.__param(4, (0,
                        p.v)(n.Km))], a);
                    }
