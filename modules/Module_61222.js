/**
 * @module Module_61222
 * @description Class module with ES module exports
 * @categories DRM, Crypto, Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 61222
 * Deobfuscated size: 15820 chars
 * Functions: 32
 * Prototype definitions: 7
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 61222
{
                        var p, c, g, f;
                        function d(e, h, k) {
                            return p.__awaiter(this, undefined, undefined, function() {
                                var l, m, n, q, r, u;
                                return p.__generator(this, function(v) {
                                    switch (v.label) {
                                    case 0:
                                        return (v.ac.push([0, 2, , 3]),
                                        [4, h()]);
                                    case 1:
                                        return [2, v.T()];
                                    case 2:
                                        return (l = v.T(),
                                        m = k.token,
                                        n = k.Ml,
                                        q = k.qv,
                                        r = k.xa,
                                        u = {
                                            type: "ale-failure",
                                            step: e,
                                            Jc: (0,
                                            f.EO)(l),
                                            now: new Date().toISOString(),
                                            fa: (0,
                                            g.fa)(),
                                            token: null !== m && undefined !== m ? m : null === n || undefined === n ? undefined : n.token,
                                            qv: (null === r || undefined === r ? undefined : r.pk) || q,
                                            pn: null === r || undefined === r ? undefined : r.Kmc.toISOString(),
                                            expiration: null === n || undefined === n ? undefined : n.Kk().toISOString(),
                                            QY: r ? (0,
                                            g.fa)() - r.Imc : undefined,
                                            iga: null === n || undefined === n ? undefined : n.hha()
                                        },
                                        [2, Promise.reject(u)]);
                                    case 3:
                                        return [2];
                                    }
                                });
                            });
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.W9a = undefined;
                        p = a(22970);
                        c = a(73608);
                        g = a(28020);
                        f = a(62411);
                        t = (function() {
                            function e(h, k) {
                                var l, m;
                                this.qv = 1;
                                this.options = p.__assign({}, h);
                                this.Ni = h.Ni;
                                this.options.x4a = null !== (l = h.x4a) && undefined !== l ? l : true;
                                this.options.TEb = null !== (m = h.TEb) && undefined !== m ? m : true;
                                this.trace = h.trace.extend(k.hvb, "ale-client");
                                this.config = k;
                            }
                            e.Dnc = function(h) {
                                h = h.Ni;
                                return {
                                    hvb: "SOCKETROUTER",
                                    scheme: c.AleScheme.A128CBC_HS256,
                                    keyx: c.AleKeyxScheme.CLEAR,
                                    crypto: h.crypto,
                                    wg: h.wg,
                                    wj: h.wj
                                };
                            }
                            ;
                            e.Utc = function(h) {
                                return new e(h,this.Dnc(h));
                            }
                            ;
                            e.prototype.mzc = function() {
                                this.Rza || (this.Rza = new c.a$a(this.config));
                                return this.Rza;
                            }
                            ;
                            e.prototype.sDb = function() {
                                return p.__awaiter(this, undefined, undefined, function() {
                                    var h, k, l, m, n, q;
                                    q = this;
                                    return p.__generator(this, function(r) {
                                        switch (r.label) {
                                        case 0:
                                            if (this.Ml && !this.Ml.hha())
                                                return [3, 5];
                                            this.xa = undefined;
                                            h = this.qv++;
                                            return [4, d("create-service", function() {
                                                return q.mzc();
                                            }, {
                                                qv: h
                                            })];
                                        case 1:
                                            return (k = r.T(),
                                            [4, d("get-request", function() {
                                                return k.Lyc();
                                            }, {
                                                qv: h
                                            })]);
                                        case 2:
                                            return (l = r.T(),
                                            this.trace("Provision request", l),
                                            [4, d("provision", function() {
                                                return q.Ni.YRc(l);
                                            }, {
                                                qv: h
                                            })]);
                                        case 3:
                                            return (m = r.T(),
                                            this.trace("Provision response", m),
                                            n = this,
                                            [4, d("create-session", function() {
                                                return k.createSession(m);
                                            }, {
                                                qv: h
                                            })]);
                                        case 4:
                                            return (n.Ml = r.T(),
                                            this.xa = {
                                                pk: h,
                                                Imc: (0,
                                                g.fa)(),
                                                Kmc: new Date()
                                            },
                                            this.trace("Created session with expiration", this.Ml.Kk().toISOString()),
                                            [3, 6]);
                                        case 5:
                                            (this.trace("Reusing session with expiration", this.Ml.Kk().toISOString()),
                                            r.label = 6);
                                        case 6:
                                            return [2, this.Ml];
                                        }
                                    });
                                });
                            }
                            ;
                            e.prototype.fCb = function(h) {
                                return p.__awaiter(this, undefined, undefined, function() {
                                    var k, l, m, n;
                                    return p.__generator(this, function(q) {
                                        switch (q.label) {
                                        case 0:
                                            if (this.options.TEb)
                                                return [3, 2];
                                            k = this;
                                            l = k.Ml;
                                            m = k.qv;
                                            n = k.xa;
                                            return [4, d(h, function() {
                                                if (!l)
                                                    throw (0,
                                                    f.Ija)("No session has been created");
                                                if (l.hha())
                                                    throw (0,
                                                    f.Ija)("Session is due for renewal");
                                            }, {
                                                Ml: l,
                                                qv: m,
                                                xa: n
                                            })];
                                        case 1:
                                            (q.T(),
                                            q.label = 2);
                                        case 2:
                                            return [2, this.sDb()];
                                        }
                                    });
                                });
                            }
                            ;
                            e.prototype.Irc = function() {
                                return p.__awaiter(this, undefined, undefined, function() {
                                    return p.__generator(this, function(h) {
                                        switch (h.label) {
                                        case 0:
                                            return [4, this.sDb()];
                                        case 1:
                                            return (h.T(),
                                            [2]);
                                        }
                                    });
                                });
                            }
                            ;
                            Object.defineProperties(e.prototype, {
                                hha: {
                                    get: function() {
                                        var h, k;
                                        return null !== (k = null === (h = this.Ml) || undefined === h ? undefined : h.hha()) && undefined !== k ? k : true;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            e.prototype.reset = function() {
                                this.Ml && (this.trace("Dropping session"),
                                this.Ml = undefined);
                            }
                            ;
                            e.prototype.encrypt = function(h) {
                                return p.__awaiter(this, undefined, undefined, function() {
                                    var k, l, m, n, q, r;
                                    return p.__generator(this, function(u) {
                                        switch (u.label) {
                                        case 0:
                                            return (u.ac.push([0, 3, , 4]),
                                            k = "encrypt",
                                            [4, this.fCb(k)]);
                                        case 1:
                                            return (l = u.T(),
                                            m = l.token,
                                            [4, d(k, function() {
                                                return l.prc(h);
                                            }, {
                                                Ml: l,
                                                token: m,
                                                xa: this.xa
                                            })]);
                                        case 2:
                                            return (n = u.T(),
                                            q = {
                                                token: m,
                                                rH: n
                                            },
                                            this.trace("Encrypted : ", h, q),
                                            [2, q]);
                                        case 3:
                                            throw (r = u.T(),
                                            this.trace("Encrypt failed :", r),
                                            this.options.x4a && this.reset(),
                                            r);
                                        case 4:
                                            return [2];
                                        }
                                    });
                                });
                            }
                            ;
                            e.prototype.decrypt = function(h) {
                                return p.__awaiter(this, undefined, undefined, function() {
                                    var k, l, m, n;
                                    return p.__generator(this, function(q) {
                                        switch (q.label) {
                                        case 0:
                                            return (q.ac.push([0, 3, , 4]),
                                            k = "decrypt",
                                            [4, this.fCb(k)]);
                                        case 1:
                                            return (l = q.T(),
                                            [4, d(k, function() {
                                                return l.xnc(h);
                                            }, {
                                                Ml: l,
                                                xa: this.xa
                                            })]);
                                        case 2:
                                            return (m = q.T(),
                                            this.trace("Decrypted : ", h, m),
                                            [2, m]);
                                        case 3:
                                            throw (n = q.T(),
                                            this.trace("Decrypt failed :", n),
                                            this.options.x4a && this.reset(),
                                            n);
                                        case 4:
                                            return [2];
                                        }
                                    });
                                });
                            }
                            ;
                            return e;
                        }
                        )();
                        b.W9a = t;
                    }
