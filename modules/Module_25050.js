/**
 * @module Module_25050
 * @description Class module with ES module exports
 * @categories DRM, Crypto, Network, Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 25050
 * Deobfuscated size: 39689 chars
 * Functions: 154
 * Prototype definitions: 89
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 25050
{
                        var p, c, g, f, e, h, k, l, m, n, q, r, u, v;
                        function d(w, x, y, A, z, B, C, D, E, G, F, H, J, M, K, L, O) {
                            var I, N, Q;
                            I = this;
                            this.yfa = x;
                            this.lB = y;
                            this.$a = A;
                            this.Kh = z;
                            this.Xb = B;
                            this.eea = C;
                            this.OPc = D;
                            this.PNb = E;
                            this.HBa = G;
                            this.Coa = F;
                            this.Qa = H;
                            this.L1 = J;
                            this.config = M;
                            this.gL = K;
                            this.K = L;
                            this.Vk = O;
                            this.Oda = new l.Ac(true);
                            this.mk = new l.Ac(false);
                            this.Et = new l.Ac(false);
                            this.ended = new l.Ac(false);
                            this.Woa = new l.Ac(0);
                            this.bc = new l.Ac(p.Qb.Bh);
                            this.C3 = new l.Ac(undefined);
                            this.mh = new v.AbortController();
                            this.loaded = this.vha = this.closed = false;
                            this.tOb = function(S, T) {
                                return function(U) {
                                    var X, Y, da, ba;
                                    X = U.newValue;
                                    Y = X.Gk;
                                    U = X.CZ;
                                    da = X.stream;
                                    X = S.streams.find(function(aa) {
                                        return aa.bitrate === da.stream.bitrate;
                                    });
                                    ba = I.Ua.di.find(function(aa) {
                                        return aa.id === Y;
                                    });
                                    I.log.info("Presenting " + X.type + " request with bitrate " + X.bitrate + ", track " + (S.trackId + " [" + U.startTime + "..." + U.endTime + "]"));
                                    T.set({
                                        stream: X,
                                        CZ: Object.assign(Object.assign({}, U), {
                                            Yic: U.startTime,
                                            jvb: U.endTime
                                        }),
                                        Yc: ba
                                    });
                                }
                                ;
                            }
                            ;
                            this.mUb = function(S, T, U) {
                                return function(X) {
                                    var Y;
                                    Y = S.streams.find(function(da) {
                                        return da.bitrate === X.newValue.stream.bitrate;
                                    });
                                    I.log.info("Streaming " + Y.type + " stream with bitrate " + Y.bitrate + ", track " + S.trackId);
                                    T.set(Y, {
                                        jR: X.sn.jR,
                                        g$: undefined
                                    });
                                    Y = I.Ua.di.filter(function(da) {
                                        return da.id === X.sn.Gk;
                                    })[0];
                                    U.set(Y);
                                }
                                ;
                            }
                            ;
                            this.sAb = new Set();
                            this.log = w.zb("HLSVideoPlayer");
                            this.Ja = (0,
                            c.createElement)("VIDEO", "position:absolute;width:100%;height:100%");
                            this.Ja.playsInline = this.config.bOb;
                            this.Ua = this.yfa(g.Yz.index++, L.R, L.id, null !== (N = L.Xa) && undefined !== N ? N : {}, this.lB.wH(), this.$a.Fc(), false, undefined, function() {
                                return I.qE();
                            });
                            this.Ua.mediaTime.set(null !== (Q = this.Ua.Hq) && undefined !== Q ? Q : 0);
                            this.qW();
                            this.b9b = this.L1.create(this);
                            this.b9b;
                            this.load();
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.unb = undefined;
                        p = a(85001);
                        c = a(52569);
                        g = a(13044);
                        f = a(72639);
                        e = a(24735);
                        h = a(36129);
                        k = a(63156);
                        l = a(81734);
                        m = a(5021);
                        n = a(32687);
                        q = a(45266);
                        r = a(3887);
                        u = a(26388);
                        v = a(91176);
                        d.prototype.t0c = function() {
                            return !!this.Ja.canPlayType && ("" !== this.Ja.canPlayType("application/vnd.apple.mpegURL") || "" !== this.Ja.canPlayType("audio/mpegurl"));
                        }
                        ;
                        d.prototype.qW = function() {
                            var w;
                            w = this;
                            this.Ja.addEventListener("loadedmetadata", function() {
                                w.Lb(p.cb.rIb);
                                w.Lb(p.cb.qIb);
                                w.Lb(p.cb.Fq);
                                w.Lb(p.cb.Doa);
                                w.Lb(p.cb.gq);
                                w.Lb(p.cb.EC);
                            });
                            this.Ja.addEventListener("error", function(x) {
                                x = w.Vk(h.ea.qib, x);
                                w.close(x);
                            });
                            this.Ja.addEventListener("timeupdate", function() {
                                w.ended.set(false);
                                w.Ua.mediaTime.set(w.qE());
                                w.wSa();
                                w.Lb(p.cb.wu);
                                w.Lb(p.cb.kWb);
                            });
                            this.Ja.addEventListener("durationchange", function() {
                                w.Lb(p.cb.RSa);
                            });
                            this.Ja.addEventListener("resize", function() {
                                w.Lb(p.cb.P8a);
                            });
                            this.Ja.addEventListener("playing", function() {
                                w.wSa();
                                w.Et.set(false);
                                w.mk.set(true);
                                w.ended.set(false);
                                w.bc.set(p.Qb.Bg);
                            });
                            this.Ja.addEventListener("pause", function() {
                                w.mk.set(false);
                                w.Et.set(false);
                                w.bc.set(p.Qb.aj);
                            });
                            this.Ja.addEventListener("waiting", function() {
                                w.bc.set(p.Qb.Bh);
                            });
                            this.Ja.addEventListener("stalled", function() {
                                w.Et.set(true);
                            });
                            this.Ja.addEventListener("seeking", function() {
                                w.Et.set(false);
                                w.C3.set(w.Ua.mediaTime.value);
                                w.bc.set(p.Qb.Bh);
                            });
                            this.Ja.addEventListener("seeked", function() {
                                undefined !== w.C3.value && (w.Ua.Rp.M0a(w.C3.value, w.qE()),
                                w.C3.set(undefined));
                                w.bc.set(w.Ky() ? p.Qb.Bg : p.Qb.aj);
                            });
                            this.Ja.addEventListener("progress", function() {
                                w.Lb(p.cb.Toa);
                                w.F2c();
                            });
                            this.Ja.addEventListener("ended", function() {
                                w.bc.set(p.Qb.Ix);
                                w.Et.set(false);
                                w.mk.set(false);
                                w.ended.set(true);
                            });
                            this.Ja.addEventListener("volumechange", function() {
                                w.Lb(p.cb.HXb);
                                w.Lb(p.cb.EKb);
                            });
                            this.mk.addListener(function() {
                                w.Lb(p.cb.I2a);
                                w.Lb(p.cb.mNb);
                                w.BZ();
                            });
                            this.Woa.addListener(function() {
                                w.Lb(p.cb.kZ);
                            });
                            this.Et.addListener(function() {
                                w.Lb(p.cb.kZ);
                            });
                            this.Oda.addListener(function() {
                                w.BZ();
                            });
                            this.ended.addListener(function() {
                                w.Lb(p.cb.Syb);
                            });
                            this.Ua.playbackRate.addListener(function(x) {
                                w.Ja.playbackRate = x.newValue;
                                w.Lb(p.cb.Tfa);
                            });
                        }
                        ;
                        d.prototype.BZ = function() {
                            !this.Ky() || this.Oda.value || this.vha || this.wsb || (this.vha = true,
                            this.Ua.kI = this.Qa.kJ,
                            this.PNb.Gm(this, this.Ua));
                        }
                        ;
                        d.prototype.x$ = function() {
                            return this.xfa - (this.Ua.lk.na(m.Ba) + this.$a.sI.na(m.Ba));
                        }
                        ;
                        d.prototype.oS = function() {
                            var w;
                            w = this.Ua.qb.JC;
                            return (0,
                            n.wc)(w) ? w : this.Ua.lk.na(m.Ba) + this.$a.sI.na(m.Ba);
                        }
                        ;
                        d.prototype.ZPa = function() {
                            return this.Qa.Hg.na(m.Ba) - this.oS();
                        }
                        ;
                        d.prototype.$Pa = function() {
                            return this.xfa - this.oS();
                        }
                        ;
                        d.prototype.F2c = function() {
                            var w;
                            w = this.Ja.readyState <= k.zv.aK.HAVE_METADATA ? 0 : this.Ja.readyState <= k.zv.aK.HAVE_CURRENT_DATA ? .5 : 1;
                            1 === w && (this.xfa = this.Qa.Hg.na(m.Ba),
                            this.Oda.set(false),
                            this.dUa(p.cb.loaded));
                            this.Woa.set(w);
                        }
                        ;
                        d.prototype.wSa = function() {
                            var w;
                            w = this.qE();
                            this.HBa.gSb(w);
                            this.Coa.gSb(w);
                        }
                        ;
                        d.prototype.Wga = function() {
                            var w;
                            w = this;
                            this.Ua.qg("ats");
                            return this.Kh.Bp({
                                Ia: this.Ua.Ia,
                                qb: this.Ua.qb,
                                J: this.Ua.R,
                                Bu: f.qq.Yla,
                                Ti: e.Tr.$r
                            }, this.mh.signal).then(function(x) {
                                var A;
                                function y(z) {
                                    var B;
                                    B = z;
                                    z && z.dr() && !z.Hp() && (B = null);
                                    w.Ua.sl.set(B);
                                }
                                w.Ua.qg("at");
                                A = w.eea.create({}).YMb(x);
                                w.Ua.S = x;
                                w.Ua.dd = A;
                                w.Ja.audioTracks.addEventListener("addtrack", function() {
                                    w.MWb(w.Ua.oa.Cc);
                                });
                                w.Ja.audioTracks.addEventListener("change", function() {
                                    for (var z, B, C = {}, D = Fa(w.Ja.audioTracks), E = D.next(); !E.done; (C = {
                                        z5: C.z5
                                    },
                                    E = D.next()))
                                        (C.z5 = E.value,
                                        C.z5.enabled && C.z5.label !== (null === (z = w.Ua.oa.Cc) || undefined === z ? undefined : z.displayName) && (false,
                                        E = null !== (B = w.Ua.ul.find((function(G) {
                                            return function(F) {
                                                return F.displayName === G.z5.label;
                                            }
                                            ;
                                        }
                                        )(C))) && undefined !== B ? B : null,
                                        w.Ua.oa.mO(E)));
                                });
                                w.Ua.oa.addListener([u.l.V], function(z) {
                                    w.MWb(z.UE);
                                    w.Lb(p.cb.Fq);
                                    w.Lb(p.cb.EC);
                                });
                                w.Ja.textTracks.addEventListener("addtrack", function() {
                                    w.NWb(w.Ua.oa.yc);
                                });
                                w.Ja.textTracks.addEventListener("change", function() {
                                    var G;
                                    for (var z, B, C = w.Ja.textTracks, D = {}, E = 0; E < C.length; (D = {
                                        A5: D.A5
                                    },
                                    E++))
                                        if ((D.A5 = C[E],
                                        "showing" === D.A5.mode && D.A5.label !== (null === (z = w.Ua.oa.yc) || undefined === z ? undefined : z.displayName))) {
                                            false;
                                            G = null !== (B = w.Ua.sk.find((function(F) {
                                                return function(H) {
                                                    return H.displayName === F.A5.label;
                                                }
                                                ;
                                            }
                                            )(D))) && undefined !== B ? B : null;
                                            w.Ua.oa.xz(G);
                                            y(G);
                                        }
                                });
                                w.Ua.oa.xz(A.paa);
                                y(A.paa);
                                w.Ua.oa.addListener([u.l.Ea], function(z) {
                                    w.NWb(z.dv);
                                    w.Lb(p.cb.gq);
                                });
                                return w.OPc.build(x, function(z) {
                                    return w.Ua.qg(z);
                                });
                            }).then(function(x) {
                                var y, A, z, B, C, D, E, G, F, H, J, M, K, L, O;
                                y = x.ZHc;
                                A = x.wgc;
                                x = x.B_c;
                                z = x.audio;
                                B = x.$wb;
                                C = x.video;
                                D = w.Ua;
                                E = D.qj;
                                G = D.oa;
                                F = D.ul;
                                H = D.ig;
                                x = D.Hq;
                                J = D.Fe;
                                M = D.gf;
                                K = D.Rp;
                                D = D.dd;
                                D.ul = F.filter(function(I) {
                                    return z.find(function(N) {
                                        return N.track.ff === I.trackId;
                                    });
                                });
                                G.U5a(D.saa);
                                G.mO(F.find(function(I) {
                                    return I.trackId === B;
                                }));
                                D = C[0];
                                L = D.stream;
                                F = z.find(function(I) {
                                    return I.track.ff === B;
                                });
                                O = F.stream;
                                w.Vca = L.bitrate;
                                w.HBa.X2a.addListener(w.tOb(G.Mc, J));
                                w.HBa.L6a.addListener(w.mUb(G.Mc, H, w.Ua.Yc[u.l.U]));
                                H = A.get(L.sh).m3.Ug;
                                w.HBa.Gb(C, D, H);
                                w.Coa.X2a.addListener(w.tOb(G.Cc, M));
                                w.Coa.L6a.addListener(w.mUb(G.Cc, E, w.Ua.Yc[u.l.V]));
                                A = A.get(O.sh).m3.Ug;
                                w.Coa.Gb(z, F, A);
                                w.Ja.src = y;
                                w.Ja.currentTime = (null !== x && undefined !== x ? x : 0) / 1E3;
                                w.Ja.load();
                                K.M0a(0, x && 0 < x ? x : 1);
                            }).catch(function(x) {
                                var y, A;
                                if (x instanceof Error) {
                                    A = (0,
                                    r.Yj)(x);
                                    w.log.error("uncaught exception", x, A);
                                }
                                w.close(w.Vk(null !== (y = x.code) && undefined !== y ? y : h.ea.Xmb, x));
                            });
                        }
                        ;
                        d.prototype.HDb = function() {
                            return [];
                        }
                        ;
                        d.prototype.gE = function() {
                            return [];
                        }
                        ;
                        d.prototype.NWb = function(w) {
                            var A;
                            for (var x = this.Ja.textTracks, y = 0; y < x.length; y++) {
                                A = x[y];
                                A.label === w.displayName && "showing" !== A.mode && (false,
                                A.mode = "showing");
                                A.label !== w.displayName && "showing" === A.mode && (false,
                                A.mode = "hidden");
                            }
                        }
                        ;
                        d.prototype.MWb = function(w) {
                            for (var x = Fa(this.Ja.audioTracks), y = x.next(); !y.done; y = x.next())
                                (y = y.value,
                                y.label !== w.displayName || y.enabled || (false,
                                y.enabled = true),
                                y.label !== w.displayName && y.enabled && (false,
                                y.enabled = false));
                        }
                        ;
                        d.prototype.lm = function() {}
                        ;
                        d.prototype.Do = function() {}
                        ;
                        d.prototype.qE = function() {
                            return Math.floor(1E3 * this.Ja.currentTime);
                        }
                        ;
                        d.prototype.XH = function() {
                            return this.qE();
                        }
                        ;
                        d.prototype.XA = function() {
                            return this.qE();
                        }
                        ;
                        d.prototype.YL = function() {
                            return Math.floor(1E3 * this.Ja.duration);
                        }
                        ;
                        d.prototype.ICb = function() {
                            return this.K.R;
                        }
                        ;
                        d.prototype.cB = function() {
                            return this.Ua.Ia;
                        }
                        ;
                        d.prototype.VCb = function() {
                            var w;
                            return null === (w = this.Ua.S) || undefined === w ? undefined : w.Aa.de;
                        }
                        ;
                        d.prototype.Vq = function() {
                            return this.Ja;
                        }
                        ;
                        d.prototype.Ws = function() {
                            return null === this.ak();
                        }
                        ;
                        d.prototype.Ky = function() {
                            return this.mk.value;
                        }
                        ;
                        d.prototype.qda = function() {
                            return !this.mk.value;
                        }
                        ;
                        d.prototype.AYa = function() {
                            return this.Ja.ended;
                        }
                        ;
                        d.prototype.ak = function() {
                            return 1 !== this.Woa.value ? {
                                stalled: this.Et.value,
                                progress: this.Woa.value,
                                progressRollback: false
                            } : null;
                        }
                        ;
                        d.prototype.getError = function() {
                            var w, x;
                            return null !== (x = null === (w = this.$j) || undefined === w ? undefined : w.cia()) && undefined !== x ? x : null;
                        }
                        ;
                        d.prototype.wBb = function() {
                            return 1 === this.Ja.buffered.length ? 1E3 * this.Ja.buffered.end(0) : null;
                        }
                        ;
                        d.prototype.PDb = function() {
                            return {
                                width: this.Ja.videoWidth,
                                height: this.Ja.videoHeight
                            };
                        }
                        ;
                        d.prototype.KYa = function() {
                            return this.Ja.muted;
                        }
                        ;
                        d.prototype.SDb = function() {
                            return this.Ja.volume;
                        }
                        ;
                        d.prototype.tSb = function(w) {
                            this.Ja.muted = w;
                        }
                        ;
                        d.prototype.MSb = function(w) {
                            this.Ja.volume = w;
                        }
                        ;
                        d.prototype.addEventListener = function(w, x, y) {
                            this.Xb.addListener(w, x, y);
                        }
                        ;
                        d.prototype.removeEventListener = function(w, x) {
                            this.Xb.removeListener(w, x);
                        }
                        ;
                        d.prototype.load = function() {
                            var w;
                            w = this;
                            this.loaded || (this.loaded = true,
                            this.gL.Nda(function(x) {
                                w.t0c() ? x.success ? w.Wga() : w.close(w.Vk(x.errorCode || h.ea.NFa, x)) : w.close(w.Vk(h.ea.d1b));
                            }));
                        }
                        ;
                        d.prototype.close = function(w) {
                            if (this.closed)
                                return Promise.resolve();
                            this.Ua.mediaTime.set(this.qE());
                            this.wSa();
                            this.Ua.V$ = this.XH();
                            this.closed = true;
                            this.Ja.removeAttribute("src");
                            this.Ja.load();
                            null === w || undefined === w ? undefined : w.vSb(!this.Oda.value);
                            this.$j = w;
                            this.mh.abort();
                            w && this.Lb(p.cb.error, w.cia());
                            this.Lb(p.cb.closed);
                            return this.PNb.zha(this.Ua);
                        }
                        ;
                        d.prototype.play = function() {
                            var w, x;
                            w = this;
                            x = this.Ja.play();
                            this.wsb = false;
                            x && x.then(function() {
                                w.dUa(p.cb.xsb);
                            }).catch(function(y) {
                                w.Lb(p.cb.kZ);
                                "NotAllowedError" === y.name && (w.log.warn("Playback is blocked by the browser settings", y),
                                w.wsb = true,
                                w.Sj = true,
                                w.dUa(p.cb.Ioa, {
                                    player: {
                                        play: function() {
                                            return w.play();
                                        }
                                    }
                                }));
                            });
                        }
                        ;
                        d.prototype.Lb = function(w, x, y) {
                            x = x || ({});
                            x.target = this;
                            this.Xb.qd(w, x, !y);
                        }
                        ;
                        d.prototype.dUa = function(w, x) {
                            this.sAb.has(w) || (this.sAb.add(w),
                            this.Lb(w, x, undefined));
                        }
                        ;
                        d.prototype.pause = function() {
                            this.Ja.pause();
                        }
                        ;
                        d.prototype.lNb = function() {
                            this.pause();
                        }
                        ;
                        d.prototype.seek = function(w) {
                            this.Ja.currentTime = w / 1E3;
                        }
                        ;
                        d.prototype.gFb = function(w) {
                            this.close(this.Vk(h.ea.mcb, h.Y.lo, w));
                        }
                        ;
                        d.prototype.F0 = function() {
                            return this.Ua.playbackRate.value;
                        }
                        ;
                        d.prototype.Zza = function(w) {
                            this.Ua.playbackRate.set(w);
                        }
                        ;
                        d.prototype.nBb = function() {
                            var w;
                            w = this;
                            return this.Ua.ul.map(function(x) {
                                return w.Fw(x);
                            });
                        }
                        ;
                        d.prototype.NWa = function(w) {
                            var x;
                            x = this;
                            return this.jca(w).map(function(y) {
                                return x.Fw(y);
                            });
                        }
                        ;
                        d.prototype.mBb = function() {
                            var w;
                            w = this.Ua.oa.Cc;
                            return w && this.Fw(w);
                        }
                        ;
                        d.prototype.MWa = function() {
                            var w;
                            w = this.Ua.oa.yc;
                            return w && this.Fw(w);
                        }
                        ;
                        d.prototype.mO = function(w) {
                            if ((w = this.jba(w)) && w.De)
                                return (this.Ua.oa.mO(w),
                                Promise.resolve());
                            this.log.error("Invalid setAudioTrack call");
                            return Promise.reject(Error("Invalid setAudioTrack call"));
                        }
                        ;
                        d.prototype.xz = function(w) {
                            var x, y;
                            x = this;
                            y = this.Ua.sk.find(function(A) {
                                return x.Fw(A) === w;
                            });
                            if (y && y.De)
                                return (this.Ua.oa.xz(y),
                                this.Ua.sl.set(y),
                                Promise.resolve());
                            this.log.error("Invalid setTextTrack call");
                            return Promise.reject(Error("Invalid setTextTrack call"));
                        }
                        ;
                        d.prototype.ACb = function() {
                            var w;
                            return this.bca(this.Ua.ul, null === (w = this.Ua.S) || undefined === w ? undefined : w.Aa.wJb);
                        }
                        ;
                        d.prototype.TVa = function(w) {
                            var x;
                            return this.bca(this.jca(w), null === (x = this.Ua.S) || undefined === x ? undefined : x.Aa.xJb);
                        }
                        ;
                        d.prototype.Fw = function(w) {
                            var x;
                            x = w.r3a = w.r3a || ({
                                trackId: w.trackId,
                                bcp47: w.oh,
                                displayName: w.displayName,
                                trackType: w.jj,
                                rawTrackType: w.SN,
                                channels: w.channels
                            });
                            this.QYa(w) && (x.isNative = w.isNative,
                            x.surroundFormatLabel = w.Gha);
                            this.RYa(w) && (x.isNoneTrack = w.dr(),
                            x.isForcedNarrative = w.Hp(),
                            x.isImageBased = w.cr);
                            x.subType = w.EV;
                            x.variant = w.variant;
                            return x;
                        }
                        ;
                        d.prototype.QYa = function(w) {
                            return "undefined" !== typeof w.isNative;
                        }
                        ;
                        d.prototype.RYa = function(w) {
                            return "undefined" !== typeof w.dr && "undefined" !== typeof w.Hp;
                        }
                        ;
                        d.prototype.jba = function(w) {
                            var x;
                            x = this;
                            return w && this.Ua.ul.find(function(y) {
                                return x.Fw(y) === w;
                            });
                        }
                        ;
                        d.prototype.jca = function(w) {
                            var x;
                            w = this.jba(w) || this.Ua.oa.Cc;
                            return null !== (x = null === w || undefined === w ? undefined : w.sk) && undefined !== x ? x : [];
                        }
                        ;
                        d.prototype.bca = function(w, x) {
                            var y;
                            y = w.length - 1;
                            if ("number" !== typeof x)
                                return y;
                            w = w.findIndex(function(A) {
                                return A.Gc > x;
                            });
                            return -1 === w ? y : w - 1;
                        }
                        ;
                        d.prototype.qBa = function(w) {
                            this.Ua.qb = (0,
                            q.Nva)(this.Ua.qb, w);
                        }
                        ;
                        d.prototype.mm = function(w) {
                            if (w !== this.Ua.M)
                                throw (false,
                                Error("Unknown segmentId " + w));
                            return this.Ua;
                        }
                        ;
                        d.prototype.WCb = function() {
                            return this.Ua.qb;
                        }
                        ;
                        d.prototype.EOa = function() {
                            false;
                        }
                        ;
                        d.prototype.UPb = function() {
                            false;
                        }
                        ;
                        d.prototype.$E = function() {
                            false;
                        }
                        ;
                        d.prototype.ZT = function() {
                            false;
                        }
                        ;
                        d.prototype.xca = function() {
                            false;
                            return Promise.reject();
                        }
                        ;
                        d.prototype.CWa = function() {
                            return {};
                        }
                        ;
                        d.prototype.fsa = function() {}
                        ;
                        d.prototype.lBb = function() {
                            return {};
                        }
                        ;
                        d.prototype.w5a = function() {}
                        ;
                        d.prototype.q4 = function() {}
                        ;
                        d.prototype.QFb = function() {
                            return false;
                        }
                        ;
                        d.prototype.OBb = function() {
                            return {
                                addEventListener: function() {},
                                removeEventListener: function() {},
                                getGroups: function() {
                                    return [];
                                },
                                register: function() {},
                                notifyUpdated: function() {},
                                getModel: function() {},
                                getTime: function() {
                                    return 0;
                                }
                            };
                        }
                        ;
                        d.prototype.O_ = function() {
                            false;
                            return Promise.resolve({
                                success: true
                            });
                        }
                        ;
                        d.prototype.KDb = function() {
                            false;
                        }
                        ;
                        d.prototype.sca = function() {
                            false;
                        }
                        ;
                        d.prototype.i4 = function() {
                            false;
                        }
                        ;
                        d.prototype.S5a = function() {
                            false;
                        }
                        ;
                        d.prototype.mIb = function() {
                            false;
                        }
                        ;
                        d.prototype.gBb = function() {
                            false;
                            return Promise.reject();
                        }
                        ;
                        d.prototype.KNb = function() {
                            false;
                            return Promise.reject();
                        }
                        ;
                        d.prototype.aPb = function() {
                            false;
                            return Promise.reject();
                        }
                        ;
                        d.prototype.Pl = function() {
                            false;
                            return Promise.reject();
                        }
                        ;
                        d.prototype.CU = function() {
                            false;
                        }
                        ;
                        b.unb = d;
                    }
