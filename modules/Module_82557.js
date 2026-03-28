/**
 * @module Module_82557
 * @description Class module with ES module exports
 * @categories Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 82557
 * Deobfuscated size: 3431 chars
 * Functions: 6
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 82557
{
                        var p, c, g, f;
                        function d(e) {
                            this.$a = e;
                            this.trace = [];
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.dKa = undefined;
                        t = a(22970);
                        p = a(85001);
                        c = a(22674);
                        g = a(81918);
                        f = a(5021);
                        d.prototype.pt = function(e) {
                            e.Jc !== p.Tc.cp && (this.trace.unshift({
                                time: this.$a.Fc(),
                                event: e
                            }),
                            5 < this.trace.length && this.trace.pop());
                        }
                        ;
                        d.prototype.KWa = function() {
                            var e, h;
                            e = this;
                            if (0 === this.trace.length)
                                return {};
                            h = this.trace[0];
                            return {
                                timeSinceLastRepositionMs: this.YUb(h.time),
                                lastRepositionCause: this.ABb(h.event.Jc),
                                repositionTrace: this.trace.map(function(k) {
                                    return {
                                        timeSince: e.YUb(k.time),
                                        cause: e.ABb(k.event.Jc),
                                        newMediaTime: k.event.OT,
                                        oldMediaTime: k.event.XT,
                                        contentPts: k.event.em,
                                        skip: k.event.skip
                                    };
                                })
                            };
                        }
                        ;
                        d.prototype.YUb = function(e) {
                            return this.$a.Fc().da(e).na(f.Ba);
                        }
                        ;
                        d.prototype.ABb = function(e) {
                            switch (e) {
                            case p.Tc.cp:
                                return "initial";
                            case p.Tc.Dv:
                                return "seek";
                            case p.Tc.lX:
                                return "live_edge";
                            case p.Tc.PX:
                                return "segment_changed";
                            case p.Tc.m8:
                                return "track_changed";
                            case p.Tc.jka:
                                return "force_rebuffer";
                            case p.Tc.q6:
                                return "fragments_missing";
                            case p.Tc.Ska:
                                return "media_discontinuity";
                            }
                        }
                        ;
                        a = d;
                        b.dKa = a;
                        b.dKa = a = t.__decorate([(0,
                        c.aa)(), t.__param(0, (0,
                        c.v)(g.re))], a);
                    }
