/**
 * @module Module_84970
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 84970
 * Deobfuscated size: 14960 chars
 * Functions: 41
 * Prototype definitions: 8
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 84970
{
                        var g, f, e, h, k, l, m, n, q, r, u, v;
                        function d(w, x, y, A, z, B) {
                            this.config = x;
                            this.gaa = y;
                            this.Ht = A;
                            this.$3c = z;
                            this.Vo = B;
                            this.va = w.zb(l.Xlb);
                        }
                        function p(w, x) {
                            this.config = w;
                            this.HF = x;
                        }
                        function c(w, x, y, A, z) {
                            this.config = x;
                            this.HF = y;
                            this.Vo = z;
                            this.va = w.zb(l.Xlb);
                            this.gaa = new Promise(function(B, C) {
                                var D;
                                try {
                                    D = A();
                                    D ? B(D) : C({
                                        Ya: k.Y.deb
                                    });
                                } catch (E) {
                                    C({
                                        Ya: k.Y.zka,
                                        Jc: E
                                    });
                                }
                            }
                            );
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.WFa = b.VFa = b.MFa = undefined;
                        t = a(22970);
                        g = a(22674);
                        f = a(87386);
                        e = a(92093);
                        h = a(48159);
                        k = a(36129);
                        l = a(44272);
                        m = a(91133);
                        n = a(59818);
                        q = a(17892);
                        r = a(77134);
                        u = a(42236);
                        v = a(63156);
                        c.prototype.create = function() {
                            this.$Ra || (this.$Ra = this.RZ());
                            return this.$Ra;
                        }
                        ;
                        c.prototype.Hh = function(w) {
                            var x;
                            x = this;
                            this.$Ra = null;
                            return this.HF.tt(this.config.timeout, new Promise(function(y, A) {
                                w.close();
                                x.delete(w.name).then(function() {
                                    y();
                                }).catch(function(z) {
                                    A(z);
                                });
                            }
                            )).catch(function(y) {
                                return y instanceof n.Ox ? Promise.reject({
                                    Ya: k.Y.zka
                                }) : y.Ya ? Promise.reject(y) : Promise.reject({
                                    Ya: k.Y.zka,
                                    Jc: y
                                });
                            });
                        }
                        ;
                        c.prototype.delete = function(w) {
                            var x;
                            x = this;
                            return this.HF.tt(this.config.timeout, new Promise(function(y, A) {
                                x.gaa.then(function(z) {
                                    var B;
                                    B = z.deleteDatabase(w);
                                    B.onsuccess = function() {
                                        y();
                                    }
                                    ;
                                    B.onerror = function() {
                                        A({
                                            Ya: k.Y.zka,
                                            Jc: B.error
                                        });
                                    }
                                    ;
                                }).catch(function(z) {
                                    A(z);
                                });
                            }
                            ));
                        }
                        ;
                        c.prototype.RZ = function() {
                            var w, x;
                            w = this;
                            return this.HF.tt(this.config.timeout, new Promise(function(y, A) {
                                if (w.config.j6a)
                                    return A({
                                        Ya: w.config.j6a
                                    });
                                w.gaa.then(function(z) {
                                    w.Vo.mark(v.jo.w1b);
                                    x = z.open(w.config.name, w.config.version);
                                    if (!x)
                                        return A({
                                            Ya: k.Y.eeb
                                        });
                                    x.onblocked = function() {
                                        w.Vo.mark(v.jo.t1b);
                                        A({
                                            Ya: k.Y.p1b
                                        });
                                    }
                                    ;
                                    x.onupgradeneeded = function() {
                                        var B;
                                        w.Vo.mark(v.jo.D1b);
                                        B = x.result;
                                        try {
                                            B.createObjectStore(w.config.Yea, {
                                                keyPath: "name"
                                            });
                                        } catch (C) {
                                            w.va.error("Exception while creating object store", C);
                                        }
                                    }
                                    ;
                                    x.onsuccess = function(B) {
                                        var C, D;
                                        w.Vo.mark(v.jo.C1b);
                                        try {
                                            C = B.target.result;
                                            D = C.objectStoreNames.length;
                                            w.va.trace("objectstorenames length ", D);
                                            if (0 === D) {
                                                w.va.error("invalid indexedDb state, deleting");
                                                w.Vo.mark(v.jo.v1b);
                                                try {
                                                    C.close();
                                                } catch (E) {}
                                                z.deleteDatabase(w.config.name);
                                                setTimeout(function() {
                                                    A({
                                                        Ya: k.Y.o1b
                                                    });
                                                }, 1);
                                                return;
                                            }
                                        } catch (E) {
                                            w.va.error("Exception while inspecting indexedDb objectstorenames", E);
                                        }
                                        y(x.result);
                                    }
                                    ;
                                    x.onerror = function() {
                                        w.Vo.mark(v.jo.u1b);
                                        w.va.error("IndexedDB open error", x.error);
                                        A({
                                            Ya: k.Y.q1b,
                                            Jc: x.error
                                        });
                                    }
                                    ;
                                }).catch(function(z) {
                                    A(z);
                                });
                            }
                            )).catch(function(y) {
                                if (y instanceof n.Ox) {
                                    try {
                                        x && x.readyState && w.Vo.mark("readyState-" + x.readyState);
                                    } catch (A) {}
                                    if (w.config.moa && x && "done" === x.readyState) {
                                        if (w.P3c(x))
                                            return (w.Vo.mark(v.jo.A1b),
                                            Promise.resolve(x.result));
                                        w.Vo.mark(v.jo.z1b);
                                    }
                                    w.Vo.mark(v.jo.y1b);
                                    return Promise.reject({
                                        Ya: k.Y.s1b
                                    });
                                }
                                if (y.Ya)
                                    return Promise.reject(y);
                                w.Vo.mark(v.jo.x1b);
                                w.va.error("IndexedDB open exception occurred", y);
                                return Promise.reject({
                                    Ya: k.Y.r1b,
                                    Jc: y
                                });
                            });
                        }
                        ;
                        c.prototype.P3c = function(w) {
                            try {
                                return 0 < w.result.objectStoreNames.length;
                            } catch (x) {
                                this.Vo.mark(v.jo.B1b);
                                this.va.error("failed to check open request state", x);
                            }
                            return false;
                        }
                        ;
                        a = c;
                        b.MFa = a;
                        b.MFa = a = t.__decorate([(0,
                        g.aa)(), t.__param(0, (0,
                        g.v)(f.Bb)), t.__param(1, (0,
                        g.v)(m.Bka)), t.__param(2, (0,
                        g.v)(n.qG)), t.__param(3, (0,
                        g.v)(h.ceb)), t.__param(4, (0,
                        g.v)(r.ZX))], a);
                        p.prototype.create = function(w) {
                            return Promise.resolve(new e.Ceb(this.config,this.HF,w));
                        }
                        ;
                        a = p;
                        b.VFa = a;
                        b.VFa = a = t.__decorate([(0,
                        g.aa)(), t.__param(0, (0,
                        g.v)(m.Bka)), t.__param(1, (0,
                        g.v)(n.qG))], a);
                        d.prototype.create = function() {
                            if (this.storage)
                                return Promise.resolve(this.storage);
                            this.baa || (this.baa = this.RZ(this.$3c));
                            return this.baa;
                        }
                        ;
                        d.prototype.RZ = function(w) {
                            var x;
                            x = this;
                            w = undefined === w ? [] : w;
                            return new Promise(function(y, A) {
                                x.Vo.mark(v.jo.l6b);
                                x.gaa.create().then(function(z) {
                                    x.Ht.create(z).then(function(B) {
                                        Promise.all(w.map(function(C) {
                                            return C.validate(B);
                                        })).then(function() {
                                            x.storage = B;
                                            y(x.storage);
                                        }).catch(function(C) {
                                            x.va.debug("DB validation failed, cause: " + C);
                                            x.config.EAb ? (x.va.debug("Fixing corrupt DB"),
                                            x.gaa.Hh(z).then(function() {
                                                x.va.error("Invalid database deleted, creating new database.");
                                                x.RZ().then(function(D) {
                                                    x.va.error("Invalid database successfully recreated.");
                                                    x.storage = D;
                                                    y(x.storage);
                                                });
                                            }).catch(function(D) {
                                                x.va.error("Couldn't delete invalid database.");
                                                A(D);
                                            })) : (x.va.debug("Ignoring invalid DB due to config"),
                                            x.storage = B,
                                            y(x.storage));
                                        });
                                    }).catch(function(B) {
                                        A(B);
                                    });
                                }).catch(function(z) {
                                    A(z);
                                });
                            }
                            );
                        }
                        ;
                        a = d;
                        b.WFa = a;
                        b.WFa = a = t.__decorate([(0,
                        g.aa)(), t.__param(0, (0,
                        g.v)(f.Bb)), t.__param(1, (0,
                        g.v)(m.Bka)), t.__param(2, (0,
                        g.v)(u.beb)), t.__param(3, (0,
                        g.v)(u.Deb)), t.__param(4, (0,
                        g.optional)()), t.__param(4, (0,
                        g.KI)(q.z6b)), t.__param(5, (0,
                        g.v)(r.ZX))], a);
                    }
