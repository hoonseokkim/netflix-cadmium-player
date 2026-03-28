/**
 * @module Module_29045
 * @description Class module with ES module exports
 * @categories Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 29045
 * Deobfuscated size: 4945 chars
 * Functions: 16
 * Prototype definitions: 15
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 29045
{
                        var p, c, g;
                        function d(f, e, h, k) {
                            this.$a = f;
                            this.Voa = e;
                            this.Ct = h;
                            this.Cd = undefined === k ? "General" : k;
                            this.QQa = {};
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.nX = undefined;
                        p = a(87386);
                        c = a(90694);
                        g = a(37960);
                        d.prototype.Kqb = function(f, e) {
                            this.QQa[f] = e;
                        }
                        ;
                        d.prototype.fatal = function(f, e) {
                            for (var h = [], k = 1; k < arguments.length; ++k)
                                h[k - 1] = arguments[k];
                            this.RK(p.ep.M0b, f, this.p5(f, h));
                        }
                        ;
                        d.prototype.error = function(f, e) {
                            for (var h = [], k = 1; k < arguments.length; ++k)
                                h[k - 1] = arguments[k];
                            this.RK(p.ep.Qt, f, this.p5(f, h));
                        }
                        ;
                        d.prototype.warn = function(f, e) {
                            for (var h = [], k = 1; k < arguments.length; ++k)
                                h[k - 1] = arguments[k];
                            this.RK(p.ep.KLa, f, this.p5(f, h));
                        }
                        ;
                        d.prototype.info = function(f, e) {
                            for (var h = [], k = 1; k < arguments.length; ++k)
                                h[k - 1] = arguments[k];
                            this.RK(p.ep.i7, f, this.p5(f, h));
                        }
                        ;
                        d.prototype.trace = function(f, e) {
                            for (var h = [], k = 1; k < arguments.length; ++k)
                                h[k - 1] = arguments[k];
                            this.RK(p.ep.lmb, f, this.p5(f, h));
                        }
                        ;
                        d.prototype.debug = function(f, e) {
                            for (var h = 1; h < arguments.length; ++h)
                                ;
                            false;
                        }
                        ;
                        d.prototype.log = function(f, e) {
                            for (var h = [], k = 1; k < arguments.length; ++k)
                                h[k - 1] = arguments[k];
                            this.debug.apply(this, [f].concat(Ba(h)));
                        }
                        ;
                        d.prototype.write = function(f, e, h) {
                            for (var k = [], l = 2; l < arguments.length; ++l)
                                k[l - 2] = arguments[l];
                            this.RK(f, e, this.p5(e, k));
                        }
                        ;
                        d.prototype.toString = function() {
                            return JSON.stringify(this);
                        }
                        ;
                        d.prototype.toJSON = function() {
                            return {
                                category: this.Cd
                            };
                        }
                        ;
                        d.prototype.rR = function(f) {
                            return new d(this.$a,this.Voa,this.Ct,f);
                        }
                        ;
                        d.prototype.RK = function(f, e, h) {
                            f = new c.JGa(f,this.Cd,this.$a.Fc(),e,h);
                            e = Fa(this.Ct.Ct);
                            for (h = e.next(); !h.done; h = e.next())
                                (h = h.value,
                                h(f));
                        }
                        ;
                        d.prototype.Nvc = function(f) {
                            return 0 < Object.keys(this.QQa).length ? [this.QQa].concat(Ba(f)) : f;
                        }
                        ;
                        d.prototype.p5 = function(f, e) {
                            var h;
                            f && "null" !== f && "undefined" !== f || e.push({
                                StackTrace: null !== (h = Error("Empty message").stack) && undefined !== h ? h : "nostack"
                            });
                            return (0,
                            g.Lec)(this.Voa, this.Nvc(e));
                        }
                        ;
                        b.nX = d;
                    }
