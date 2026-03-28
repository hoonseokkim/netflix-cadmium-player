/**
 * @module Module_76892
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 76892
 * Deobfuscated size: 4497 chars
 * Functions: 12
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 76892
{
                        var c, g, f, e, h, k;
                        function d() {}
                        function p() {}
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.wLa = b.xLa = undefined;
                        t = a(22970);
                        f = a(22674);
                        a = a(22365);
                        e = {
                            FE: false,
                            reason: "uninitialized"
                        };
                        h = {
                            FE: false,
                            reason: "uninitialized"
                        };
                        k = null === (g = null === (c = null === a.Lg || undefined === a.Lg ? undefined : a.Lg.userAgentData) || undefined === c ? undefined : c.getHighEntropyValues) || undefined === g ? undefined : g.call(c, ["architecture", "platformVersion"]);
                        null === k || undefined === k ? undefined : k.then(function(l) {
                            var m;
                            m = l.architecture;
                            e = m ? {
                                FE: true,
                                architecture: m
                            } : {
                                FE: false,
                                reason: "undefined"
                            };
                            h = (l = l.platformVersion) ? {
                                FE: true,
                                version: l
                            } : {
                                FE: false,
                                reason: "undefined"
                            };
                        }).catch(function() {
                            e = {
                                FE: false,
                                reason: "exception"
                            };
                            h = {
                                FE: false,
                                reason: "exception"
                            };
                        });
                        Ha.Object.defineProperties(p.prototype, {
                            architecture: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return e;
                                }
                            },
                            platformVersion: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return h;
                                }
                            }
                        });
                        c = p;
                        b.xLa = c;
                        b.xLa = c = t.__decorate([(0,
                        f.aa)()], c);
                        Ha.Object.defineProperties(d.prototype, {
                            architecture: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return Promise.resolve().then(function() {
                                        return null === k || undefined === k ? undefined : k.then(function(l) {
                                            return l.architecture;
                                        });
                                    });
                                }
                            },
                            platformVersion: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return Promise.resolve().then(function() {
                                        return null === k || undefined === k ? undefined : k.then(function(l) {
                                            return l.platformVersion;
                                        });
                                    });
                                }
                            }
                        });
                        c = d;
                        b.wLa = c;
                        b.wLa = c = t.__decorate([(0,
                        f.aa)()], c);
                    }
