/**
 * @module Module_71724
 * @description Class module with ES module exports
 * @categories Media, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 71724
 * Deobfuscated size: 1268 chars
 * Functions: 3
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 71724
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        d = a(22970);
                        t = a(72905);
                        p = a(72905);
                        a = (function(c) {
                            function g() {
                                return null !== c && c.apply(this, arguments) || this;
                            }
                            d.__extends(g, c);
                            g.prototype.parse = function(f) {
                                this.N.offset += 6;
                                this.N.sg();
                                p.u && this.N.console.trace("VideoSampleEntry sampleEntryType: " + this.type);
                                if (null === f || undefined === f ? 0 : f.ce)
                                    f.ce.HVc = this.type;
                                return true;
                            }
                            ;
                            return g;
                        }
                        )(t.Kf);
                        b["default"] = a;
                    }
