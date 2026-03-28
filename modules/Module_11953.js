/**
 * @module Module_11953
 * @description Class module with ES module exports
 * @categories DRM, Crypto, Network, Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 11953
 * Deobfuscated size: 26801 chars
 * Functions: 66
 * Prototype definitions: 36
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 11953
{
                        var g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F, H, J;
                        function d() {
                            this.hBa = [];
                            this.D1c = 50;
                        }
                        function p(M) {
                            var K;
                            K = this;
                            this.j = M;
                            Promise.resolve();
                            this.LK = [];
                            this.Wm = new h.jl();
                            this.oob = 0;
                            this.Hma = [];
                            this.Cg = (0,
                            m.Fo)(this.j, "MediaElementASE");
                            this.Ipb = f.lK;
                            this.oMa = false;
                            this.kb = new d();
                            this.Dg = new H.Ac(D.zv.aK.HAVE_NOTHING);
                            this.SNa = {};
                            this.ksa = this.Ima(function() {
                                var L;
                                if (K.Ja)
                                    return null !== (L = K.Ja.webkitDecodedFrameCount) && undefined !== L ? L : 0;
                            });
                            this.YA = this.Ima(function() {
                                var L;
                                if (K.Ja) {
                                    L = K.CMa();
                                    return L ? L.totalVideoFrames : K.Ja.webkitDecodedFrameCount;
                                }
                            });
                            this.vS = this.Ima(function() {
                                var L;
                                if (K.Ja) {
                                    L = K.CMa();
                                    return L ? L.droppedVideoFrames : K.Ja.webkitDroppedFrameCount;
                                }
                            });
                            this.Nba = this.Ima(function() {
                                var L;
                                if (K.Ja) {
                                    L = K.CMa();
                                    return L && L.corruptedVideoFrames;
                                }
                            });
                            this.Wob = function(L) {
                                false;
                                K.Wm.qd(z.ll.RHb, {
                                    J: L
                                });
                            }
                            ;
                            this.eNa = function() {
                                true === x.$i.hidden ? K.Hma.forEach(function(L) {
                                    L.refresh();
                                    L.MZc();
                                }) : K.Hma.forEach(function(L) {
                                    L.refresh();
                                    L.n_c();
                                });
                            }
                            ;
                            this.ppb = function(L) {
                                var O, N;
                                if (K.Ja) {
                                    L = L.FBa;
                                    O = K.w8b();
                                    O && (L.ConstrictionActive = O.constrictionActive,
                                    L.Status = O.status);
                                    try {
                                        L.readyState = "" + K.Ja.readyState;
                                        L.currentTime = "" + K.Ja.currentTime;
                                        L.pbRate = "" + K.Ja.playbackRate;
                                    } catch (Q) {}
                                    O = K.LK.length;
                                    for (var I; O--; ) {
                                        I = K.LK[O];
                                        N = "";
                                        I.type == f.Rka ? N = "audio" : I.type == f.B7 && (N = "video");
                                        (0,
                                        v.Qf)(L, I.bsa(), {
                                            prefix: N
                                        });
                                    }
                                    K.oD && (O = K.oD.duration) && !isNaN(O) && (L.duration = O.toFixed(4));
                                }
                            }
                            ;
                            this.npb = function() {
                                K.Wm.qd(z.ll.pPb);
                            }
                            ;
                            J ? (this.JE = m.Za.get(A.ofb).create(this, this.j),
                            this.Kd = m.Za.get(F.Vl),
                            e.config.B1 && new Promise(function(L) {
                                K.Ipb = L;
                                K.j.addEventListener(C.ja.Fh, L);
                            }
                            ),
                            this.Cg.trace("Created Media Element"),
                            this.addEventListener = this.Wm.addListener,
                            this.removeEventListener = this.Wm.removeListener,
                            this.rrc = "encrypted") : this.Ema(n.ea.rib);
                        }
                        function c() {
                            var M;
                            M = (0,
                            l.createElement)("VIDEO", "position:absolute;width:100%;height:100%");
                            M.disablePictureInPicture = e.config.Eoc;
                            return M;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.qHa = undefined;
                        g = a(90762);
                        f = a(33096);
                        e = a(29204);
                        h = a(94886);
                        k = a(37509);
                        l = a(52569);
                        m = a(31276);
                        n = a(36129);
                        q = a(45146);
                        r = a(8825);
                        u = a(67572);
                        v = a(3887);
                        w = a(77705);
                        x = a(22365);
                        y = a(32687);
                        A = a(80012);
                        z = a(16520);
                        B = a(5021);
                        C = a(85001);
                        D = a(63156);
                        E = a(82100);
                        G = a(26388);
                        F = a(53085);
                        H = a(81734);
                        J = !!(x.NP && HTMLVideoElement && URL && HTMLVideoElement.prototype.play);
                        p.prototype.XA = function(M) {
                            try {
                                this.Ja && (this.oob = this.Ja.currentTime);
                            } catch (K) {
                                this.Cg.error("Exception while getting VIDEO.currentTime", K);
                                M && this.z8(n.ea.R4b, K);
                            }
                            return (0,
                            x.Tt)(this.oob * f.Ur);
                        }
                        ;
                        p.prototype.seek = function(M, K) {
                            var L;
                            K = undefined === K ? false : K;
                            (0,
                            q.ta)(!this.rs);
                            this.Bpb();
                            L = this.XA(true);
                            if (!K && !e.config.Lbc && (0,
                            x.Tka)(L - M) <= this.wRb)
                                (this.Cg.trace("Seek delta too small", {
                                    currentTime: L,
                                    seekTime: M,
                                    min: this.wRb
                                }),
                                this.kb.trace("smallseek", M));
                            else {
                                this.kb.trace("seek", M);
                                try {
                                    this.Cg.trace("Setting video elements currentTime", {
                                        From: (0,
                                        r.zk)(L),
                                        To: (0,
                                        r.zk)(M)
                                    });
                                    this.rs = {};
                                    this.Ja.currentTime = M / f.Ur;
                                    this.Wm.qd(z.ll.wu);
                                } catch (O) {
                                    this.Cg.error("Exception while setting VIDEO.currentTime", O);
                                    this.z8(n.ea.S4b, O);
                                }
                            }
                        }
                        ;
                        p.prototype.pDb = function() {
                            return !!this.rs;
                        }
                        ;
                        p.prototype.addSourceBuffer = function(M) {
                            var K;
                            try {
                                K = new g.rHa(this.j,M,this.oD,this.Cg);
                                this.LK.push(K);
                                M == f.B7 && K.hUa && K.hUa.addListener(this.Ipb);
                                this.Wm.qd(z.ll.tTb);
                                return K;
                            } catch (L) {
                                K = (0,
                                v.Yj)(L);
                                this.Cg.error("Unable to add source buffer.", {
                                    error: K
                                });
                                this.j.Gg(n.ea.qIa, {
                                    Ya: M === G.l.V ? n.Y.cHa : n.Y.dHa,
                                    Cf: K
                                });
                            }
                        }
                        ;
                        p.prototype.I9 = function(M) {
                            var K;
                            K = this;
                            M.forEach(function(L) {
                                return K.addSourceBuffer(L);
                            });
                            return true;
                        }
                        ;
                        p.prototype.removeSourceBuffer = function(M) {
                            this.LK = this.LK.filter(function(K) {
                                return !(0,
                                l.pic)(M, K);
                            });
                            this.oD.removeSourceBuffer(M);
                        }
                        ;
                        p.prototype.endOfStream = function() {
                            this.kb.trace("endofstream");
                            false;
                            e.config.bQa && this.oD.endOfStream();
                        }
                        ;
                        p.prototype.Hh = function(M) {
                            false;
                            this.LK = [];
                            M && M.Tjd();
                            return true;
                        }
                        ;
                        p.prototype.WVa = function() {
                            if (this.oD)
                                return (0,
                                B.eQc)(this.oD.duration);
                        }
                        ;
                        p.prototype.xoc = function() {
                            var M;
                            if (!this.oMa && this.Ja && this.Ja.readyState >= D.zv.aK.HAVE_CURRENT_DATA) {
                                M = this.Ja.webkitDecodedFrameCount;
                                if (undefined === M || 0 < M || e.config.K4c)
                                    this.oMa = true;
                            }
                            return this.oMa;
                        }
                        ;
                        p.prototype.open = function(M) {
                            var K;
                            K = this;
                            this.Ja = M || c();
                            try {
                                this.oD = new x.NP();
                            } catch (L) {
                                this.z8(n.ea.I4b, L);
                                return;
                            }
                            try {
                                this.Sg = URL.createObjectURL(this.oD);
                            } catch (L) {
                                this.z8(n.ea.J4b, L);
                                return;
                            }
                            try {
                                this.oD.addEventListener("sourceopen", function(L) {
                                    return K.I9b(L);
                                });
                                this.JE.Fac(this.Wob);
                                this.fbc(this.Ja);
                                this.gbc(this.Ja);
                                this.Ja.src = this.Sg;
                                this.Dg.addListener(this.npb);
                                this.j.addEventListener(C.ja.a6a, this.ppb);
                                k.Ce.addListener(k.Qs, this.eNa);
                                this.eNa();
                            } catch (L) {
                                this.z8(n.ea.K4b, L);
                                return;
                            }
                            M || !this.j.aT || e.config.z8a || this.JE.SLb();
                        }
                        ;
                        p.prototype.close = function() {
                            this.kb.trace("close");
                            this.Ja && (this.XA(false),
                            this.Bpb(),
                            this.LK = [],
                            this.WTc(this.Ja),
                            this.RTc(this.Ja),
                            this.JE.NTc(this.Wob),
                            this.JE.close(),
                            clearTimeout(this.JE.Qkd),
                            this.Dg.removeListener(this.npb),
                            this.j.removeEventListener(C.ja.a6a, this.ppb),
                            k.Ce.removeListener(k.Qs, this.eNa),
                            this.Ja = undefined);
                        }
                        ;
                        p.prototype.UUc = function() {
                            this.rs && (this.kb.trace("resetSeek"),
                            this.rs = undefined);
                        }
                        ;
                        p.prototype.C9b = function() {
                            e.config.z8a && this.JE.SLb();
                        }
                        ;
                        p.prototype.CMa = function() {
                            if (this.Ja)
                                return this.Ja.getVideoPlaybackQuality && this.Ja.getVideoPlaybackQuality() || this.Ja.videoPlaybackQuality || this.Ja.playbackQuality;
                        }
                        ;
                        p.prototype.o$b = function() {
                            var M;
                            M = this.j.$j;
                            return (M = M && M.errorCode) && 0 <= [n.ea.mla, n.ea.yka].indexOf(M);
                        }
                        ;
                        p.prototype.Ima = function(M) {
                            var K;
                            K = m.Za.get(u.cib)(M);
                            this.Hma.push(K);
                            return function() {
                                K.refresh();
                                return K.Wvc();
                            }
                            ;
                        }
                        ;
                        p.prototype.z8 = function(M, K) {
                            var L, O;
                            L = {
                                Ya: n.Y.Sr,
                                Cf: (0,
                                v.Yj)(K)
                            };
                            try {
                                O = K.message.match(/(?:[x\W\s]|^)([0-9a-f]{8})(?:[x\W\s]|$)/i)[1].toUpperCase();
                                O && 8 == O.length && (L.Yg = O);
                            } catch (I) {}
                            this.j.Gg(M, L);
                        }
                        ;
                        p.prototype.Bpb = function() {
                            this.Hma.forEach(function(M) {
                                M.refresh();
                            });
                        }
                        ;
                        p.prototype.w8b = function() {
                            return this.Ja && this.Ja.msGraphicsTrustStatus;
                        }
                        ;
                        p.prototype.Ema = function(M, K) {
                            this.j.Gg(M, K, undefined);
                        }
                        ;
                        p.prototype.I9b = function(M) {
                            false;
                            this.r$b || (this.r$b = true,
                            this.Wm.qd(z.ll.oAa, M));
                        }
                        ;
                        p.prototype.H9b = function() {
                            this.kb.trace("seeking");
                            this.Cg.trace("Video element event: seeking");
                            this.rs ? this.rs.ALc = true : (this.Cg.error("unexpected seeking event"),
                            e.config.Lsc && this.Ema(n.ea.X4b, {
                                Cf: {
                                    Trace: this.kb.P0()
                                }
                            }));
                        }
                        ;
                        p.prototype.G9b = function() {
                            this.kb.trace("seeked");
                            this.Cg.trace("Video element event: seeked");
                            this.rs ? ((0,
                            q.ta)(this.rs.ALc),
                            this.rs.zLc = true,
                            this.eqb()) : (this.Cg.error("unexpected seeked event"),
                            e.config.Ksc && this.Ema(n.ea.W4b, {
                                Cf: {
                                    Trace: this.kb.P0()
                                }
                            }));
                        }
                        ;
                        p.prototype.J9b = function() {
                            var M;
                            this.kb.trace("timeupdate", null === (M = this.Ja) || undefined === M ? undefined : M.currentTime);
                            false;
                            this.rs && (this.rs.CLc = true,
                            this.eqb());
                            this.Wm.qd(z.ll.wu);
                        }
                        ;
                        p.prototype.F9b = function() {
                            this.Cg.trace("Video element event: loadstart");
                        }
                        ;
                        p.prototype.K9b = function(M) {
                            this.Cg.trace("Video element event:", M.type);
                            try {
                                this.j.volume.set(this.Ja.volume);
                                this.j.muted.set(this.Ja.muted);
                            } catch (K) {
                                this.Cg.error("error updating volume", K);
                            }
                        }
                        ;
                        p.prototype.D9b = function(M) {
                            var K, L, O, I, N, Q, S, T;
                            K = this.Ema;
                            L = n.ea.qib;
                            O = n.Gcb;
                            I = this.kb.P0();
                            N = M.target;
                            Q = N && N.error;
                            S = M.errorCode;
                            N = Q && Q.code;
                            (0,
                            y.gd)(N) || (N = S && S.code);
                            S = Q && Q.message;
                            T = Q && Q.msExtendedCode;
                            (0,
                            y.gd)(T) || (T = Q && Q.systemCode);
                            (0,
                            y.gd)(T) || (T = M.systemCode);
                            (0,
                            y.gd)(T) || (T = (0,
                            E.iWa)(S));
                            M = (0,
                            v.Qf)({}, {
                                code: N,
                                systemCode: T,
                                trace: JSON.stringify(I)
                            }, {
                                jxa: true
                            });
                            O = {
                                Ya: O(N),
                                Cf: (0,
                                w.r_a)(M)
                            };
                            try {
                                S && (O.uea = S);
                            } catch (U) {}
                            T = (0,
                            v.wm)(T);
                            (0,
                            y.wc)(T) && (O.Yg = (0,
                            m.xPa)(T, 4));
                            K.call(this, L, O);
                        }
                        ;
                        p.prototype.eqb = function() {
                            this.rs && this.rs.zLc && this.rs.CLc && (this.kb.trace("seekcomplete"),
                            this.rs = undefined,
                            this.Wm.qd(z.ll.Nga));
                        }
                        ;
                        p.prototype.fbc = function(M) {
                            var L, O;
                            function K(I, N) {
                                M.addEventListener(I, O[I] = N);
                            }
                            L = this;
                            O = this.SNa;
                            K("error", function(I) {
                                return L.D9b(I);
                            });
                            K("seeking", function() {
                                return L.H9b();
                            });
                            K("seeked", function() {
                                return L.G9b();
                            });
                            K("timeupdate", function() {
                                return L.J9b();
                            });
                            K("loadstart", function() {
                                return L.F9b();
                            });
                            K("volumechange", function(I) {
                                return L.K9b(I);
                            });
                            K(this.rrc, function() {
                                return L.C9b();
                            });
                            e.config.Goc && K("contextmenu", function(I) {
                                return I.preventDefault();
                            });
                            this.DSc = this.Kd.gV((0,
                            B.pc)(500), function() {
                                L.Dg.set(M.readyState);
                            });
                        }
                        ;
                        p.prototype.WTc = function(M) {
                            var K, I;
                            if (M) {
                                for (var L = Fa(Object.entries(this.SNa)), O = L.next(); !O.done; O = L.next()) {
                                    I = Fa(O.value);
                                    O = I.next().value;
                                    I = I.next().value;
                                    M.removeEventListener(O, I);
                                    delete this.SNa[O];
                                }
                                null === (K = this.DSc) || undefined === K ? undefined : K.cancel();
                                this.Dg.set(D.zv.aK.HAVE_NOTHING);
                            }
                        }
                        ;
                        p.prototype.gbc = function(M) {
                            var K, L;
                            K = this.j.nv;
                            L = K.lastChild;
                            L ? K.insertBefore(M, L) : K.appendChild(M);
                        }
                        ;
                        p.prototype.RTc = function(M) {
                            e.config.SQc && this.o$b() || (M.removeAttribute("src"),
                            M.load(),
                            this.j.nv.removeChild(M));
                            this.Sg && (URL.revokeObjectURL(this.Sg),
                            this.Sg = undefined);
                            this.oD = undefined;
                        }
                        ;
                        Ha.Object.defineProperties(p.prototype, {
                            sourceBuffers: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.LK;
                                }
                            },
                            wRb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return e.config.pZc;
                                }
                            }
                        });
                        b.qHa = p;
                        d.prototype.trace = function(M, K) {
                            this.hBa.push([M, K]);
                            this.hBa.length > this.D1c && this.hBa.shift();
                        }
                        ;
                        d.prototype.P0 = function() {
                            return this.hBa;
                        }
                        ;
                    }
