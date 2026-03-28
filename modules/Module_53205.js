/**
 * @module Module_53205
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 53205
 * Deobfuscated size: 2449 chars
 * Functions: 5
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 53205
{
                        var p, c, g, f;
                        function d(e) {
                            this.config = e;
                            this.l6a = c.ia;
                            this.n4 = [];
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.fLa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(72574);
                        g = a(5021);
                        a = a(22692);
                        d.prototype.Bl = function() {
                            var h;
                            for (var e; 0 < this.n4.length; )
                                (e = this.n4.shift(),
                                this.Mqb(e));
                            e = undefined === this.Eaa || undefined === this.IR ? g.ia : this.IR.da(this.Eaa);
                            h = e.EGb() ? 0 : this.l6a.na(c.fP) / e.na(g.Ba);
                            return {
                                m7a: Math.floor(h),
                                med: e.na(g.Ba)
                            };
                        }
                        ;
                        d.prototype.uac = function(e) {
                            this.l6a = this.l6a.add(e.size);
                            this.n4.push(e.apc);
                            for (this.n4.sort(function(h, k) {
                                return h.start.xl(k.start);
                            }); this.n4.length > this.config.cpc; )
                                (e = this.n4.shift(),
                                this.Mqb(e));
                        }
                        ;
                        d.prototype.Mqb = function(e) {
                            undefined === this.Eaa && (this.Eaa = e.start);
                            undefined !== this.IR && 0 > this.IR.xl(e.start) && (this.Eaa = this.Eaa.add(e.start.da(this.IR)));
                            if (undefined === this.IR || 0 > this.IR.xl(e.end))
                                this.IR = e.end;
                        }
                        ;
                        f = d;
                        b.fLa = f;
                        b.fLa = f = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(a.xmb))], f);
                    }
