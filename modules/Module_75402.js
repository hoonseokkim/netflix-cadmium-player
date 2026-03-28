/**
 * @module Module_75402
 * @description Class module with ES module exports
 * @categories Network
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 75402
 * Deobfuscated size: 5757 chars
 * Functions: 12
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 75402
{
                        var d, p, c, g, f, e, h;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.s$a = undefined;
                        t = a(22970);
                        d = a(90745);
                        p = a(91176);
                        c = a(91176);
                        g = t.__importDefault(a(14282));
                        f = t.__importDefault(a(53800));
                        e = a(91967);
                        h = a(60028);
                        a = (function() {
                            function k(l) {
                                this.Z = l;
                                this.yw = "aseReport";
                                this.FB = "asereport";
                                this.GD = p.I.uh;
                                this.events = new d.EventEmitter();
                                this.F$ = h.Z7.gbb;
                                this.una = false;
                                this.hUb = 0;
                                this.I2 = this.I2.bind(this);
                                this.QSb({
                                    type: "asereportconfigoverrides",
                                    aw: this.Z.config.aw,
                                    yA: this.Z.config.yA,
                                    fL: this.Z.config.fL
                                });
                            }
                            k.prototype.QSb = function(l) {
                                var m, n, q, r, u;
                                r = this.Z.config.nfd;
                                u = null !== (m = l.aw) && undefined !== m ? m : this.Z.config.aw;
                                0 === Math.floor(1E6 * Math.random()) % u || r ? (m = null !== (n = l.yA) && undefined !== n ? n : this.Z.config.yA,
                                this.GD = p.I.Ca(m),
                                this.LIc = null !== (q = l.fL) && undefined !== q ? q : this.Z.config.fL,
                                this.Z.R9 = true,
                                this.open()) : (this.GD = p.I.uh,
                                this.una = this.Z.R9 = false,
                                this.Z.events.vm("requestIssued", this.I2));
                            }
                            ;
                            k.prototype.open = function() {
                                var l, m;
                                l = this;
                                if (this.Z.R9 && !this.una) {
                                    m = [];
                                    m[g.default.pq.U] = new f.default(this.Z.config,g.default.pq.U);
                                    m[g.default.pq.V] = new f.default(this.Z.config,g.default.pq.V);
                                    m[g.default.pq.Ea] = new f.default(this.Z.config,g.default.pq.Ea);
                                    this.E6a = m;
                                    this.una = true;
                                    this.Z.events.on("openComplete", function() {
                                        return l.lLb();
                                    });
                                    this.lLb();
                                    this.Z.events.on("requestIssued", this.I2);
                                }
                            }
                            ;
                            k.prototype.lLb = function() {
                                this.Z.events.emit("aseReportEnabled", {
                                    type: "asereportenabled"
                                });
                            }
                            ;
                            k.prototype.I2 = function(l) {
                                l.result && l.streamList && (this.E6a[l.mediaType].add(l.result, l.streamList),
                                ++this.hUb >= this.LIc && this.events.emit("collectionRequested"));
                            }
                            ;
                            k.prototype.Fzc = function() {
                                var l;
                                l = (0,
                                c.flatten)(this.E6a.map(function(m) {
                                    return m.get();
                                }).filter(function(m) {
                                    return undefined !== m;
                                }));
                                this.E6a.forEach(function(m) {
                                    return m.reset(true);
                                });
                                this.hUb = 0;
                                return l;
                            }
                            ;
                            k.prototype.ef = function(l) {
                                var m, n;
                                m = l.Ui;
                                n = l.kic;
                                l = l.UFb || n || m === e.Sc.Wj;
                                return this.Z.R9 && this.una && l && (l = this.Fzc()) && l.length ? {
                                    qO: true,
                                    event: {
                                        type: "asereport",
                                        strmsel: l
                                    }
                                } : {
                                    qO: false
                                };
                            }
                            ;
                            return k;
                        }
                        )();
                        b.s$a = a;
                    }
