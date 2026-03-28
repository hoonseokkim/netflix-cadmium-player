/**
 * @module Module_7379
 * @description Class module with ES module exports
 * @categories DRM, Crypto, Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 7379
 * Deobfuscated size: 5519 chars
 * Functions: 10
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 7379
{
                        var d, p, c, g, f, e, h, k;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.a$a = undefined;
                        d = a(22970);
                        p = a(84032);
                        c = a(20408);
                        g = a(2802);
                        f = a(31178);
                        e = a(80462);
                        h = a(11038);
                        k = a(12346);
                        t = (function() {
                            function l(m) {
                                l.cWc(m);
                                switch (m.keyx) {
                                case g.AleKeyxScheme.CLEAR:
                                    this.yua = new f.bfb(m.crypto,m.wg,m.scheme);
                                    break;
                                case g.AleKeyxScheme.RSA_OAEP_256:
                                    this.yua = new h.dfb(m.crypto,m.wg,m.scheme);
                                    break;
                                case g.AleKeyxScheme.AUTH_DH:
                                    if (!m.wj || !m.zSa)
                                        throw Error("missing config for AUTH-DH keyx scheme");
                                    this.yua = new k.afb(m.crypto,m.wg,m.wj,m.zSa);
                                    break;
                                default:
                                    throw Error("unsupported key exchange scheme");
                                }
                                this.config = d.__assign({}, m);
                            }
                            l.cWc = function(m) {
                                if (m.scheme === g.AleScheme.A128CBC_HS256_NRD && m.keyx !== g.AleKeyxScheme.AUTH_DH || m.keyx === g.AleKeyxScheme.AUTH_DH && m.scheme !== g.AleScheme.A128CBC_HS256_NRD)
                                    throw Error("ALE scheme and Keyx scheme are incompatible");
                            }
                            ;
                            l.prototype.Lyc = function() {
                                return d.__awaiter(this, undefined, undefined, function() {
                                    var m, n;
                                    return d.__generator(this, function(q) {
                                        switch (q.label) {
                                        case 0:
                                            return (n = {
                                                ver: e.xib,
                                                scheme: this.config.scheme,
                                                type: this.config.hvb
                                            },
                                            [4, this.yua.LVa()]);
                                        case 1:
                                            return (m = (n.keyx = q.T(),
                                            n),
                                            [2, JSON.stringify(m)]);
                                        }
                                    });
                                });
                            }
                            ;
                            l.prototype.createSession = function(m) {
                                return d.__awaiter(this, undefined, undefined, function() {
                                    var n, q, r, u, v;
                                    return d.__generator(this, function(w) {
                                        switch (w.label) {
                                        case 0:
                                            n = (0,
                                            c.VMb)(m);
                                            if (n.ver !== c.yib)
                                                throw Error("incompatible provisioning response version");
                                            if (n.scheme !== this.config.scheme)
                                                throw Error("inconsistent scheme in provisioning response");
                                            if (n.keyx.scheme !== this.config.keyx)
                                                throw Error("inconsistent keyx scheme in provisioning response");
                                            return [4, this.yua.f3a(n.keyx)];
                                        case 1:
                                            return (q = w.T(),
                                            r = new Date(),
                                            r.setSeconds(r.getSeconds() + n.ttl),
                                            u = undefined === n.rw ? this.Aic(n.ttl) : n.rw,
                                            v = new Date(r.getTime()),
                                            v.setSeconds(v.getSeconds() - u),
                                            [2, new p.b$a(n.token,r,v,q,this.config.wg)]);
                                        }
                                    });
                                });
                            }
                            ;
                            l.prototype.Aic = function(m) {
                                return Math.min(Math.floor(m / 3), 86400);
                            }
                            ;
                            return l;
                        }
                        )();
                        b.a$a = t;
                    }
