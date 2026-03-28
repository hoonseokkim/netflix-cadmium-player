/**
 * @module Module_74098
 * @description Class module with ES module exports
 * @categories DRM, Crypto, Network, Media, ABR, Manifest, Text, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 74098
 * Deobfuscated size: 76478 chars
 * Functions: 112
 * Prototype definitions: 44
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 74098
{
                        var p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F;
                        function d(H, J, M, K, L, O, I, N, Q, S, T, U, X, Y, da, ba, aa, ca, ea, R) {
                            var P;
                            P = this;
                            this.j = H;
                            this.Ua = J;
                            this.TUb = M;
                            this.ki = K;
                            this.RTa = L;
                            this.hg = O;
                            this.Hqa = I;
                            this.Je = N;
                            this.config = Q;
                            this.yg = S;
                            this.Qa = T;
                            this.$a = U;
                            this.VB = X;
                            this.wI = Y;
                            this.Hl = da;
                            this.VH = ba;
                            this.FT = aa;
                            this.Qc = ca;
                            this.PE = ea;
                            this.EE = R;
                            this.w1 = new WeakMap();
                            this.mHb = new WeakMap();
                            this.Vha = [];
                            this.Y_a = this.uM = this.nga = 0;
                            this.t_ = [];
                            this.FOa = false;
                            this.aq = function(V) {
                                var Z, fa, la, ka, sa, qa, wa, na, oa, W, ia, ha, pa, va, Aa, ma, ra, ya, ua;
                                pa = {};
                                try {
                                    pa = {
                                        playdelaysdk: (0,
                                        l.hi)(P.j.x$()),
                                        applicationPlaydelay: (0,
                                        l.hi)(P.j.ZPa()),
                                        playdelay: (0,
                                        l.hi)(P.j.$Pa()),
                                        trackid: P.j.co,
                                        bookmark: (0,
                                        l.hi)(P.j.Hq || 0),
                                        pbnum: P.j.index,
                                        endianness: (0,
                                        e.ywc)(),
                                        isStandaloneDisplay: P.config().zTb
                                    };
                                    P.config().hrc && (pa.transitiontime = P.j.Kr,
                                    pa.uiplaystarttime = P.j.qb.JC,
                                    pa.playbackrequestedat = P.j.lk.na(m.Ba),
                                    pa.clockgettime = P.getTime(),
                                    pa.clockgetpreciseepoch = P.Qa.Hg.na(m.Ba),
                                    pa.clockgetpreciseappepoch = P.$a.sI.na(m.Ba),
                                    pa.absolutestarttime = P.j.oS(),
                                    pa.relativetime = P.j.kDb());
                                    va = P.j.oa.Cc;
                                    Aa = null === (fa = null === (Z = P.j.gf.value) || undefined === Z ? undefined : Z.stream) || undefined === fa ? undefined : fa.ob;
                                    pa.audiotrackinfo = P.qS(va, Aa);
                                    ma = P.j.oa.Mc;
                                    ra = null === (ka = null === (la = P.j.Fe.value) || undefined === la ? undefined : la.stream) || undefined === ka ? undefined : ka.ob;
                                    pa.videotrackinfo = P.$Wa(ma, ra);
                                    pa.texttrackinfo = P.IS(P.j.oa.yc);
                                    pa.mediabufferedsegments = null === (sa = P.j.ae) || undefined === sa ? undefined : sa.s0();
                                    P.Sra(pa, "startplay");
                                } catch (xa) {
                                    P.log.error("error in startplay log fields", xa);
                                }
                                P.j.Sj && (pa.blocked = P.j.Sj);
                                P.Qc.YEb(pa);
                                (0,
                                x.wc)(P.j.Ysb) && (pa.bookmarkact = (0,
                                l.hi)(P.j.Ysb));
                                (Z = P.j.Pf.at && P.j.Pf.ats ? P.j.Pf.at - P.j.Pf.ats : undefined) && (pa.nccpat = Z);
                                (Z = P.j.Pf.lr && P.j.Pf.lc ? P.j.Pf.lr - P.j.Pf.lc : undefined) && (pa.nccplt = Z);
                                (Z = P.j.Pf.lc && P.j.Pf.lg ? P.j.Pf.lc - P.j.Pf.lg : undefined) && (pa.lct = Z);
                                (Z = P.yo()) && (pa.downloadables = Z);
                                Da._cad_global.device && (0,
                                x.gd)(Da._cad_global.device.ira) && (pa.esnSource = Da._cad_global.device.ira);
                                (0,
                                l.Qf)(pa, P.VB, {
                                    prefix: "pi_"
                                });
                                P.j.pu && P.j.pu.initBitrate && (pa.initvbitrate = P.j.pu.initBitrate);
                                P.j.pu && P.j.pu.selector && (pa.selector = P.j.pu.selector);
                                pa.fullDlreports = P.A8a;
                                if (P.j.state.value >= w.Nc.Lf)
                                    try {
                                        ya = P.j.SD();
                                        ya && (P.maxBitrate = (0,
                                        e.kja)(ya.map(function(xa) {
                                            return xa.bitrate;
                                        })),
                                        P.yJb = (0,
                                        e.kja)(ya.map(function(xa) {
                                            return xa.height;
                                        })),
                                        pa.maxbitrate = P.maxBitrate,
                                        pa.maxresheight = P.yJb);
                                    } catch (xa) {
                                        P.log.error("Exception computing max bitrate", xa);
                                    }
                                try {
                                    ua = (0,
                                    e.G0)();
                                    ua && (pa.pdltime = ua);
                                } catch (xa) {}
                                try {
                                    (0,
                                    l.Qf)(pa, P.j.Pf, {
                                        prefix: "sm_"
                                    });
                                    (0,
                                    l.Qf)(pa, P.j.Xsa(), {
                                        prefix: "vd_"
                                    });
                                } catch (xa) {}
                                V && P.j.JU && (pa.pssh = P.j.JU);
                                P.bFb(P.j, pa);
                                pa.avtp = P.NV.Bl().m7a;
                                (null === (qa = P.j.fb) || undefined === qa ? 0 : qa.yK) && P.Bta(pa);
                                if (P.j.oa.yc)
                                    try {
                                        pa.ttTrackFields = P.j.oa.yc.Bj;
                                    } catch (xa) {}
                                pa.itsxheaac = MediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.42"');
                                P.Qc.V0(pa, true, P.j.oa.Cc, P.Ua);
                                P.Qc.X0(pa, true, P.j.oa.Mc, P.Ua);
                                P.j.S && (pa.packageId = P.j.S.Aa.jt);
                                if (null === (wa = P.j.S) || undefined === wa ? 0 : wa.Aa.Bs)
                                    pa.hasChoiceMap = true;
                                P.config().hTa && (pa.reusedManifest = null !== (oa = null === (na = P.j.S) || undefined === na ? undefined : na.E8a) && undefined !== oa ? oa : false);
                                if (null === (ha = null === (ia = null === (W = P.j.S) || undefined === W ? undefined : W.Aa.EF) || undefined === ia ? undefined : ia.tO) || undefined === ha ? 0 : ha.tB)
                                    pa.isSteeringSticky = true;
                                P.xFc();
                                V && (P.$Xa(pa),
                                P.bYa(pa));
                                P.WEb(P.j, pa);
                                P.RS(P.j, pa);
                                P.SS(P.j, pa);
                                P.Cy(P.j, pa);
                                P.Sca(P.j, pa);
                                P.nM(P.j, pa, P.FOa);
                                P.Tca(P.j, pa);
                                P.mCc(P.j, pa);
                                P.aYa(pa);
                                P.dYa(pa);
                                P.Qc.W0(pa);
                                P.VEb(pa);
                                P.Qc.Cta(pa, P.Ua);
                                P.cYa(pa);
                                P.mB(pa, c.Od.aq);
                                P.UEb(pa);
                                P.bd(y.Zd.aq, V, F.tf | F.Mx | F.Rl | F.$z | F.hP | F.zja | F.sP | F.xv, pa);
                            }
                            ;
                            this.mv = function(V, Z, fa) {
                                Z = {
                                    playdelay: (0,
                                    l.hi)(V),
                                    reason: fa,
                                    intrplayseq: P.uM - 1,
                                    skipped: Z
                                };
                                "repos" === fa && (Z.prstate = true === P.j.paused.value ? "paused" : "playing");
                                P.mB(Z, c.Od.mv);
                                P.SS(P.j, Z);
                                P.Cy(P.j, Z);
                                P.Sca(P.j, Z);
                                P.bd(y.Zd.mv, false, F.tf | F.Mx | F.Rl, Z);
                                "rebuffer" !== fa && "force_rebuffer" !== fa || P.j.Rp.Cac(Number((0,
                                l.hi)(V)));
                            }
                            ;
                            this.qH = function(V, Z, fa, la) {
                                V = {
                                    moff: (0,
                                    l.Ms)(fa),
                                    moffms: (0,
                                    l.hi)(fa),
                                    vbitrate: Z.bitrate,
                                    vbitrateold: V.bitrate,
                                    vdlid: Z.ob,
                                    vdlidold: V.ob,
                                    vheight: Z.height,
                                    vheightold: V.height,
                                    vwidth: Z.width,
                                    vwidthold: V.width,
                                    bw: la
                                };
                                P.SS(P.j, V);
                                P.Cy(P.j, V);
                                P.nM(P.j, V);
                                P.mB(V, c.Od.qH);
                                P.bd(y.Zd.qH, false, F.Rl, V);
                            }
                            ;
                            this.Z3a = function(V, Z, fa) {
                                V = {
                                    moff: (0,
                                    l.Ms)(fa),
                                    moffms: (0,
                                    l.hi)(fa),
                                    vdlidold: V.ob,
                                    vbitrateold: V.bitrate
                                };
                                P.SS(P.j, V);
                                P.Cy(P.j, V);
                                P.nM(P.j, V);
                                P.Qc.Kw(V, Z, P.j.gf.value && P.j.gf.value.stream);
                                P.mB(V, c.Od.hga);
                                P.bd(y.Zd.hga, false, F.Rl, V);
                            }
                            ;
                            this.s2a = function() {
                                var V, Z;
                                V = {
                                    waittime: (0,
                                    l.hi)(P.j.kDb()),
                                    abortedevent: "startplay",
                                    trackid: P.j.co,
                                    prstate: P.cI(),
                                    paustate: P.j.paused.value
                                };
                                P.Sra(V, "endplay");
                                P.mB(V, c.Od.VI);
                                P.VH.Qaa && (V.eventlist_version = 1,
                                V.eventlist = P.FT.UCb(P.j));
                                P.j.pu && P.j.pu.initBitrate && (V.initvbitrate = P.j.pu.initBitrate);
                                try {
                                    Z = (0,
                                    e.G0)();
                                    Z && (V.pdltime = Z);
                                    (0,
                                    l.Qf)(V, P.j.Pf, {
                                        prefix: "sm_"
                                    });
                                } catch (fa) {}
                                P.XXa(V);
                                P.Qc.Cta(V, P.Ua);
                                V.itsxheaac = MediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.42"');
                                P.Qc.V0(V, false, P.j.oa.Cc, P.Ua);
                                P.Qc.X0(V, false, P.j.oa.Mc, P.Ua);
                                P.$Xa(V);
                                P.Qc.Kw(V, P.j.ig.value, P.j.qj.value);
                                P.bFb(P.j, V);
                                P.RS(P.j, V);
                                P.Tca(P.j, V);
                                P.cYa(V);
                                P.bYa(V);
                                P.Cy(P.j, V);
                                P.bd(y.Zd.VI, false, F.tf | F.Rl | F.hP | F.$z | F.xv, V);
                            }
                            ;
                            this.r2a = function(V, Z) {
                                V = {
                                    waittime: (0,
                                    l.hi)(V),
                                    abortedevent: "resumeplay",
                                    resumeplayreason: Z
                                };
                                P.j.pu && P.j.pu.initBitrate && (V.initvbitrate = P.j.pu.initBitrate);
                                P.Qc.Kw(V, P.j.ig.value, P.j.qj.value);
                                P.Tca(P.j, V);
                                P.Cy(P.j, V);
                                P.mB(V, c.Od.VI);
                                P.bd(y.Zd.VI, false, F.tf | F.Rl | F.xv, V);
                            }
                            ;
                            this.y6a = function(V, Z, fa) {
                                V = {
                                    newstate: Z ? "Paused" : "Playing",
                                    oldstate: V ? "Paused" : "Playing",
                                    reason: fa
                                };
                                P.SS(P.j, V);
                                P.Cy(P.j, V);
                                P.nM(P.j, V);
                                P.Qc.Kw(V, P.j.Fe.value && P.j.Fe.value.stream, P.j.gf.value && P.j.gf.value.stream);
                                P.mB(V, c.Od.xha);
                                P.bd(y.Zd.xha, false, F.tf | F.Rl, V);
                            }
                            ;
                            this.WS = function(V, Z, fa) {
                                var la, ka, sa, qa, wa;
                                V = (0,
                                l.Qf)({
                                    vdlid: P.j.ig.value.ob,
                                    playingms: V,
                                    pausedms: Z,
                                    intrplayseq: P.uM++,
                                    prstate: P.cI(),
                                    paustate: P.j.paused.value
                                }, fa);
                                P.Sra(V, "intrplay");
                                P.mB(V, c.Od.WS);
                                Z = P.j.Yc[z.l.U].value;
                                fa = P.j.Yc[z.l.V].value;
                                V.cdnid = V.vcdnid = Z && Z.id;
                                V.acdnid = fa && fa.id;
                                Z = null === (la = P.j.bk(P.j.xH).S) || undefined === la ? undefined : la.Aa;
                                V.locid = P.w1 && Z && (null === (ka = P.w1.get(Z)) || undefined === ka ? undefined : ka.c_a);
                                V.loclv = P.w1 && Z && (null === (sa = P.w1.get(Z)) || undefined === sa ? undefined : sa.wIb);
                                V.avtp = P.NV.Bl().m7a;
                                V.mediabuffered = null === (qa = P.j.ae) || undefined === qa ? undefined : qa.r0();
                                V.hidden = document.hidden;
                                V.volume = P.j.j_;
                                if (null === (wa = P.j.fb) || undefined === wa ? 0 : wa.yK)
                                    (P.XXa(V),
                                    P.Bta(V),
                                    P.$Eb(V));
                                try {
                                    (0,
                                    l.Qf)(V, P.j.Xsa(), {
                                        prefix: "vd_"
                                    });
                                } catch (na) {}
                                P.SS(P.j, V);
                                P.Cy(P.j, V);
                                P.Sca(P.j, V);
                                P.nM(P.j, V);
                                P.Qc.Kw(V, P.j.Fe.value && P.j.Fe.value.stream, P.j.gf.value && P.j.gf.value.stream);
                                P.bd(y.Zd.WS, false, F.tf | F.Rl, V);
                            }
                            ;
                            this.XN = function(V, Z, fa, la) {
                                V = {
                                    moffold: (0,
                                    l.Ms)(V),
                                    reposseq: P.nga++,
                                    prstate: P.cI(),
                                    paustate: P.j.paused.value
                                };
                                la === w.Tc.q6 && (V.reason = "missing_segments");
                                P.nM(P.j, V);
                                P.Qc.Kw(V, fa && fa.stream, Z && Z.stream);
                                P.mB(V, c.Od.XN);
                                P.bd(y.Zd.XN, false, F.tf | F.Rl, V);
                            }
                            ;
                            this.rPa = function() {
                                var V, Z, fa, la;
                                Z = P.qS(P.j.oa.Cc, P.j.qj.value.ob);
                                fa = P.qI;
                                la = null === (V = P.tZa) || undefined === V ? undefined : V.ob;
                                V = P.qS(fa, la);
                                P.bd(y.Zd.psb, false, F.tf | F.Rl, {
                                    switchdelay: (0,
                                    l.hi)(P.getTime() - P.uZa),
                                    track: Z,
                                    oldtrack: V
                                });
                            }
                            ;
                            this.qha = function(V) {
                                P.bd(y.Zd.wTb, false, F.tf | F.Rl, {
                                    speedold: Math.floor(1E3 * V.oldValue),
                                    speed: Math.floor(1E3 * V.newValue)
                                });
                            }
                            ;
                            this.R4 = function() {
                                P.bd(y.Zd.n1c, false, F.tf | F.Rl, {
                                    track: P.j.oa.yc.Bj
                                });
                            }
                            ;
                            this.yJ = function(V) {
                                var Z, fa;
                                fa = P.j.oa.yc;
                                if (V.newValue || fa && fa.dr() && !fa.Hp())
                                    (V = null !== (Z = V.newValue) && undefined !== Z ? Z : fa,
                                    Z = P.IS(V),
                                    V = P.IS(P.HZa),
                                    Z = {
                                        switchdelay: (0,
                                        l.hi)(P.getTime() - P.GZa),
                                        track: Z,
                                        oldtrack: V
                                    },
                                    P.Qc.Kw(Z, P.j.Fe.value && P.j.Fe.value.stream, P.j.gf.value && P.j.gf.value.stream),
                                    P.bd(y.Zd.aVb, false, F.tf | F.Rl, Z));
                            }
                            ;
                            this.fw = function(V) {
                                P.bd(y.Zd.jec, false, F.tf | F.Rl, V.newValue);
                            }
                            ;
                            this.vgc = function(V, Z) {
                                var fa, la;
                                fa = Z.serverid;
                                la = {
                                    locid: Z.location,
                                    loclv: Z.locationlv,
                                    selocaid: fa,
                                    selcdnid: fa,
                                    selocaname: Z.servername
                                };
                                la.mediatype = Z.mediatype;
                                la.selreason = Z.selreason || "unknown";
                                la.seldetail = Z.seldetail;
                                la.cdnbwdata = JSON.stringify([{
                                    id: fa
                                }]);
                                V && (la.oldlocid = V.c_a,
                                la.oldloclv = V.wIb,
                                la.oldocaid = V.TWc,
                                la.oldocaname = V.Zga);
                                (V = Z.manifest && Z.manifest.movieId) ? ((Z = P.j.bk(V).di) && (la.cdninfo = P.Iba(Z)),
                                la.viewableId = V) : P.log.warn("ASE is missing manifest for viewable");
                                P.bd(y.Zd.Itb, false, F.zja, la);
                            }
                            ;
                            this.Nxb = function() {
                                var V, Z, fa;
                                if (P.j.di)
                                    try {
                                        V = false;
                                        P.A8a || (V = true,
                                        P.t_ = P.t_.filter(function(la) {
                                            return !la.success;
                                        }));
                                        if (0 < P.t_.length) {
                                            Z = P.Hqa.construct(P.t_, P.j.lk.na(m.Ba));
                                            P.t_ = [];
                                            Z.erroronly = V;
                                            fa = {};
                                            (0,
                                            l.Qi)(Z, function(la, ka) {
                                                fa[la] = JSON.stringify(ka);
                                            });
                                            P.bd(y.Zd.Ooc, false, F.Rl, fa);
                                        }
                                    } catch (la) {
                                        P.log.error("Exception in dlreport.", la);
                                    }
                            }
                            ;
                            this.cI = function() {
                                var V;
                                V = P.j.bc.value;
                                return V === w.Qb.Bg ? "playing" : V === w.Qb.aj ? "paused" : V === w.Qb.Ix ? "ended" : "waiting";
                            }
                            ;
                            this.HI = function() {
                                var V, Z, fa;
                                if (P.j.state.value == w.Nc.Lf) {
                                    fa = P.wfa();
                                    P.config().i4a && (fa.avtp = P.NV.Bl().m7a,
                                    (null === (V = P.j.fb) || undefined === V ? 0 : V.yK) && P.Bta(fa));
                                    fa.mediabuffered = null === (Z = P.j.ae) || undefined === Z ? undefined : Z.r0();
                                    fa.midplayseq = P.Y_a++;
                                    fa.prstate = P.cI();
                                    fa.paustate = P.j.paused.value;
                                    P.config().MWc && P.tUb("midplay");
                                    P.config().hz && P.eYa(fa);
                                    P.aYa(fa);
                                    P.dYa(fa);
                                    P.Cy(P.j, fa);
                                    P.Qc.W0(fa);
                                    P.bd(y.Zd.HI, false, F.tf | F.Rl | F.hP | F.$z, fa);
                                }
                            }
                            ;
                            this.tUb = function(V) {
                                var Z, fa;
                                Z = {};
                                Z.trigger = V;
                                try {
                                    fa = P.j.mWa();
                                    Z.subtitleqoescore = P.j.Gr.Kzc(fa);
                                    Z.metrics = JSON.stringify(P.j.Gr.JWa(fa));
                                } catch (la) {
                                    P.log.error("error getting subtitle qoe data", la);
                                }
                                P.bd(y.Zd.g0c, false, F.tf | F.hP | F.Mx, Z);
                            }
                            ;
                            this.transition = function(V) {
                                var Z;
                                V.mediabufferedsegments = null === (Z = P.j.ae) || undefined === Z ? undefined : Z.s0();
                                P.nM(P.j, V);
                                P.Tca(P.j, V);
                                P.bd(y.Zd.transition, false, 0, V);
                            }
                            ;
                            this.e5a = function(V, Z) {
                                P.bd(y.Zd.e5a, Z, 0, V);
                            }
                            ;
                            this.MOa = function(V) {
                                P.bd(y.Zd.MOa, false, 0, V);
                            }
                            ;
                            this.vw = function(V) {
                                var Z, fa, la, ka, sa, qa, wa;
                                ka = P.wfa();
                                P.Sra(ka, "endplay");
                                ka.prstate = P.cI();
                                ka.paustate = P.j.paused.value;
                                ka.muted = P.j.muted.value;
                                ka.isStandaloneDisplay = P.config().zTb;
                                ka.hidden = document.hidden;
                                ka.volume = P.j.j_;
                                ka.fullDlreports = P.A8a;
                                ka.mediabuffered = null === (Z = P.j.ae) || undefined === Z ? undefined : Z.r0();
                                ka.mediabufferedsegments = null === (fa = P.j.ae) || undefined === fa ? undefined : fa.s0();
                                P.j.DJ && "downloaded" === P.j.DJ.N0() && (ka.trickplay_ms = P.j.mia.offset,
                                ka.trickplay_res = P.j.mia.sQb);
                                P.config().gXb && (ka.rtinfo = P.j.bzc());
                                P.config().i4a && (null === (la = P.j.fb) || undefined === la ? 0 : la.yK) && P.Bta(ka);
                                ka.endreason = V ? "error" : P.j.bc.value === w.Qb.Ix ? "ended" : "stopped";
                                (Z = P.VB) && (0,
                                l.Qf)(ka, Z, {
                                    prefix: "pi_"
                                });
                                try {
                                    (0,
                                    l.Qf)(ka, P.j.Pf, {
                                        prefix: "sm_"
                                    });
                                } catch (W) {}
                                P.j.WXa && (ka.inactivityTime = P.j.WXa);
                                Z = P.j.UVa();
                                0 < Object.keys(Z).length && (ka.mediaSessionActionHandlerCount = Z);
                                P.XXa(ka);
                                P.$Eb(ka);
                                if (P.j.Soa) {
                                    Z = P.j.Soa;
                                    fa = P.config().btb;
                                    la = P.j.loadTime;
                                    sa = {
                                        iv: fa,
                                        seg: []
                                    };
                                    qa = function(W, ia, ha) {
                                        return 0 === ia || undefined === ha[ia - 1] ? W : W - ha[ia - 1];
                                    }
                                    ;
                                    wa = Z.qdc.map(qa);
                                    qa = Z.p4c.map(qa);
                                    for (var na, oa = 0; oa < wa.length; oa++) {
                                        if (wa[oa] || qa[oa])
                                            na ? (na.ams.push(wa[oa]),
                                            na.vms.push(qa[oa])) : na = {
                                                ams: [Z.qdc[oa]],
                                                vms: [Z.p4c[oa]],
                                                soffms: Z.startTime + oa * fa - la
                                            };
                                        oa !== wa.length - 1 && wa[oa] && qa[oa] || !na || (sa.seg.push(na),
                                        na = undefined);
                                    }
                                    ka.bt = JSON.stringify(sa);
                                }
                                V && (P.$Xa(ka),
                                P.bYa(ka));
                                P.tUb("endplay");
                                P.config().hz && P.eYa(ka);
                                P.Qc.V0(ka, false, P.j.oa.Cc, P.Ua);
                                P.Qc.X0(ka, false, P.j.oa.Mc, P.Ua);
                                P.WEb(P.j, ka);
                                P.RS(P.j, ka);
                                P.SS(P.j, ka);
                                P.nM(P.j, ka, P.FOa);
                                P.Cy(P.j, ka);
                                P.Sca(P.j, ka);
                                P.Tca(P.j, ka);
                                P.aYa(ka);
                                P.dYa(ka);
                                P.Qc.W0(ka);
                                P.oCc(ka);
                                P.VEb(ka);
                                P.pCc(ka);
                                P.sCc(ka);
                                P.cYa(ka);
                                P.tCc(ka);
                                P.mB(ka, c.Od.vw);
                                P.UEb(ka);
                                P.bd(y.Zd.vw, V, F.tf | F.Mx | F.Rl | F.hP | F.$z | F.sP | F.xv, ka);
                            }
                            ;
                            this.Woc = function(V) {
                                P.t_.push(P.Hqa.hjc(V.response));
                            }
                            ;
                            this.Sj = function() {
                                P.bd(y.Zd.Vsb, false, F.tf | F.hP | F.xv, {});
                            }
                            ;
                            this.iic = function(V) {
                                var Z, fa;
                                Z = V.response.gr;
                                V = (0,
                                m.pc)(Z.Dm);
                                fa = (0,
                                m.pc)(Z.lx);
                                Z = (0,
                                q.la)(Z.uo || 0);
                                Z.EGb() || Z.MYa() || (V = new r.YJa(V,fa),
                                P.NV.uac(new u.Nbb(V,Z)));
                            }
                            ;
                            this.Lxa = function(V) {
                                var Z, fa, la;
                                la = V.newValue;
                                V.sn && V.sn.QB && la && (null === (Z = V.sn) || undefined === Z || !Z.reason) || la == P.hT || (P.y6a(P.hT, la, null === (fa = V.sn) || undefined === fa ? undefined : fa.reason),
                                P.hT = la);
                            }
                            ;
                            this.iH = function(V) {
                                function Z(fa) {
                                    var la;
                                    if (P.j.jc && P.j.jc.sourceBuffers) {
                                        la = P.j.jc.sourceBuffers.filter(function(ka) {
                                            return ka.type === fa;
                                        }).pop();
                                        if (la)
                                            return {
                                                busy: la.ak(),
                                                updating: la.updating(),
                                                ranges: la.bsa()
                                            };
                                    }
                                }
                                V = {
                                    cause: V.Jc
                                };
                                V.cause && V.cause === f.fJa && (V.mediaTime = P.j.mediaTime.value,
                                V.buf_audio = Z(g.Rka),
                                V.buf_video = Z(g.B7));
                                P.WS(P.Vha[w.Qb.Bg] || 0, P.Vha[w.Qb.aj] || 0, V);
                            }
                            ;
                            this.wVb = function(V) {
                                var Z;
                                V = V.oldValue;
                                Z = P.getTime();
                                V === w.Qb.Bh ? P.Vha = [] : P.Vha[V] = (P.Vha[V] || 0) + (Z - P.HFc);
                                P.HFc = Z;
                            }
                            ;
                            this.Fq = function(V) {
                                P.uZa = P.getTime();
                                P.qI = V.XE;
                            }
                            ;
                            this.gq = function(V) {
                                P.GZa = P.getTime();
                                P.HZa = V.YT;
                            }
                            ;
                            this.Z9 = function(V) {
                                P.tZa = V.oldValue;
                            }
                            ;
                            this.Pda = function(V) {
                                var fa;
                                function Z(la, ka) {
                                    var sa;
                                    if (!la || la.c_a !== ka.location) {
                                        sa = {
                                            c_a: ka.location,
                                            wIb: ka.locationlv,
                                            TWc: ka.serverid,
                                            Zga: ka.servername
                                        };
                                        P.vgc(la, ka);
                                        return sa;
                                    }
                                }
                                fa = V.manifest;
                                "audio" === V.mediatype ? (V = Z(P.mHb.get(fa), V)) && P.mHb.set(fa, V) : (V = Z(P.w1.get(fa), V)) && P.w1.set(fa, V);
                            }
                            ;
                            this.Xga = function(V) {
                                var Z, fa;
                                Z = V.mediatype;
                                fa = V.reason;
                                "video" === Z ? "serverswitchaway" === fa ? (P.Hm.summary.IXb++,
                                P.Hm.Kua = P.Qa.Hg.na(m.Ba)) : "serverswitchback" === fa && (P.Hm.summary.JXb++,
                                P.Hm.Kua && (P.Hm.summary.KXb.push(P.Qa.Hg.na(m.Ba) - P.Hm.Kua),
                                P.Hm.Kua = undefined)) : "audio" === Z && ("serverswitchaway" === fa ? (P.Hm.summary.Xrb++,
                                P.Hm.Bua = P.Qa.Hg.na(m.Ba)) : "serverswitchback" === fa && (P.Hm.summary.Yrb++,
                                P.Hm.Bua && (P.Hm.summary.Zrb.push(P.Qa.Hg.na(m.Ba) - P.Hm.Bua),
                                P.Hm.Bua = undefined)));
                                P.bd(y.Zd.VWc, false, F.tf | F.Rl, {
                                    mediatype: V.mediatype,
                                    server: V.server,
                                    selreason: V.reason,
                                    location: V.location,
                                    bitrate: V.bitrate,
                                    confidence: V.confidence,
                                    throughput: V.throughput,
                                    oldserver: V.oldserver
                                });
                            }
                            ;
                            this.ZY = function(V) {
                                var Z;
                                Z = V.FB;
                                V = p.__rest(V, ["type", "logblobType"]);
                                delete V.inner;
                                switch (Z) {
                                case "asereport":
                                    P.bd(y.Zd.xcc, false, F.Rl, V);
                                    break;
                                case "livereport":
                                    P.Cy(P.j, V);
                                    P.Sca(P.j, V);
                                    P.mB(V, c.Od.uI);
                                    P.bd(y.Zd.uI, false, F.tf | F.Mx, V);
                                    break;
                                default:
                                    P.bd(Z, false, F.tf, V);
                                }
                            }
                            ;
                            this.ava = function(V) {
                                var Z, fa, la, ka;
                                Z = V.mediaType;
                                fa = V.current;
                                la = V.vr;
                                ka = V.Nza;
                                V = V.ob;
                                Z = {
                                    mediatype: (0,
                                    D.FI)(Z),
                                    curr: {
                                        enc: fa.Bo,
                                        origin: fa.Ao
                                    },
                                    prev: {
                                        enc: la.Bo,
                                        origin: la.Ao
                                    },
                                    segmentnumber: ka,
                                    dlid: V
                                };
                                P.Cy(P.j, Z);
                                P.bd(y.Zd.dHc, false, F.tf, Z);
                            }
                            ;
                            this.C4 = function(V) {
                                V = Object.assign({}, V);
                                V.details && (V.details = JSON.stringify(V.details));
                                P.bd(y.Zd.f0c, true, F.tf | F.Mx | F.zja, V);
                            }
                            ;
                            this.FOa = da.C8a || da.xBa || da.NAb;
                            this.NV = M();
                            this.log = (0,
                            h.Fo)(H, "LogblobBuilder");
                            this.hT = H.paused.value;
                            this.Ia = this.Ua.Ia;
                            this.Hm = {
                                summary: {
                                    IXb: 0,
                                    JXb: 0,
                                    KXb: [],
                                    Xrb: 0,
                                    Yrb: 0,
                                    Zrb: []
                                },
                                Kua: undefined,
                                Bua: undefined
                            };
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.x7 = undefined;
                        p = a(22970);
                        c = a(45247);
                        g = a(33096);
                        f = a(13044);
                        e = a(52569);
                        h = a(31276);
                        k = a(45146);
                        l = a(3887);
                        m = a(5021);
                        n = a(36129);
                        q = a(72574);
                        r = a(74267);
                        u = a(70826);
                        v = a(22365);
                        w = a(85001);
                        x = a(32687);
                        y = a(18169);
                        A = a(32573);
                        z = a(26388);
                        B = a(30873);
                        C = a(79542);
                        D = a(45247);
                        E = a(82100);
                        G = a(24735);
                        d.prototype.bFb = function(H, J) {
                            var M, K, L, O, I, N, Q, S, T, U, X, Y, da, ba, aa, ca, ea;
                            if (this.config().hz)
                                try {
                                    M = {};
                                    K = this.yg.getStats(undefined, undefined, H.R);
                                    L = H.oS();
                                    O = K.KV.uic || [];
                                    M.attempts = K.iya || 0;
                                    M.num_completed_tasks = O.length;
                                    I = this.hg.Tsc;
                                    N = {};
                                    Q = A.Yr.D4;
                                    S = A.Yr.pd;
                                    T = A.Yr.hQa;
                                    K.zp && (N.scheduled = K.zp - L);
                                    U = H.S;
                                    U && (0,
                                    x.wc)(U.WU) && (N.preauthsent = U.WU - H.loadTime,
                                    N.preauthreceived = U.F3 - H.loadTime);
                                    X = O.filter(function(R) {
                                        return "manifest" === R.type;
                                    });
                                    M.mf_succ = X.filter(I("status", Q)).length;
                                    M.mf_fail = X.filter(I("status", S)).length;
                                    Y = H.Pf;
                                    (0,
                                    x.gd)(Y.lg) && 0 > Y.lg && H.loadTime && (N.ldlsent = Y.lc,
                                    N.ldlreceived = Y.lr);
                                    da = O.filter(function(R) {
                                        return "license" === R.type;
                                    });
                                    M.ldl_succ = da.filter(I("status", Q)).length;
                                    M.ldl_fail = da.filter(I("status", S)).length;
                                    K = true;
                                    L = [];
                                    "notcached" === H.gR && (K = false,
                                    L.push("Missing cached manifest"));
                                    this.config().Wqa || (K = false,
                                    L.push("LDL prefetch disabled"));
                                    ba = da.filter(I("status", T)).length;
                                    this.config().Wqa && 0 === ba && (!N.ldlreceived || 0 <= N.ldlreceived) && (K = false,
                                    L.push("LDL received after start"));
                                    if (this.config().Yqa)
                                        if (J.isPrefetchItem) {
                                            aa = J.prefetchedAudioMs / J.bcABufferLevelMs;
                                            if (1 > J.prefetchedVideoMs / J.bcVBufferLevelMs || 1 > aa)
                                                (K = false,
                                                L.push("Insufficient media fetched"));
                                        } else
                                            (K = false,
                                            L.push("aseStats not initialized"));
                                    ca = O.filter(function(R) {
                                        return "getHeaders" === R.type;
                                    });
                                    M.header_succ = ca.filter(I("status", Q)).length;
                                    M.header_fail = ca.filter(I("status", S)).length;
                                    ea = O.filter(function(R) {
                                        return "getMedia" === R.type;
                                    });
                                    M.media_succ = ea.filter(I("status", Q)).length;
                                    M.media_fail = ea.filter(I("status", S)).length;
                                    M.hm_succ = M.header_succ + M.media_succ;
                                    M.hm_fail = M.header_fail + M.media_fail;
                                    (0,
                                    l.Qf)(J, M, {
                                        prefix: "pr_"
                                    });
                                    this.VH.Qaa && (J.eventlist_version = 1,
                                    J.eventlist = this.FT.UCb(H));
                                    (J.prefetchCompleted = K) || (J.prefetchFailed = L,
                                    (0,
                                    l.Qf)(J, N, {
                                        prefix: "pe_"
                                    }));
                                    this.eYa(J);
                                } catch (R) {
                                    this.log.warn("error in collecting video prepare data", R);
                                }
                        }
                        ;
                        d.prototype.$Wa = function(H, J) {
                            return H ? {
                                id: H.trackId,
                                downloadableId: J,
                                rank: H.Gc
                            } : {};
                        }
                        ;
                        d.prototype.qS = function(H, J) {
                            return H ? {
                                id: H.trackId,
                                trackId: H.trackId,
                                bcp47: H.oh,
                                downloadableId: J,
                                rank: H.Gc,
                                chan: H.channels
                            } : {};
                        }
                        ;
                        d.prototype.IS = function(H) {
                            return H ? {
                                id: H.trackId,
                                trackId: H.trackId,
                                bcp47: H.oh,
                                downloadableId: H.ob,
                                rank: H.Gc,
                                isImageBased: H.cr,
                                profile: H.profile
                            } : {};
                        }
                        ;
                        d.prototype.kzc = function(H, J) {
                            if (H = H.Jba())
                                if (J = H[J])
                                    return J.Va;
                        }
                        ;
                        d.prototype.WEb = function(H, J) {
                            H.qb.bh && (J.isBranching = true);
                        }
                        ;
                        d.prototype.RS = function(H, J) {
                            J.cachedManifest = H.gR;
                            J.cachedLicense = H.qZ.source;
                            J.usedldl = this.config().Wqa ? (H.qZ.type === G.Tr.dK).toString() : "not_capable";
                        }
                        ;
                        d.prototype.SS = function(H, J) {
                            var M, K;
                            if (this.config().rCc) {
                                M = H.nWa();
                                K = H.ga.S;
                                M && K && (J.segment = M,
                                K = H.bM(),
                                J.segmenttime = K,
                                H = this.kzc(H, M),
                                null !== K && undefined !== H && (J.segmentoffset = K - H));
                            }
                        }
                        ;
                        d.prototype.nM = function(H, J, M) {
                            J.pxid = H.Le;
                            (undefined === M ? 0 : M) && (J.playgraph_trace = H.$Nb);
                        }
                        ;
                        d.prototype.Tca = function(H, J) {
                            var M, K;
                            K = [];
                            H.j1() && K.push("ux");
                            H.bta() && K.push("content");
                            H.Gw() && K.push("ads");
                            (null === (M = this.j.S) || undefined === M ? 0 : M.Aa.Bs) && K.push("choiceMap");
                            J.playgraphTypes = K;
                        }
                        ;
                        d.prototype.mCc = function(H, J) {
                            var M, K, L;
                            M = new Set();
                            H.j1() && H.RDb().forEach(function(O) {
                                O != H.bg && M.add(O);
                            });
                            if (H.bta()) {
                                K = H.xH;
                                L = H.S.Aa.RD.Z;
                                Object.keys(L.ba).map(function(O) {
                                    return L.ba[O].J;
                                }).filter(function(O, I, N) {
                                    return O !== K && N.indexOf(O) === I;
                                }).forEach(function(O) {
                                    return M.add(O);
                                });
                            }
                            0 < M.size && (J.auxViewables = [].concat(Ba(M)));
                        }
                        ;
                        d.prototype.$Eb = function(H) {
                            var J, M;
                            J = this.j.zgd;
                            M = J && J.nUc;
                            J && J.OBc && (H.htwbr = J.OBc,
                            H.pbtwbr = J.hkd,
                            H.hptwbr = J.Hgd);
                            J && J.AVc && (H.rr = J.AVc,
                            H.ra = J.Ikd);
                            J && M && 0 < (M.length || 0) && (H.qe = JSON.stringify(M));
                        }
                        ;
                        d.prototype.$Xa = function(H) {
                            var J, M, K;
                            try {
                                J = this.hg.createElement("canvas");
                                M = J.getContext("webgl") || J.getContext("experimental-webgl");
                                if (M) {
                                    K = M.getExtension("WEBGL_debug_renderer_info");
                                    K && (H.WebGLRenderer = M.getParameter(K.UNMASKED_RENDERER_WEBGL),
                                    H.WebGLVendor = M.getParameter(K.UNMASKED_VENDOR_WEBGL));
                                }
                            } catch (L) {}
                        }
                        ;
                        d.prototype.sCc = function(H) {
                            H.switchAwaySummary = {
                                vsa: this.Hm.summary.IXb,
                                vsb: this.Hm.summary.JXb,
                                vsbt: this.Hm.summary.KXb,
                                asa: this.Hm.summary.Xrb,
                                asb: this.Hm.summary.Yrb,
                                asbt: this.Hm.summary.Zrb
                            };
                        }
                        ;
                        d.prototype.n8b = function(H) {
                            var J;
                            J = [];
                            return H ? Object.keys(H).map(function(M) {
                                return +M;
                            }) : J;
                        }
                        ;
                        d.prototype.yo = function() {
                            var H, J;
                            H = this;
                            if (this.j.Jz && this.j.ul) {
                                J = [];
                                this.j.Jz.concat(this.j.ul).forEach(function(M) {
                                    M.streams.forEach(function(K) {
                                        J.push({
                                            dlid: K.ob,
                                            type: K.type,
                                            bitrate: K.bitrate,
                                            vmaf: K.Wb,
                                            cdn_ids: H.n8b(K.KSa)
                                        });
                                    });
                                });
                                return JSON.stringify(J);
                            }
                        }
                        ;
                        d.prototype.ugc = function() {
                            var J, M, K;
                            function H(L, O) {
                                var I, N, Q;
                                I = L.cdnId + "$" + L.correlationId;
                                N = K[I];
                                N || (N = {
                                    cdnid: L.cdnId,
                                    pbcid: L.correlationId,
                                    dls: []
                                },
                                K[I] = N,
                                M.push(N));
                                (0,
                                k.l_)(L.bitrate);
                                (0,
                                k.l_)(L.duration);
                                I = {
                                    bitrate: L.bitrate,
                                    tm: (0,
                                    v.Tt)(L.duration)
                                };
                                Q = L.vmaf;
                                Q && ((0,
                                k.l_)(L.vmaf),
                                I.vf = Q);
                                I[O] = (0,
                                l.wm)(L.downloadableId);
                                N.dls.push(I);
                            }
                            J = this.j.Rp.kvc();
                            M = [];
                            K = {};
                            J.audio.forEach(function(L) {
                                H(L, "adlid");
                            });
                            J.video.forEach(function(L) {
                                H(L, "dlid");
                            });
                            return JSON.stringify(M);
                        }
                        ;
                        d.prototype.wfa = function() {
                            var H, J, M, K, L, O, I, N, Q, S, T, U, X, Y, da, ba, aa;
                            M = this.j.Rp;
                            K = {
                                totaltime: (0,
                                l.Ms)(M.Iu("content")),
                                totalcontenttime: (0,
                                l.Ms)(M.tca("content")),
                                totaladtime: (0,
                                l.Ms)(M.Iu("ads")),
                                totalothertime: (0,
                                l.Ms)(M.Iu("other")),
                                cdndldist: this.ugc(),
                                reposcount: this.nga,
                                intrplaycount: this.uM
                            };
                            try {
                                L = {
                                    numskip: 0,
                                    numlowqual: 0
                                };
                                O = this.j.ae;
                                I = O.YA();
                                (0,
                                x.wc)(I) && (K.totfr = I,
                                L.numren = I);
                                I = O.vS();
                                (0,
                                x.wc)(I) && (K.totdfr = I,
                                L.numrendrop = I);
                                I = O.Nba();
                                (0,
                                x.wc)(I) && (K.totcfr = I,
                                L.numrenerr = I);
                                K.playqualvideo = JSON.stringify(L);
                                N = this.j.ig.value;
                                N && (K.videofr = N.framerate.toFixed(3));
                                Q = M.WUa();
                                Q && (K.abrdel = Q);
                                S = M.lta() && M.qBb();
                                S && (K.tw_vmaf = S);
                                T = M.oBb();
                                T && (0,
                                l.Qf)(K, T);
                                K.rbfrs = this.uM;
                                K.maxbitrate = this.maxBitrate;
                                K.maxresheight = this.yJb;
                                U = this.j.fM();
                                for (M = 0; M < U.length; M++) {
                                    X = U[M];
                                    Y = this.Ua.c2.nJ(X);
                                    if (Y) {
                                        (0,
                                        k.ta)(da);
                                        K.maxbitrate = da ? da.bitrate : 0;
                                        K.maxresheight = da ? da.height : 0;
                                        K.bitratefilters = Y.join("|");
                                        break;
                                    }
                                    da = X;
                                }
                                this.j.DJ && (K.trickplay = this.j.DJ.N0());
                                null !== this.j.Gr.Esb && (K.avg_subt_delay = this.j.Gr.Esb);
                                ba = null === (H = this.j.ae) || undefined === H ? undefined : H.bWb;
                                ba && 0 < ba && (K.unexpectedrewindcount = ba);
                                aa = null === (J = this.j.ae) || undefined === J ? undefined : J.wXb.XAb;
                                aa && 0 < aa.length && (K.frozenFrames = aa);
                            } catch (ca) {
                                this.log.error("Exception reading some of the endplay fields", ca);
                            }
                            (0,
                            l.Qf)(K, this.j.Xsa(), {
                                prefix: "vd_"
                            });
                            return K;
                        }
                        ;
                        d.prototype.getTime = function() {
                            return this.$a.Fc().na(m.Ba);
                        }
                        ;
                        d.prototype.AWa = function() {
                            return this.getTime() - this.Ua.lk.na(m.Ba);
                        }
                        ;
                        d.prototype.eYa = function(H) {
                            var J;
                            try {
                                J = this.yg.getStats();
                                H.pr_cache_size = JSON.stringify(J.cache);
                                H.pr_stats = JSON.stringify(J.zuc);
                            } catch (M) {}
                        }
                        ;
                        d.prototype.aYa = function(H) {
                            this.log.debug("httpstats", this.Je.stats);
                            (0,
                            l.Qf)(H, this.Je.stats, {
                                prefix: "http_"
                            });
                        }
                        ;
                        d.prototype.Cy = function(H, J) {
                            H = H.Hc;
                            H.Da && (J.intenttoplayatedge = H.Ku(),
                            H = H.aM(),
                            J.livestage = this.sxc(H));
                        }
                        ;
                        d.prototype.Sca = function(H, J) {
                            var M;
                            M = H.Hc;
                            H.fb && M.Da && [{
                                mediaType: z.l.V,
                                wra: "aencodingpipeline"
                            }, {
                                mediaType: z.l.U,
                                wra: "vencodingpipeline"
                            }, {
                                mediaType: z.l.Ea,
                                wra: "tencodingpipeline"
                            }, {
                                mediaType: z.l.yk,
                                wra: "mencodingpipeline"
                            }].forEach(function(K) {
                                var L;
                                L = H.fb.EB[K.mediaType];
                                if (L.Bo || L.Ao)
                                    J[K.wra] = {
                                        enc: L.Bo,
                                        origin: L.Ao
                                    };
                            });
                        }
                        ;
                        d.prototype.sxc = function(H) {
                            switch (H) {
                            case B.Kx.c8:
                            case B.Kx.Ika:
                            case B.Kx.FEa:
                                return H.toLowerCase();
                            default:
                                return (0,
                                C.MH)(H);
                            }
                        }
                        ;
                        d.prototype.XXa = function(H) {
                            var J, M, K;
                            J = this.config().Vwb && !(this.Ia % this.config().Vwb);
                            M = this.j.fb;
                            K = null === M || undefined === M ? undefined : M.Ck;
                            J && K && (H.ASEstats = JSON.stringify(M.IFb()));
                        }
                        ;
                        d.prototype.Bta = function(H) {
                            Object.assign(H, this.j.fb.$c.Szc());
                        }
                        ;
                        d.prototype.dYa = function(H) {
                            var J;
                            try {
                                J = v.$C.memory;
                                (0,
                                x.CGb)(J) && (H.totalJSHeapSize = J.totalJSHeapSize,
                                H.usedJSHeapSize = J.usedJSHeapSize,
                                H.jsHeapSizeLimit = J.jsHeapSizeLimit);
                            } catch (M) {}
                        }
                        ;
                        d.prototype.VEb = function(H) {
                            var J;
                            try {
                                if (this.config().B$) {
                                    J = this.j.tvc();
                                    H.battery = J;
                                    this.log.trace("batterystatuses", J);
                                }
                            } catch (M) {}
                        }
                        ;
                        d.prototype.oCc = function(H) {
                            this.j.eqa && (H.dqec = this.j.eqa);
                        }
                        ;
                        d.prototype.cYa = function(H) {
                            var J, M, K;
                            (null === (J = this.j.hm) || undefined === J ? 0 : J.jxc) ? H.keySystem = this.j.hm.Wy.Oy : (null === (K = null === (M = this.j.hm) || undefined === M ? undefined : M.mediaKeys) || undefined === K ? 0 : K.keySystem) ? H.keySystem = this.j.hm.mediaKeys.keySystem : this.PE.bHb && (H.keySystem = this.PE.bHb);
                            H.keySystem && (H.keysys = H.keySystem);
                            this.PE.gHb && (H.keySystemStatuses = this.cIc(this.PE.gHb));
                            this.PE.Iva && (H.keySystemMediaKeysCount = this.PE.Iva);
                            0 < this.EE.eHb.length && (H.keySystemRestrictions = this.EE.eHb);
                            0 < Object.keys(this.EE.fHb).length && (H.keySystemRestrictionsDebug = this.EE.fHb);
                            0 < Object.keys(this.EE.dHb).length && (H.keySystemRestrictionReasons = this.EE.dHb);
                            H.useEncryptedEvent = this.config().z8a;
                        }
                        ;
                        d.prototype.cIc = function(H) {
                            var J;
                            J = this;
                            return H.reduce(function(M, K) {
                                var L;
                                L = (0,
                                E.bvb)(K.Aua);
                                M[L] = J.gIc(K.status);
                                return M;
                            }, {});
                        }
                        ;
                        d.prototype.gIc = function(H) {
                            return H.supported ? true : H.reason;
                        }
                        ;
                        d.prototype.bYa = function(H) {
                            var J;
                            if (null === (J = this.j.hm) || undefined === J ? 0 : J.kCb)
                                H.keystatus = this.j.hm.qZa;
                        }
                        ;
                        d.prototype.pCc = function(H) {
                            this.QTa && (H.externaldisplay = this.QTa.Y_);
                        }
                        ;
                        d.prototype.tCc = function(H) {
                            H.didHydrateTracks = this.j.Aqa;
                        }
                        ;
                        d.prototype.xFc = function() {
                            undefined === this.QTa && (this.QTa = this.RTa.Nsc());
                        }
                        ;
                        d.prototype.Sra = function(H, J) {
                            (J = this.j.B0(J)) && Object.entries(J).forEach(function(M) {
                                var K;
                                K = Fa(M);
                                M = K.next().value;
                                K = K.next().value;
                                H[M] = K;
                            });
                        }
                        ;
                        d.prototype.mB = function(H, J) {
                            var M;
                            (J = null === (M = this.j.fb) || undefined === M ? undefined : M.xsa(undefined, J)) && Object.entries(J).forEach(function(K) {
                                var L;
                                L = Fa(K);
                                K = L.next().value;
                                L = L.next().value;
                                H[K] = L;
                            });
                        }
                        ;
                        d.prototype.UEb = function(H) {
                            var J, M, K, L, O;
                            K = String.fromCharCode.apply(String, [97, 100, 118, 101, 114, 116, 115]);
                            L = !JSON.parse('{"result": { "' + K + '": {}}}').result[K];
                            O = String.fromCharCode.apply(String, [100, 97, 105, 83, 117, 112, 112, 111, 114, 116, 101, 100]);
                            K = !(null === (M = null === (J = JSON.parse('{"result": { "' + K + '": {"' + O + '": true}}}').result) || undefined === J ? undefined : J[K]) || undefined === M ? 0 : M[O]);
                            H.ab1 = L;
                            H.ab2 = K;
                            H.ab = L || K;
                        }
                        ;
                        d.prototype.bd = function(H, J, M, K) {
                            var L, O;
                            O = K.sev;
                            O = J ? "error" : null !== O && undefined !== O ? O : "info";
                            J && this.j.$j && (0,
                            n.hka)(this.j.$j.errorCode, this.j.$j.Ya, this.AWa(), null === (L = this.j.ae) || undefined === L ? undefined : L.YA()) && (O = "info");
                            this.j.vI.zHc(H) || (this.rOa(K, this.j, J, M),
                            H = this.wI.tu(H, O, K, this.Ua),
                            this.ki.bd(H));
                        }
                        ;
                        d.prototype.nCc = function(H, J) {
                            var M, K;
                            K = null === (M = J.fb) || undefined === M ? undefined : M.Bwb;
                            K && (null === K || undefined === K ? undefined : K.J) !== J.xH && (H.auxMid || (H.auxMid = K.J),
                            H.auxPlaybackcontextid || (H.auxPlaybackcontextid = J.bk(K.J).de));
                        }
                        ;
                        d.prototype.rOa = function(H, J, M, K) {
                            var L, O, I, N, Q, S, T;
                            this.Qc.XEb(H, J);
                            this.nCc(H, J);
                            K & F.tf && ((0,
                            k.ta)(!H || undefined === H.moff),
                            this.Qc.aFb(H, J.ga, J.bta()));
                            K & F.Mx && this.Qc.cFb(H, J);
                            K & F.Rl && (null === (L = J.fb) || undefined === L ? 0 : L.Ck) && (H.abuflbytes = null !== (O = H.abuflbytes) && undefined !== O ? O : J.lPa(),
                            H.abuflmsec = null !== (I = H.abuflmsec) && undefined !== I ? I : J.U9(),
                            H.vbuflbytes = null !== (N = H.vbuflbytes) && undefined !== N ? N : J.N8a(),
                            H.vbuflmsec = null !== (Q = H.vbuflmsec) && undefined !== Q ? Q : J.Iia(),
                            H.tbuflbytes = null !== (S = H.tbuflbytes) && undefined !== S ? S : J.T0c(),
                            H.tbuflmsec = null !== (T = H.tbuflmsec) && undefined !== T ? T : J.U0c());
                            K & F.$z && this.Qc.dFb(H, J.nv);
                            K & F.hP && (L = v.Lg.hardwareConcurrency,
                            0 <= L && (H.numcores = L),
                            L = this.Ua.QSa) && (O = L.XUa(),
                            H.droppedFrames = JSON.stringify(O),
                            L = L.gca(this.config().ppc),
                            (0,
                            l.Qi)(L, function(U, X) {
                                H["droppedFramesP" + U] = JSON.stringify(X);
                            }));
                            if (K & F.zja)
                                try {
                                    J.di && undefined === H.cdninfo && (H.cdninfo = this.Iba(J.di));
                                } catch (U) {}
                            M && K & F.sP && ((0,
                            k.ta)(J.$j),
                            this.Qc.ZEb(H, J, J.$j));
                            K & F.xv && this.Qc.ZXa(H);
                        }
                        ;
                        d.prototype.Iba = function(H) {
                            return JSON.stringify(H.map(function(J) {
                                return {
                                    id: J.id,
                                    nm: J.name,
                                    rk: J.Gc,
                                    wt: J.location.weight,
                                    lv: J.location.level
                                };
                            }));
                        }
                        ;
                        Ha.Object.defineProperties(d.prototype, {
                            A8a: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.j.KL || this.j.A_;
                                }
                            }
                        });
                        b.x7 = d;
                        (function(H) {
                            H[H.tf = 1] = "MOFF";
                            H[H.Mx = 2] = "PRESENTEDSTREAMS";
                            H[H.Rl = 4] = "BUFFER";
                            H[H.$z = 8] = "SCREEN";
                            H[H.hP = 16] = "CPU";
                            H[H.zja = 32] = "CDN";
                            H[H.sP = 64] = "FATALERROR";
                            H[H.xv = 128] = "BROWSERINFO";
                        }
                        )(F || (F = {}));
                    }
