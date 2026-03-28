/**
 * @module Module_98516
 * @description Class/prototype module
 * @categories ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 98516
 * Deobfuscated size: 37807 chars
 * Functions: 66
 * Prototype definitions: 47
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 98516
{
                        var D, E, G, F, H, J, M, K, L, O, I, N, Q, S, T, U, X, Y, da, ba, aa, ca, ea, R, P, V, Z, fa, la, ka, sa, qa, wa, na, oa, W, ia, ha, pa, va, Aa;
                        function d(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function p(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function c(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function g(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                            this.f6a = ma.config.f6a;
                            this.og = this.sizes = undefined;
                        }
                        function f(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function e() {
                            for (var ma = new DataView(this), ra = "", ya, ua = 0; ua < this.byteLength; ua++)
                                (ya = ma.getUint8(ua),
                                ra += ("00" + ya.toString(16)).slice(-2));
                            return ra;
                        }
                        function h(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function k(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function l(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function m(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function n(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function q(ma) {
                            function ra(ya, ua, xa, Ca, Ja) {
                                F.call(this, ya, ua, xa, Ca, Ja);
                                this.EKc = ma;
                            }
                            ra.Fd = false;
                            ra.prototype = new F();
                            ra.prototype.constructor = ra;
                            Object.defineProperties(ra.prototype, {
                                rbb: {
                                    get: function() {
                                        return this.EKc;
                                    }
                                }
                            });
                            ra.prototype.parse = function() {
                                this.N.offset = this.startOffset + 4;
                                this.Ec.a9a(this.rbb);
                                this.type = this.rbb;
                                return true;
                            }
                            ;
                            return ra;
                        }
                        function r(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function u(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function v(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function w(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function x(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function y(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function A(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function z(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function B(ma, ra, ya, ua, xa) {
                            F.call(this, ma, ra, ya, ua, xa);
                        }
                        function C(ma, ra) {
                            ma.forEach(function(ya) {
                                ra[ya.Ae] = ya;
                            });
                        }
                        D = a(93334).assert;
                        b = a(75589);
                        E = a(49420).I;
                        G = a(24500);
                        a(2050);
                        a(32296);
                        a(32296);
                        a(32296);
                        F = a(72905).Kf;
                        H = a(71368)["default"];
                        J = a(95797)["default"];
                        M = a(85571)["default"];
                        K = a(45645)["default"];
                        L = a(35503)["default"];
                        O = a(29973)["default"];
                        I = a(19234)["default"];
                        N = a(28721)["default"];
                        Q = a(84379)["default"];
                        a(71724);
                        a(70428);
                        S = a(40755).h9a;
                        T = a(40755).Zbb;
                        U = a(26856)["default"];
                        X = a(29043)["default"];
                        Y = a(41192)["default"];
                        da = a(41192).p9a;
                        ba = a(41192).q9a;
                        aa = a(41192).r9a;
                        ca = a(41192).s9a;
                        ea = a(41116)["default"];
                        R = a(18319)["default"];
                        P = a(56226)["default"];
                        V = a(87206)["default"];
                        Z = a(41192).Kdb;
                        fa = a(41192).ydb;
                        la = a(41192).sbb;
                        ka = a(41192).o9a;
                        sa = a(97066)["default"];
                        qa = a(96345)["default"];
                        wa = a(31025)["default"];
                        na = a(91056)["default"];
                        oa = a(64280)["default"];
                        a(91578);
                        a(59909);
                        a(27364);
                        a(48823);
                        W = a(30717)["default"];
                        ia = a(70179).o8;
                        ha = a(89362)["default"];
                        pa = a(96989)["default"];
                        va = a(23471)["default"];
                        Aa = a(16530)["default"];
                        a = a(53158)["default"];
                        d.Fd = true;
                        d.prototype = new F();
                        d.prototype.constructor = d;
                        p.Fd = true;
                        p.prototype = new F();
                        p.prototype.constructor = p;
                        c.Fd = false;
                        c.prototype = new F();
                        c.prototype.constructor = c;
                        c.prototype.parse = function(ma) {
                            var ra;
                            this.oi();
                            1 === this.version ? (this.N.Am(),
                            this.N.Am(),
                            this.O = this.N.dc(),
                            this.duration = this.N.Am()) : (this.N.dc(),
                            this.N.dc(),
                            this.O = this.N.dc(),
                            this.duration = this.N.dc());
                            ra = this.N.sg() & 32767;
                            this.language = String.fromCharCode(96 + (ra >>> 10), 96 + (ra >>> 5 & 31), 96 + (ra & 31));
                            ma && ma.ce && (ma.ce.O = this.O,
                            ma.ce.duration = this.duration);
                            return true;
                        }
                        ;
                        g.Fd = false;
                        g.prototype = new F();
                        g.prototype.constructor = g;
                        g.prototype.M9b = function() {
                            this.oi();
                            this.N.dc();
                            this.O = this.N.dc();
                            0 === this.version ? (this.jyb = this.N.dc(),
                            this.yAb = this.N.dc()) : (this.jyb = this.N.Am(),
                            this.yAb = this.N.Am());
                            this.vQb = this.N.sg();
                            this.DPb = this.N.sg();
                        }
                        ;
                        g.prototype.P7b = function(ma, ra) {
                            var ya, ua, xa;
                            ya = this.O;
                            ma = ma && ma.O || ya;
                            ua = ma / ya;
                            ya = this.N.Kya(ra, 12, false);
                            xa = 1 === ua ? this.N.Kya(ra, 12, false) : G.from(Uint32Array, {
                                length: ra
                            }, function() {
                                var Ca;
                                Ca = Math.round(this.N.dc() * ua);
                                this.N.offset += 8;
                                return Ca;
                            }, this);
                            this.C$b(ra, xa, ya, ma);
                        }
                        ;
                        g.prototype.C$b = function(ma, ra, ya, ua) {
                            if (this.f6a) {
                                ua = this.f6a * ua / 1E3;
                                for (var xa = 0, Ca = 1; Ca < ma; Ca++)
                                    Math.abs(ra[xa] - ua) > Math.abs(ra[xa] + ra[Ca] - ua) ? (ra[xa] += ra[Ca],
                                    ya[xa] += ya[Ca]) : (++xa,
                                    xa !== Ca && (ra[xa] = ra[Ca],
                                    ya[xa] = ya[Ca]));
                                ++xa;
                                ra = new Uint32Array(ra.buffer.slice(0, 4 * xa));
                                ya = new Uint32Array(ya.buffer.slice(0, 4 * xa));
                            }
                            this.sizes = ya;
                            this.og = ra;
                        }
                        ;
                        g.prototype.parse = function(ma) {
                            var ra, ya, ua, xa;
                            this.M9b();
                            this.Ha = ma.Ha;
                            ra = this.O;
                            ya = this.Ha && this.Ha.O || ra;
                            ua = this.DPb;
                            xa = this.startOffset + this.length + this.yAb;
                            ra = new E(this.jyb,ra).Rc(ya).$;
                            this.Ta = {
                                O: ya,
                                rv: ra,
                                offset: xa
                            };
                            this.P7b(this.Ha, ua);
                            this.Ta.og = this.og;
                            this.Ta.sizes = this.sizes;
                            ma.Po = this;
                            return true;
                        }
                        ;
                        f.Fd = false;
                        f.prototype = new F();
                        f.prototype.constructor = f;
                        f.prototype.parse = function() {
                            var ma;
                            this.PF = [];
                            this.cPc = [];
                            ma = (this.length - 11) / 2;
                            this.N.Hd();
                            this.N.Hd();
                            this.N.Hd();
                            for (var ra = 0; ra < ma; ra++)
                                (this.PF.push(this.N.Hd()),
                                this.cPc.push(this.N.Hd()));
                            return true;
                        }
                        ;
                        h.Fd = false;
                        h.prototype = new F();
                        h.prototype.constructor = h;
                        h.prototype.parse = function(ma) {
                            var ra;
                            this.oi();
                            this.N.offset += 1;
                            if (0 == this.version)
                                this.N.offset += 1;
                            else {
                                ra = this.N.Hd();
                                this.Onc = ra >> 4;
                                this.Snc = ra & 15;
                                ma && ma.ce && (ma.ce.Vdd = this.Onc,
                                ma.ce.Ydd = this.Snc);
                            }
                            this.ixb = this.N.Hd();
                            this.gxb = this.N.Hd();
                            this.pZa = this.N.offset;
                            this.xB = this.N.s3(16);
                            this.xB.toString = e;
                            ma && ma.ce && (ma.ce.Wdd = this.ixb,
                            ma.ce.hxb = this.gxb,
                            ma.ce.Xdd = this.xB);
                            1 == this.ixb && 0 == this.gxb && (this.Nnc = this.N.Hd(),
                            this.Mnc = this.N.s3(this.Nnc),
                            ma && ma.ce && (ma.ce.Pnc = this.Mnc));
                            return true;
                        }
                        ;
                        k.Fd = false;
                        k.prototype = new F();
                        k.prototype.constructor = k;
                        k.prototype.parse = function() {
                            this.oi();
                            this.ww = this.N.sg();
                            this.YIc = this.N.Kya(this.ww, undefined, true);
                            return true;
                        }
                        ;
                        l.Fd = false;
                        l.prototype = new F();
                        l.prototype.constructor = l;
                        l.prototype.parse = function(ma) {
                            var ra, ya, ua, xa, Ca, Ja;
                            ra = ma.Po;
                            D(ra);
                            ma = ma.Ha;
                            ya = ra.O;
                            ra = ra.DPb;
                            D(ma);
                            D(ya);
                            D(ra);
                            this.oi();
                            D(2 > this.version);
                            this.ww = this.N.sg();
                            this.g3 = new Uint16Array(ra + 1);
                            ua = ma.IDb(ya);
                            xa = ua / ya;
                            Ca = ma.Rc(ua).$;
                            if (0 === this.version)
                                for ((this.Q3 = new Uint16Array(),
                                this.Rf = new Uint32Array(),
                                ma = ya = 0); ma <= ra; ++ma) {
                                    if ((this.g3[ma] = ya,
                                    ma < this.ww)) {
                                        Ja = this.N.Hd();
                                        if (0 !== Ja)
                                            for (ua = 0; ua < Ja; (++ua,
                                            ++ya))
                                                (this.Q3[ya] = Math.floor((this.N.dc() + 1) * xa) / Ca,
                                                this.Rf[ya] = this.N.dc());
                                    }
                                }
                            else if (1 === this.version)
                                for ((ua = this.N.tSc(this.ww),
                                this.N.offset += 4,
                                this.Rf = this.N.Kya(this.ww, 10, false),
                                this.N.offset -= 8,
                                this.Q3 = G.from(Uint16Array, {
                                    length: this.ww
                                }, function() {
                                    var La;
                                    La = Math.floor((this.N.dc() + 1) * xa) / Ca;
                                    this.N.offset += 6;
                                    return La;
                                }, this),
                                ya = ma = 0); ma <= ra; ++ma) {
                                    for (; ya < ua.length && ua[ya] < ma; )
                                        ++ya;
                                    this.g3[ma] = ya;
                                }
                            this.en = {
                                g3: this.g3,
                                Q3: this.Q3,
                                Rf: this.Rf
                            };
                            return true;
                        }
                        ;
                        m.Fd = true;
                        m.prototype = Object.create(d.prototype);
                        m.prototype.constructor = m;
                        n.Fd = true;
                        n.prototype = Object.create(d.prototype);
                        n.prototype.constructor = n;
                        n.prototype.OH = function() {
                            var ma;
                            ma = this.Nt("tfhd");
                            ma && (this.CA = ma.Nsb ? ma.CA : this.parent.startOffset);
                            return true;
                        }
                        ;
                        r.Fd = false;
                        r.prototype = new F();
                        r.prototype.constructor = r;
                        r.prototype.parse = function() {
                            var ma, Oa;
                            ma = this.N.offset;
                            this.oi();
                            if (1 === this.version) {
                                this.N.offset += 2;
                                for (var ra = this.N.offset, ya = this.N.Hd(), ua = this.N.Hd(), xa = this.N.Hd(), Ca = this.N.Hd(), Ja = this.N.sg(), La = [], Na = 0; Na < Ja; ++Na)
                                    La = this.N.Hd();
                                Na = (ya & 240) >>> 4;
                                Oa = (ya & 14) >>> 1;
                                ya &= 1;
                                xa = 16 === xa ? 1 : 0;
                                ua != Ca && this.N.console.warn("VP9: Has the VP9 spec for vpcC changed? colourPrimaries " + ua + " and matrixCoefficients " + Ca + " should be the same value!");
                                Ca = 2;
                                switch (ua) {
                                case 1:
                                    Ca = 2;
                                    break;
                                case 6:
                                    Ca = 1;
                                    break;
                                case 9:
                                    Ca = 5;
                                    break;
                                default:
                                    this.N.console.warn("VP9: Unknown colourPrimaries " + ua + "! Falling back to default color space VP9_COLOR_SPACE_BT709_6 (2)");
                                }
                                this.version = 0;
                                this.Ec.$h(this.version, ma);
                                this.Ec.$h(Na << 4 | Ca, ra++);
                                this.Ec.$h(Oa << 4 | xa << 1 | ya, ra++);
                                Ja += 2;
                                La.push(0, 0);
                                this.Ec.rW(Ja, false);
                                ra += 2;
                                La.forEach(function(Ka) {
                                    this.Ec.$h(Ka, ra++);
                                });
                            }
                            return true;
                        }
                        ;
                        u.Fd = false;
                        u.prototype = new F();
                        u.prototype.constructor = u;
                        u.Ae = "tfhd";
                        Object.defineProperties(u.prototype, {
                            Nsb: {
                                get: function() {
                                    return this.flags & 1;
                                }
                            },
                            LVc: {
                                get: function() {
                                    return this.flags & 2;
                                }
                            },
                            Qnc: {
                                get: function() {
                                    return this.flags & 8;
                                }
                            },
                            Rnc: {
                                get: function() {
                                    return this.flags & 16;
                                }
                            },
                            jxb: {
                                get: function() {
                                    return this.flags & 32;
                                }
                            }
                        });
                        u.prototype.parse = function(ma) {
                            this.oi();
                            this.Y4 = this.N.dc();
                            this.CA = this.Nsb ? this.N.Am() : undefined;
                            this.eRb = this.LVc ? this.N.dc() : undefined;
                            this.YD = this.Qnc ? this.N.dc() : undefined;
                            this.ZD = this.Rnc ? this.N.dc() : undefined;
                            this.AH = this.jxb ? this.N.dc() : undefined;
                            ma && ma.Na && (ma.Na.Y4 = this.Y4,
                            ma.Na.CA = this.CA,
                            ma.Na.eRb = this.eRb,
                            ma.Na.YD = this.YD,
                            ma.Na.ZD = this.ZD,
                            ma.Na.AH = this.jxb ? this.AH : undefined);
                            return true;
                        }
                        ;
                        v.Fd = false;
                        v.prototype = new F();
                        v.prototype.constructor = v;
                        v.prototype.parse = function(ma) {
                            this.oi();
                            this.fH = 1 === this.version ? this.N.Am() : this.N.dc();
                            ma && ma.Na && (ma.Na.fH = this.fH);
                            return true;
                        }
                        ;
                        v.prototype.pa = function(ma) {
                            var ra;
                            ra = this.startOffset + 12;
                            this.fH += ma;
                            1 === this.version ? this.Ec.jYb(this.fH, ra) : this.Ec.fo(this.fH, ra);
                        }
                        ;
                        w.Fd = false;
                        w.prototype = Object.create(F.prototype);
                        w.prototype.constructor = w;
                        Object.defineProperties(w.prototype, {
                            WQ: {
                                get: function() {
                                    return this.flags & 1;
                                }
                            }
                        });
                        w.prototype.parse = function(ma) {
                            this.oi();
                            this.WQ && this.N.gC();
                            this.WQ && this.N.dc();
                            this.kSa = this.N.Hd();
                            this.Vd = this.N.dc();
                            0 === this.kSa && this.N.KU(this.Vd);
                            ma && ma.Na && (ma.Na.GVc = this.Vd);
                            return true;
                        }
                        ;
                        w.prototype.pa = function(ma, ra) {
                            if (ma) {
                                ma = ra ? this.Vd - ma : ma;
                                this.Ec.offset = this.startOffset + 13 + (this.WQ ? 8 : 0);
                                this.Vd -= ma;
                                this.Ec.fo(this.Vd);
                                if (0 !== this.kSa) {
                                    this.tza = ra ? 0 : this.kSa * ma;
                                    return;
                                }
                                this.tza = 0;
                                if (ra)
                                    this.Ec.offset += this.Vd;
                                else {
                                    for (ra = 0; ra < ma; ++ra)
                                        this.tza += this.Ec.Hd();
                                    this.Ec.offset -= ma;
                                }
                                this.xr(ma, this.N.offset);
                            }
                            return true;
                        }
                        ;
                        x.Fd = false;
                        x.prototype = Object.create(F.prototype);
                        x.prototype.constructor = x;
                        Object.defineProperties(x.prototype, {
                            WQ: {
                                get: function() {
                                    return this.flags & 1;
                                }
                            }
                        });
                        x.prototype.parse = function(ma) {
                            var ra, ya, Na, Oa;
                            this.oi();
                            this.WQ && this.N.gC();
                            this.WQ && this.N.dc();
                            this.ww = this.N.dc();
                            D(1 === this.ww, "Expected a single entry in Sample Auxiliary Information Offsets box");
                            this.zl = 0 === this.version ? this.N.Ufa() : this.N.mPb();
                            this.N.offset = this.zl;
                            if (ma && ma.Na && ma.ce) {
                                ra = ma.ce.hxb;
                                ya = ma.Na.GVc;
                                D(0 < ra || undefined !== ma.ce.Pnc, "Expected per sample or constant IV");
                                D(0 < ya, "Expected saix box parsing to find sample count");
                                ma.Na.eV = [];
                                for (var ua = 0; ua < ya; ua++) {
                                    for (var xa = ra ? this.N.s3(ra) : undefined, Ca = [], Ja = this.N.sg(), La = 0; La < Ja; La++) {
                                        Na = this.N.sg();
                                        Oa = this.N.dc();
                                        Ca.push({
                                            bfc: Na,
                                            cfc: Oa
                                        });
                                    }
                                    ma.Na.eV.push({
                                        O6a: Ca,
                                        QFa: xa
                                    });
                                }
                            }
                            return true;
                        }
                        ;
                        x.prototype.pa = function(ma, ra) {
                            this.zl += ma;
                            this.Ec.offset = this.startOffset + 16 + (this.WQ ? 8 : 0) + (0 === this.version ? 0 : 4);
                            this.Ec.d9a(ra, this.zl);
                            return true;
                        }
                        ;
                        y.Fd = false;
                        y.prototype = Object.create(F.prototype);
                        y.prototype.constructor = y;
                        A.Fd = false;
                        A.prototype = Object.create(y.prototype);
                        A.prototype.constructor = A;
                        Object.defineProperties(y.prototype, {
                            M1a: {
                                get: function() {
                                    return false;
                                }
                            },
                            jXb: {
                                get: function() {
                                    return this.flags & 2;
                                }
                            }
                        });
                        Object.defineProperties(A.prototype, {
                            M1a: {
                                get: function() {
                                    return this.flags & 1;
                                }
                            }
                        });
                        y.prototype.parse = function(ma) {
                            var ra, ya, Ca, Ja;
                            this.oi();
                            ya = null === (ra = null === ma || undefined === ma ? undefined : ma.ce) || undefined === ra ? undefined : ra.hxb;
                            this.HM = undefined !== ya ? ya : 8;
                            this.M1a && (this.HM = this.N.dc() & 255,
                            this.kid = this.N.KU(16));
                            if (ma && ma.Na) {
                                if (ma.Na.eV)
                                    return true;
                                ma.Na.Kl || (ma.Na.Kl = []);
                            }
                            if (0 !== this.HM && 8 !== this.HM && 16 !== this.HM)
                                return true;
                            this.Vd = this.N.dc();
                            if (ma && ma.Na)
                                for (ra = 0; ra < this.Vd; ra++)
                                    if ((ma.Na.Kl[ra].QFa = 0 < this.HM ? this.N.s3(this.HM) : undefined,
                                    this.jXb)) {
                                        ya = [];
                                        for (var ua = this.N.sg(), xa = 0; xa < ua; xa++) {
                                            Ca = this.N.sg();
                                            Ja = this.N.dc();
                                            ya.push({
                                                bfc: Ca,
                                                cfc: Ja
                                            });
                                        }
                                        ma.Na.Kl[ra].O6a = ya;
                                    }
                            return true;
                        }
                        ;
                        A.prototype.pa = function(ma, ra) {
                            return y.prototype.pa.call(this, ma, ra, 28 + (this.M1a ? 20 : 0));
                        }
                        ;
                        y.prototype.pa = function(ma, ra, ya) {
                            var ua;
                            ma = ra ? this.Vd - ma : ma;
                            this.Ec.offset = this.startOffset + (ya || 12);
                            this.Vd -= ma;
                            this.Ec.fo(this.Vd);
                            ya = this.Ec.offset;
                            if (this.jXb)
                                for (ma = ra ? this.Vd : ma; 0 < ma; --ma) {
                                    this.Ec.offset += this.HM;
                                    ua = this.Ec.sg();
                                    this.Ec.offset += 6 * ua;
                                }
                            else
                                this.Ec.offset += this.HM * (ra ? this.Vd : ma);
                            ra ? this.xr(this.length - (this.N.offset - this.startOffset), this.N.offset) : this.xr(this.N.offset - ya, ya);
                        }
                        ;
                        z.Fd = false;
                        z.prototype = Object.create(F.prototype);
                        z.prototype.constructor = z;
                        z.prototype.parse = function(ma) {
                            this.oi();
                            if (ma && ma.Na) {
                                undefined === ma.Na.Kl && (ma.Na.Kl = []);
                                for (var ra = 0; ra < this.length - 12; ra++)
                                    ma.Na.Kl[ra].gld = this.N.Hd();
                            }
                            return true;
                        }
                        ;
                        z.prototype.pa = function(ma, ra, ya) {
                            if (this.length - 12 !== ra)
                                return true;
                            ya ? this.xr(ra - ma, this.startOffset + 12 + ma) : this.xr(ma, this.startOffset + 12);
                            return true;
                        }
                        ;
                        B.Fd = false;
                        B.prototype = Object.create(F.prototype);
                        B.prototype.constructor = B;
                        B.prototype.parse = function() {
                            this.oi();
                            this.N.gC();
                            1 === this.version && this.N.dc();
                            this.ww = this.N.dc();
                            this.Gga = [];
                            for (var ma = 0; ma < this.ww; ++ma)
                                for (var ra = this.N.dc(), ya = this.N.dc(), ua = 0; ua < ra; ++ua)
                                    this.Gga.push(ya);
                            return true;
                        }
                        ;
                        B.prototype.pa = function(ma, ra) {
                            this.Gga = ra ? this.Gga.slice(0, ma) : this.Gga.slice(ma);
                            ma = this.Gga.reduce(function(ya, ua) {
                                0 !== ya.length && ya[ya.length - 1].group === ua || ya.push({
                                    group: ua,
                                    count: 0
                                });
                                ++ya[ya.length - 1].count;
                                return ya;
                            }, []);
                            this.Ec.offset = this.startOffset + 16 + (1 === this.version ? 4 : 0);
                            this.Ec.fo(ma.length);
                            ma.forEach((function(ya) {
                                this.Ec.fo(ya.count);
                                this.Ec.fo(ya.group);
                            }
                            ).bind(this));
                            this.ww > ma.length && this.xr(8 * (this.ww - ma.length));
                            this.ww = ma.length;
                            return true;
                        }
                        ;
                        Y = {
                            Se: {
                                moov: p,
                                trak: d,
                                mdia: d,
                                mdhd: c,
                                minf: d,
                                encv: Y,
                                schi: d,
                                sidx: g,
                                sinf: d,
                                senc: y,
                                stbl: d,
                                tenc: h,
                                mvex: d,
                                moof: m,
                                traf: n,
                                tfhd: u,
                                trun: ia,
                                sbgp: B,
                                sdtp: z,
                                saiz: w,
                                saio: x,
                                tfdt: v,
                                mdat: Aa,
                                vmaf: f,
                                edts: d
                            },
                            L1c: {
                                vpcC: r,
                                SmDm: q("smdm"),
                                CoLL: q("coll")
                            },
                            KVb: {
                                schm: ea
                            },
                            O4a: {}
                        };
                        C([R, P, O, a, pa, I, ha, N, Z, fa, la, V, ka, H, K, na, oa, L, Q, J, M, W, ia], Y.Se);
                        C([S, U, da, ba, aa, ca, T, X, qa, sa, va], Y.O4a);
                        C([R, ea], Y.KVb);
                        Y.Se[b.nib] = h;
                        Y.Se[b.ala] = k;
                        Y.Se[b.$ka] = l;
                        Y.Se[b.mib] = A;
                        Y.O4a[b.QHa] = wa;
                        Y.Kf = F;
                        t.exports = {
                            o2: Y
                        };
                    }
