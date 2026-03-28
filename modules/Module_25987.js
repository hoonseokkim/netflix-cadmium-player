/**
 * @module Module_25987
 * @description Class module with ES module exports
 * @categories DRM, Network, Manifest, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 25987
 * Deobfuscated size: 6877 chars
 * Functions: 11
 * Prototype definitions: 7
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 25987
{
                        var d, p, c;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.ema = undefined;
                        d = a(22970);
                        p = a(62411);
                        c = {
                            logblob: "pbo-logblob",
                            events: "pbo-event",
                            manifest: "pbo-manifest",
                            license: "pbo-license",
                            ntlBatch: "ntl-log",
                            ntlSendImmediate: "ntl-event",
                            laser: "laser-event",
                            laserNtl: "laser-event-ntl"
                        };
                        t = (function() {
                            function g(f) {
                                this.eRa = this.e2 = 1;
                                this.options = f;
                            }
                            g.prototype.nva = function(f, e, h, k) {
                                var l;
                                f = this.correlationId;
                                this.e2++;
                                return {
                                    routingContext: {
                                        messageType: e,
                                        correlationId: f,
                                        attempt: h,
                                        foreground: null !== (l = this.options.Ni.visible.sW) && undefined !== l ? l : false
                                    },
                                    payload: k
                                };
                            }
                            ;
                            Object.defineProperties(g.prototype, {
                                correlationId: {
                                    get: function() {
                                        return ("").concat(this.eRa, "-").concat(this.e2);
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(g.prototype, {
                                connection: {
                                    get: function() {
                                        return this.eRa;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            g.prototype.wCc = function() {
                                this.eRa++;
                                this.e2 = 1;
                            }
                            ;
                            g.prototype.Cdc = function(f) {
                                var e;
                                e = this.options.Ni.info;
                                f = d.__assign(d.__assign({}, f), {
                                    clientInfo: {
                                        build: e.Hia.build,
                                        platform: e.Hia.platform,
                                        applicationVersion: e.Hia.$a,
                                        uiPlatform: e.W7a,
                                        uiVersion: e.Hia.W7a,
                                        player: e.Hia.player
                                    },
                                    groupName: e.groupName
                                });
                                return d.__assign(d.__assign({}, this.nva(undefined, "authentication", undefined, f)), {
                                    requiresPushySupport: this.options.Rfa
                                });
                            }
                            ;
                            g.prototype.request = function(f, e) {
                                return this.nva(f.name, c[f.type], e, f.payload);
                            }
                            ;
                            g.prototype.Puc = function(f, e) {
                                return this.nva(undefined, f, 1, e);
                            }
                            ;
                            g.prototype.rpa = function(f) {
                                var e, h, k, l;
                                l = null === (e = f.routingContext) || undefined === e ? undefined : e.messageType;
                                e = (null === (h = f.routingContext) || undefined === h ? undefined : h.correlationId) || "";
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
                                e = f.payload;
                                h = f.routingContext;
                                if (f.socketRouterError)
                                    throw (0,
                                    p.VEa)(f);
                                if (!e || "object" !== typeof e)
                                    throw (0,
                                    p.k7)(f);
                                f = (h || ({})).headers;
                                return {
                                    headers: f && "object" === typeof f ? f : {},
                                    payload: e
                                };
                            }
                            ;
                            g.bWc = 2;
                            return g;
                        }
                        )();
                        b.ema = t;
                    }
