/**
 * @module Module_55099
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 55099
 * Deobfuscated size: 1923 chars
 * Functions: 6
 * Prototype definitions: 5
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 55099
{
                        var p;
                        function d(c) {
                            this.Uuc = c;
                            this.cta = false;
                            this.vta = this.Xh = this.O4 = 0;
                            this.Pca = false;
                            this.wta = 0;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.dib = undefined;
                        p = a(32687);
                        d.prototype.DOa = function(c) {
                            c < this.O4 && (this.Xh += this.O4);
                            this.O4 = c;
                            this.cta = true;
                        }
                        ;
                        d.prototype.Wvc = function() {
                            if (this.cta)
                                return this.Pca ? this.wta - this.vta : this.Xh + this.O4 - this.vta;
                        }
                        ;
                        d.prototype.refresh = function() {
                            var c;
                            c = this.Uuc();
                            (0,
                            p.wc)(c) && this.DOa(c);
                        }
                        ;
                        d.prototype.MZc = function() {
                            this.Pca || (this.cta && (this.wta = this.Xh + this.O4),
                            this.Pca = true);
                        }
                        ;
                        d.prototype.n_c = function() {
                            this.Pca && (this.cta && (this.vta += this.Xh + this.O4 - this.wta),
                            this.wta = 0,
                            this.Pca = false);
                        }
                        ;
                        b.dib = d;
                    }
