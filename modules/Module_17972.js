/**
 * @module Module_17972
 * @description Class module with ES module exports
 * @categories Media, ABR, Text, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 17972
 * Deobfuscated size: 23856 chars
 * Functions: 55
 * Prototype definitions: 23
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 17972
{
                        var p, c, g, f;
                        function d(e, h, k) {
                            undefined === k && (k = 0);
                            return e.displayTime - k <= h && h < e.displayTime + e.duration;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.OZb = b.x$a = undefined;
                        p = a(22970);
                        c = a(91176);
                        g = a(90745);
                        t = (function(e) {
                            function h(k, l, m, n, q, r, u, v) {
                                var w, x, y;
                                y = e.call(this) || this;
                                y.v8b = k;
                                y.F8 = l;
                                y.z8b = m;
                                y.va = n;
                                y.rda = q;
                                y.kWa = r;
                                y.Uxa = u;
                                y.options = v;
                                y.Ym = [];
                                y.Yl = [];
                                y.kp = [];
                                y.u2a = new g.sf();
                                y.X4a = new g.sf();
                                y.vpa = new g.sf();
                                y.vK = new f(function() {
                                    return l(k());
                                }
                                ,y.va,(null === (w = y.options) || undefined === w ? undefined : w.Da) || false);
                                y.vK.events.on("bufferingcomplete", function() {
                                    var A;
                                    y.va.trace("AseTimer:Received buffering complete from watcher");
                                    null === (A = y.us) || undefined === A ? undefined : A.kd();
                                    y.W0a();
                                });
                                y.vK.K2a();
                                y.RSb();
                                y.u2a.on(y.Uxa, "segmentPresenting", function() {
                                    y.gMb();
                                });
                                y.u2a.on(y.Uxa, "taskSchedulerChanged", function() {
                                    y.RSb();
                                });
                                null === (x = y.us) || undefined === x ? undefined : x.La();
                                return y;
                            }
                            p.__extends(h, e);
                            Object.defineProperty(h.prototype, "_buffering", {
                                get: function() {
                                    return this.vK.r$;
                                },
                                enumerable: false,
                                configurable: true
                            });
                            h.prototype.c0c = function() {
                                var k, l, m, n, q, r, u, v, w, x, y, A, z, B;
                                B = this;
                                return p.__generator(this, function(C) {
                                    switch (C.label) {
                                    case 0:
                                        this.va.trace("AseTimer:Starting subtitle worker");
                                        if (this.rda())
                                            return (this.va.trace("Paused: exiting"),
                                            [2]);
                                        k = function() {
                                            return B.sd.Qa.currentTime.G;
                                        }
                                        ;
                                        l = this.v8b;
                                        this.kp = this.Yl.concat(this.Ym);
                                        this.IOb(l(), true);
                                        C.label = 1;
                                    case 1:
                                        if (!this.kp.length)
                                            return [3, 3];
                                        n = m = l();
                                        this.Ztb(m);
                                        try {
                                            for ((q = (A = undefined,
                                            p.__values(this.kp)),
                                            r = q.next()); !r.done; r = q.next())
                                                (u = r.value,
                                                this.va.trace(("AseTimer:Checking subtitle ").concat(u.id)),
                                                m >= u.displayTime + u.duration || (d(u, m, this.options.a_c) ? (this.va.trace(("AseTimer:Showing subtitle ").concat(u.id)),
                                                this.GQc(u),
                                                n = Math.max(m, u.displayTime)) : (this.va.trace(("AseTimer:Staging subtitle ").concat(u.id)),
                                                this.r6a(u))));
                                        } catch (D) {
                                            A = {
                                                error: D
                                            };
                                        } finally {
                                            try {
                                                r && !r.done && (z = q.return) && z.call(q);
                                            } finally {
                                                if (A)
                                                    throw A.error;
                                            }
                                        }
                                        v = this.mfc(n);
                                        if (!isFinite(v))
                                            return (this.vK.K2a(),
                                            [3, 3]);
                                        w = k();
                                        x = this.z8b(v, m);
                                        if (undefined === x)
                                            return [3, 3];
                                        y = Math.max(x, 10) + w;
                                        this.va.trace(("AseTimer:Sleeping till PlayerTime ").concat(y));
                                        return [4, c.ie.Jm(c.I.Ca(y))];
                                    case 2:
                                        return (C.T(),
                                        this.IOb(l()),
                                        [3, 1]);
                                    case 3:
                                        return (this.va.trace(("AseTimer:Checking removed subtitles one more time ").concat(l())),
                                        this.Ztb(l()),
                                        this.va.trace("AseTimer:Ending subtitle worker"),
                                        [2]);
                                    }
                                });
                            }
                            ;
                            h.prototype.IOb = function(k, l) {
                                var m, n, q, r, u;
                                n = this;
                                undefined === l && (l = false);
                                q = l || !this.Ym.length;
                                q || (q = this.kp[this.kp.length - 1].displayTime > k);
                                if (q) {
                                    this.va.trace(("AseTimer:Getting subtitles for ").concat(k), {
                                        Ddd: this.sd.Qa.currentTime
                                    });
                                    r = this.F8(k);
                                    if (r) {
                                        this.va.trace(("AseTimer:Received ").concat(r.length, " subtitles"));
                                        q = function(y) {
                                            (0,
                                            c.kc)(u.kp, function(A) {
                                                return A.id === y.id;
                                            }) || k >= y.displayTime + y.duration || (u.va.trace(("AseTimer:adding ").concat(y.id), {
                                                start: y.startTime,
                                                eed: y.displayTime,
                                                end: y.endTime,
                                                ued: y.duration
                                            }),
                                            u.kp.push(y));
                                        }
                                        ;
                                        u = this;
                                        try {
                                            for (var v = p.__values(r), w = v.next(); !w.done; w = v.next())
                                                q(w.value);
                                        } catch (y) {
                                            var x;
                                            x = {
                                                error: y
                                            };
                                        } finally {
                                            try {
                                                w && !w.done && (m = v.return) && m.call(v);
                                            } finally {
                                                if (x)
                                                    throw x.error;
                                            }
                                        }
                                        l && this.kp.filter(function(y) {
                                            return !(0,
                                            c.kc)(r, function(A) {
                                                return A.id === y.id;
                                            });
                                        }).forEach(function(y) {
                                            return n.dfa(y);
                                        });
                                        this.kp.length || this.vK.K2a();
                                    } else
                                        this.Gl();
                                }
                            }
                            ;
                            h.prototype.stop = function() {
                                var k;
                                this.va.trace("AseTimer:Stop");
                                null === (k = this.us) || undefined === k ? undefined : k.La();
                                this.vK.reset();
                                this.Tya();
                                this.u2a.clear();
                                this.X4a.clear();
                                this.vpa.clear();
                            }
                            ;
                            h.prototype.Tya = function() {
                                var k, l, m, n;
                                this.va.trace("AseTimer:Removing all", this.Yl.length);
                                n = this.Yl;
                                try {
                                    for (var q = p.__values(n), r = q.next(); !r.done; r = q.next())
                                        this.dfa(r.value);
                                } catch (v) {
                                    var u;
                                    u = {
                                        error: v
                                    };
                                } finally {
                                    try {
                                        r && !r.done && (k = q.return) && k.call(q);
                                    } finally {
                                        if (u)
                                            throw u.error;
                                    }
                                }
                                this.Yl = [];
                                if (null === (l = this.us) || undefined === l ? 0 : l.Ho)
                                    null === (m = this.us) || undefined === m ? undefined : m.La();
                            }
                            ;
                            h.prototype.pause = function() {
                                var k;
                                null === (k = this.us) || undefined === k ? undefined : k.La();
                            }
                            ;
                            h.prototype.LJ = function() {
                                var k, l, m, n;
                                (null === (k = this.us) || undefined === k ? undefined : k.state) !== c.Sm.complete && (null === (l = this.us) || undefined === l ? undefined : l.state) !== c.Sm.CR || this.rda() || (null === (m = this.us) || undefined === m ? undefined : m.kd());
                                this.Vm && this.vK.check();
                                this.rda() && (null === (n = this.us) || undefined === n ? undefined : n.La());
                            }
                            ;
                            h.prototype.RSb = function() {
                                var k;
                                k = this;
                                this.va.trace("Setting up new task scheduler");
                                (this.sd = this.kWa()) ? (this.X4a.clear(),
                                this.X4a.on(this.sd, "clockChanged", function() {
                                    return k.LLb();
                                }),
                                this.us = this.sd.Fs(function() {
                                    return k.c0c();
                                }, "subtitleWorker"),
                                this.LLb()) : this.va.warn("AseTimer: no player task scheduler");
                            }
                            ;
                            h.prototype.mfc = function(k) {
                                var l;
                                return null !== (l = this.kp.map(function(m) {
                                    return [m.displayTime, m.displayTime + m.duration + 1];
                                }).reduce(function(m, n) {
                                    return m.concat(n);
                                }, []).filter(function(m) {
                                    return m > k;
                                }).sort(function(m, n) {
                                    return m - n;
                                })[0]) && undefined !== l ? l : Infinity;
                            }
                            ;
                            h.prototype.LLb = function() {
                                var k, l, m;
                                k = this;
                                this.vpa.clear();
                                (null === (l = this.sd) || undefined === l ? 0 : l.Qa) ? (this.va.trace("onClockChanged: clock listeners registered"),
                                this.vpa.on(this.sd.Qa, "clockAdjusted", function(n) {
                                    n.reason === c.Hx.rO && k.gMb();
                                }),
                                this.vpa.on(this.sd.Qa, "stopStart", function() {
                                    var n;
                                    k.sd.Us || (null === (n = k.us) || undefined === n ? undefined : n.kd());
                                })) : this.va.trace("onClockChanged: playerTaskScheduler has not been set or clock is undefined");
                                null === (m = this.us) || undefined === m ? undefined : m.kd();
                            }
                            ;
                            h.prototype.gMb = function() {
                                var k, l;
                                this.va.trace("Timeline changed");
                                this.Tya();
                                this.rda() ? null === (l = this.us) || undefined === l ? undefined : l.La() : null === (k = this.us) || undefined === k ? undefined : k.kd();
                            }
                            ;
                            h.prototype.r6a = function(k) {
                                -1 === this.Ym.indexOf(k) && this.eNc(k);
                            }
                            ;
                            h.prototype.Ztb = function(k) {
                                var l, m, r;
                                m = this.Yl.concat(this.Ym);
                                try {
                                    for (var n = p.__values(m), q = n.next(); !q.done; q = n.next()) {
                                        r = q.value;
                                        k >= r.displayTime + r.duration && this.dfa(r);
                                    }
                                } catch (v) {
                                    var u;
                                    u = {
                                        error: v
                                    };
                                } finally {
                                    try {
                                        q && !q.done && (l = n.return) && l.call(n);
                                    } finally {
                                        if (u)
                                            throw u.error;
                                    }
                                }
                            }
                            ;
                            h.prototype.GQc = function(k) {
                                -1 === this.Yl.indexOf(k) && (this.Yl.push(k),
                                -1 !== this.Ym.indexOf(k) && (this.Ym = this.Ym.filter(function(l) {
                                    return l !== k;
                                })),
                                this.s1a(k));
                            }
                            ;
                            h.prototype.s1a = function(k) {
                                this.va.trace("AseTimer:Showing", k.id);
                                this.emit("showsubtitle", k);
                            }
                            ;
                            h.prototype.eNc = function(k) {
                                this.va.trace("AseTimer:Staging", k.id);
                                this.Ym.push(k);
                                this.emit("stagesubtitle", k);
                            }
                            ;
                            h.prototype.Gl = function() {
                                this.va.trace("AseTimer:onUnderflow", this.Vm);
                                this.Vm || (this.emit("underflow"),
                                this.vK.Gl());
                            }
                            ;
                            h.prototype.dfa = function(k) {
                                this.va.trace("AseTimer:Removing", k.id);
                                -1 !== this.Ym.indexOf(k) && (this.Ym = this.Ym.filter(function(l) {
                                    return l !== k;
                                }));
                                -1 !== this.Yl.indexOf(k) && (this.emit("removesubtitle", k),
                                this.Yl = this.Yl.filter(function(l) {
                                    return l !== k;
                                }));
                                this.kp = this.kp.filter(function(l) {
                                    return l !== k;
                                });
                            }
                            ;
                            h.prototype.W0a = function() {
                                var k;
                                this.kp.length && (this.emit("bufferingComplete"),
                                this.rda() || (null === (k = this.us) || undefined === k ? undefined : k.kd()));
                            }
                            ;
                            return h;
                        }
                        )(g.EventEmitter);
                        b.x$a = t;
                        f = (function() {
                            function e(h, k, l) {
                                undefined === l && (l = false);
                                this.F8 = h;
                                this.va = k;
                                this.KMa = l;
                                this.events = new g.EventEmitter();
                                this.Vm = false;
                            }
                            Object.defineProperty(e.prototype, "buffering", {
                                get: function() {
                                    return this.Vm;
                                },
                                enumerable: false,
                                configurable: true
                            });
                            e.prototype.K2a = function() {
                                var h;
                                h = this;
                                this.va.trace("AseTimer:Buffering watcher restart");
                                this.Vm = true;
                                this.qNa && clearInterval(this.qNa);
                                this.qNa = this.KMa ? setInterval(function() {
                                    return h.check();
                                }, 500) : setInterval(function() {
                                    return h.check();
                                }, 2E4);
                            }
                            ;
                            e.prototype.Gl = function() {
                                this.va.trace("AseTimer:Buffering watcher underflow");
                                this.Vm = true;
                                this.cub(1);
                            }
                            ;
                            e.prototype.reset = function() {
                                this.va.trace("AseTimer:Buffering watcher reset");
                                clearInterval(this.qNa);
                                clearTimeout(this.y$b);
                                this.Vm = false;
                            }
                            ;
                            e.prototype.cub = function(h) {
                                var k;
                                k = 250 * (1 << h);
                                2E3 < k && (k = 2E3);
                                this.check();
                                this.Vm && (this.y$b = setTimeout(this.cub.bind(this, h + 1), k));
                            }
                            ;
                            e.prototype.check = function() {
                                var h;
                                h = this.F8();
                                this.va.trace("AseTimer:Buffering complete check", null === h || undefined === h ? undefined : h.length);
                                null !== h && (this.reset(),
                                this.events.emit("bufferingcomplete", {
                                    type: "bufferingcomplete",
                                    vO: h
                                }));
                            }
                            ;
                            return e;
                        }
                        )();
                        b.OZb = f;
                    }
