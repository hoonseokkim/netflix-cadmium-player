/**
 * @module Module_64181
 * @description Class module with ES module exports
 * @categories DRM, Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 64181
 * Deobfuscated size: 19795 chars
 * Functions: 45
 * Prototype definitions: 22
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 64181
{
                        var f, e, h;
                        function d(k, l, m, n, q, r, u, v, w, x, y) {
                            var A;
                            A = this;
                            this.$a = k;
                            this.l2 = m;
                            this.z2a = n;
                            this.config = q;
                            this.rb = r;
                            this.Vk = u;
                            this.ufa = v;
                            this.Ql = w;
                            this.Im = y;
                            this.csc = Object.values(f.cb).map(function(z) {
                                return {
                                    event: z,
                                    sE: function(B) {
                                        return A.Xb.qd(z, B);
                                    }
                                };
                            });
                            this.Xb = x.create();
                            this.QN = [];
                            this.log = l.zb("SegmentManager");
                            this.VA = true;
                            this.nv = this.Ql.createElement("div", h.WJa);
                        }
                        function p(k, l, m, n, q, r, u, v, w, x, y) {
                            var A;
                            A = this;
                            this.log = k;
                            this.config = l;
                            this.DLc = m;
                            this.z2a = n;
                            this.Vk = q;
                            this.ufa = r;
                            this.ov = u;
                            this.K = v;
                            this.nv = w;
                            this.rb = x;
                            this.Im = y;
                            this.xZ = function() {
                                A.pN && (A.pN.cancel(),
                                A.pN = undefined);
                            }
                            ;
                            this.jXa = function(z) {
                                A.log.trace("Received the transition event", {
                                    movieId: z.R
                                });
                                A.CSc();
                            }
                            ;
                            this.YZa = function() {}
                            ;
                            this.log.debug("Constructing session data", c(v));
                            this.p1c = new Promise(function(z) {
                                A.CSc = z;
                            }
                            );
                        }
                        function c(k) {
                            return {
                                movieId: k.R
                            };
                        }
                        function g(k) {
                            return JSON.stringify({
                                movieId: k.R,
                                startPts: k.Nb,
                                logicalEnd: k.Cj,
                                params: k.Xa ? {
                                    trackingId: k.Xa.co,
                                    authParams: k.Xa.Goa,
                                    sessionParams: k.Xa.Dr,
                                    disableTrackStickiness: k.Xa.ESa,
                                    uiPlayStartTime: k.Xa.JC,
                                    loadImmediately: k.Xa.fva,
                                    playbackState: k.Xa.playbackState ? {
                                        currentTime: k.Xa.playbackState.currentTime,
                                        volume: k.Xa.playbackState.volume,
                                        muted: k.Xa.playbackState.muted,
                                        playbackRate: k.Xa.playbackState.playbackRate
                                    } : undefined,
                                    pin: k.Xa.BNb,
                                    heartbeatCooldown: k.Xa.uXa,
                                    uiLabel: k.Xa.Ye,
                                    uxLabels: k.Xa.yBa
                                } : undefined
                            });
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.ulb = undefined;
                        f = a(85001);
                        e = a(5021);
                        h = a(33096);
                        p.prototype.load = function(k) {
                            var l, m;
                            l = this;
                            this.log.trace("Loading new segment", c(this.K));
                            this.player = this.z2a.TZ(this.config, this.ufa, this.Vk, this.K, this.rb, this.Im);
                            this.player.addEventListener(f.cb.U0, function(n) {
                                l.log.trace("Segment is inactive", c(l.K));
                                l.ov.close(l.Vk(n.errorCode));
                            });
                            this.player.addEventListener(f.cb.closed, this.xZ);
                            this.player.addEventListener(f.cb.s7a, function(n) {
                                n.timecodes.forEach(function(q) {
                                    "start" === q.type && k ? (l.K.Nb = q.r4,
                                    l.K.Xa.Nb = q.r4) : "ending" === q.type && (l.K.Cj = q.r4,
                                    l.K.Xa.Cj = q.r4);
                                });
                                l.K.id && l.K.Cj && l.rb.KWb(l.K.id, l.K.Cj);
                                l.ov.HWb(l.K);
                            });
                            if (k)
                                (this.log.debug("Pausing background segment", c(this.K)),
                                this.player.addEventListener(f.cb.XYa, this.jXa),
                                this.player.lNb());
                            else {
                                this.nv.appendChild(this.player.Vq());
                                m = function(n) {
                                    l.jXa(n);
                                    l.player.removeEventListener(f.cb.loaded, m);
                                }
                                ;
                                this.player.addEventListener(f.cb.loaded, m);
                            }
                        }
                        ;
                        p.prototype.observe = function() {
                            var k, l, m;
                            k = this;
                            this.log.trace("Observing segment", g(this.K));
                            if (this.pN)
                                this.log.trace("Segment is currently observing", c(this.K));
                            else if (this.K.Xa && this.K.Xa.fva)
                                this.YZa(this);
                            else {
                                l = this.DLc.Uvb(this.config, function() {
                                    var n;
                                    if (k.player) {
                                        n = k.player.XH();
                                        if (n)
                                            return n;
                                    }
                                    return 0;
                                });
                                m = this.zfc(this.K);
                                this.log.trace("Adding a moment to watch", {
                                    time: m
                                });
                                l.observe(m, function() {
                                    k.log.trace("Segment has reached its loading point", c(k.K));
                                    k.YZa(k);
                                    k.xZ();
                                });
                            }
                        }
                        ;
                        p.prototype.close = function(k) {
                            this.log.info("Closing segment", {
                                segment: g(this.K),
                                error: k
                            });
                            return this.player ? (this.player.removeEventListener(f.cb.XYa, this.jXa),
                            this.player.close(k)) : Promise.resolve();
                        }
                        ;
                        p.prototype.jNc = function(k) {
                            this.YZa = k;
                        }
                        ;
                        p.prototype.zfc = function(k) {
                            var l, m;
                            l = k.Cj;
                            k = k.Xa ? k.Xa.fva : false;
                            m = 0;
                            l && !k && (m = l - this.config.rCb(),
                            m < this.config.zCb() && (k = l - this.config.zCb(),
                            m = l - k / 2));
                            return m;
                        }
                        ;
                        d.prototype.Ryc = function() {
                            return this.tj && this.tj.player ? this.tj.player.Ws() : false;
                        }
                        ;
                        d.prototype.Vq = function() {
                            return this.nv;
                        }
                        ;
                        d.prototype.bI = function() {
                            if (!this.tj || !this.tj.player)
                                throw Error("Player not ready");
                            return this.tj.player;
                        }
                        ;
                        d.prototype.HWb = function(k) {
                            var l, m;
                            m = this.aUa(k);
                            m ? this.JWb(m, k) : this.rb.Hu(k.id) || this.log.error("Tried to update a non-existent segment", {
                                segment: g(k),
                                currentMovieId: this.tj.K.R,
                                queuedMovieIds: this.QN.map(function(n) {
                                    return n.K.R;
                                }),
                                xid: null === (l = this.tj.player) || undefined === l ? undefined : l.cB()
                            });
                        }
                        ;
                        d.prototype.cf = function(k) {
                            var l;
                            this.log.info("Adding segment", g(k));
                            if (this.VA) {
                                this.log.trace("First segment, loading", c(k));
                                l = this.pIb(k);
                                this.VA = false;
                            } else
                                (this.log.trace("Subsequent segment, caching", c(k)),
                                (l = this.aUa(k)) ? this.JWb(l, k) : (l = this.createSession(k),
                                this.QN.push(l),
                                this.tj.observe()));
                            return l ? l.p1c : null;
                        }
                        ;
                        d.prototype.transition = function(k, l) {
                            var m, n, q;
                            n = this.RT;
                            q = null === n || undefined === n ? undefined : n.player;
                            if (n && q)
                                return (this.RT = undefined,
                                this.log.info("Transitioning segment", g(n.K)),
                                q.S5a(this.$a.Fc().na(e.Ba)),
                                this.HVb(n, l));
                            l = null === n || undefined === n ? undefined : n.K;
                            this.log.error("Transitioning to next segment failed. Session or player not available.", {
                                mid: this.tj.K.R,
                                xid: null === (m = this.tj.player) || undefined === m ? undefined : m.cB(),
                                nextSegmentId: k,
                                currentSegment: g(this.tj.K),
                                nextSegment: l ? g(l) : undefined,
                                queuedMovieIds: this.QN.map(function(r) {
                                    return r.K.R;
                                })
                            });
                            return Promise.reject();
                        }
                        ;
                        d.prototype.close = function(k) {
                            var l;
                            l = this;
                            this.log.trace("Closing all segments", {
                                currSession: JSON.stringify(c(this.tj.K)),
                                nextSession: this.RT ? JSON.stringify(c(this.RT.K)) : undefined
                            });
                            k = [this.tj.close(k)];
                            this.RT && k.push(this.RT.close());
                            return Promise.all(k).then(function() {
                                l.RT = undefined;
                                l.QN = [];
                                l.VA = true;
                            });
                        }
                        ;
                        d.prototype.addListener = function(k, l, m) {
                            this.Xb.addListener(k, l, m);
                        }
                        ;
                        d.prototype.removeListener = function(k, l) {
                            this.Xb.removeListener(k, l);
                        }
                        ;
                        d.prototype.JWb = function(k, l) {
                            this.UNc(k.K, l);
                            this.log.trace("Overwrote existing segment data", g(k.K));
                        }
                        ;
                        d.prototype.pIb = function(k) {
                            var l, m;
                            l = this;
                            this.log.info("Loading the next episode", c(k));
                            if (this.tj) {
                                this.config.ZUa()[k.R] = k.Nb;
                                m = this.aUa(k);
                            } else
                                m = this.createSession(k);
                            if (m)
                                return (this.log.trace("Found the next session", c(k)),
                                m.jNc(function(n) {
                                    l.XUb(n);
                                }),
                                this.tj ? (this.log.trace("Subsequent playback, caching player and pausing", c(k)),
                                this.RT = m,
                                m.load(true)) : (this.log.trace("First playback transitioning immediately", c(k)),
                                m.load(false),
                                this.HVb(m)),
                                m);
                            this.log.warn("Unable to find the session, make sure to add it before loading", c(k));
                        }
                        ;
                        d.prototype.HVb = function(k, l) {
                            var m, n, q, r, u;
                            l = undefined === l ? {} : l;
                            r = k.player ? null === (m = k.player) || undefined === m ? undefined : m.getError() : "missing player";
                            if (r)
                                return (null === (n = k.player) || undefined === n ? undefined : n.close(),
                                this.log.error("Transitioning to next segment failed. Session is in the error state.", {
                                    srcmid: this.tj.K.R,
                                    mid: k.K.R,
                                    error: r,
                                    xid: null === (q = k.player) || undefined === q ? undefined : q.cB()
                                }),
                                Promise.reject());
                            this.log.trace("Playing episode", c(k.K));
                            m = this.tj;
                            this.tj = k;
                            k = this.tj.player;
                            k.w5a(false);
                            this.qW(k, m ? m.player : undefined);
                            if (m && m.player) {
                                u = m.player.Vq();
                                n = k.Vq();
                                u.style.display = "none";
                                m = m.close();
                                this.nv.appendChild(n);
                                m.then(function() {
                                    u.parentElement && u.parentElement.removeChild(u);
                                });
                                n.style.display = "block";
                                k.qBa(l);
                                k.q4();
                                k.play();
                            }
                            return Promise.resolve();
                        }
                        ;
                        d.prototype.XUb = function(k) {
                            var l, m, n, q, r;
                            if (this.QN.length && k.player) {
                                l = k.player.XH();
                                m = this.QN[0];
                                n = this.tj.K.Cj;
                                q = this.tj.K.Xa ? this.tj.K.Xa.fva : false;
                                if (n || q) {
                                    q ? r = 0 : n && (r = n - this.config.rCb());
                                    null !== l && l >= r && (this.log.info("Got a time change, loading the next player", c(m.K)),
                                    this.pIb(m.K),
                                    this.QN.splice(0, 1),
                                    this.XUb(k));
                                }
                            }
                        }
                        ;
                        d.prototype.aUa = function(k) {
                            return this.tj.K.R === k.R ? this.tj : this.QN.find(function(l) {
                                return l.K.R === k.R;
                            });
                        }
                        ;
                        d.prototype.UNc = function(k, l) {
                            k.Nb = l.Nb || k.Nb;
                            k.Cj = l.Cj || k.Cj;
                            k.Xa = l.Xa || k.Xa;
                            k.S = l.S || k.S;
                        }
                        ;
                        d.prototype.createSession = function(k) {
                            return new p(this.log,this.config,this.l2,this.z2a,this.Vk,this.ufa,this,k,this.nv,this.rb,this.Im);
                        }
                        ;
                        d.prototype.qW = function(k, l) {
                            this.csc.forEach(function(m) {
                                l && l.removeEventListener(m.event, m.sE);
                                k.addEventListener(m.event, m.sE);
                            });
                            this.Xb.qd(f.JX.Rga, {
                                player: k
                            });
                        }
                        ;
                        b.ulb = d;
                    }
