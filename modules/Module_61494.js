/**
 * @module Module_61494
 * @description Class module with ES module exports
 * @categories Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 61494
 * Deobfuscated size: 19098 chars
 * Functions: 38
 * Prototype definitions: 17
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 61494
{
                        var g, f, e, h;
                        function d(k, l, m, n, q, r, u) {
                            var v;
                            v = this;
                            this.player = l;
                            this.j = m;
                            this.l2 = n;
                            this.Kd = q;
                            this.YY = r;
                            this.config = u;
                            this.xZ = function() {
                                v.pN && (v.pN.cancel(),
                                v.pN = undefined);
                            }
                            ;
                            this.log = k.zb("SegmentManager", this.j);
                            this.ba = new Map();
                            this.j.qb.bh && (this.j.addEventListener(e.ja.iO, function(w) {
                                return v.RB(w);
                            }),
                            this.j.addEventListener(e.ja.closed, this.xZ));
                        }
                        function p(k, l) {
                            this.id = k;
                            this.zQa = l;
                        }
                        function c(k, l, m, n) {
                            return f.we.call(this, k, m, undefined, undefined, undefined, l, undefined, n) || this;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.kab = undefined;
                        g = a(36129);
                        f = a(31149);
                        e = a(85001);
                        h = a(5021);
                        Ia(c, f.we);
                        c.prototype.toString = function() {
                            return this.code + "-" + this.subCode + " : " + this.message + "\n" + JSON.stringify(this.data);
                        }
                        ;
                        p.prototype.toJSON = function() {
                            return {
                                id: this.id,
                                contentStartPts: this.Va,
                                contentEndPts: this.eb
                            };
                        }
                        ;
                        Ha.Object.defineProperties(p.prototype, {
                            Va: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.zQa.startTimeMs;
                                }
                            },
                            eb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    var k;
                                    return null !== (k = this.zQa.endTimeMs) && undefined !== k ? k : undefined;
                                }
                            },
                            PB: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    var k;
                                    return Object.keys(null !== (k = this.zQa.next) && undefined !== k ? k : {});
                                }
                            }
                        });
                        d.prototype.RB = function(k) {
                            var l;
                            l = this;
                            false;
                            k = k.position.segmentId;
                            0 === this.ba.size && Object.entries(this.j.Jba()).forEach(function(m) {
                                var n;
                                n = Fa(m);
                                m = n.next().value;
                                n = n.next().value;
                                l.ba.set(m, new p(m,n));
                            });
                            this.ga = this.ba.get(k);
                        }
                        ;
                        d.prototype.play = function(k) {
                            this.r3 && (this.r3 = undefined);
                            this.xZ();
                            this.log.trace("Playing segment", k);
                            return this.kGb(k) ? this.sPc(k) : this.sfa(k);
                        }
                        ;
                        d.prototype.rg = function(k) {
                            this.log.trace("Queueing segment", k);
                            return this.kGb(k) ? this.lSc(k) : this.mSc(k);
                        }
                        ;
                        d.prototype.Pl = function(k, l) {
                            var m, n;
                            m = this;
                            n = this.j.fb;
                            if (null === n || undefined === n || !n.Ck)
                                return Promise.reject(this.getError(g.ea.T$a, "ASE session manager is not yet initialized", g.Y.XCa, {
                                    segmentId: k,
                                    updates: l
                                }));
                            this.log.trace("Updating next segment weights", k, l);
                            return new Promise(function(q, r) {
                                try {
                                    n.M2c(k, l);
                                    m.j.fireEvent(e.ja.h8a, {
                                        M: k,
                                        RWb: l
                                    });
                                    q();
                                } catch (u) {
                                    r(m.getError(g.ea.T$a, "updateNextSegmentWeights threw an exception", g.Y.nZb, {
                                        segmentId: k,
                                        updates: l,
                                        error: u
                                    }));
                                }
                            }
                            );
                        }
                        ;
                        d.prototype.kGb = function(k) {
                            var l;
                            return this.ga ? undefined !== (null === (l = this.j.Jba()[this.ga.id].next) || undefined === l ? undefined : l[k]) : false;
                        }
                        ;
                        d.prototype.rWa = function() {
                            var k;
                            k = this.j.fb;
                            if (null === k || undefined === k ? 0 : k.Ck)
                                return k.Gu().BPc;
                        }
                        ;
                        d.prototype.Fyc = function() {
                            var k;
                            k = this.j.fb;
                            if (null === k || undefined === k ? 0 : k.Ck)
                                return k.Gu().id;
                        }
                        ;
                        d.prototype.Hvc = function() {
                            var k;
                            k = this.j.fb;
                            if (null === k || undefined === k ? 0 : k.Ck)
                                return (k = {
                                    IPa: 0
                                },
                                k.IPa);
                        }
                        ;
                        d.prototype.sPc = function(k) {
                            var l, m;
                            l = this;
                            m = this.j.fb;
                            return null !== m && undefined !== m && m.Ck ? this.ga && 1 === this.ga.PB.length ? this.sfa(k) : this.j.ae ? undefined === this.Hvc() ? (this.log.error("playNextSegment: branchOffset missing", {
                                segment: k
                            }),
                            this.sfa(k)) : new Promise(function(n, q) {
                                var w, x, y, A, z, B;
                                function r() {
                                    !y && x && w && (B.cancel(),
                                    y = true,
                                    l.log.trace("Telling ASE to choose the next segment", {
                                        id: k,
                                        stopped: x,
                                        repositioned: w,
                                        completed: y
                                    }),
                                    m.mpa(k, false) ? (n(),
                                    y = true) : (y = true,
                                    l.log.error("playNextSegment: ASE chooseNextSegment failed. Falling back to full seek.", {
                                        segment: k
                                    }),
                                    l.sfa(k).then(n).catch(q)));
                                }
                                function u() {
                                    m.stop();
                                    w = true;
                                    l.log.trace("Player is repositioned", {
                                        id: k,
                                        stopped: x,
                                        repositioned: w,
                                        completed: y
                                    });
                                    l.j.removeEventListener(e.ja.D3, u);
                                    r();
                                }
                                function v() {
                                    x = true;
                                    l.log.trace("ASE is stopped", {
                                        id: k,
                                        stopped: x,
                                        repositioned: w,
                                        completed: y
                                    });
                                    m.removeEventListener("stop", v);
                                    r();
                                }
                                w = false;
                                x = false;
                                y = false;
                                A = l.ba.get(k);
                                z = l.rWa();
                                if (undefined === z)
                                    return (l.log.debug("playNextSegment: getPresentingBranchPlayerEndPts undefined, fallback to full seek.", {
                                        segment: k
                                    }),
                                    l.sfa(k));
                                l.log.trace("Seeking to next segment", JSON.stringify({
                                    segmentId: k,
                                    seekTo: z,
                                    currentSegment: l.ga,
                                    nextSegment: A
                                }, null, "  "));
                                l.j.fireEvent(e.ja.rwa, {
                                    Li: l.ga && l.ga.id,
                                    s2: k
                                });
                                m.addEventListener("stop", v);
                                l.j.addEventListener(e.ja.D3, u);
                                B = l.Kd.zr((0,
                                h.ri)(10), function() {
                                    y = true;
                                    B.cancel();
                                    q(l.getError(g.ea.Q5, "Timed out waiting for the player to be repositioned and ASE to be stopped", g.Y.jZb, {
                                        id: k,
                                        stopped: x,
                                        repositioned: w,
                                        completed: y
                                    }));
                                });
                                l.player.seek(z, e.Tc.PX);
                            }
                            ) : (this.log.warn("MediaPresenter is not initialized", k),
                            Promise.reject(this.getError(g.ea.Q5, "MediaPresenter is not initialized", g.Y.kZb, {
                                id: k
                            }))) : Promise.reject(this.getError(g.ea.Q5, "ASE session manager is not yet initialized", g.Y.XCa, {
                                id: k
                            }));
                        }
                        ;
                        d.prototype.sfa = function(k) {
                            var l;
                            l = this.ba.get(k);
                            return l ? this.Mga(l, g.ea.Q5) : Promise.reject(this.getError(g.ea.Q5, "Unable to find the separated segment", g.Y.S$a, {
                                id: k
                            }));
                        }
                        ;
                        d.prototype.lSc = function(k) {
                            var l;
                            l = this.j.fb;
                            if (null === l || undefined === l || !l.Ck)
                                return Promise.reject(this.getError(g.ea.R5, "ASE session manager is not yet initialized", g.Y.XCa, {
                                    id: k
                                }));
                            this.j.fireEvent(e.ja.rwa, {
                                Li: this.ga && this.ga.id,
                                s2: k
                            });
                            if (l.mpa(k, true))
                                return Promise.resolve();
                            this.log.error("queueNextSegment: ASE chooseNextSegment failed - falling back to a delayed seek at the end of current segment", {
                                segment: k
                            });
                            return this.nxb(k);
                        }
                        ;
                        d.prototype.mSc = function(k) {
                            this.log.error("calls to queueSeparatedSegment are deprecated", {
                                segment: k,
                                mid: this.j.R,
                                srcsegment: this.Fyc()
                            });
                            return this.nxb(k);
                        }
                        ;
                        d.prototype.nxb = function(k) {
                            var l, m;
                            l = this;
                            if (this.r3)
                                return Promise.reject(this.getError(g.ea.R5, "Unable to queue segment for delayed seek because there is currently already a segment queued for delayed seek", g.Y.mZb, {
                                    currentSegment: this.ga ? this.ga.id : undefined,
                                    queuedSegment: this.r3.id,
                                    failedSegment: k
                                }));
                            if (!this.ga)
                                return Promise.reject(this.getError(g.ea.R5, "Unable to queue segment for delayed seek because there is no currently playing segment", g.Y.iZb, {
                                    nextSegmentid: k
                                }));
                            m = this.ba.get(k);
                            if (!m)
                                return Promise.reject(this.getError(g.ea.R5, "Unable to find the separated segment", g.Y.S$a, {
                                    nextSegmentid: k,
                                    currentSegmentId: this.ga.id
                                }));
                            this.r3 = {
                                id: k,
                                promise: new Promise(function(n, q) {
                                    var r;
                                    l.pN = l.l2.Uvb({
                                        $Cb: function() {
                                            return (0,
                                            h.pc)(100);
                                        }
                                    }, function() {
                                        return l.player.qE() || 0;
                                    });
                                    r = l.rWa() - l.config().qKb;
                                    l.log.trace("Adding moment for queued segment for delayed seek", {
                                        segment: k,
                                        pts: r
                                    });
                                    l.pN.observe(r, function() {
                                        l.log.trace("Moment has arrived, seek to segment", {
                                            segment: k,
                                            currentSegment: l.ga.id,
                                            playerEndPts: l.rWa(),
                                            pts: r
                                        });
                                        l.r3 = undefined;
                                        l.xZ();
                                        l.Mga(m, g.ea.R5).then(n).catch(q);
                                    });
                                }
                                )
                            };
                            this.r3.promise.catch(function(n) {
                                l.j.Gg(n.code, n);
                            });
                            return Promise.resolve();
                        }
                        ;
                        d.prototype.Mga = function(k, l) {
                            var m;
                            m = this;
                            return new Promise(function(n, q) {
                                var r;
                                try {
                                    r = k.Va;
                                    false;
                                    m.player.seek(r, e.Tc.Dv);
                                    n();
                                } catch (u) {
                                    q(m.getError(l, "Seek threw an exception", g.Y.lZb, {
                                        id: k.id,
                                        error: u
                                    }));
                                }
                            }
                            );
                        }
                        ;
                        d.prototype.getError = function(k, l, m, n) {
                            this.log.warn(l, n);
                            return new c(k,l,m,n);
                        }
                        ;
                        b.kab = d;
                    }
