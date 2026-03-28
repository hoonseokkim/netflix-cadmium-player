/**
 * @module Module_49690
 * @description Class module with ES module exports
 * @categories MSL, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 49690
 * Deobfuscated size: 5442 chars
 * Functions: 14
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 49690
{
                        var d, p, c, g;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.jkb = undefined;
                        d = a(22970);
                        p = a(41674);
                        c = a(57086);
                        g = a(67442);
                        t = (function() {
                            function f(e, h, k) {
                                this.console = e;
                                this.eFc = h;
                                this.Ig = k;
                                this.AC = new g.iFa(e,{
                                    Ig: k
                                });
                                this.Pua = new c.Jka(e,"pri-cache");
                            }
                            f.prototype.getStats = function() {
                                return {
                                    maxSize: this.Ig,
                                    activeItemsLength: this.AC.GY,
                                    queueSize: this.AC.mF
                                };
                            }
                            ;
                            Object.defineProperties(f.prototype, {
                                GY: {
                                    get: function() {
                                        return this.AC.GY;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            Object.defineProperties(f.prototype, {
                                mF: {
                                    get: function() {
                                        return this.AC.mF;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            f.prototype.remove = function(e) {
                                this.Pua.has(e) && this.Pua.delete(e);
                            }
                            ;
                            f.prototype.get = function(e) {
                                var h, k, l;
                                h = this;
                                k = d.__assign({}, e);
                                l = this.Pua.eWa(k.key, function() {
                                    var n, q, r;
                                    function m() {
                                        k.required = true;
                                        r.uT();
                                    }
                                    n = new p.AbortController();
                                    q = {
                                        Vv: n.signal,
                                        LFb: function() {
                                            var u;
                                            h.console.trace("Invoking pri-cache", {
                                                key: k.key,
                                                sya: k.priority,
                                                Rkd: k.required
                                            });
                                            u = h.eFc.fDc(k, n.signal);
                                            k.required && u.uT();
                                            m = function() {
                                                return u.uT();
                                            }
                                            ;
                                            return u.item;
                                        },
                                        priority: k.priority
                                    };
                                    r = h.AC.add(q);
                                    return {
                                        value: d.__assign(d.__assign({}, r), {
                                            uT: function() {
                                                null === m || undefined === m ? undefined : m();
                                            }
                                        }),
                                        tN: function() {
                                            h.console.trace("pri-cache item removal", {
                                                key: k.key
                                            });
                                            n.abort();
                                            h.AC.remove(q);
                                        }
                                    };
                                });
                                e.required && l.value.uT();
                                return l;
                            }
                            ;
                            f.prototype.clear = function() {
                                this.Pua.clear();
                                this.AC.clear();
                            }
                            ;
                            return f;
                        }
                        )();
                        b.jkb = t;
                    }
