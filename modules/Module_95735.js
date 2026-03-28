/**
 * @module Module_95735
 * @description Class module with ES module exports
 * @categories Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 95735
 * Deobfuscated size: 4626 chars
 * Functions: 10
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 95735
{
                        var p, c, g, f;
                        function d() {
                            this.pQ = false;
                            this.mna = p.r7.t7;
                            this.gtc = ["chgstrm", "debug", "cdnsel", "netstats", "midplay"];
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.VGa = undefined;
                        t = a(22970);
                        p = a(6823);
                        c = a(22674);
                        g = a(29204);
                        f = a(45146);
                        d.prototype.Wyb = function(e) {
                            var h, k, l, m;
                            h = this;
                            k = e.duration;
                            l = e.lnaStartTime;
                            m = e.level;
                            (0,
                            f.ta)(undefined !== k && 0 < k, "Unexpected or undefined duration value");
                            (0,
                            f.ta)(undefined !== l && 0 < l, "Unexpected or undefined start time value");
                            e.platform && !e.platform.includes("web") || g.config.Ytc || (this.mna = null !== m && undefined !== m ? m : p.r7.t7,
                            setTimeout(function() {
                                h.pQ = true;
                                h.lzb({
                                    lnaStopTime: k
                                });
                            }, l));
                        }
                        ;
                        d.prototype.lzb = function(e) {
                            var h, k;
                            h = this;
                            e = e.lnaStopTime;
                            (0,
                            f.ta)(undefined !== e && 0 < e, "Unexpected or undefined stop time value");
                            k = Math.floor(Math.random() * g.config.fHc) + 1;
                            this.JTa && clearTimeout(this.JTa);
                            this.JTa = setTimeout(function() {
                                h.pQ && (h.pQ = false,
                                h.JTa = undefined);
                            }, e + k);
                        }
                        ;
                        d.prototype.vRc = function(e) {
                            var h, k, l, m;
                            if ("enterLNAMode" === e.type && e.payload)
                                this.Wyb(e.payload);
                            else if ("exitLNAMode" === e.type && e.payload)
                                this.lzb(e.payload);
                            else if ("lna" === e.type) {
                                h = e.lnaStartTime;
                                k = e.lnaEndTime;
                                l = e.serverCurrTime;
                                e = e.level;
                                if (h && k && l) {
                                    m = Math.min(k - l, g.config.CIc);
                                    l < k && l > h && this.Wyb({
                                        lnaStartTime: 1,
                                        duration: m,
                                        level: e
                                    });
                                }
                            }
                        }
                        ;
                        d.prototype.o4c = function() {
                            return this.pQ && this.mna === p.r7.Adb;
                        }
                        ;
                        d.prototype.nOb = function() {
                            return this.pQ && (this.mna === p.r7.MEDIUM || this.mna === p.r7.Adb);
                        }
                        ;
                        d.prototype.zHc = function(e) {
                            return this.pQ && this.gtc.includes(e);
                        }
                        ;
                        Ha.Object.defineProperties(d.prototype, {
                            eHc: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.pQ;
                                }
                            }
                        });
                        a = d;
                        b.VGa = a;
                        b.VGa = a = t.__decorate([(0,
                        c.aa)()], a);
                    }
