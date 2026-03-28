/**
 * @module Module_27364
 * @description Class module with ES module exports
 * @categories Media, ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 27364
 * Deobfuscated size: 6162 chars
 * Functions: 6
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 27364
{
                        var d, p, c;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.xbb = undefined;
                        d = a(22970);
                        p = a(72905);
                        t = a(91578);
                        c = a(47887);
                        a = (function(g) {
                            function f() {
                                return null !== g && g.apply(this, arguments) || this;
                            }
                            d.__extends(f, g);
                            f.prototype.Lya = function() {
                                var e;
                                e = this.N.ib(4);
                                return 15 !== e ? [96E3, 88200, 64E3, 48E3, 44100, 32E3, 24E3, 22050, 16E3, 12E3, 11025, 8E3, 7350][e] : this.N.ib(24);
                            }
                            ;
                            f.prototype.parse = function(e, h) {
                                if (this.FDc(h) && 64 === h.Pwa) {
                                    if (null === e || undefined === e ? 0 : e.fm) {
                                        h = this.N.LBb(this.length);
                                        for (var k = new ArrayBuffer(this.length), l = new Uint8Array(k), m = 0; m < this.length; m++)
                                            l[m] = h.getUint8(m);
                                        e.fm.Qdd = k;
                                    }
                                    h = this.N.offset;
                                    this.dw = this.C3a();
                                    this.xza = this.Lya();
                                    this.mQa = this.N.ib(4);
                                    this.Q4a = this.X_ = 5 === this.dw || 29 === this.dw ? 5 : -1;
                                    this.Dya = 29 === this.dw ? 1 : -1;
                                    0 < this.X_ && (this.eba = this.Lya(),
                                    this.dw = this.C3a(),
                                    22 === this.dw && (this.sra = this.N.ib(4)));
                                    switch (this.dw) {
                                    case 1:
                                    case 2:
                                    case 3:
                                    case 4:
                                    case 6:
                                    case 7:
                                    case 17:
                                    case 19:
                                    case 20:
                                    case 21:
                                    case 22:
                                    case 23:
                                        (this.yba = this.N.ib(1),
                                        this.qRa = (this.boc = this.N.ib(1)) ? this.N.ib(14) : undefined,
                                        this.N.ib(1),
                                        this.mS = 3 === this.dw ? 256 : 23 === this.dw ? this.yba ? 480 : 512 : this.yba ? 960 : 1024);
                                    }
                                    l = 8 * (this.length - (this.N.offset - h)) + this.N.te;
                                    5 !== this.X_ && 16 <= l && (l = this.N.ib(11),
                                    695 === l && (k = this.C3a(),
                                    5 === k && (l = this.N.ib(1),
                                    1 === l && (this.eba = this.Lya(),
                                    l = 8 * (this.length - (this.N.offset - h)) + this.N.te,
                                    12 <= l && (l = this.N.ib(11),
                                    1352 === l && (this.Dya = this.N.ib(1))))),
                                    22 === k && (l = this.N.ib(1),
                                    1 === l && (this.eba = this.Lya()),
                                    this.sra = this.N.ib(4))));
                                    p.u && this.N.console.trace("AudioSpecificConfig: audioObjectType=" + this.dw + ", samplingFrequency=" + this.xza + ", channelConfiguration=" + this.mQa + ", extensionAudioObjectType=" + this.X_ + ", sbrPresentFlag=" + this.Q4a + ", psPresentFlag=" + this.Dya + ", extensionSamplingFrequency=" + this.eba + ", extensionChannelConfiguration=" + this.sra + ", frameLengthFlag=" + this.yba + ", coreCoderDelay=" + this.qRa + ", frameLength=" + this.mS);
                                    if (null === e || undefined === e ? 0 : e.fm)
                                        (e.fm.dw = this.dw,
                                        e.fm.xza = this.xza,
                                        e.fm.mQa = this.mQa,
                                        e.fm.X_ = this.X_,
                                        e.fm.Q4a = this.Q4a,
                                        e.fm.Dya = this.Dya,
                                        e.fm.eba = this.eba,
                                        e.fm.sra = this.sra,
                                        e.fm.yba = this.yba,
                                        e.fm.qRa = this.qRa,
                                        e.fm.mS = this.mS);
                                }
                                this.skip();
                                return true;
                            }
                            ;
                            f.prototype.C3a = function() {
                                var e;
                                e = this.N.ib(5);
                                31 === e && (e = 32 + this.N.ib(6));
                                return e;
                            }
                            ;
                            f.prototype.FDc = function(e) {
                                return e.tag === c.fEa.tag;
                            }
                            ;
                            f.tag = 5;
                            return f;
                        }
                        )(t.Yja);
                        b.xbb = a;
                    }
