/**
 * @module Module_47359
 * @description Class module with ES module exports
 * @categories DRM, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 47359
 * Deobfuscated size: 28367 chars
 * Functions: 62
 * Prototype definitions: 24
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 47359
{
                        var c, g, f, e, h, k, l, m, n, q, r, u, v, w, x;
                        function d(y) {
                            var A, z, B, C, D, E, G, F, H, J, M, K;
                            z = y.Qa;
                            B = y.EA;
                            C = y.RXb;
                            D = y.Hr;
                            E = y.priority;
                            G = undefined === E ? 0 : E;
                            E = y.NO;
                            F = undefined === E ? true : E;
                            y = y.Hsb;
                            H = undefined === y ? true : y;
                            (0,
                            e.assert)(z.zj, ("Current time: ").concat(f.platform.time.fa(), " cr: ").concat(z.currentTime));
                            (0,
                            e.assert)(z.currentTime.isFinite());
                            y = C.da(z.currentTime);
                            H && (y = p(y, null !== (A = null === D || undefined === D ? undefined : D.Owa) && undefined !== A ? A : 0));
                            J = Math.max(Math.ceil(y.$B / z.speed), 0);
                            M = D || ({
                                id: undefined,
                                oxb: J,
                                Owa: 0,
                                zNc: J,
                                NO: F,
                                epa: []
                            });
                            K = f.platform.time.fa();
                            M.id = (M.NO ? q.Q5a : setTimeout)(function() {
                                var L, O;
                                L = C.da(z.currentTime);
                                O = f.platform.time.fa() - K - J;
                                M.epa.push({
                                    delay: O,
                                    lZc: J
                                });
                                L.Hn(k.I.ia) ? B() : (M.Owa++,
                                d({
                                    Qa: z,
                                    EA: B,
                                    RXb: C,
                                    Hr: M,
                                    priority: G,
                                    NO: F,
                                    Hsb: H
                                }));
                            }, J, G);
                            M.oxb = J;
                            return M;
                        }
                        function p(y, A) {
                            return 0 < A ? k.I.max(y, k.I.Ca(10 * (1 << Math.min(A, 6) - 1))) : y;
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.NX = b.llb = undefined;
                        c = a(22970);
                        g = a(90745);
                        f = a(66164);
                        e = a(43529);
                        h = a(70248);
                        k = a(44847);
                        l = a(50214);
                        m = a(73550);
                        n = a(32910);
                        q = a(95130);
                        r = a(47061);
                        u = a(36992);
                        v = a(56161);
                        w = (function() {
                            function y() {
                                this.complete();
                            }
                            Object.defineProperties(y.prototype, {
                                QV: {
                                    get: function() {
                                        return this.NNa;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(y.prototype, {
                                twa: {
                                    get: function() {
                                        return this.t9b;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(y.prototype, {
                                Jmc: {
                                    get: function() {
                                        return this.V7b;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(y.prototype, {
                                Bza: {
                                    get: function() {
                                        return this.k$b;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            y.prototype.set = function(A, z, B) {
                                this.V7b = z === x.u2 ? 0 : f.platform.time.fa();
                                this.t9b = A;
                                this.k$b = z;
                                n.u && (0,
                                e.assert)(!this.NNa, "Invalid replacement of timeout value");
                                this.NNa = B;
                            }
                            ;
                            y.prototype.complete = function() {
                                this.NNa = undefined;
                                this.set(k.I.uh, x.u2);
                            }
                            ;
                            return y;
                        }
                        )();
                        (function(y) {
                            y[y.u2 = 0] = "none";
                            y[y.xea = 1] = "microTask";
                            y[y.setTimeout = 2] = "setTimeout";
                        }
                        )(x || (b.llb = x = {}));
                        t = (function(y) {
                            function A(z, B) {
                                var C;
                                C = y.call(this) || this;
                                C.Qa = z;
                                C.console = B;
                                C.eda = false;
                                C.vqa = false;
                                C.Un = new w();
                                C.Ks = new g.sf();
                                C.Sk = new l.LP([],(0,
                                h.Zub)(function(D, E) {
                                    return D.$U.xl(E.$U);
                                }, function(D, E) {
                                    return D.Oe.tc.priority - E.Oe.tc.priority;
                                }, function(D, E) {
                                    return E.Oe.priority - D.Oe.priority;
                                }, function(D, E) {
                                    return D.Oe.id > E.Oe.id ? 1 : D.Oe.id < E.Oe.id ? -1 : 0;
                                }));
                                C.toa(z);
                                return C;
                            }
                            c.__extends(A, y);
                            A.hXc = function(z) {
                                this.config = z;
                            }
                            ;
                            A.Kwc = function(z, B) {
                                var D, E;
                                function C() {
                                    var G, F;
                                    G = new A(z,B);
                                    F = new m.mX({
                                        name: "rootTaskScheduler",
                                        cfa: function(H) {
                                            H() && (G.La(),
                                            D.Dza.delete(z));
                                        },
                                        console: B
                                    });
                                    return {
                                        tc: G,
                                        BB: F
                                    };
                                }
                                D = this;
                                (0,
                                e.assert)(this.config, "Config has not been intiialized");
                                this.config.Ktb && (this.Dza.has(z) || this.Dza.set(z, C()));
                                E = this.Dza.get(z) || C();
                                return {
                                    tc: E.tc,
                                    Qk: E.BB.wA()
                                };
                            }
                            ;
                            Object.defineProperties(A.prototype, {
                                BBa: {
                                    get: function() {
                                        return this.IQ;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(A.prototype, {
                                AYc: {
                                    get: function() {
                                        return this.Qa.zj;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            A.prototype.zqc = function() {
                                this.IQ || (this.IQ = new v.$X());
                                return this.IQ;
                            }
                            ;
                            A.prototype.Tq = function() {
                                var z;
                                z = {
                                    hasSchedule: !!this.Un.QV,
                                    schedule: this.Un.QV && ({
                                        sleepTime: this.Un.QV.oxb,
                                        originalSleepTime: this.Un.QV.zNc,
                                        clockSkewAdjustments: this.Un.QV.Owa
                                    }),
                                    nextWakeup: this.Un.twa.G,
                                    timeScheduled: this.Un.Jmc,
                                    scheduleType: x[this.Un.Bza],
                                    numTasks: this.Sk.length,
                                    clock: {
                                        ir: this.Qa.zj,
                                        ct: this.Qa.currentTime.G,
                                        sp: this.Qa.speed
                                    }
                                };
                                n.u && this.trace("audit", z);
                                return z;
                            }
                            ;
                            A.prototype.toa = function(z) {
                                var B;
                                B = this;
                                this.iy();
                                this.Ks.clear();
                                this.Qa = z;
                                this.Ks.on(z, "stopStart", function() {
                                    return B.MU();
                                });
                                this.Ks.on(z, "clockAdjusted", function() {
                                    return B.afa();
                                });
                                this.Ks.on(z, "speedChanged", function() {
                                    return B.dNc();
                                });
                                this.afa();
                                this.emit("clockChanged");
                            }
                            ;
                            A.prototype.dNc = function() {
                                this.iy();
                                this.MU();
                            }
                            ;
                            A.prototype.La = function() {
                                this.reset();
                                this.eda && (this.vqa = true);
                                this.Ks.clear();
                                this.Us = true;
                            }
                            ;
                            A.prototype.reset = function() {
                                var z;
                                this.iy();
                                z = this.Sk.Ij();
                                this.Sk.clear();
                                z.forEach(function(B) {
                                    return B.Oe.La();
                                });
                            }
                            ;
                            A.prototype.kd = function() {
                                var z;
                                this.iy();
                                z = this.Sk.Ij();
                                this.Sk.clear();
                                z.forEach(function(B) {
                                    return B.Oe.kd();
                                });
                            }
                            ;
                            A.prototype.afa = function() {
                                var z, B;
                                z = this;
                                B = this.Sk.map(function(C) {
                                    return C.Oe;
                                });
                                this.iy();
                                this.Sk.clear();
                                B.forEach(function(C) {
                                    return z.MY(C, false);
                                });
                                this.MU();
                            }
                            ;
                            A.prototype.MY = function(z, B) {
                                var C, D;
                                undefined === B && (B = true);
                                C = z.swa();
                                D = this.dVb(C);
                                C = {
                                    Oe: z,
                                    $U: D,
                                    fza: C
                                };
                                n.u && this.trace(("Adding task ").concat(z.name, " for ").concat(D.G, " from ").concat(z.tc.name) + ("/").concat(z.tc.priority));
                                (0,
                                e.assert)(!this.Sk.contains(C));
                                this.Sk.push(C);
                                B && this.MU();
                            }
                            ;
                            A.prototype.tBa = function(z) {
                                var B, C;
                                B = this;
                                this.iy();
                                z.mz && this.Sk.map(function(D) {
                                    return D;
                                }).filter(function(D) {
                                    return -1 !== z.mz.indexOf(D.Oe);
                                }).forEach(function(D) {
                                    return B.Sk.remove(D);
                                });
                                null === (C = z.NY) || undefined === C ? undefined : C.forEach(function(D) {
                                    return B.MY(D, false);
                                });
                                this.MU();
                            }
                            ;
                            A.prototype.MU = function() {
                                var z, B, C, D, E, G;
                                z = this;
                                n.u && this.trace("recheck schedule task count:" + this.Sk.length);
                                if (this.AYc) {
                                    if (this.eda)
                                        n.u && this.trace("already executing, bailing");
                                    else if (this.Un.Bza === x.xea)
                                        n.u && this.trace("Already scheduled on microtask, bailing");
                                    else {
                                        C = this.Un.twa;
                                        D = this.Sk.mr();
                                        E = (null === D || undefined === D ? undefined : D.$U) || k.I.uh;
                                        if (E.isFinite() && E.TT(C)) {
                                            if ((this.iy(false),
                                            this.Qa.currentTime.$f(E)))
                                                (this.Un.set(E, x.xea),
                                                Promise.resolve().then(function() {
                                                    z.Un.Bza === x.xea && (z.Un.complete(),
                                                    z.$Qb({
                                                        type: x.xea
                                                    }));
                                                }));
                                            else {
                                                n.u && this.trace("scheduling next wake up for", {
                                                    wnd: E.G,
                                                    Oe: null === D || undefined === D ? undefined : D.Oe.name,
                                                    $Vc: null === D || undefined === D ? undefined : D.Oe.tc.name
                                                });
                                                G = d({
                                                    Qa: this.Qa,
                                                    EA: function() {
                                                        z.Un.complete();
                                                        z.$Qb({
                                                            type: x.setTimeout,
                                                            twa: E,
                                                            delay: z.Qa.currentTime.da(E),
                                                            kR: G.Owa,
                                                            epa: G.epa
                                                        });
                                                    },
                                                    RXb: E,
                                                    priority: null !== (B = null === D || undefined === D ? undefined : D.Oe.tc.priority) && undefined !== B ? B : 0,
                                                    NO: !!A.config.NO,
                                                    Hsb: !!A.config.Gsb
                                                });
                                                this.Un.set(E, x.setTimeout, G);
                                            }
                                        } else
                                            E.isFinite() || this.Un.Bza !== x.setTimeout || this.iy(false);
                                    }
                                } else
                                    (n.u && this.trace("should check schedule is false, stopping"),
                                    this.iy());
                            }
                            ;
                            A.prototype.$Qb = function(z) {
                                var C, D, E, G, F, H;
                                function B() {
                                    return H = true;
                                }
                                G = 0;
                                F = null === (C = this.Sk.mr()) || undefined === C ? undefined : C.fza;
                                H = false;
                                this.Qa.on("stopStart", B);
                                try {
                                    for ((this.eda = true,
                                    null === (D = this.IQ) || undefined === D ? undefined : D.e_c(z)); 1E4 > G++ && this.Z1c() && !H; )
                                        ;
                                } finally {
                                    this.Qa.vm("stopStart", B);
                                    this.eda = false;
                                    null === (E = this.IQ) || undefined === E ? undefined : E.Arc(G);
                                    this.iy();
                                    z = this.Sk.map(function(J) {
                                        return {
                                            name: J.Oe.name,
                                            $Vc: J.Oe.tc.name,
                                            xnd: J.$U.G
                                        };
                                    });
                                    1E4 < G && !this.qBc(F) ? this.error(("Task scheduler executed more than ").concat(1E4) + " iterations in same tick", z.slice(0, 5)) : (n.u && this.trace("Next tasks", z),
                                    this.MU());
                                }
                            }
                            ;
                            A.prototype.qBc = function(z) {
                                var B, C;
                                C = null === (B = this.Sk.mr()) || undefined === B ? undefined : B.fza;
                                return z && C && z.timestamp.equal(C.timestamp) && z.type === C.type ? false : true;
                            }
                            ;
                            A.prototype.nIc = function() {
                                this.eda && (this.vqa = true);
                            }
                            ;
                            A.prototype.Z1c = function() {
                                var z, B, C, D, E, G;
                                D = (null === (z = this.Sk.mr()) || undefined === z ? undefined : z.$U) || k.I.uh;
                                n.u && this.trace(("tryExecuteNextTask @").concat(this.Qa.currentTime.G, ", next wakeup at ").concat(D));
                                z = this.Qa.currentTime;
                                if (z.$f(D)) {
                                    E = this.Sk.pop();
                                    if (E) {
                                        G = E.Oe;
                                        null === (B = this.IQ) || undefined === B ? undefined : B.d_c({
                                            Oe: G,
                                            currentTime: z,
                                            twa: D
                                        });
                                        this.XRa = G;
                                        B = false;
                                        n.u && this.trace("Running a task @" + z.G + ", scheduled for time:" + D.G + ("Name:").concat(G.name));
                                        try {
                                            G.cO();
                                            B = true;
                                            E.fza = G.swa();
                                            E.$U = this.dVb(E.fza);
                                        } catch (F) {
                                            throw (this.error(("Unhandled error from a task ").concat(G.name, " occurred.") + " Removing the task from future executions:" + F, {
                                                stack: F.stack
                                            }),
                                            G.La(),
                                            F);
                                        } finally {
                                            null === (C = this.IQ) || undefined === C ? undefined : C.zrc({
                                                Oe: G,
                                                imd: B
                                            });
                                            this.XRa = undefined;
                                            this.vqa ? (G.La(),
                                            this.vqa = false) : E.$U !== k.I.uh && G.state === r.Sm.yr && ((0,
                                            e.assert)(!this.Sk.contains(E)),
                                            this.Sk.push(E));
                                        }
                                        return true;
                                    }
                                }
                            }
                            ;
                            A.prototype.zga = function(z) {
                                this.PU(z, false);
                                this.MY(z);
                            }
                            ;
                            A.prototype.PU = function(z, B) {
                                var C;
                                undefined === B && (B = true);
                                C = this.Sk.find(function(D) {
                                    return D.Oe === z;
                                });
                                C && this.VTc(C, B);
                            }
                            ;
                            A.prototype.VTc = function(z, B) {
                                this.Sk.remove(z);
                                B && this.MU();
                            }
                            ;
                            A.prototype.iy = function(z) {
                                var B;
                                undefined === z && (z = true);
                                this.Un.QV && (z && this.emit("stopping"),
                                z = this.Un.QV,
                                (z.NO ? q.IQa : clearTimeout)(z.id),
                                this.Un.complete(),
                                null === (B = this.BBa) || undefined === B ? undefined : B.iy());
                            }
                            ;
                            A.prototype.dVb = function(z) {
                                return z.type === u.VP.absolute ? z.timestamp : z.timestamp.add(this.Qa.currentTime);
                            }
                            ;
                            A.prototype.trace = function() {
                                for (var z, B = [], C = 0; C < arguments.length; C++)
                                    B[C] = arguments[C];
                                null === (z = this.console) || undefined === z ? undefined : z.trace.apply(z, c.__spreadArray(["RootTaskScheduler:"], c.__read(B), false));
                            }
                            ;
                            A.prototype.error = function() {
                                for (var z, B = [], C = 0; C < arguments.length; C++)
                                    B[C] = arguments[C];
                                null === (z = this.console) || undefined === z ? undefined : z.error.apply(z, c.__spreadArray(["RootTaskScheduler:"], c.__read(B), false));
                            }
                            ;
                            A.config = {
                                NO: true,
                                Ktb: true,
                                Gsb: true
                            };
                            A.Dza = new WeakMap();
                            return A;
                        }
                        )(g.EventEmitter);
                        b.NX = t;
                    }
