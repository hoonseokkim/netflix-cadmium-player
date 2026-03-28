/**
 * @module Module_91578
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 91578
 * Deobfuscated size: 3195 chars
 * Functions: 8
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 91578
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Yja = undefined;
                        d = a(22970);
                        p = a(47887);
                        t = (function() {
                            function c(g, f, e) {
                                this.tag = g;
                                this.view = f;
                                this.N = e;
                                this.startOffset = e.offset;
                            }
                            c.iPb = function(g, f, e) {
                                var h, k;
                                h = g.Hd();
                                k = g.xSc();
                                g = new (p.BR[h] || c)(h,g.LBb(k),g);
                                g.parse(f, e);
                                return g;
                            }
                            ;
                            Object.defineProperties(c.prototype, {
                                length: {
                                    get: function() {
                                        return this.view.byteLength;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }
                            });
                            c.prototype.parse = function() {
                                this.N.offset = this.startOffset + this.length;
                                this.N.te = 0;
                                return true;
                            }
                            ;
                            c.prototype.aAb = function(g) {
                                var f, h;
                                f = [];
                                this.tag === g && f.push(this);
                                if (this.BR)
                                    for (var e = 0; e < this.BR.length; e++) {
                                        h = this.BR[e];
                                        f = d.__spreadArray(d.__spreadArray([], f, true), h.aAb(g), true);
                                    }
                                return f;
                            }
                            ;
                            c.prototype.wn = function(g) {
                                for (g = this.aAb(g); 0 < g.length; )
                                    return g[0];
                            }
                            ;
                            c.prototype.zpb = function(g) {
                                for (this.BR = []; this.N.offset < this.startOffset + this.length; )
                                    this.BR.push(c.iPb(this.N, g, this));
                            }
                            ;
                            return c;
                        }
                        )();
                        b.Yja = t;
                        t.prototype.skip = t.prototype.parse;
                    }
