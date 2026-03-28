/**
 * @module Module_25881
 * @description Class module with ES module exports
 * @categories Crypto
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 25881
 * Deobfuscated size: 6924 chars
 * Functions: 8
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 25881
{
                        var d, p, c, g, f, e, h, k, l, m;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Z1a = b.ARa = b.k3b = b.uf = undefined;
                        d = a(22970);
                        t = a(48235);
                        p = d.__importDefault(a(51411));
                        c = d.__importDefault(a(42979));
                        g = a(44127);
                        f = d.__importDefault(a(42458));
                        e = d.__importDefault(a(6838));
                        h = d.__importDefault(a(88257));
                        k = d.__importDefault(a(36114));
                        l = d.__importDefault(a(10690));
                        b.uf = {
                            Wl: 1,
                            eA: 2
                        };
                        m = (function(n) {
                            function q(r, u, v) {
                                var w, x, y, A, z;
                                w = n.call(this) || this;
                                x = b.uf.Wl;
                                y = r;
                                A = null;
                                for (z in p.default.FDa)
                                    if (p.default.FDa[z] == r) {
                                        x = b.uf.eA;
                                        y = null;
                                        A = r;
                                        break;
                                    }
                                w.version = x;
                                w.xB = y;
                                w.shc = A;
                                w.iv = u;
                                w.rH = v;
                                return w;
                            }
                            d.__extends(q, n);
                            q.prototype.bo = function(r, u, v) {
                                var w;
                                w = this;
                                c.default(v, function() {
                                    var x;
                                    x = r.zf();
                                    switch (w.version) {
                                    case b.uf.Wl:
                                        x.put("keyid", w.xB);
                                        w.iv && x.put("iv", w.iv);
                                        x.put("ciphertext", w.rH);
                                        x.put("sha256", g.Fk("AA=="));
                                        break;
                                    case b.uf.eA:
                                        x.put("version", w.version);
                                        x.put("cipherspec", w.shc);
                                        w.iv && x.put("iv", w.iv);
                                        x.put("ciphertext", w.rH);
                                        break;
                                    default:
                                        throw new l.default("Ciphertext envelope version " + w.version + " encoding unsupported.");
                                    }
                                    r.Vj(x, u, v);
                                }, this);
                            }
                            ;
                            return q;
                        }
                        )(t.fp);
                        b.k3b = m;
                        b.ARa = function(n, q, r, u) {
                            c.default(u, function() {
                                return new m(n,q,r);
                            });
                        }
                        ;
                        b.Z1a = function(n, q, r) {
                            c.default(r, function() {
                                var u, v, w, x, y;
                                if (!q)
                                    try {
                                        q = n.xS("version");
                                        u = false;
                                        for (v in b.uf)
                                            if (b.uf[v] == q) {
                                                u = true;
                                                break;
                                            }
                                        if (!u)
                                            throw new f.default(k.default.Ymb,"ciphertext envelope " + n);
                                    } catch (A) {
                                        if (A instanceof e.default)
                                            q = b.uf.Wl;
                                        else
                                            throw A;
                                    }
                                switch (q) {
                                case b.uf.Wl:
                                    try {
                                        w = n.Be("keyid");
                                        x = n.has("iv") ? n.Ed("iv") : null;
                                        y = n.Ed("ciphertext");
                                        n.Ed("sha256");
                                    } catch (A) {
                                        if (A instanceof e.default)
                                            throw new h.default(k.default.lf,"ciphertext envelope " + n,A);
                                        throw A;
                                    }
                                    break;
                                case b.uf.eA:
                                    try {
                                        if (n.xS("version") != b.uf.eA)
                                            throw new f.default(k.default.Ymb,"ciphertext envelope " + n);
                                        w = p.default.FDa.nS(n.Be("cipherspec"));
                                        if (!w)
                                            throw new f.default(k.default.K6b,"ciphertext envelope " + n);
                                        x = n.has("iv") ? n.Ed("iv") : null;
                                        y = n.Ed("ciphertext");
                                    } catch (A) {
                                        if (A instanceof e.default)
                                            throw new h.default(k.default.lf,"ciphertext envelope " + n,A);
                                        throw A;
                                    }
                                    break;
                                default:
                                    throw new f.default(k.default.O6b,"ciphertext envelope " + n);
                                }
                                return new m(w,x,y);
                            });
                        }
                        ;
                    }
