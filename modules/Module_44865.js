/**
 * @module Module_44865
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 44865
 * Deobfuscated size: 3917 chars
 * Functions: 5
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 44865
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.qkb = undefined;
                        d = a(22970);
                        p = a(62411);
                        t = (function(c) {
                            function g() {
                                return null !== c && c.apply(this, arguments) || this;
                            }
                            d.__extends(g, c);
                            g.prototype.nva = function(f, e, h, k) {
                                h = ("").concat(this.e2);
                                this.e2 += 2;
                                return {
                                    xa: {
                                        Cm: f || e,
                                        YN: e,
                                        id: h,
                                        bdd: {
                                            Ubd: this.options.Ni.visible.sW ? "foreground" : "background"
                                        }
                                    },
                                    payload: k
                                };
                            }
                            ;
                            g.prototype.rpa = function(f) {
                                var e, h, k, l;
                                l = null === (e = f.xa) || undefined === e ? undefined : e.YN;
                                e = ("").concat((null === (h = f.xa) || undefined === h ? undefined : h.id) || "");
                                switch (l) {
                                case "nonce":
                                    if ((h = null === (k = f.payload) || undefined === k ? undefined : k.nonceToken) && "string" === typeof h)
                                        return {
                                            type: l,
                                            id: e,
                                            nonce: h
                                        };
                                    throw (0,
                                    p.k7)(f);
                                case "unauthorized":
                                    return {
                                        type: l,
                                        id: e
                                    };
                                }
                                return {
                                    type: "other",
                                    id: e
                                };
                            }
                            ;
                            g.prototype.validate = function(f) {
                                var e, h;
                                e = f.xa;
                                h = f.payload;
                                if (!e || "object" !== typeof e)
                                    throw (0,
                                    p.k7)(f);
                                if ("undefined" !== typeof e.errorCode)
                                    throw (0,
                                    p.VEa)(f);
                                if (!h || "object" !== typeof h)
                                    throw (0,
                                    p.k7)(f);
                                f = e.headers;
                                return {
                                    headers: f && "object" === typeof f ? f : {},
                                    payload: h
                                };
                            }
                            ;
                            return g;
                        }
                        )(a(25987).ema);
                        b.qkb = t;
                    }
