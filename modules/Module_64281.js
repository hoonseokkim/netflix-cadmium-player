/**
 * @module Module_64281
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 64281
 * Deobfuscated size: 6131 chars
 * Functions: 19
 * Prototype definitions: 13
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 64281
{
                        var p, c, g, f;
                        function d(e, h) {
                            return h && !Array.isArray(h) && -1 === h.fzb.indexOf(e) ? h.rules : [];
                        }
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.xRa = undefined;
                        p = a(22970);
                        t = a(90745);
                        c = a(49165);
                        g = a(87561);
                        f = (function(e) {
                            function h(k, l) {
                                var m;
                                m = e.call(this) || this;
                                m.aIc = k;
                                m.xFb = l;
                                m.tMa = {};
                                return m;
                            }
                            p.__extends(h, e);
                            h.prototype.emit = function(k) {
                                for (var l = [], m = 1; m < arguments.length; m++)
                                    l[m - 1] = arguments[m];
                                return e.prototype.emit.call(this, k, this.aIc(k, l[0]));
                            }
                            ;
                            h.prototype.subscribe = function(k) {
                                var l, m;
                                l = this;
                                if (!this.listeners(k).length) {
                                    m = function() {
                                        for (var n = [], q = 0; q < arguments.length; q++)
                                            n[q] = arguments[q];
                                        return l.emit.apply(l, p.__spreadArray([k], p.__read(n), false));
                                    }
                                    ;
                                    this.tMa[k] = m;
                                    this.xFb.addListener(k, m);
                                }
                            }
                            ;
                            h.prototype.addListener = function(k, l) {
                                this.subscribe(k);
                                e.prototype.addListener.call(this, k, l);
                                return this;
                            }
                            ;
                            h.prototype.removeListener = function(k, l) {
                                e.prototype.removeListener.call(this, k, l);
                                l = this.tMa[k];
                                !this.listeners(k).length && l && (this.xFb.removeListener(k, l),
                                this.tMa[k] = undefined);
                                return this;
                            }
                            ;
                            h.prototype.on = function(k, l) {
                                this.addListener(k, l);
                                return this;
                            }
                            ;
                            h.prototype.vm = function(k, l) {
                                this.removeListener(k, l);
                                return this;
                            }
                            ;
                            h.prototype.once = function(k, l) {
                                var n;
                                function m() {
                                    for (var q = [], r = 0; r < arguments.length; r++)
                                        q[r] = arguments[r];
                                    n.removeListener(k, m);
                                    l.apply(undefined, p.__spreadArray([], p.__read(q), false));
                                }
                                n = this;
                                this.addListener(k, m);
                                return this;
                            }
                            ;
                            h.prototype.kya = function(k, l) {
                                this.subscribe(k);
                                e.prototype.kya.call(this, k, l);
                            }
                            ;
                            h.prototype.sOb = function(k, l) {
                                var n;
                                function m() {
                                    for (var q = [], r = 0; r < arguments.length; r++)
                                        q[r] = arguments[r];
                                    n.removeListener(k, m);
                                    l.apply(undefined, p.__spreadArray([], p.__read(q), false));
                                }
                                n = this;
                                this.kya(k, m);
                            }
                            ;
                            return h;
                        }
                        )(t.EventEmitter);
                        b.xRa = function(e, h, k, l) {
                            return new f(function(m, n) {
                                var q;
                                q = d(m, l["*"]);
                                m = l[m] || [];
                                q = q.concat(m).filter(function(r) {
                                    return "object" === typeof r;
                                });
                                m = p.__read(m.filter(function(r) {
                                    return "function" === typeof r;
                                }), 1)[0];
                                return q.length ? (0,
                                g.rza)(e, n, k, {
                                    rules: q,
                                    Fr: false,
                                    SOa: true
                                }, c.jG.IJ, m) : n;
                            }
                            ,h);
                        }
                        ;
                    }
