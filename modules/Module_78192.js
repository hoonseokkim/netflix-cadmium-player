/**
 * @module Module_78192
 * @description Class/prototype module
 * @categories Media, ABR, Manifest, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 78192
 * Deobfuscated size: 9825 chars
 * Functions: 23
 * Prototype definitions: 14
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 78192
{
                        var g, f;
                        function d(e, h) {
                            var l;
                            e = e || 0;
                            if (h)
                                for (var k in h.ba) {
                                    l = h.ba[k];
                                    if (e >= (l.Va || 0) && (!l.eb || e < l.eb))
                                        return k;
                                }
                        }
                        function p(e, h) {
                            return e && h && h.ba[e];
                        }
                        function c(e, h, k) {
                            var l;
                            this.ya = e.va;
                            this.rl = k;
                            this.JK = this.L7b(e.Mza);
                            this.sD = [];
                            l = k && k[k.length - 1];
                            this.oo = l && (l.endTime || l.fx);
                            this.Jv = new g(e,h,k);
                            e = d(e.yd || 0, this.JK);
                            this.vq = this.A8(e);
                        }
                        g = a(76290);
                        f = a(67725);
                        Object.defineProperties(c.prototype, {
                            WRa: {
                                get: function() {
                                    return this.Jv.WRa;
                                }
                            }
                        });
                        c.prototype.HWa = function(e, h) {
                            return this.Jv && this.Jv.HWa(e, h);
                        }
                        ;
                        c.prototype.MSa = function(e, h) {
                            this.Jv.lXc(e);
                            this.gqb(e);
                            if (!this.JK && this.oo && e > this.oo)
                                h && h();
                            else if ((e = this.vob(e, this.vq, 2, h),
                            this.JK && 0 < this.vq.ZKb.length))
                                h && h();
                            else if (this.JK && this.vq.f1 && e) {
                                2 > this.sD.length && this.S7b(this.vq);
                                h = Math.ceil(2 / (this.sD.length - 1));
                                for (var k = 0; k < this.sD.length && e && 3 > k; k++)
                                    (e = this.sD[k],
                                    e = this.vob(e.startTime, e, h));
                            }
                        }
                        ;
                        c.prototype.Y5a = function(e) {
                            return this.Jv.Y5a(e) ? (this.Jv.Dbc(),
                            this.MSa(e),
                            this.vq.f1 = false,
                            true) : false;
                        }
                        ;
                        c.prototype.oO = function(e, h) {
                            var k;
                            this.gqb(e);
                            this.sD.forEach(function(l) {
                                l.f1 = false;
                            });
                            k = this.vq.Bt && this.vq.Bt[0];
                            this.Jv.oO(e, k && k.index);
                            (e = this.Jv.pzc(e)) && e.length ? this.Jv.$xb(e, h) : h && h();
                        }
                        ;
                        c.prototype.Wn = function(e, h) {
                            var k;
                            this.ya.debug("Set next segment to", h, "for segment", e);
                            e = this.Bob(e) || this.A8(e);
                            e.NRb = h;
                            k = this;
                            e.Uea = e.Uea.filter(function(l) {
                                if (l.id === h)
                                    return true;
                                k.pMa(l);
                                return false;
                            });
                        }
                        ;
                        c.prototype.Pl = function(e, h) {
                            var k;
                            k = p(e, this.JK);
                            Object.keys(k.next).forEach(function(l) {
                                k.next[l].weight = h[l] || 0;
                            });
                        }
                        ;
                        c.prototype.L7b = function(e) {
                            var h, l;
                            h = {};
                            if (e = (e || ({})).ba) {
                                h.ba = {};
                                for (var k in e) {
                                    l = e[k] || ({});
                                    h.ba[k] = {
                                        Va: l.Va,
                                        eb: l.eb,
                                        Oc: l.Oc,
                                        next: this.K7b(l.next)
                                    };
                                }
                            }
                            return h;
                        }
                        ;
                        c.prototype.K7b = function(e) {
                            var h, k;
                            h = {};
                            for (k in e)
                                h[k] = {
                                    weight: (e[k] || ({})).weight
                                };
                            return h;
                        }
                        ;
                        c.prototype.gqb = function(e) {
                            var h, k;
                            if (this.JK && this.vq.startTime > e || this.vq.endTime && this.vq.endTime < e) {
                                h = this.vq;
                                k = d(e, this.JK);
                                k ? (this.ya.debug("Switching segments from", this.vq.id, "to", k, "at pts", e),
                                this.vq = this.Bob(k) || this.A8(k),
                                this.pMa(h)) : this.ya.debug("The pts is outside of the current segment but not in a new one yet");
                            }
                        }
                        ;
                        c.prototype.A8 = function(e) {
                            this.ya.debug("SegmentManager: creating segment", e);
                            e = new f(e,p(e, this.JK),this.rl,this.ya);
                            this.sD.push(e);
                            this.ya.debug("SegmentManager: segment contains", e.Bt.length, "sidxes");
                            return e;
                        }
                        ;
                        c.prototype.pMa = function(e) {
                            var h;
                            if (e && e !== this.vq) {
                                this.ya.debug("SegmentManager: deleting segment", e.id);
                                e.Uea.forEach(this.pMa.bind(this));
                                this.sD = this.sD.filter(function(k) {
                                    return k !== e;
                                });
                                h = e.nub();
                                this.Jv.ETc(h && h.size || 0, h && h.Bt);
                            }
                        }
                        ;
                        c.prototype.Bob = function(e) {
                            var k;
                            for (var h = 0; e && h < this.sD.length; h++) {
                                k = this.sD[h];
                                if (e === k.id)
                                    return k;
                            }
                        }
                        ;
                        c.prototype.S7b = function(e) {
                            var h, l;
                            h = e.NRb;
                            if (h && "" !== h)
                                e.Uea.push(this.A8(h));
                            else {
                                h = e.ZKb;
                                for (var k in h) {
                                    l = h[k];
                                    if (!l || !l.weight)
                                        break;
                                    e.Uea.push(this.A8(k));
                                }
                            }
                        }
                        ;
                        c.prototype.vob = function(e, h, k, l) {
                            if (!h || h.f1)
                                return (this.ya.debug("Done driving segment", h && h.id),
                                true);
                            if (!this.Jv.cgc)
                                return (this.ya.debug("Throttling buffering in quiet period"),
                                false);
                            this.ya.debug("Drive streaming of segment", h.id, "from pts", e);
                            k = (e = this.Jv.qzc(e, h, k)) && e.length || 0;
                            if (0 === k)
                                return (this.ya.debug("Segment is fully downloaded", h && h.id),
                                h.f1 = true,
                                l && l(),
                                true);
                            this.ya.debug("Downloading", k, "sidxes in segment", h.id);
                            return this.Jv.$xb(e, function(m, n) {
                                m && (h.f1 = false);
                                l && l(m, n);
                            });
                        }
                        ;
                        t.exports = c;
                    }
