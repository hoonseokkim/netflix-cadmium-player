/**
 * @module Module_99886
 * @description Class/prototype module
 * @categories Network, Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 99886
 * Deobfuscated size: 12530 chars
 * Functions: 21
 * Prototype definitions: 14
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 99886
{
                        var g, f, e, h, k, l, m;
                        function d(n, q, r, u, v, w) {
                            this.R = this.J = n;
                            this.priority = q;
                            this.yd = r;
                            w && w.Ye && (this.Ye = w.Ye);
                            undefined !== u && (this.c3 = u);
                            this.zp = v;
                            this.Xa = w;
                        }
                        function p(n, q, r, u, v) {
                            e(undefined !== u, "video preparer is null");
                            e(undefined !== v, "ui preparer is null");
                            this.ub = q || console;
                            this.ub = q;
                            this.ya = r;
                            this.G$b = u;
                            this.x$b = v;
                            this.qpb = l.Q2a;
                            this.uY = [];
                            this.QNa = false;
                            this.C8 = 0;
                            new m().on(l, "changed", c, this);
                            this.reset();
                        }
                        function c() {
                            this.ub.log("config changed");
                            l.Q2a && (this.qpb = l.Q2a);
                            l.Iea !== this.nY && (this.reset(),
                            this.e4a());
                        }
                        g = a(79809);
                        f = a(45578);
                        b = a(76122);
                        e = b.assert;
                        h = b.iAb;
                        k = a(90638);
                        l = a(94030).config;
                        m = a(41628).sf;
                        l.declare({
                            Q2a: ["ppmConfig", {
                                D6c: {
                                    vLb: 0,
                                    uLb: 2,
                                    rLb: 0,
                                    sLb: 5,
                                    OSb: 0
                                },
                                Ead: {
                                    vLb: 0,
                                    uLb: 1,
                                    rLb: 0,
                                    sLb: 3,
                                    OSb: 1E3
                                },
                                S6c: {
                                    vLb: 0,
                                    uLb: 1,
                                    rLb: 0,
                                    sLb: 3,
                                    OSb: 1E3
                                }
                            }]
                        });
                        p.prototype.constructor = p;
                        p.prototype.reset = function() {
                            this.yMa = true;
                            this.nY = l.Iea;
                            this.ub.log("create model: " + l.Iea, l.WQb, l.Jub);
                            switch (l.Iea) {
                            case "modelone":
                                this.nY = new k(this.ub);
                                break;
                            default:
                                this.nY = new k(this.ub);
                            }
                        }
                        ;
                        p.prototype.e4a = function() {
                            var q, r;
                            if (false === this.QNa) {
                                this.QNa = true;
                                for (var n = 0; n < this.uY.length; n++) {
                                    this.ub.log("PlayPredictionModel replay: ", JSON.stringify(this.uY[n]));
                                    q = this.qvb(this.uY[n]);
                                    r = this.kBb(q);
                                    this.nY.update(q, r);
                                    this.yMa = false;
                                }
                                this.uY = [];
                            }
                        }
                        ;
                        p.prototype.update = function(n) {
                            var q, r, u;
                            this.ub.log("PlayPredictionModel update: ", JSON.stringify(n));
                            if (n && n.xc && n.xc[0]) {
                                false === this.QNa && this.uY.length < l.GIc && this.uY.push(n);
                                q = this.qvb(n);
                                r = this.kBb(q);
                                this.ub.log("actionType", r);
                                q = "mlmodel" == l.Iea ? this.nY.update(n, r) : this.nY.update(q, r);
                                q = this.Muc(q, l.fFc || 1);
                                this.ub.log("PlayPredictionModel.prototype.update() - returnedList: ", JSON.stringify(q));
                                0 === this.C8 && (this.C8 = g(),
                                this.ya && this.ya.kga && this.ya.kga({
                                    ooc: this.C8
                                }));
                                if (this.ya && this.ya.dUc) {
                                    this.ewc();
                                    u = [];
                                    q.forEach(function(v) {
                                        u.push({
                                            vmd: v.J
                                        });
                                    });
                                    JSON.stringify(n);
                                    JSON.stringify(q);
                                }
                                this.G$b.CU(q);
                                this.x$b.CU(q);
                                this.yMa = false;
                            }
                        }
                        ;
                        p.prototype.ewc = function() {
                            g();
                        }
                        ;
                        p.prototype.kga = function() {
                            this.C8 = g();
                            this.ya && this.ya.kga && this.ya.kga({
                                ooc: this.C8
                            });
                        }
                        ;
                        p.prototype.qvb = function(n) {
                            var q, r, u, v, w;
                            q = {};
                            u = n.xc || [];
                            v = (function(x) {
                                var y, A;
                                y = {};
                                w = f.q7.name.indexOf(x.context);
                                y.context = 0 <= w ? w : f.q7.pG;
                                y.rowIndex = x.rowIndex;
                                y.requestId = x.requestId;
                                y.list = [];
                                r = x.list || [];
                                r.forEach((function(z) {
                                    A = {
                                        J: z.J,
                                        yd: z.yd,
                                        index: z.index,
                                        c3: z.c3,
                                        lya: z.lya,
                                        list: z.list,
                                        Xa: z.Xa
                                    };
                                    undefined !== z.property && (w = f.hX.name.indexOf(z.property),
                                    A.property = 0 <= w ? w : f.hX.pG);
                                    y.list.push(A);
                                }
                                ).bind(this));
                                q.xc.push(y);
                            }
                            ).bind(this);
                            if (undefined !== n.direction) {
                                w = f.XC.name.indexOf(n.direction);
                                q.direction = 0 <= w ? w : f.XC.pG;
                            }
                            undefined !== n.rba && (q.mfd = n.rba.rowIndex,
                            q.lfd = n.rba.lic);
                            q.rba = n.rba;
                            q.xc = [];
                            u.forEach(v);
                            return q;
                        }
                        ;
                        p.prototype.kBb = function(n) {
                            var q, r, u;
                            q = n.direction || f.XC.pG;
                            r = n.rba;
                            u = n.xc || [];
                            true === this.yMa ? n = f.SF.Rcb : true === u.some(this.nBc) ? (n = f.SF.P7,
                            this.aza(u, q, r)) : n = u[0].context === f.q7.Ula ? f.SF.Ula : q === f.XC.xkb || q === f.XC.ifb ? f.SF.Wkb : f.SF.pG;
                            return n;
                        }
                        ;
                        p.prototype.nBc = function(n) {
                            return (n.list || []).some(function(q) {
                                return q.property === f.hX.P7 || q.property === f.hX.nbb;
                            });
                        }
                        ;
                        p.prototype.aza = function(n, q, r) {
                            var u, v;
                            this.ub.log("reportPlayFocusEvent: ", q, r);
                            u = {};
                            v = h(n);
                            this.ya && this.ya.aza && (u.Red = g(),
                            u.direction = f.XC.name[q],
                            r && (u.rowIndex = r.rowIndex,
                            u.Kub = r.lic),
                            undefined !== v.Tn && (u.requestId = n[v.Tn].requestId),
                            this.ya.aza && this.ya.aza(u));
                        }
                        ;
                        p.prototype.Muc = function(n, q) {
                            for (var r = n.length, u = [], v, w, x, y, A = 0; A < r; A++) {
                                w = n[A];
                                v = Math.floor(A / q) + 1;
                                if (undefined !== w.list) {
                                    x = w.list;
                                    y = x.length;
                                    for (var z = 0; z < Math.min(l.fic, y) && !(x[z].zp = w.zp,
                                    this.Uqb(x[z], v, u),
                                    u.length >= l.tJb); z++)
                                        ;
                                } else
                                    this.Uqb(w, v, u);
                                if (u.length >= l.tJb)
                                    break;
                            }
                            return u;
                        }
                        ;
                        p.prototype.Uqb = function(n, q, r) {
                            var v, w;
                            function u(x) {
                                x.Ye && (x.Xa || (x.Xa = {}),
                                x.Xa.Ye = x.Ye);
                                return x.Xa;
                            }
                            v = n.lya;
                            if (undefined !== v && v instanceof Array)
                                v.forEach(function(x) {
                                    undefined !== x.J && (w = u(x),
                                    r.push(new d(x.J,q,x.yd,x.c3,n.zp,w)));
                                });
                            else if (undefined !== v && undefined !== v.J) {
                                v = n.lya;
                                w = u(v);
                                r.push(new d(v.J,q,v.yd,v.c3,n.zp,w));
                            }
                            undefined !== n.J && (w = u(n),
                            r.push(new d(n.J,q,n.yd,n.c3,n.zp,w)));
                        }
                        ;
                        p.prototype.hE = function(n) {
                            var q;
                            q = this.qpb;
                            return n ? q[n] : q;
                        }
                        ;
                        t.exports = p;
                    }
