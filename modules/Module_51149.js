/**
 * @module Module_51149
 * @description Class module with ES module exports
 * @categories DRM, Network, Media, ABR, Manifest, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 51149
 * Deobfuscated size: 19871 chars
 * Functions: 29
 * Prototype definitions: 12
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 51149
{
                        var p, c, g, f, e, h, k, l, m;
                        function d(n, q, r) {
                            var u;
                            u = this;
                            this.qr = n;
                            this.VH = q;
                            this.uVb = function(v) {
                                var w, x, y, A, z;
                                w = u.LUb++;
                                x = v.request.EL || "dl";
                                y = u.JDb(x, "start");
                                if (y) {
                                    A = v.request.hN.M;
                                    if (A && !u.QTb.has(A)) {
                                        u.va.trace("trackMediaRequest segmentId", {
                                            PQa: A
                                        });
                                        z = v.nF;
                                        u.qr.dJb(y, A, z ? x + "-" + z + "-" + w : x);
                                        v.Mna(function() {
                                            var B, C;
                                            B = u.JDb(x, "end");
                                            C = z ? x + "-" + z + "-" + w : x;
                                            B && u.qr.dJb(B, A, C);
                                        });
                                    }
                                }
                            }
                            ;
                            this.LUb = 0;
                            this.QTb = new Set();
                            this.va = r.zb("MilestonesEventBuilder");
                            q.Qaa && this.O4c();
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.EHa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(63156);
                        g = a(77134);
                        f = a(5021);
                        e = a(61726);
                        h = a(34231);
                        k = a(79542);
                        a = a(87386);
                        l = {
                            start: {
                                video: c.Pa.HW,
                                audio: c.Pa.DW
                            },
                            end: {
                                video: c.Pa.GW,
                                audio: c.Pa.BW
                            }
                        };
                        d.prototype.UCb = function(n) {
                            var r, u, v, w, x, y, A, z, B;
                            function q(C) {
                                return (0,
                                f.timestamp)(r.orb((0,
                                f.timestamp)(C), n, true));
                            }
                            r = this;
                            v = new Set();
                            w = n.Pf;
                            x = n.Ia;
                            y = undefined === n.JTb ? null : n.JTb;
                            A = this.qr.Dxc(x);
                            z = null === (u = n.fb) || undefined === u ? undefined : u.Qmc;
                            z && z.forEach(function(C) {
                                A.push.apply(A, Ba(r.qr.Cxc(C)));
                            });
                            this.va.trace("getPlayDelayEvents", {
                                jdd: z
                            });
                            this.qr.PTc(n.Ia);
                            z && z.forEach(function(C) {
                                r.qr.OTc(C);
                            });
                            z && 0 < z.length && z.forEach(function(C) {
                                r.QTb.add(C);
                            });
                            u = [];
                            ("pr_ats"in w) && u.push({
                                name: c.Pa.Ila,
                                $n: q(w.pr_ats),
                                Ia: x,
                                correlationId: "request-pre-manifest"
                            });
                            ("ats"in w) && u.push({
                                name: c.Pa.Gla,
                                $n: q(w.ats),
                                Ia: x,
                                correlationId: "request-manifest"
                            });
                            ("pr_at"in w) && u.push({
                                name: c.Pa.Hla,
                                $n: q(w.pr_at),
                                Ia: x,
                                correlationId: "request-pre-manifest"
                            });
                            ("at"in w) && u.push({
                                name: c.Pa.Fla,
                                $n: q(w.at),
                                Ia: x,
                                correlationId: "request-manifest"
                            });
                            z = this.tVa(w, ["ats", "pr_ats"]);
                            B = this.tVa(w, ["at", "pr_at"]);
                            z && u.push({
                                name: c.Pa.Qka,
                                $n: q(w[z]),
                                Ia: x,
                                correlationId: "manifest"
                            });
                            B && u.push({
                                name: c.Pa.Pka,
                                $n: q(w[B]),
                                Ia: x,
                                correlationId: "manifest"
                            });
                            ("lg"in w) && u.push({
                                name: c.Pa.Ela,
                                $n: q(w.lg),
                                Ia: x,
                                correlationId: "request-license"
                            });
                            ("lr"in w) && (u.push({
                                name: c.Pa.Dla,
                                $n: q(w.lr),
                                Ia: x,
                                correlationId: "request-license"
                            }),
                            u.push({
                                name: c.Pa.dja,
                                $n: q(w.lr),
                                Ia: x,
                                correlationId: "apply-license"
                            }));
                            ("ld"in w) && (u.push({
                                name: c.Pa.cja,
                                $n: q(w.ld),
                                Ia: x,
                                correlationId: "apply-license"
                            }),
                            u.push({
                                name: c.Pa.Nja,
                                $n: q(w.ld),
                                Ia: x,
                                correlationId: "drm"
                            }));
                            ("tt_start"in w) && u.push({
                                name: c.Pa.FW,
                                $n: q(w.tt_start),
                                Ia: x,
                                correlationId: "request-timed-text"
                            });
                            ("tt_comp"in w) && u.push({
                                name: c.Pa.EW,
                                $n: q(w.tt_comp),
                                Ia: x,
                                correlationId: "request-timed-text"
                            });
                            ("ffr"in w) && u.push({
                                name: c.Pa.ika,
                                $n: q(w.ffr),
                                Ia: x,
                                correlationId: "first-frame-render"
                            });
                            (z = this.tVa(w, ["drm_start", "lg"])) && u.push({
                                name: c.Pa.Oja,
                                $n: q(w[z]),
                                Ia: x,
                                correlationId: "drm"
                            });
                            ("uiCalledPlay"in w) && u.push({
                                name: c.Pa.qma,
                                $n: q(w.uiCalledPlay),
                                Ia: x,
                                correlationId: "ui-called-play"
                            });
                            w = u.concat(A).map(function(C) {
                                return r.o1c(C, n);
                            }).filter(function(C) {
                                return C.ts <= (null !== y && undefined !== y ? y : C.ts);
                            });
                            x = w.filter(function(C) {
                                var D;
                                C = null !== (D = C.eventName) && undefined !== D ? D : C.eventId;
                                return 0 <= C.indexOf(c.Pa.HW) || 0 <= C.indexOf(c.Pa.DW) || 0 <= C.indexOf(c.Pa.FW);
                            }).reduce(function(C, D) {
                                return Math.min(C, D.ts);
                            }, Infinity);
                            u = w.filter(function(C) {
                                var D;
                                C = null !== (D = C.eventName) && undefined !== D ? D : C.eventId;
                                return 0 <= C.indexOf(c.Pa.GW) || 0 <= C.indexOf(c.Pa.BW) || 0 <= C.indexOf(c.Pa.EW);
                            }).reduce(function(C, D) {
                                return Math.max(C, D.ts);
                            }, -Infinity);
                            Infinity !== x && w.push({
                                eventName: c.Pa.Gja,
                                eventId: "content-buffering",
                                ts: x,
                                comp: "buffering",
                                cat: "cdn",
                                step: "start"
                            });
                            -Infinity !== u && w.push({
                                eventName: c.Pa.Fja,
                                eventId: "content-buffering",
                                ts: u,
                                comp: "buffering",
                                cat: "cdn",
                                step: "end"
                            });
                            w.forEach(function(C) {
                                "end" === C.step && v.add(C.eventId);
                            });
                            return w.filter(function(C) {
                                return "start" !== C.step || v.has(C.eventId) ? true : false;
                            }).sort(function(C, D) {
                                return C.ts - D.ts;
                            }).reduce(function(C, D) {
                                var E;
                                E = D.eventName;
                                delete D.eventName;
                                E && (C[E] = D);
                                return C;
                            }, {});
                        }
                        ;
                        d.prototype.qbc = function(n, q, r) {
                            return (undefined === r ? 0 : r) ? n.na(f.Ba) + q.lk.na(f.Ba) : n.na(f.Ba) - q.lk.na(f.Ba);
                        }
                        ;
                        d.prototype.orb = function(n, q, r) {
                            r = undefined === r ? false : r;
                            if (q.Kr)
                                if (r)
                                    n.na(f.Ba) + q.Kr;
                                else
                                    return n.na(f.Ba) - q.Kr;
                            return this.qbc(n, q, r);
                        }
                        ;
                        d.prototype.o1c = function(n, q) {
                            var r, u;
                            r = n.correlationId;
                            u = n.name;
                            return {
                                eventName: this.XKc(u, r),
                                eventId: r || u,
                                ts: this.orb(n.$n, q),
                                comp: this.Bn(u),
                                cat: this.Bvc(u),
                                step: this.Bzc(u)
                            };
                        }
                        ;
                        d.prototype.XKc = function(n, q) {
                            switch (n) {
                            case c.Pa.FW:
                            case c.Pa.EW:
                            case c.Pa.DW:
                            case c.Pa.BW:
                            case c.Pa.HW:
                            case c.Pa.GW:
                                return n + "-" + q;
                            default:
                                return n;
                            }
                        }
                        ;
                        d.prototype.Bn = function(n) {
                            switch (n) {
                            case c.Pa.Ila:
                            case c.Pa.Hla:
                            case c.Pa.Gla:
                            case c.Pa.Fla:
                            case c.Pa.Qka:
                            case c.Pa.Pka:
                                return "manifest";
                            case c.Pa.Ela:
                            case c.Pa.Dla:
                            case c.Pa.kKa:
                            case c.Pa.jKa:
                            case c.Pa.lka:
                            case c.Pa.kka:
                            case c.Pa.dja:
                            case c.Pa.cja:
                            case c.Pa.Oja:
                            case c.Pa.Nja:
                                return "license";
                            case c.Pa.FW:
                            case c.Pa.EW:
                            case c.Pa.DW:
                            case c.Pa.BW:
                            case c.Pa.HW:
                            case c.Pa.GW:
                            case c.Pa.bCa:
                            case c.Pa.aCa:
                            case c.Pa.Gja:
                            case c.Pa.Fja:
                                return "buffering";
                            case c.Pa.nIa:
                            case c.Pa.mIa:
                            case c.Pa.qma:
                            case c.Pa.ika:
                                return "playback";
                            default:
                                return (0,
                                k.MH)(n);
                            }
                        }
                        ;
                        d.prototype.Bvc = function(n) {
                            switch (n) {
                            case c.Pa.Ila:
                            case c.Pa.Hla:
                            case c.Pa.Gla:
                            case c.Pa.Fla:
                            case c.Pa.Qka:
                            case c.Pa.Pka:
                                return "aws";
                            case c.Pa.Ela:
                            case c.Pa.Dla:
                            case c.Pa.Oja:
                            case c.Pa.Nja:
                                return "mixed";
                            case c.Pa.nIa:
                            case c.Pa.mIa:
                            case c.Pa.kKa:
                            case c.Pa.jKa:
                            case c.Pa.lka:
                            case c.Pa.kka:
                            case c.Pa.dja:
                            case c.Pa.cja:
                            case c.Pa.bCa:
                            case c.Pa.aCa:
                            case c.Pa.ika:
                            case c.Pa.qma:
                                return "device";
                            case c.Pa.FW:
                            case c.Pa.EW:
                            case c.Pa.DW:
                            case c.Pa.BW:
                            case c.Pa.HW:
                            case c.Pa.GW:
                            case c.Pa.Gja:
                            case c.Pa.Fja:
                                return "cdn";
                            default:
                                return (0,
                                k.MH)(n);
                            }
                        }
                        ;
                        d.prototype.Bzc = function(n) {
                            switch (n) {
                            case c.Pa.Ila:
                            case c.Pa.nIa:
                            case c.Pa.Gla:
                            case c.Pa.Ela:
                            case c.Pa.bCa:
                            case c.Pa.FW:
                            case c.Pa.DW:
                            case c.Pa.HW:
                            case c.Pa.kKa:
                            case c.Pa.lka:
                            case c.Pa.dja:
                            case c.Pa.Qka:
                            case c.Pa.Oja:
                            case c.Pa.Gja:
                                return "start";
                            case c.Pa.Hla:
                            case c.Pa.mIa:
                            case c.Pa.Fla:
                            case c.Pa.Dla:
                            case c.Pa.jKa:
                            case c.Pa.kka:
                            case c.Pa.cja:
                            case c.Pa.aCa:
                            case c.Pa.EW:
                            case c.Pa.BW:
                            case c.Pa.GW:
                            case c.Pa.Pka:
                            case c.Pa.Nja:
                            case c.Pa.Fja:
                                return "end";
                            case c.Pa.qma:
                            case c.Pa.ika:
                                return "discrete";
                            default:
                                return (0,
                                k.MH)(n);
                            }
                        }
                        ;
                        d.prototype.JDb = function(n, q) {
                            if ((n in l[q]))
                                return l[q][n];
                        }
                        ;
                        d.prototype.x2c = function() {
                            e.Je.removeEventListener(e.sta, this.uVb);
                        }
                        ;
                        d.prototype.O4c = function() {
                            this.x2c();
                            e.Je.addEventListener(e.sta, this.uVb);
                        }
                        ;
                        d.prototype.tVa = function(n, q) {
                            q = Fa(q);
                            for (var r = q.next(); !r.done; r = q.next())
                                if ((r = r.value,
                                (r in n)))
                                    return r;
                        }
                        ;
                        m = d;
                        b.EHa = m;
                        b.EHa = m = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(g.H7)), t.__param(1, (0,
                        p.v)(h.Rt)), t.__param(2, (0,
                        p.v)(a.Bb))], m);
                    }
