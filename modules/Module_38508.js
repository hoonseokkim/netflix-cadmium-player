/**
 * @module Module_38508
 * @description Class module with ES module exports
 * @categories Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 38508
 * Deobfuscated size: 2411 chars
 * Functions: 4
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 38508
{
                        var p, c;
                        function d(g) {
                            var f;
                            f = this;
                            this.iR = function() {
                                var e, h, k;
                                h = !document.hidden;
                                k = null === (e = f.j.lm()) || undefined === e ? undefined : e.Cq.value;
                                e = f.j.paused.value;
                                h || !k || e || (f.va.debug("Pausing playback because window is not visible"),
                                f.j.paused.set(true, {
                                    QB: true,
                                    reason: "adnotvisible"
                                }));
                            }
                            ;
                            this.unsubscribe = function() {
                                document.removeEventListener("visibilitychange", f.iR);
                                f.j.lm().Cq.removeListener(f.iR);
                                f.j.paused.removeListener(f.iR);
                            }
                            ;
                            this.va = g.zb("AdVisibilityMonitor");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.wCa = undefined;
                        t = a(22970);
                        p = a(22674);
                        a = a(87386);
                        d.prototype.m2 = function(g) {
                            this.aKc || (this.va.debug("Starting to monitor playback for visibility"),
                            this.j = g,
                            this.aKc = true,
                            document.addEventListener("visibilitychange", this.iR),
                            this.j.lm().Cq.addListener(this.iR),
                            this.j.paused.addListener(this.iR),
                            this.j.addEventListener("closing", this.unsubscribe),
                            this.iR());
                        }
                        ;
                        c = d;
                        b.wCa = c;
                        b.wCa = c = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(a.Bb))], c);
                    }
