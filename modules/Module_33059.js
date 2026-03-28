/**
 * @module Module_33059
 * @description Class module with ES module exports
 * @categories Crypto, Network, Media, ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 33059
 * Deobfuscated size: 23588 chars
 * Functions: 54
 * Prototype definitions: 33
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 33059
{
                        var p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x;
                        function d(y, A) {
                            this.j = y;
                            this.Ll = A;
                            this.w0c = false;
                            this.log = (0,
                            g.Fo)(this.j, "MediaAppendManager");
                            this.jc = this.j.jc;
                            this.Ja = this.jc.Ja;
                            this.Ria = this.a$ = false;
                            this.audio = {
                                type: c.mj.audio,
                                my: [],
                                Op: [],
                                Z2: false
                            };
                            this.video = {
                                type: c.mj.video,
                                my: [],
                                Op: [],
                                Z2: false
                            };
                            y = {};
                            this.ZV = (y[v.l.U] = this.video,
                            y[v.l.V] = this.audio,
                            y);
                            this.closed = false;
                            this.AI = p.config.AI;
                            this.Rva = p.config.Rva;
                            this.wN = this.j.qb.bh ? p.config.F1a : p.config.wN;
                            this.Fsb = true;
                            this.Pd = g.Za.get("Base64EncoderSymbol");
                            this.iUa = false;
                            (0,
                            e.ta)(this.AI > this.Rva, "bad config");
                            (0,
                            e.ta)(this.AI > this.wN, "bad config");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Fgb = undefined;
                        p = a(29204);
                        c = a(51344);
                        g = a(31276);
                        f = a(36129);
                        e = a(45146);
                        h = a(3887);
                        k = a(33096);
                        l = a(85001);
                        m = a(93294);
                        n = a(5021);
                        q = a(63156);
                        r = a(75568);
                        u = a(69931);
                        v = a(26388);
                        w = a(79048);
                        x = a(22210);
                        d.prototype.r0 = function() {
                            var z, B;
                            function y(C, D) {
                                return A(C, D.gN);
                            }
                            function A(C, D) {
                                var E, G, F, H;
                                F = !!D.response;
                                H = D.response;
                                if (D.Ee)
                                    return C + (H.byteLength || 0);
                                D = (null !== (E = null === D || undefined === D ? undefined : D.Xoa) && undefined !== E ? E : 0) - (null !== (G = null === D || undefined === D ? undefined : D.Yoa) && undefined !== G ? G : 0);
                                return (F ? H.byteLength : D) + C;
                            }
                            z = this.ZV[v.l.U];
                            B = this.ZV[v.l.V];
                            return {
                                videoToAppend: z.Op.reduce(A, 0),
                                videoInBuffer: z.my.reduce(y, 0),
                                audioToAppend: B.Op.reduce(A, 0),
                                audioInBuffer: B.my.reduce(y, 0)
                            };
                        }
                        ;
                        d.prototype.s0 = function() {
                            return {
                                audioBufferedSegments: this.audio.my.map(function(y) {
                                    return [y.gN.PN, y.gN.kF];
                                }),
                                videoBufferedSegments: this.video.my.map(function(y) {
                                    return [y.gN.PN, y.gN.kF];
                                })
                            };
                        }
                        ;
                        d.prototype.pLc = function() {
                            this.audio.ee && !this.audio.ee.ak() && (false,
                            this.audio.ee.Jrb(new Uint8Array([0, 0, 0, 8, 102, 114, 101, 101])));
                        }
                        ;
                        d.prototype.TXc = function() {
                            this.audio.Z5a = true;
                            this.video.Z5a = true;
                        }
                        ;
                        d.prototype.YXc = function(y) {
                            y === v.l.V ? this.a$ = true : y === v.l.U && (this.Ria = true);
                        }
                        ;
                        d.prototype.ak = function() {
                            var y, A;
                            return !(null === (y = this.audio.ee) || undefined === y || !y.ak()) || !(null === (A = this.video.ee) || undefined === A || !A.ak());
                        }
                        ;
                        d.prototype.bha = function(y) {
                            var A, z;
                            null === (A = this.audio.ee) || undefined === A ? undefined : A.bha(y);
                            null === (z = this.video.ee) || undefined === z ? undefined : z.bha(y);
                        }
                        ;
                        d.prototype.acc = function(y) {
                            var A;
                            y.mediaType === v.l.V ? this.a$ = false : y.mediaType === v.l.U && (this.Ria = false);
                            A = this.ZV[y.mediaType];
                            A ? A.Op.push(y) : (0,
                            e.ta)(false);
                        }
                        ;
                        d.prototype.$bc = function(y, A, z) {
                            A = this.itb(y.mediaType, A, z);
                            this.iUa || y.mediaType !== v.l.U || (this.FQc(y, z.profile),
                            this.iUa = true);
                            this.Krb(A);
                        }
                        ;
                        d.prototype.Krb = function(y) {
                            var A;
                            A = this.ZV[y.mediaType];
                            A ? A.Op.push(y) : (0,
                            e.ta)(false);
                        }
                        ;
                        d.prototype.itb = function(y, A, z) {
                            return {
                                mediaType: y,
                                rB: false,
                                response: A,
                                pg: function() {
                                    return "header";
                                },
                                get Ee() {
                                    return !this.rB;
                                },
                                profile: z.profile
                            };
                        }
                        ;
                        d.prototype.FQc = function(y, A) {
                            (0,
                            e.ta)(!!y.HTb, "startOfSegment properties need to be set before first header is appended");
                            this.iUa || !p.config.KAb || !this.j.bta() && !this.j.Gw() || y.HTb.YFb || (this.log.trace("Force appending encrypted stream header first to allow mixed clear & encrypted content"),
                            y = this.wwc(A),
                            this.Krb(this.itb(v.l.U, y.data, {
                                profile: y.profile
                            })));
                        }
                        ;
                        d.prototype.wwc = function(y) {
                            var A;
                            A = y;
                            x.xe.Sl.test(y) ? y = k.N$a : x.xe.Tl.test(y) ? y = k.P$a : x.xe.wFa.test(y) ? y = k.O$a : (A = r.H.wP,
                            y = k.M$a);
                            return {
                                data: this.Pd.decode(y),
                                profile: A
                            };
                        }
                        ;
                        d.prototype.XXc = function(y) {
                            var A;
                            A = this.ZV[y.type];
                            if (A)
                                try {
                                    A.ee = y;
                                } catch (z) {
                                    this.Gg(f.ea.qIa, {
                                        Ya: (0,
                                        m.pVa)(y.type),
                                        Cf: (0,
                                        h.Yj)(z)
                                    });
                                }
                        }
                        ;
                        d.prototype.close = function() {
                            this.Ja = this.jc = undefined;
                            this.closed = true;
                        }
                        ;
                        d.prototype.Gg = function(y, A, z) {
                            this.closed || this.j.Gg(y, A, z);
                        }
                        ;
                        d.prototype.cSa = function(y) {
                            return this.Sxb(this.audio, y, this.cqa()) && this.Sxb(this.video, y, this.cqa());
                        }
                        ;
                        d.prototype.cqa = function() {
                            return this.j.bc.value === l.Qb.Bh ? this.wN : this.Rva;
                        }
                        ;
                        d.prototype.q1c = function() {
                            var y, A;
                            y = this.video.Op.filter(function(z) {
                                return !z.Ee;
                            }).reduce(function(z, B) {
                                return z + B.th;
                            }, 0);
                            A = this.audio.Op.filter(function(z) {
                                return !z.Ee;
                            }).reduce(function(z, B) {
                                return z + B.th;
                            }, 0);
                            return Math.min(y, A);
                        }
                        ;
                        d.prototype.Sxb = function(y, A, z) {
                            var B;
                            B = y.dSa;
                            B = B && B.gN;
                            return !y.ee || 0 === y.Op.length && (y.type === c.mj.audio && this.a$ || y.type === c.mj.video && this.Ria) ? true : B && B.kF - A >= z || false;
                        }
                        ;
                        d.prototype.OVb = function(y) {
                            this.w0c || (this.NVb(this.audio, y),
                            this.NVb(this.video, y));
                            this.closed || this.Vtb();
                        }
                        ;
                        d.prototype.Vtb = function() {
                            var y, A, z, B, C, D;
                            B = !this.audio.ee || 0 !== this.audio.my.length;
                            C = 0 === this.video.Op.length && this.Ria;
                            D = !this.video.ee || 0 !== this.video.my.length;
                            !(0 === this.audio.Op.length && this.a$ && D || C && B) || (null === (y = this.audio.ee) || undefined === y ? 0 : y.ak()) || (null === (A = this.video.ee) || undefined === A ? 0 : A.ak()) || this.oTa || !(this.Ja.readyState > q.zv.aK.HAVE_NOTHING) || this.Ll.sda || (this.oTa = true,
                            null === (z = this.jc) || undefined === z ? undefined : z.endOfStream());
                        }
                        ;
                        d.prototype.NVb = function(y, A) {
                            var z, B, C, D;
                            if (!this.closed && y.ee) {
                                B = y.ee;
                                C = y.my;
                                !B.ak() && 0 < C.length && (y.dSa = C[C.length - 1]);
                                if (y.Z5a) {
                                    if (B.ak())
                                        return;
                                    y.Z5a = false;
                                    D = null === (z = this.jc) || undefined === z ? undefined : z.WVa().R2a(n.Ba);
                                    D && 0 < D && B.remove(0, D / k.Ur);
                                }
                                for (z = y.Op[0]; z && z.response && (z.Ee || z.PN - A <= this.AI); )
                                    if ((this.oTa = false,
                                    this.b2c(z)))
                                        (y.Op.shift(),
                                        z = y.Op[0]);
                                    else
                                        break;
                                !B.ak() && 0 < C.length && (y.dSa = C[C.length - 1]);
                            }
                        }
                        ;
                        d.prototype.b2c = function(y) {
                            var A, z, B;
                            false;
                            (0,
                            e.ta)(y && !!y.response);
                            A = y.response;
                            z = y.mediaType;
                            B = this.ZV[z];
                            if (!this.closed && B.ee && !B.ee.ak()) {
                                try {
                                    y.Ee && y.profile && B.ee.Bgc(y.profile);
                                    this.log.trace("Feeding media segment to decoder", {
                                        Bytes: A.byteLength
                                    });
                                    B.ee.Jrb(A, y);
                                    y.Ee || B.my.push(this.flc(y));
                                } catch (C) {
                                    "QuotaExceededError" === C.name ? (this.j.eqa = this.j.eqa ? this.j.eqa + 1 : 1,
                                    this.Fsb = false,
                                    B.Z2 = true) : (this.log.error("Exception while appending media", y, C),
                                    this.Gg("CodecSwitchingError" === C.name ? f.ea.uib : f.ea.T4b, (0,
                                    m.pVa)(z)));
                                    return;
                                }
                                return true;
                            }
                        }
                        ;
                        d.prototype.Xkc = function(y) {
                            var A;
                            if (u.SKa[y.Oa])
                                return u.SKa[y.Oa];
                            A = this.j.gEb(y.md);
                            A || (this.log.warn("Could not find CDN", {
                                cdnId: y.md
                            }),
                            A = {
                                id: y.md,
                                sIb: y.location
                            });
                            return A;
                        }
                        ;
                        d.prototype.IRa = function(y) {
                            var A, z;
                            A = y.Oa;
                            if (u.TKa[A])
                                return u.TKa[A];
                            y.mediaType === v.l.V ? z = this.j.cEb(A) : y.mediaType === v.l.U && (z = this.j.yEb(A));
                            z || this.log.error("Could not find stream", {
                                stream: A
                            });
                            return z;
                        }
                        ;
                        d.prototype.flc = function(y) {
                            var A, z, B, C;
                            z = this.IRa(y);
                            B = {
                                startTime: Math.floor(y.PN),
                                endTime: Math.floor(y.kF),
                                Yic: Math.floor(y.em),
                                jvb: Math.floor(y.em + y.th)
                            };
                            C = null === z || undefined === z ? undefined : z.track.ym;
                            "content" === C && (null === (A = this.j.fb) || undefined === A ? 0 : A.ei) && (A = this.j.fb.ei.ba[y.M],
                            A.type === w.ed.vc || A.type === w.ed.Sa) && (C = "ads");
                            return {
                                gN: y,
                                stream: z,
                                CZ: B,
                                Yc: this.Xkc(y),
                                ym: C
                            };
                        }
                        ;
                        d.prototype.rQa = function(y) {
                            this.bub(y, v.l.V);
                            this.bub(y, v.l.U);
                        }
                        ;
                        d.prototype.bub = function(y, A) {
                            var z, B, C, D, E, G, F, H, J;
                            z = this;
                            C = y;
                            this.Fsb && (C -= p.config.CI);
                            D = this.ZV[A];
                            E = D.my;
                            H = false;
                            E.some(function(M, K) {
                                var L;
                                L = M.gN;
                                if (y < L.PN - 50)
                                    return ((0,
                                    e.ta)(false, "decoder content does not contain media time"),
                                    true);
                                C >= L.kF && (G = K);
                                if (y < L.kF)
                                    return (F = K,
                                    K = A === v.l.V ? z.j.gf : z.j.Fe,
                                    M !== K.value && (K.set(M),
                                    H = true),
                                    true);
                            });
                            if ((D.Z2 || H) && undefined !== G && !this.oTa) {
                                if (G + 1 === F) {
                                    if (0 === G)
                                        return;
                                    G--;
                                }
                                J = G === E.length - 1 ? null === (B = this.jc) || undefined === B ? undefined : B.WVa().R2a(n.Ba) : E[G].gN.kF - 1;
                                false;
                                J && 0 < J && ((B = D.ee) && !B.ak() ? (B.remove(0, J / k.Ur),
                                D.Z2 = false,
                                E.splice(0, G + 1)) : (D.Z2 = true,
                                false));
                            }
                        }
                        ;
                        d.prototype.xQb = function() {
                            false;
                            [this.audio, this.video].forEach(function(y) {
                                y.my = [];
                                y.dSa = undefined;
                                y.Op = [];
                            });
                            this.Ria = this.a$ = false;
                            this.j.fireEvent(l.ja.sea);
                        }
                        ;
                        d.prototype.VWa = function() {
                            return [this.audio, this.video].filter(function(y) {
                                return y.ee;
                            });
                        }
                        ;
                        d.prototype.zvc = function() {
                            var y, A;
                            if (this.ak())
                                (0,
                                e.ta)(false, "should not be busy while checking buffer ranges");
                            else {
                                y = this.VWa().map(function(z) {
                                    var B, C, D, E, G;
                                    E = z.Op.filter(function(F) {
                                        return F.rB;
                                    });
                                    G = z.ee.buffered();
                                    z = G.length ? Math.ceil(1E3 * G.start(0)) : undefined;
                                    G = G.length ? Math.floor(1E3 * G.end(G.length - 1)) : undefined;
                                    z = null !== z && undefined !== z ? z : null === (B = E[0]) || undefined === B ? undefined : B.PN;
                                    B = null !== (D = null === (C = E[E.length - 1]) || undefined === C ? undefined : C.kF) && undefined !== D ? D : G;
                                    if (undefined !== z && undefined !== B)
                                        return {
                                            start: z,
                                            end: B
                                        };
                                });
                                if (y.every(function(z) {
                                    return z;
                                })) {
                                    A = Math.max.apply(Math, Ba(y.map(function(z) {
                                        return z.start;
                                    })));
                                    y = Math.min.apply(Math, Ba(y.map(function(z) {
                                        return z.end;
                                    })));
                                    if (y > A)
                                        return {
                                            start: (0,
                                            n.pc)(A),
                                            end: (0,
                                            n.pc)(y)
                                        };
                                }
                            }
                        }
                        ;
                        d.prototype.skip = function(y) {
                            (0,
                            e.ta)(!this.ak(), "should not be busy while skipping");
                            this.VWa().forEach(function(A) {
                                A.Z2 = true;
                            });
                            this.rQa(y);
                            this.VWa().forEach(function(A) {
                                0 < A.my.length || (A.Op = A.Op.filter(function(z) {
                                    return z.Ee || z.kF > y ? true : false;
                                }));
                            });
                        }
                        ;
                        b.Fgb = d;
                    }
