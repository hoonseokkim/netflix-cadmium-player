/**
 * @module Module_70428
 * @description Class module with ES module exports
 * @categories Media, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 70428
 * Deobfuscated size: 1819 chars
 * Functions: 3
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 70428
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        d = a(22970);
                        p = a(72905);
                        t = (function(c) {
                            function g() {
                                return null !== c && c.apply(this, arguments) || this;
                            }
                            d.__extends(g, c);
                            g.prototype.parse = function(f) {
                                var e;
                                e = c.prototype.parse.call(this, f);
                                this.N.offset += 8;
                                this.nQa = this.N.sg();
                                this.P4a = this.N.sg();
                                this.N.offset += 4;
                                this.samplerate = this.N.sg();
                                this.N.offset += 2;
                                p.u && this.N.console.trace("MP4AudioSampleEntry: channelcount: " + this.nQa + ", samplesize: " + this.P4a + ", samplerate: " + this.samplerate);
                                if (null === f || undefined === f ? 0 : f.ce)
                                    (f.ce.nQa = this.nQa,
                                    f.ce.P4a = this.P4a,
                                    f.ce.samplerate = this.samplerate);
                                return e;
                            }
                            ;
                            g.Fd = false;
                            return g;
                        }
                        )(a(71724).default);
                        b["default"] = t;
                    }
