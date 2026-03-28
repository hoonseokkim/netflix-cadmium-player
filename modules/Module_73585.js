/**
 * @module Module_73585
 * @description Class module with ES module exports
 * @categories ABR, Text, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 73585
 * Deobfuscated size: 19226 chars
 * Functions: 53
 * Prototype definitions: 21
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 73585
{
                        var p, c, g, f, e, h, k, l, m, n, q, r;
                        function d(u, v) {
                            var w;
                            w = this;
                            this.j = u;
                            this.BO = v;
                            this.T6a = this.FKb = 0;
                            this.Fh = this.Sp = false;
                            this.bV = 0;
                            this.yta = new Set();
                            this.iha = true;
                            this.gq = function() {
                                var x, y;
                                w.hza();
                                w.yR && (w.log.info("Deactivating", w.yR),
                                w.uJ.anc(w.Uq()));
                                w.j.sl.set(null);
                                w.PV.sSb(undefined);
                                w.wub();
                                x = w.j.oa.yc;
                                x && x.dr() && !x.Hp() && (x = null);
                                if (x && w.j.bc.value !== n.Qb.Bh) {
                                    y = w.Uq();
                                    w.uJ.dac(y, x);
                                }
                                x ? (w.log.info("Activating", x),
                                w.j.Zn.set(x.getState() === p.WP.cs.EP ? n.zh.Lf : n.zh.Xf),
                                w.Sp || w.j.qg("tt_start"),
                                x.Hta(w.BO).then(w.FY).catch(w.FY)) : w.j.Zn.set(n.zh.Lf);
                                w.yR = x;
                                w.KJ();
                                w.j.Hc.Da && w.j.Zn.set(n.zh.Lf);
                            }
                            ;
                            this.sync = function() {
                                w.Sp && (w.PV.start(),
                                w.j.bc.value !== n.Qb.Bg && w.PV.stop());
                            }
                            ;
                            this.KJ = function() {
                                var x;
                                w.iha && w.j.state.value === n.Nc.Lf && w.j.bc.value !== n.Qb.Bh && (w.Gj ? x = w.PV.Tuc() : w.j.oa.yc && (x = d.h_c[w.j.oa.yc.getState()]));
                                x && (0,
                                m.gd)(x.startTime) && w.j.CC.value !== x && (w.FKb++,
                                w.T6a += w.PV.CCb() - x.startTime,
                                w.Esb = Math.ceil(w.T6a / (w.FKb + 0)));
                                w.j.CC.set(x);
                            }
                            ;
                            this.Uq = function() {
                                var x;
                                x = w.j.mWa();
                                w.yR && w.yR.iB && (x += w.yR.iB);
                                return x;
                            }
                            ;
                            this.s1a = function(x) {
                                w.yta.add(x);
                                w.iha && (w.fireEvent(d.fTb, x),
                                x && x.id && (w.uJ.PWb(x.id),
                                false));
                                w.log.trace("showsubtitle", w.Msa(x));
                            }
                            ;
                            this.dfa = function(x) {
                                w.yta.delete(x) && w.iha && (w.fireEvent(d.cQb, x),
                                w.log.trace("removesubtitle", w.Msa(x)));
                            }
                            ;
                            this.CBc = function() {
                                w.yta.forEach(function(x) {
                                    w.fireEvent(d.cQb, x);
                                    w.log.trace("hide subtitle", w.Msa(x));
                                });
                            }
                            ;
                            this.kVc = function() {
                                w.yta.forEach(function(x) {
                                    w.fireEvent(d.fTb, x);
                                    w.log.trace("resume subtitle", w.Msa(x));
                                });
                            }
                            ;
                            this.Gl = function() {
                                w.log.warn("imagesubs buffer underflow", w.j.oa.yc.Bj);
                                w.j.Zn.set(n.zh.Xf);
                            }
                            ;
                            this.W0a = function() {
                                w.log.info("imagesubs buffering complete", w.j.oa.yc.Bj);
                                w.j.Zn.set(n.zh.Lf);
                            }
                            ;
                            this.rN = function() {
                                w.Sp && w.Gj && w.Gj.LJ(w.Uq());
                            }
                            ;
                            this.cMb = function(x) {
                                w.Sp && w.Gj && (w.Gj.pause(),
                                w.Gj.oO(x.em));
                            }
                            ;
                            this.RB = function() {
                                w.Sp && w.Gj && w.Gj.SOb();
                            }
                            ;
                            this.ZLb = function(x) {
                                w.Gj && w.Gj.Wn(x.Li, x.s2);
                            }
                            ;
                            this.kMb = function(x) {
                                w.Gj && w.Gj.Pl(x.M, x.RWb);
                            }
                            ;
                            this.NMc = function() {
                                w.Sp = true;
                                (0,
                                l.gi)(function() {
                                    var x, y;
                                    (null === (x = w.yR) || undefined === x ? 0 : x.cr) ? null === (y = w.Gj) || undefined === y ? undefined : y.LJ(w.Uq()) : w.sync();
                                    w.KJ();
                                });
                            }
                            ;
                            this.KMc = function() {
                                w.wub();
                                w.PV.stop();
                                w.KJ();
                                w.Fh = true;
                                w.hza();
                            }
                            ;
                            this.w1a = function(x) {
                                (x = x.newValue) && (0,
                                m.isArray)(x.blocks) && (w.uJ.PWb.apply(w.uJ, Ba(x.blocks.map(function(y) {
                                    return y.id;
                                }))),
                                false);
                            }
                            ;
                            this.UMc = function(x) {
                                w.p3c(x.newValue, x.oldValue);
                                w.sync();
                                w.KJ();
                            }
                            ;
                            this.FY = function(x) {
                                var y;
                                if (!w.Fh) {
                                    y = x.track;
                                    if (y === w.j.oa.yc)
                                        try {
                                            w.Gj = y.IWa();
                                            y.cr ? w.bac(x) : w.cac(x);
                                        } catch (A) {
                                            w.log.error("Error activating track:", A, y);
                                            return;
                                        }
                                    w.Sp || w.j.qg(x.success ? "tt_comp" : "tt_err");
                                    x.success ? (f.config.bRb ? setTimeout(function() {
                                        w.j.Zn.set(n.zh.Lf);
                                    }, f.config.bRb) : w.j.Zn.set(n.zh.Lf),
                                    y.cr || w.KJ()) : x.aborted ? w.log.warn("aborted timed text track loading") : f.config.Jsc ? w.j.Gg(k.ea.M1b, {
                                        Cf: x.track ? x.track.Bj : {}
                                    }) : (w.log.error("ignore subtitle initialization error", x),
                                    w.j.Zn.set(n.zh.Lf));
                                }
                            }
                            ;
                            this.Xb = new g.jl();
                            this.uJ = new h.gmb((0,
                            e.Fo)(u, "SubtitleTracker"),f.config.erc);
                            this.log = (0,
                            e.Fo)(u, "TimedTextManager");
                            this.PV = new c.Hmb(this.Uq,this.KJ);
                            this.j.oa.addListener([r.l.Ea], this.gq);
                            f.config.bQc ? (this.j.addEventListener(n.ja.Sp, this.NMc),
                            this.gq()) : (this.j.Zn.set(n.zh.Lf),
                            this.j.addEventListener(n.ja.Sp, function() {
                                w.Sp = true;
                                w.gq();
                            }));
                            this.j.bc.addListener(this.UMc);
                            this.j.addEventListener(n.ja.l7a, this.sync);
                            this.j.CC.addListener(this.w1a);
                            this.j.addEventListener(n.ja.Fh, this.KMc);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Dmb = undefined;
                        p = a(26159);
                        c = a(7953);
                        g = a(94886);
                        f = a(29204);
                        e = a(31276);
                        h = a(69899);
                        k = a(36129);
                        l = a(32219);
                        m = a(32687);
                        n = a(85001);
                        q = a(35781);
                        r = a(26388);
                        d.prototype.WYc = function() {
                            this.iha = true;
                            this.kVc();
                            this.KJ();
                        }
                        ;
                        d.prototype.EBc = function() {
                            this.iha = false;
                            this.CBc();
                            this.KJ();
                        }
                        ;
                        d.prototype.addEventListener = function(u, v, w) {
                            this.Xb.addListener(u, v, w);
                        }
                        ;
                        d.prototype.removeEventListener = function(u, v) {
                            this.Xb.removeListener(u, v);
                        }
                        ;
                        d.prototype.fireEvent = function(u, v, w) {
                            this.Xb.qd(u, v, w);
                        }
                        ;
                        d.prototype.sOa = function(u, v, w) {
                            var x, y;
                            x = this;
                            y = q.Bmb.dlc(this.j, u, v, w);
                            this.DFb(this.j.sk, y);
                            this.j.ul.forEach(function(A) {
                                x.DFb(A.sk, y);
                            });
                            this.j.oa.xz(y);
                            this.j.fireEvent(n.ja.EC);
                        }
                        ;
                        d.prototype.T2a = function(u) {
                            return this.t4a(u) ? u.Hta(this.BO).then(function() {}) : Promise.resolve();
                        }
                        ;
                        d.prototype.Kzc = function(u) {
                            return this.uJ.jzc(u);
                        }
                        ;
                        d.prototype.JWa = function(u) {
                            return this.uJ.JWa(u);
                        }
                        ;
                        d.prototype.sca = function() {
                            var u, v;
                            u = {
                                size: this.BO.DBb().characterSize
                            };
                            v = this.j.Xha;
                            v && (u.visibility = v.RWa(),
                            u.o$ = v.PWa(),
                            u.Ry = v.QWa());
                            return u;
                        }
                        ;
                        d.prototype.bYc = function(u) {
                            this.BO.LXc(u);
                            u = this.j.oa.yc;
                            this.t4a(u) && !u.cr && u.Hta(this.BO).then(this.FY).catch(this.FY);
                        }
                        ;
                        d.prototype.p3c = function(u, v) {
                            var w;
                            u === n.Qb.Bg || u == n.Qb.aj ? v !== n.Qb.Bg && v !== n.Qb.aj && ((v = this.j.oa.yc) && !this.t4a(v) || this.uJ.SKb(this.Uq(), v || undefined, "presentingstate:" + u)) : u !== n.Qb.Bh && u !== n.Qb.Ix || this.uJ.qTa(null !== (w = this.Uq()) && undefined !== w ? w : undefined, "presentingstate:" + u);
                        }
                        ;
                        d.prototype.hza = function() {
                            this.bV = 0;
                            Da.clearTimeout(this.oVc);
                        }
                        ;
                        d.prototype.wub = function() {
                            var u;
                            this.Gj && this.Gj.stop();
                            (null === (u = this.yR) || undefined === u ? 0 : u.cr) && this.PIb("removeListener");
                            this.Gj = undefined;
                        }
                        ;
                        d.prototype.PIb = function(u) {
                            this.Gj && (this.Gj[u]("showsubtitle", this.s1a),
                            this.Gj[u]("removesubtitle", this.dfa),
                            this.Gj[u]("underflow", this.Gl),
                            this.Gj[u]("bufferingComplete", this.W0a),
                            "addListener" === u ? (this.j.addEventListener(n.ja.wu, this.rN),
                            this.j.addEventListener(n.ja.pt, this.cMb),
                            this.j.addEventListener(n.ja.iO, this.RB),
                            this.j.addEventListener(n.ja.rwa, this.ZLb),
                            this.j.addEventListener(n.ja.h8a, this.kMb)) : (this.j.removeEventListener(n.ja.wu, this.rN),
                            this.j.removeEventListener(n.ja.pt, this.cMb),
                            this.j.removeEventListener(n.ja.iO, this.RB),
                            this.j.removeEventListener(n.ja.rwa, this.ZLb),
                            this.j.removeEventListener(n.ja.h8a, this.kMb)));
                        }
                        ;
                        d.prototype.Msa = function(u) {
                            return {
                                currentPts: this.Uq(),
                                displayTime: u.displayTime,
                                duration: u.duration,
                                id: u.id,
                                originX: u.originX,
                                originY: u.originY,
                                sizeX: u.sizeX,
                                sizeY: u.sizeY,
                                rootContainerExtentX: u.rootContainerExtentX,
                                rootContainerExtentY: u.rootContainerExtentY
                            };
                        }
                        ;
                        d.prototype.bac = function(u) {
                            var v, w;
                            v = this;
                            w = u.track;
                            if (!w || !w.cr)
                                throw Error("Not an image base subtitle");
                            u.success ? (this.hza(),
                            this.PIb("addListener"),
                            this.log.info("Activated", w),
                            this.j.sl.set(w),
                            this.Sp ? (0,
                            l.gi)(function() {
                                v.Gj.LJ(v.Uq());
                            }) : this.Gj.pause()) : this.PQb(w, u);
                        }
                        ;
                        d.prototype.cac = function(u) {
                            var v, w;
                            v = u.track;
                            w = u.success;
                            if (!v || v.cr)
                                throw Error("Not a valid text track");
                            w ? (this.hza(),
                            this.PV.sSb(this.Gj),
                            this.log.info("Activated", v),
                            this.j.sl.set(v)) : this.PQb(v, (0,
                            k.eG)(u));
                            this.KJ();
                        }
                        ;
                        d.prototype.PQb = function(u, v) {
                            var w, x;
                            w = this;
                            x = this.bV < f.config.JIc;
                            x && (this.oVc = Da.setTimeout(function() {
                                w.bV++;
                                u.Hta(w.BO).then(w.FY).catch(w.FY);
                            }, f.config.j1c));
                            this.log.error("Failed to activate" + ((null === u || undefined === u ? 0 : u.cr) ? " img subtitle" : ""), {
                                retry: x
                            }, v, u);
                        }
                        ;
                        d.prototype.t4a = function(u) {
                            return !(!u || u.dr() && !u.Hp());
                        }
                        ;
                        d.prototype.DFb = function(u, v) {
                            var w;
                            w = u.findIndex(function(x) {
                                return x.Gc >= v.Gc;
                            });
                            -1 === w && (w = 0);
                            u.splice(w, 0, v);
                        }
                        ;
                        b.Dmb = d;
                        t = {};
                        d.h_c = (t[p.WP.cs.LOADING] = {
                            Oda: true
                        },
                        t[p.WP.cs.s7] = {
                            pd: true
                        },
                        t);
                        d.fTb = "showsubtitle";
                        d.cQb = "removesubtitle";
                    }
