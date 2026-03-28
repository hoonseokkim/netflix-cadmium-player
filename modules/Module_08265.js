/**
 * @module Module_8265
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 8265
 * Deobfuscated size: 6438 chars
 * Functions: 18
 * Prototype definitions: 11
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 8265
{
                        var p, c, g, f, e, h, k, l, m, n, q, r;
                        function d(u, v, w, x) {
                            this.dm = u;
                            this.Pd = v;
                            this.Kj = w;
                            this.hj = x;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.vKa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(36129);
                        g = a(6405);
                        f = a(84408);
                        e = a(61731);
                        h = a(59818);
                        k = a(2248);
                        l = a(82100);
                        m = a(97737);
                        n = a(31149);
                        q = a(7605);
                        r = a(47450);
                        d.prototype.xpa = function() {
                            return false;
                        }
                        ;
                        d.prototype.tPa = function() {
                            return false;
                        }
                        ;
                        d.prototype.dQa = function() {
                            return true;
                        }
                        ;
                        d.prototype.DVa = function() {
                            return l.ZF;
                        }
                        ;
                        d.prototype.dsa = function() {
                            return this.Pd.decode(l.bFa);
                        }
                        ;
                        d.prototype.xWa = function() {
                            return [];
                        }
                        ;
                        d.prototype.oYa = function(u) {
                            u.iga();
                        }
                        ;
                        d.prototype.nRa = function(u) {
                            var v, w;
                            v = [];
                            if (u.messageType === m.aHa || u.messageType === m.$Ga) {
                                if (u.messageType === m.aHa) {
                                    w = this.Kj.encode(new Uint8Array(u.message));
                                    v = JSON.parse(w);
                                    w = v.map(function(x) {
                                        return x.keyID;
                                    });
                                    v = v.map(function(x) {
                                        return x.payload;
                                    });
                                } else
                                    v = [this.Pd.encode(new Uint8Array(u.message))];
                                if (0 === v.length || !v.every(function(x) {
                                    return x && x.length;
                                }))
                                    throw new n.we(c.ea.fcb);
                                v = this.r1c(v);
                                v = this.Kj.decode(JSON.stringify(v));
                            } else
                                v = new Uint8Array(u.message);
                            return {
                                type: u.type,
                                sessionId: u.target.sessionId,
                                ET: [v],
                                messageType: u.messageType,
                                dT: w
                            };
                        }
                        ;
                        d.prototype.xL = function(u) {
                            var v, w, x, y;
                            w = null === (v = u.target) || undefined === v ? undefined : v.error;
                            if (w)
                                (x = w.systemCode,
                                y = w.code);
                            v = new e.wk(c.ea.nla,u instanceof h.Ox ? c.Y.l6 : c.Y.VW,x ? this.dm.Ora(x, 4) : y,"",w);
                            v.zaa(u);
                            return v;
                        }
                        ;
                        d.prototype.r1c = function(u) {
                            u = u.map(function(v, w) {
                                return {
                                    ID: r.ama.zCc(w),
                                    PAYLOAD: v
                                };
                            });
                            return {
                                VERSION: this.hj.ND ? 3 : 1,
                                CHALLENGES: u
                            };
                        }
                        ;
                        d.prototype.x0 = function(u, v) {
                            var w, x;
                            w = this;
                            if (v && this.hj.ND)
                                try {
                                    x = this.Kj.encode(v[0]);
                                    return JSON.parse(x).RESPONSES.sort(function(y, A) {
                                        return y.ID > A.ID ? 1 : -1;
                                    }).map(function(y) {
                                        var A;
                                        A = r.ama.qUb(y.ID);
                                        y = w.Pd.decode(y.DHB).subarray(4, 12);
                                        A = w.Pd.decode(u[A]).subarray(0, 8);
                                        return {
                                            from: y,
                                            to: A
                                        };
                                    });
                                } catch (y) {
                                    throw new e.wk(c.ea.M4b,undefined,undefined,undefined,y);
                                }
                        }
                        ;
                        a = d;
                        b.vKa = a;
                        b.vKa = a = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(g.dP)), t.__param(1, (0,
                        p.v)(k.Km)), t.__param(2, (0,
                        p.v)(f.zG)), t.__param(3, (0,
                        p.v)(q.Nx))], a);
                    }
