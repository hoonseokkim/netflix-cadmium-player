/**
 * @module Module_70402
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 70402
 * Deobfuscated size: 2336 chars
 * Functions: 9
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 70402
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.EventEmitter = undefined;
                        d = a(22970);
                        t = a(90745);
                        p = (function(c) {
                            function g(f, e, h) {
                                var k;
                                k = c.call(this) || this;
                                h ? k.resolve() : k.listener = f.listener(e, function() {
                                    k.clear();
                                    k.resolve();
                                });
                                return k;
                            }
                            d.__extends(g, c);
                            g.prototype.clear = function() {
                                this.listener && (this.listener.clear(),
                                this.listener = undefined);
                            }
                            ;
                            return g;
                        }
                        )(a(91176).Zo);
                        a = (function(c) {
                            function g() {
                                return null !== c && c.apply(this, arguments) || this;
                            }
                            d.__extends(g, c);
                            g.prototype.listener = function(f, e) {
                                var h;
                                h = this;
                                this.on(f, e);
                                return {
                                    clear: function() {
                                        return h.vm(f, e);
                                    }
                                };
                            }
                            ;
                            g.prototype.YHb = function(f, e) {
                                return new p(this,f,e);
                            }
                            ;
                            return g;
                        }
                        )(t.EventEmitter);
                        b.EventEmitter = a;
                    }
