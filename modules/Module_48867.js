/**
 * @module Module_48867
 * @description Class module with ES module exports
 * @categories Media, ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 48867
 * Deobfuscated size: 2831 chars
 * Functions: 5
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 48867
{
                        var d, p, c;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.u8 = undefined;
                        d = a(66164);
                        p = a(48170);
                        c = a(2983);
                        t = (function() {
                            function g(f) {
                                this.console = f;
                                this.axb = [];
                                this.Usb = {};
                                this.Exb = false;
                            }
                            g.prototype.fAa = function(f, e) {
                                this.axb = f;
                                undefined !== e ? this.Usb[e] = f : this.Exb || (this.console.warn("StreamFilters: Bitrate filters received with undefined viewable id"),
                                this.Exb = true);
                            }
                            ;
                            g.prototype.Oh = function(f) {
                                var e, h, k, l;
                                e = this;
                                if (0 === f.length)
                                    return f;
                                k = f[0].J;
                                if (undefined === k)
                                    return (this.console.error("StreamFilters: Stream has undefined viewable id"),
                                    f);
                                try {
                                    null === (h = d.platform.SD) || undefined === h ? undefined : h.call(d.platform, k);
                                } catch (m) {
                                    return (this.console.error("StreamFilters: createFilteredVideoStreamList: " + m),
                                    f);
                                }
                                l = this.Usb[k] || this.axb;
                                p.u && this.console.trace(("VideoBitrateRangesFilter: filtering ").concat(f.length, " streams with ").concat(JSON.stringify(l)));
                                f = f.filter(function(m) {
                                    return (0,
                                    c.fcc)(m.profile, m.bitrate, m.track, l, e.console).inRange;
                                });
                                p.u && this.console.trace(("VideoBitrateRangesFilter: ... ").concat(f.length, " streams in range"));
                                return f;
                            }
                            ;
                            return g;
                        }
                        )();
                        b.u8 = t;
                    }
