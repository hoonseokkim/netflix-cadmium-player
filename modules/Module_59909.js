/**
 * @module Module_59909
 * @description Class module with ES module exports
 * @categories ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 59909
 * Deobfuscated size: 2187 chars
 * Functions: 3
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 59909
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.fEa = undefined;
                        d = a(22970);
                        p = a(72905);
                        t = (function(c) {
                            function g() {
                                return null !== c && c.apply(this, arguments) || this;
                            }
                            d.__extends(g, c);
                            g.prototype.parse = function(f) {
                                var e;
                                this.Pwa = this.N.Hd();
                                e = this.N.Hd();
                                this.G6a = e >>> 2;
                                this.b8a = e >>> 1 & 1;
                                this.MPa = 256 * this.N.sg() + this.N.Hd();
                                this.maxBitrate = this.N.dc();
                                this.Joa = this.N.dc();
                                p.u && this.N.console.trace("DecoderConfigDescriptor: objectTypeIndication= 0x" + this.Pwa.toString(16) + ", streamType=" + this.G6a + ", upStream=" + this.b8a + ", bufferSizeDB=" + this.MPa + ", maxBitrate=" + this.maxBitrate + ", avgBitrate=" + this.Joa);
                                if (null === f || undefined === f ? 0 : f.fm)
                                    (f.fm.Pwa = this.Pwa,
                                    f.fm.G6a = this.G6a,
                                    f.fm.b8a = this.b8a,
                                    f.fm.MPa = this.MPa,
                                    f.fm.maxBitrate = this.maxBitrate,
                                    f.fm.Joa = this.Joa);
                                this.zpb(f);
                                return true;
                            }
                            ;
                            g.tag = 4;
                            return g;
                        }
                        )(a(91578).Yja);
                        b.fEa = t;
                    }
