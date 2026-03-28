/**
 * @module Module_67894
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 67894
 * Deobfuscated size: 9231 chars
 * Functions: 40
 * Prototype definitions: 16
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 67894
{
                        var c, g, f, e, h, k, l;
                        function d(m, n, q, r) {
                            this.va = m;
                            this.config = n;
                            this.bCc = q;
                            this.V_a = r;
                            this.oR = {
                                mem: {
                                    storage: this.V_a,
                                    key: "mem"
                                }
                            };
                            this.uO = this.config.uO;
                        }
                        function p(m, n, q, r) {
                            this.Jh = m;
                            this.Ht = n;
                            this.V_a = q;
                            this.config = r;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.DCa = b.CCa = undefined;
                        t = a(22970);
                        c = a(22674);
                        g = a(36129);
                        f = a(42236);
                        e = a(87386);
                        h = a(86607);
                        k = a(31679);
                        a = a(34231);
                        p.prototype.create = function() {
                            this.baa || (this.baa = this.RZ());
                            return this.baa;
                        }
                        ;
                        p.prototype.RZ = function() {
                            this.Tbc = new d(this.Jh.zb("AppStorage"),this.config,this.Ht,this.V_a);
                            return this.Tbc.create();
                        }
                        ;
                        l = p;
                        b.CCa = l;
                        b.CCa = l = t.__decorate([(0,
                        c.aa)(), t.__param(0, (0,
                        c.v)(e.Bb)), t.__param(1, (0,
                        c.v)(f.Eeb)), t.__param(2, (0,
                        c.v)(h.dhb)), t.__param(3, (0,
                        c.v)(a.Rt))], l);
                        d.prototype.create = function() {
                            var m;
                            m = this;
                            return this.vlc().then(function(n) {
                                if (!m.ggc(n, m.config.Oca))
                                    throw m.WKc(n);
                                return m;
                            });
                        }
                        ;
                        d.prototype.load = function(m) {
                            var n;
                            n = this;
                            return new Promise(function(q, r) {
                                n.Bn(m).storage.load(m).then(function(u) {
                                    q(u);
                                }).catch(function(u) {
                                    r(u);
                                });
                            }
                            );
                        }
                        ;
                        d.prototype.save = function(m, n, q) {
                            var r;
                            r = this;
                            return new Promise(function(u, v) {
                                r.Bn(m).storage.save(m, n, q).then(function(w) {
                                    u(w);
                                }).catch(function(w) {
                                    v(w);
                                });
                            }
                            );
                        }
                        ;
                        d.prototype.remove = function(m) {
                            var n;
                            n = this;
                            return new Promise(function(q, r) {
                                n.Bn(m).storage.remove(m).then(function() {
                                    q();
                                }).catch(function(u) {
                                    r(u);
                                });
                            }
                            );
                        }
                        ;
                        d.prototype.removeAll = function() {
                            var m;
                            m = this;
                            return new Promise(function(n, q) {
                                m.MPb("mem").then(function() {
                                    return m.MPb("idb");
                                }).catch(function(r) {
                                    return Promise.reject(r);
                                }).then(function() {
                                    n();
                                }).catch(function(r) {
                                    m.va.error("remove all failed");
                                    q(r);
                                });
                            }
                            );
                        }
                        ;
                        d.prototype.loadAll = function() {
                            var m, n;
                            m = this;
                            n = [];
                            return this.lIb("mem").then(function(q) {
                                n = n.concat(q);
                                return m.lIb("idb");
                            }).catch(function(q) {
                                m.IEc(q) || m.va.error("IndexedDb.LoadAll exception", q);
                                return [];
                            }).then(function(q) {
                                return n = n.concat(q);
                            }).catch(function(q) {
                                m.va.error("load all failed", q);
                                throw q;
                            });
                        }
                        ;
                        d.prototype.vlc = function() {
                            var m;
                            m = this;
                            return this.bCc.create().then(function(n) {
                                m.oR.idb = {
                                    storage: n,
                                    key: "idb"
                                };
                            }).catch(function(n) {
                                m.va.error("idb failed to load", n);
                                return n || ({
                                    Ya: g.Y.lo
                                });
                            });
                        }
                        ;
                        d.prototype.ggc = function(m, n) {
                            return !m || m && n ? true : false;
                        }
                        ;
                        d.prototype.WKc = function(m) {
                            var n;
                            n = "";
                            m && (n += m.Ya);
                            return {
                                Ya: n
                            };
                        }
                        ;
                        d.prototype.MPb = function(m) {
                            return (m = this.oR[m]) ? m.storage.removeAll() : Promise.resolve();
                        }
                        ;
                        d.prototype.lIb = function(m) {
                            return (m = this.oR[m]) ? m.storage.loadAll() : Promise.resolve([]);
                        }
                        ;
                        d.prototype.rtc = function(m) {
                            for (var n in this.uO)
                                if (m.startsWith(n))
                                    return this.uO[n];
                            return this.uO[k.A_b];
                        }
                        ;
                        d.prototype.Bn = function(m) {
                            var n, q;
                            n = this;
                            this.rtc(m).every(function(r) {
                                return n.oR[r] ? (q = n.oR[r],
                                false) : true;
                            });
                            if (!q) {
                                this.va.error("component not found for storageKey", {
                                    u_c: m,
                                    mcd: Object.keys(this.oR),
                                    rules: this.uO
                                });
                                q = this.oR.mem;
                            }
                            this.va.trace("component found for key", {
                                storageKey: m,
                                componentKey: q.key
                            });
                            return q;
                        }
                        ;
                        d.prototype.IEc = function(m) {
                            return (m && (m.Ya || m.errorSubCode)) === g.Y.tG;
                        }
                        ;
                        b.DCa = d;
                    }
