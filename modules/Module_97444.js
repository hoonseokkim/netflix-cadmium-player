/**
 * @module Module_97444
 * @description Class module with ES module exports
 * @categories DRM, Media, ABR, Manifest, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 97444
 * Deobfuscated size: 19584 chars
 * Functions: 34
 * Prototype definitions: 10
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 97444
{
                        var p, c, g, f, e, h, k;
                        function d(l, m, n, q, r, u) {
                            var v;
                            v = this;
                            this.wI = m;
                            this.ki = n;
                            this.$a = q;
                            this.Qc = r;
                            this.Y_a = this.uM = this.nga = 0;
                            this.hT = false;
                            this.HI = function() {
                                var w;
                                w = v.wfa();
                                w.prstate = v.cI();
                                w.paustate = v.j.qda();
                                w.midplayseq = v.Y_a++;
                                v.Qc.W0(w);
                                v.bd(p.Zd.HI, undefined, k.tf | k.$z, w);
                            }
                            ;
                            this.Sj = function() {
                                v.bd(p.Zd.Vsb, undefined, k.tf | k.xv, {});
                            }
                            ;
                            this.gq = function(w) {
                                v.GZa = v.getTime();
                                v.HZa = w.YT;
                            }
                            ;
                            this.Z9 = function(w) {
                                v.tZa = w.oldValue;
                            }
                            ;
                            this.Lxa = function(w) {
                                w != v.hT && (v.y6a(v.hT, w),
                                v.hT = w);
                            }
                            ;
                            this.y6a = function(w, x) {
                                var y;
                                y = v.j.Ua;
                                w = {
                                    newstate: x ? "Paused" : "Playing",
                                    oldstate: w ? "Paused" : "Playing"
                                };
                                v.Qc.Kw(w, y.Fe.value && y.Fe.value.stream, y.gf.value && y.gf.value.stream);
                                v.bd(p.Zd.xha, undefined, k.tf, w);
                            }
                            ;
                            this.qha = function(w) {
                                v.bd(p.Zd.wTb, undefined, k.tf, {
                                    speedold: Math.floor(1E3 * w.oldValue),
                                    speed: Math.floor(1E3 * w.newValue)
                                });
                            }
                            ;
                            this.yJ = function(w) {
                                var x, y, A;
                                y = v.j.Ua;
                                A = y.oa.yc;
                                if (w.newValue || A && A.dr() && !A.Hp())
                                    (w = null !== (x = w.newValue) && undefined !== x ? x : A,
                                    x = v.IS(w),
                                    w = v.IS(v.HZa),
                                    x = {
                                        switchdelay: (0,
                                        c.hi)(v.getTime() - v.GZa),
                                        track: x,
                                        oldtrack: w
                                    },
                                    v.Qc.Kw(x, y.Fe.value && y.Fe.value.stream, y.gf.value && y.gf.value.stream),
                                    v.bd(p.Zd.aVb, undefined, k.tf, x));
                            }
                            ;
                            this.r2a = function(w, x) {
                                var y;
                                y = v.j.Ua;
                                w = {
                                    waittime: (0,
                                    c.hi)(w),
                                    abortedevent: "resumeplay",
                                    resumeplayreason: x
                                };
                                v.Qc.Kw(w, y.ig.value, y.qj.value);
                                v.bd(p.Zd.VI, undefined, k.tf | k.xv, w);
                            }
                            ;
                            this.mv = function(w, x, y) {
                                var A;
                                A = y.F4a;
                                y = y.kQb;
                                w = {
                                    playdelay: (0,
                                    c.hi)(w),
                                    reason: A,
                                    intrplayseq: v.uM - 1,
                                    skipped: x
                                };
                                "repos" === A && (w.prstate = true === v.j.mk.value ? "playing" : "paused",
                                y === e.Tc.q6 && (w.repos_reason = "missing_segments"));
                                v.bd(p.Zd.mv, undefined, k.tf | k.Mx, w);
                            }
                            ;
                            this.rPa = function() {
                                var w, x, y, A;
                                x = v.qS(v.j.Ua.oa.Cc, v.j.Ua.qj.value.ob);
                                y = v.qI;
                                A = null === (w = v.tZa) || undefined === w ? undefined : w.ob;
                                w = v.qS(y, A);
                                v.bd(p.Zd.psb, undefined, k.tf, {
                                    switchdelay: (0,
                                    c.hi)(v.getTime() - v.uZa),
                                    track: x,
                                    oldtrack: w
                                });
                            }
                            ;
                            this.Fq = function(w) {
                                v.uZa = v.getTime();
                                v.qI = w.XE;
                            }
                            ;
                            this.s2a = function() {
                                var w, x, y;
                                w = v.j.Ua;
                                x = {
                                    abortedevent: "startplay",
                                    trackid: w.co,
                                    prstate: v.cI(),
                                    paustate: v.j.qda()
                                };
                                try {
                                    y = (0,
                                    g.G0)();
                                    y && (x.pdltime = y);
                                    (0,
                                    c.Qf)(x, w.Pf, {
                                        prefix: "sm_"
                                    });
                                } catch (A) {}
                                v.Qc.Cta(x, w);
                                v.Qc.V0(x, false, w.oa.Cc, w);
                                v.Qc.X0(x, false, w.oa.Mc, w);
                                v.Qc.Kw(x, w.ig.value, w.qj.value);
                                v.RS(x);
                                v.bd(p.Zd.VI, undefined, k.tf | k.$z | k.xv, x);
                            }
                            ;
                            this.qH = function(w, x, y, A) {
                                w = {
                                    moff: (0,
                                    c.Ms)(y),
                                    moffms: (0,
                                    c.hi)(y),
                                    vbitrate: x.bitrate,
                                    vbitrateold: w.bitrate,
                                    vdlid: x.ob,
                                    vdlidold: w.ob,
                                    vheight: x.height,
                                    vheightold: w.height,
                                    vwidth: x.width,
                                    vwidthold: w.width,
                                    bw: A
                                };
                                v.bd(p.Zd.qH, undefined, 0, w);
                            }
                            ;
                            this.XN = function(w, x, y) {
                                w = {
                                    moffold: (0,
                                    c.Ms)(w),
                                    reposseq: v.nga++,
                                    prstate: v.cI(),
                                    paustate: v.j.qda()
                                };
                                v.Qc.Kw(w, y && y.stream, x && x.stream);
                                v.bd(p.Zd.XN, undefined, k.tf, w);
                            }
                            ;
                            this.aq = function(w) {
                                var x, y, A, z, B, C, D, E, G;
                                C = w.Ua;
                                D = {
                                    playdelaysdk: (0,
                                    c.hi)(v.j.x$()),
                                    applicationPlaydelay: (0,
                                    c.hi)(v.j.ZPa()),
                                    playdelay: (0,
                                    c.hi)(v.j.$Pa()),
                                    trackid: C.co,
                                    bookmark: (0,
                                    c.hi)(C.Hq || 0),
                                    pbnum: C.index
                                };
                                D.audiotrackinfo = v.qS(v.j.Ua.oa.Cc, v.j.Ua.gf.value ? v.j.Ua.gf.value.stream ? v.j.Ua.gf.value.stream.ob : undefined : undefined);
                                E = v.j.Ua.oa.Mc;
                                G = null === (y = null === (x = v.j.Ua.Fe.value) || undefined === x ? undefined : x.stream) || undefined === y ? undefined : y.ob;
                                D.videotrackinfo = v.$Wa(E, G);
                                D.texttrackinfo = v.IS(v.j.Ua.oa.yc);
                                v.j.Sj && (D.blocked = v.j.Sj);
                                D.initvbitrate = v.j.Vca;
                                v.Qc.ZXa(D);
                                v.Qc.YEb(D);
                                D.esnSource = null === (A = Da._cad_global.device) || undefined === A ? undefined : A.ira;
                                v.eFb(D, C);
                                D.pdltime = (0,
                                g.G0)();
                                (0,
                                c.Qf)(D, C.Pf, {
                                    prefix: "sm_"
                                });
                                D.ttTrackFields = null === (z = C.oa.yc) || undefined === z ? undefined : z.Bj;
                                D.itsxheaac = MediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.42"');
                                v.Qc.V0(D, true, C.oa.Cc, C);
                                v.Qc.X0(D, true, C.oa.Mc, C);
                                D.packageId = null === (B = C.S) || undefined === B ? undefined : B.Aa.jt;
                                v.Qc.W0(D);
                                v.Qc.Cta(D, C);
                                v.RS(D);
                                v.bd(p.Zd.aq, w.$j, k.tf | k.Mx | k.$z | k.sP | k.xv, D);
                            }
                            ;
                            this.vw = function() {
                                var w, x, y;
                                w = v.j;
                                x = w.Ua;
                                w = w.$j;
                                y = v.wfa();
                                y.paustate = !v.j.Ky();
                                y.muted = v.j.KYa();
                                y.endreason = w ? "error" : v.j.AYa() ? "ended" : "stopped";
                                v.Qc.V0(y, false, x.oa.Cc, x);
                                v.Qc.X0(y, false, x.oa.Mc, x);
                                v.Qc.W0(y);
                                v.RS(y);
                                v.bd(p.Zd.vw, w, k.tf | k.Mx | k.$z | k.sP | k.xv, y);
                            }
                            ;
                            this.Z3a = function(w, x, y) {
                                var A;
                                A = v.j.Ua.gf;
                                w = {
                                    moff: (0,
                                    c.Ms)(y),
                                    moffms: (0,
                                    c.hi)(y),
                                    vdlidold: w.ob,
                                    vbitrateold: w.bitrate
                                };
                                v.Qc.Kw(w, x, A.value && A.value.stream);
                                v.bd(p.Zd.hga, undefined, 0, w);
                            }
                            ;
                            this.cI = function() {
                                var w;
                                w = v.j.bc.value;
                                return w === e.Qb.Bg ? "playing" : w === e.Qb.aj ? "paused" : w === e.Qb.Ix ? "ended" : "waiting";
                            }
                            ;
                            this.va = l.zb("LogblobBuilderImpl");
                            this.j = u;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.x7 = undefined;
                        p = a(18169);
                        c = a(3887);
                        g = a(52569);
                        f = a(36129);
                        e = a(85001);
                        h = a(5021);
                        d.prototype.getTime = function() {
                            return this.$a.Fc().na(h.Ba);
                        }
                        ;
                        d.prototype.AWa = function() {
                            return this.getTime() - this.j.Ua.lk.na(h.Ba);
                        }
                        ;
                        d.prototype.qS = function(l, m) {
                            return l ? {
                                trackId: l.trackId,
                                bcp47: l.oh,
                                downloadableId: m,
                                rank: l.Gc,
                                chan: l.channels
                            } : {};
                        }
                        ;
                        d.prototype.$Wa = function(l, m) {
                            return l ? {
                                id: l.trackId,
                                downloadableId: m,
                                rank: l.Gc
                            } : {};
                        }
                        ;
                        d.prototype.IS = function(l) {
                            return l ? {
                                trackId: l.trackId,
                                bcp47: l.oh,
                                downloadableId: l.ob,
                                rank: l.Gc,
                                isImageBased: l.cr,
                                profile: l.profile
                            } : {};
                        }
                        ;
                        d.prototype.eFb = function(l, m) {
                            var n;
                            if (m = null === (n = m.oa.Mc) || undefined === n ? undefined : n.streams)
                                (l.maxbitrate = (0,
                                g.kja)(m.map(function(q) {
                                    return q.bitrate;
                                })),
                                l.maxresheight = (0,
                                g.kja)(m.map(function(q) {
                                    return q.height;
                                })));
                        }
                        ;
                        d.prototype.RS = function(l) {
                            l.cachedManifest = "notcached";
                            l.cachedLicense = "notcached";
                            l.usedldl = "false";
                        }
                        ;
                        d.prototype.wfa = function() {
                            var l, m, n, q;
                            l = this.j.Ua;
                            m = l.Rp;
                            n = {
                                totaltime: (0,
                                c.Ms)(m.Iu()),
                                totalcontenttime: (0,
                                c.Ms)(m.tca()),
                                reposcount: this.nga,
                                intrplaycount: this.uM
                            };
                            n.playqualvideo = JSON.stringify({
                                numskip: 0,
                                numlowqual: 0
                            });
                            q = l.ig.value;
                            q && (n.videofr = q.framerate.toFixed(3));
                            (q = m.WUa()) && (n.abrdel = q);
                            (q = m.lta() && m.qBb()) && (n.tw_vmaf = q);
                            (m = m.oBb()) && (0,
                            c.Qf)(n, m);
                            n.rbfrs = this.uM;
                            this.eFb(n, l);
                            return n;
                        }
                        ;
                        d.prototype.bd = function(l, m, n, q) {
                            var r, u, v;
                            r = this;
                            m && (0,
                            f.hka)(null === m || undefined === m ? undefined : m.errorCode, null === m || undefined === m ? undefined : m.Ya, this.AWa(), undefined) && (u = "info");
                            v = this.j.Ua;
                            this.rOa(q, m, n);
                            m = u || (m ? "error" : "info");
                            q = this.wI.tu(l, m, q, v);
                            this.ki.bd(q);
                            "error" !== m && l !== p.Zd.vw || this.ki.flush(false).catch(function() {
                                r.va.debug("Failed to flush the logblobs");
                            });
                        }
                        ;
                        d.prototype.rOa = function(l, m, n) {
                            var q;
                            q = this.j.Ua;
                            this.Qc.XEb(l, q);
                            n & k.tf && this.Qc.aFb(l, q, false);
                            n & k.Mx && this.Qc.cFb(l, q);
                            n & k.$z && this.Qc.dFb(l, this.j.Vq());
                            m && n & k.sP && this.Qc.ZEb(l, q, m);
                            n & k.xv && this.Qc.ZXa(l);
                        }
                        ;
                        b.x7 = d;
                        (function(l) {
                            l[l.tf = 1] = "MOFF";
                            l[l.Mx = 2] = "PRESENTEDSTREAMS";
                            l[l.$z = 4] = "SCREEN";
                            l[l.sP = 8] = "FATALERROR";
                            l[l.xv = 16] = "BROWSERINFO";
                        }
                        )(k || (k = {}));
                    }
