/**
 * @module Module_24711
 * @description Class module with ES module exports
 * @categories DRM, Crypto
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 24711
 * Deobfuscated size: 4078 chars
 * Functions: 6
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 24711
{
                        var p, c, g;
                        function d(f) {
                            var e;
                            e = g.Wo.call(this) || this;
                            e.L_a = 0;
                            e.Awb = [0];
                            e.xT = [0];
                            e.visibility = 0;
                            e.hy = function() {
                                var h, k;
                                h = e.Dc.Cq.value;
                                k = e.Dc.aB();
                                h && k ? (h = e.visibility,
                                e.visibility = document.hidden ? 0 : 1,
                                h !== e.visibility && (1 === e.visibility ? (e.L_a = e.visibility,
                                e.Dva = k.position.offset.G) : (k = k.position.offset.G - (e.Dva || 0),
                                k > e.xT[0] && (e.xT[0] = k),
                                e.Dva = undefined))) : e.unsubscribe();
                            }
                            ;
                            e.va = f.zb("AdVisibilityTracker");
                            return e;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.xCa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(87386);
                        g = a(87144);
                        Ia(d, g.Wo);
                        d.prototype.start = function(f) {
                            g.Wo.prototype.start.call(this, f);
                            this.BE || (document.addEventListener("visibilitychange", this.hy),
                            this.BE = true);
                        }
                        ;
                        d.prototype.Rsa = function(f) {
                            var e, h, k;
                            h = this.j.nv.getBoundingClientRect();
                            k = h.height;
                            h = h.width;
                            "adStart" === f.event && (k = 0 === k ? document.documentElement.clientHeight : k,
                            h = 0 === h ? document.documentElement.clientWidth : h);
                            f = f.ii.offset.G - (null !== (e = this.Dva) && undefined !== e ? e : 0);
                            f > this.xT[0] && (this.xT[0] = f);
                            e = document.fullscreenElement ? true : screen.height === Da.outerHeight && screen.width === Da.outerWidth;
                            this.Awb = this.xT;
                            return {
                                cumulativeTimeByVisibilityMs: this.Awb,
                                maxContinuousTimeByVisibilityMs: this.xT,
                                visibility: this.visibility,
                                maxVisibility: this.L_a,
                                screenHeight: screen.height,
                                screenWidth: screen.width,
                                adHeight: k,
                                adWidth: h,
                                fullScreen: e
                            };
                        }
                        ;
                        d.prototype.xga = function() {
                            this.Dva = undefined;
                            this.xT = [0];
                            this.L_a = this.visibility = document.hidden ? 0 : 1;
                        }
                        ;
                        d.prototype.unsubscribe = function() {
                            g.Wo.prototype.unsubscribe.call(this);
                            document.removeEventListener("visibilitychange", this.hy);
                        }
                        ;
                        a = d;
                        b.xCa = a;
                        b.xCa = a = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(c.Bb))], a);
                    }
