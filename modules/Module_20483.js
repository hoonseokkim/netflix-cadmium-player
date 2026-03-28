/**
 * @module Module_20483
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 20483
 * Deobfuscated size: 2343 chars
 * Functions: 8
 * Prototype definitions: 5
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 20483
{
                        var p;
                        function d(c) {
                            this.Q8b = undefined === c ? false : c;
                            this.Qg = {
                                0: []
                            };
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.zla = undefined;
                        t = a(22970);
                        a = a(22674);
                        d.prototype.add = function(c, g) {
                            var f;
                            g = undefined === g ? 0 : g;
                            f = this.Qg[g];
                            f ? this.Q8b && -1 !== f.indexOf(c) || f.push(c) : this.Qg[g] = [c];
                        }
                        ;
                        d.prototype.remove = function(c, g) {
                            this.xq(c, undefined === g ? 0 : g);
                        }
                        ;
                        d.prototype.removeAll = function(c) {
                            this.xq(c);
                        }
                        ;
                        d.prototype.flatten = function() {
                            var c;
                            c = this;
                            return Object.keys(this.Qg).sort().reduce(function(g, f) {
                                return g.concat(c.Qg[f]);
                            }, []);
                        }
                        ;
                        d.prototype.xq = function(c, g) {
                            Object.entries(this.Qg).forEach(function(f) {
                                var e, h;
                                e = Fa(f);
                                f = e.next().value;
                                e = e.next().value;
                                if (undefined === g || g === parseInt(f)) {
                                    -1 < (h = e.indexOf(c)) && e.splice(h, 1);
                                }
                            });
                        }
                        ;
                        p = d;
                        b.zla = p;
                        b.zla = p = t.__decorate([(0,
                        a.aa)()], p);
                    }
