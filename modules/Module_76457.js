/**
 * @module Module_76457
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 76457
 * Deobfuscated size: 1515 chars
 * Functions: 3
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 76457
{
                        var p, c, g;
                        function d(f, e) {
                            this.Je = e;
                            this.log = f.zb("OpenConnectSideChannel");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.hIa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(87386);
                        a = a(32934);
                        d.prototype.Pra = function(f, e, h) {
                            e = {
                                url: f.url,
                                dWc: h
                            };
                            false;
                            f.GXa = this.Je.XYc(e);
                        }
                        ;
                        d.prototype.KQ = function(f) {
                            try {
                                f.GXa();
                            } catch (e) {
                                this.log.warn("exception aborting request");
                            }
                        }
                        ;
                        g = d;
                        b.hIa = g;
                        b.hIa = g = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(c.Bb)), t.__param(1, (0,
                        p.v)(a.Sz))], g);
                    }
