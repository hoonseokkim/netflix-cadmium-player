/**
 * @module Module_44698
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 44698
 * Deobfuscated size: 2419 chars
 * Functions: 9
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 44698
{
                        var p, c, g;
                        function d(f, e) {
                            this.H$ = e;
                            this.log = f.zb("PboEventSenderImpl");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.FIa = undefined;
                        t = a(22970);
                        p = a(87607);
                        c = a(87386);
                        a = a(22674);
                        d.prototype.k5a = function(f, e) {
                            var h;
                            h = this.H$(p.$o.start);
                            return this.gzb(h, f, e);
                        }
                        ;
                        d.prototype.SRb = function(f) {
                            var e;
                            e = this;
                            return this.H$(p.$o.stop).ef({
                                log: this.log,
                                J: f.R
                            }, f).then(function() {}).catch(function(h) {
                                e.log.error("PBO stop event failed", h);
                                throw h;
                            });
                        }
                        ;
                        d.prototype.c4 = function(f, e, h) {
                            f = this.H$(f);
                            return this.gzb(f, e, h);
                        }
                        ;
                        d.prototype.gzb = function(f, e, h) {
                            var k;
                            k = this;
                            return f.ef({
                                log: this.log,
                                links: e.S.Kp,
                                J: h.R
                            }, h).then(function() {}).catch(function(l) {
                                k.log.error("PBO event failed", l);
                                throw l;
                            });
                        }
                        ;
                        g = d;
                        b.FIa = g;
                        b.FIa = g = t.__decorate([(0,
                        a.aa)(), t.__param(0, (0,
                        a.v)(c.Bb)), t.__param(1, (0,
                        a.v)(p.XEa))], g);
                    }
