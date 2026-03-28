/**
 * @module Module_99881
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 99881
 * Deobfuscated size: 3382 chars
 * Functions: 11
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 99881
{
                        var d, p, c;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.qab = undefined;
                        d = a(22970);
                        t = a(53389);
                        p = d.__importDefault(a(79804));
                        c = d.__importDefault(a(48795));
                        a = (function(g) {
                            function f(e) {
                                var h;
                                h = g.call(this) || this;
                                h.Bk = e;
                                h.Xl = false;
                                h.Ux = 0;
                                h.TMa = -1;
                                return h;
                            }
                            d.__extends(f, g);
                            f.prototype.abort = function() {}
                            ;
                            f.prototype.close = function(e, h) {
                                var k;
                                k = this;
                                p.default(h, function() {
                                    return k.Xl = true;
                                });
                            }
                            ;
                            f.prototype.mark = function() {
                                this.TMa = this.Ux;
                            }
                            ;
                            f.prototype.reset = function() {
                                if (-1 == this.TMa)
                                    throw new c.default("Cannot reset before input stream has been marked or if mark has been invalidated.");
                                this.Ux = this.TMa;
                            }
                            ;
                            f.prototype.read = function(e, h, k) {
                                var l;
                                l = this;
                                p.default(k, function() {
                                    var m;
                                    if (l.Xl)
                                        throw new c.default("Stream is already closed.");
                                    if (l.Ux == l.Bk.length)
                                        return null;
                                    -1 == e && (e = l.Bk.length - l.Ux);
                                    m = l.Bk.subarray(l.Ux, l.Ux + e);
                                    l.Ux += m.length;
                                    return m;
                                });
                            }
                            ;
                            f.prototype.skip = function(e, h, k) {
                                var l;
                                l = this;
                                p.default(k, function() {
                                    var m;
                                    m = l.Ux;
                                    l.Ux = Math.min(l.Ux + e, l.Bk.length);
                                    return l.Ux - m;
                                });
                            }
                            ;
                            return f;
                        }
                        )(t.Cka);
                        b.qab = a;
                    }
