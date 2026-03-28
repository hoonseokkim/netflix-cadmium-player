/**
 * @module Module_14242
 * @description Class module with ES module exports
 * @categories ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 14242
 * Deobfuscated size: 4430 chars
 * Functions: 8
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 14242
{
                        var d, p, c;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.Qlb = undefined;
                        d = a(91176);
                        p = a(7559);
                        c = a(65161);
                        t = (function() {
                            function g(f, e) {
                                this.Xn = f;
                                this.console = e;
                                this.gwa = Infinity;
                                this.Wub = this.s4a = 0;
                                this.m2c = false;
                            }
                            g.prototype.ntc = function(f, e, h, k, l) {
                                var m;
                                if (this.Xn) {
                                    m = f.Ta;
                                    if (m) {
                                        if (h === c.l.U)
                                            (h = m.QH(Math.ceil(this.Xn * f.Ha.$B), undefined, true),
                                            m = f.Eu(h),
                                            f = m.Ob.Af(f.Ha),
                                            m.Nh({
                                                start: 0,
                                                end: this.Xn - h * f
                                            }),
                                            this.gwa = this.Xn);
                                        else {
                                            undefined !== k.yTb ? (e = k.yTb,
                                            h = e * f.Ha.G) : (h = (0,
                                            p.GCb)(k, l) + Math.ceil(k.rdc * f.Ha.$B),
                                            d.I.Ca(h).Af(f.Ha),
                                            h = e + h,
                                            e = Math.ceil(h / f.Ha.$B));
                                            h = m.QH(h, undefined, true);
                                            for (l = k = 0; l < h; ++l)
                                                (m = f.Eu(l),
                                                k += m.Ob.Af(f.Ha));
                                            k = e - k;
                                            m = f.Eu(h);
                                            m.Nh({
                                                end: k
                                            });
                                            this.gwa = e;
                                        }
                                        m.B_a();
                                        return m;
                                    }
                                }
                            }
                            ;
                            g.prototype.eBc = function() {
                                return this.Wub >= this.gwa;
                            }
                            ;
                            g.prototype.yCc = function(f, e) {
                                this.s4a += this.YA(f, e);
                            }
                            ;
                            g.prototype.Grc = function(f, e, h) {
                                f.s4a = this.YA(e, h);
                            }
                            ;
                            g.prototype.YA = function(f, e) {
                                return f.Ob.Af(e.Ha);
                            }
                            ;
                            g.prototype.GA = function() {
                                if (!this.eBc())
                                    return false;
                                if (this.m2c)
                                    return (this.console.warn("StallAtFrameCount underflow reported, bufferingComplete = false"),
                                    false);
                                this.console.warn("StallAtFrameCount bufferingComplete = true:", ("").concat(this.Wub, " >= ").concat(this.gwa));
                                return true;
                            }
                            ;
                            return g;
                        }
                        )();
                        b.Qlb = t;
                    }
