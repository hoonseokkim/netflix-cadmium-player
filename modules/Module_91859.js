/**
 * @module Module_91859
 * @description Class module with ES module exports
 * @categories Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 91859
 * Deobfuscated size: 17206 chars
 * Functions: 66
 * Prototype definitions: 23
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 91859
{
                        var c, g, f, e, h, k, l, m, n, q, r, u, v;
                        function d(w, x, y, A, z, B, C) {
                            this.config = w;
                            this.Kd = y;
                            this.MF = A;
                            this.ZB = z;
                            this.Zxa = B;
                            this.Vk = C;
                            this.Eua = Promise.resolve();
                            this.closed = false;
                            this.log = x.zb("PlaydataServices");
                            this.rU = [];
                            this.active = new Set();
                        }
                        function p(w, x, y, A, z, B) {
                            this.log = w;
                            this.Kd = x;
                            this.ij = y;
                            this.ZB = A;
                            this.MF = z;
                            this.qPc = B;
                            this.Czb = this.fd = false;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.VIa = undefined;
                        t = a(22970);
                        c = a(22674);
                        g = a(5021);
                        f = a(87386);
                        e = a(53085);
                        h = a(32979);
                        k = a(62278);
                        l = a(95398);
                        m = a(36129);
                        n = a(23048);
                        q = a(10469);
                        r = a(45266);
                        u = a(30869);
                        a = a(79274);
                        p.prototype.m2 = function(w, x) {
                            var A;
                            function y() {
                                var z;
                                z = A.ZB.create(A.ij);
                                A.MF.j8a(z).catch(function(B) {
                                    var C;
                                    C = A.Czb ? f.ep.KLa : f.ep.Qt;
                                    A.Czb = true;
                                    A.log.write(C, "Unable to save playdata changes to IDB", B);
                                });
                            }
                            A = this;
                            this.log.trace("Adding initial playdata", x);
                            this.MF.Pac(x).then(function() {
                                A.log.trace("Scheduling monitor", {
                                    interval: w
                                });
                                A.oz = A.Kd.gV(w, y);
                            }).catch(function(z) {
                                A.log.error("Unable to add playdata", {
                                    error: z,
                                    playdata: new n.qla().encode(x)
                                });
                                A.oz = A.Kd.gV(w, y);
                            });
                        }
                        ;
                        p.prototype.stop = function(w) {
                            var x, y;
                            x = this;
                            if (this.fd)
                                return Promise.resolve();
                            this.oz && this.oz.cancel();
                            y = this.ZB.create(this.ij);
                            return this.MF.j8a(y).catch(function(A) {
                                x.log.error("Unable to update playdata changes during stop", A);
                            }).then(function() {
                                if (w) {
                                    if (x.ij.background.value)
                                        return (x.log.trace("Playback is currently in the background and never played, not sending the playdata", y),
                                        Promise.resolve());
                                    x.log.trace("Sending final playdata to the server", y);
                                    return x.qPc.SRb(y);
                                }
                                x.log.trace("Currently configured to not send play data, not sending the data to the server");
                            }).then(function() {
                                if (w)
                                    return (x.log.trace("Removing playdata from the persisted store", y),
                                    x.MF.VPb(y));
                                x.log.trace("Currently configured to not send play data, not removing the play data from IDB");
                            }).then(function() {
                                x.log.info("Successfully stopped the playback", y.R);
                            }).catch(function(A) {
                                x.log.error("Unable to remove playdata changes", A);
                                throw A;
                            });
                        }
                        ;
                        p.prototype.cancel = function() {
                            this.fd = true;
                            this.oz && this.oz.cancel();
                            this.MF.j8a(this.ZB.create(this.ij));
                        }
                        ;
                        d.prototype.Gb = function() {
                            var w;
                            w = this;
                            this.pM || (this.log.trace("Starting playdata services"),
                            this.pM = this.MF.zSc().then(function() {
                                false;
                                return w;
                            }).catch(function(x) {
                                w.log.error("Unable to read the playdata, it will be deleted and not sent to the server", x);
                                return w;
                            }));
                            return this.pM;
                        }
                        ;
                        d.prototype.close = function() {
                            this.closed = true;
                            this.rU.forEach(function(w) {
                                w.m2.cancel();
                            });
                        }
                        ;
                        d.prototype.send = function(w) {
                            var x;
                            if (this.closed)
                                return Promise.resolve();
                            x = this.config;
                            return x.mU && x.i5a ? this.FWc(w) : Promise.resolve();
                        }
                        ;
                        d.prototype.Gm = function(w, x, y) {
                            var A;
                            A = this;
                            this.closed || (this.w6a(w),
                            this.k5a(w).catch(function(z) {
                                A.log.error("Start command failed", {
                                    playdata: z.sU,
                                    error: z.Waa
                                });
                            }),
                            x && this.u6a(this.gxc(w), w, y));
                        }
                        ;
                        d.prototype.zha = function(w) {
                            var x, y, A;
                            x = this;
                            if (this.closed)
                                return Promise.resolve();
                            y = this.ZB.create(w);
                            this.active.delete(y.Ia);
                            w = Fa((0,
                            r.zN)(function(z) {
                                return z.key === y.Ia;
                            }, this.rU));
                            A = w.next().value;
                            this.rU = w.next().value;
                            return Promise.all(A.map(function(z) {
                                z.stopped = true;
                                return z.m2.stop(x.config.i5a);
                            })).then(function() {});
                        }
                        ;
                        d.prototype.w6a = function(w) {
                            var x, y;
                            w.qg("pdb");
                            if (this.config.m2a.TYa()) {
                                x = this.ZB.create(w);
                                y = x.Ia;
                                this.rU.some(function(A) {
                                    return A.key === y;
                                }) ? this.log.trace("Already collecting playdata, ignoring", x) : (this.log.info("Starting to collect playdata", x),
                                this.active.add(y),
                                this.rU.push({
                                    key: y,
                                    m2: this.Oxc(w, x),
                                    zz: false,
                                    stopped: false
                                }));
                            }
                        }
                        ;
                        d.prototype.FWc = function(w) {
                            var x, y, A, z;
                            x = this;
                            y = this.MF.sU.filter(function(B) {
                                return !x.active.has(B.Ia);
                            });
                            A = undefined;
                            z = undefined;
                            w && Infinity === w ? A = y : (y = Fa((0,
                            r.zN)(function(B) {
                                return B.R === w;
                            }, y)),
                            A = y.next().value,
                            z = y.next().value);
                            z && 0 < z.length && this.Kd.zr(this.config.ORb, function() {
                                x.RRb(z).catch(function() {});
                            });
                            return A && 0 !== A.length ? this.RRb(A) : Promise.resolve();
                        }
                        ;
                        d.prototype.RRb = function(w) {
                            var y;
                            function x(A) {
                                return y.Zxa.SRb(A).then(function() {
                                    return y.STc(A);
                                });
                            }
                            y = this;
                            return w.reduce(function(A, z) {
                                return A.then(function() {
                                    return x(z);
                                });
                            }, Promise.resolve());
                        }
                        ;
                        d.prototype.STc = function(w) {
                            var x;
                            x = this;
                            return this.MF.VPb(w).then(function() {}).catch(function(y) {
                                x.log.error("Unable to complete the stop lifecycle event", y);
                                throw y;
                            });
                        }
                        ;
                        d.prototype.Oxc = function(w, x) {
                            w = new p(this.log,this.Kd,w,this.ZB,this.MF,this.Zxa);
                            w.m2(this.config.m2a, x);
                            return w;
                        }
                        ;
                        d.prototype.k5a = function(w) {
                            var x, y;
                            x = this;
                            y = this.ZB.create(w);
                            return this.Zxa.k5a(w, y).then(function() {
                                false;
                                x.fJb(w);
                            }).catch(function(A) {
                                x.fJb(w);
                                throw {
                                    sU: y,
                                    Waa: A
                                };
                            });
                        }
                        ;
                        d.prototype.fJb = function(w) {
                            this.rU.filter(function(x) {
                                return x.key === w.Ia.toString();
                            }).forEach(function(x) {
                                x.zz = true;
                            });
                        }
                        ;
                        d.prototype.PRb = function(w) {
                            return this.c4(q.pla.pause, w, m.ea.gib);
                        }
                        ;
                        d.prototype.QRb = function(w) {
                            return this.c4(q.pla.resume, w, m.ea.ukb);
                        }
                        ;
                        d.prototype.Qza = function(w) {
                            return this.c4(q.pla.splice, w, m.ea.clb);
                        }
                        ;
                        d.prototype.c4 = function(w, x, y) {
                            var z;
                            function A(B) {
                                var C;
                                C = z.rU.filter(function(D) {
                                    return D.key === B.Ia.toString();
                                });
                                return 0 === C.length ? true : C.reduce(function(D, E) {
                                    return D || E.stopped || !E.zz;
                                }, false);
                            }
                            z = this;
                            return A(x) ? this.Eua : this.Eua = this.Eua.catch(function() {
                                return Promise.resolve();
                            }).then(function() {
                                var B;
                                if (A(x))
                                    return Promise.resolve();
                                false;
                                B = z.ZB.create(x);
                                return z.Zxa.c4(w, x, B);
                            }).then(function(B) {
                                false;
                                return B;
                            }).catch(function(B) {
                                var C;
                                z.log.error("Failed to send event", {
                                    eventKey: w,
                                    xid: x.Ia,
                                    error: B
                                });
                                B.wTa ? C = z.Vk(y, B) : B.JI === m.Yka.ud && (C = z.Vk(y, B));
                                throw {
                                    Waa: B,
                                    EN: C
                                };
                            });
                        }
                        ;
                        d.prototype.u6a = function(w, x, y) {
                            var A;
                            A = this;
                            false;
                            this.EQa();
                            this.nZa = this.Kd.zr(w, function() {
                                A.EQa();
                                A.c4(q.pla.wua, x, m.ea.Veb).then(function() {
                                    A.u6a(w, x, y);
                                }).catch(function(z) {
                                    var B;
                                    B = z.Waa;
                                    (z = z.EN) && y(z);
                                    B.JI !== m.Yka.ud && A.u6a(w, x, y);
                                });
                            });
                        }
                        ;
                        d.prototype.WTb = function() {
                            this.EQa();
                        }
                        ;
                        d.prototype.EQa = function() {
                            this.nZa && (this.nZa.cancel(),
                            this.nZa = undefined);
                        }
                        ;
                        d.prototype.gxc = function(w) {
                            return w.qb.uXa ? (0,
                            g.pc)(w.qb.uXa) : this.config.YGb;
                        }
                        ;
                        v = d;
                        b.VIa = v;
                        b.VIa = v = t.__decorate([(0,
                        c.aa)(), t.__param(0, (0,
                        c.v)(l.xjb)), t.__param(1, (0,
                        c.v)(f.Bb)), t.__param(2, (0,
                        c.v)(e.Vl)), t.__param(3, (0,
                        c.v)(k.Mib)), t.__param(4, (0,
                        c.v)(h.TIa)), t.__param(5, (0,
                        c.v)(q.Oib)), t.__param(6, (0,
                        c.v)(a.T7)), t.__param(7, (0,
                        c.v)(u.Yi))], v);
                    }
