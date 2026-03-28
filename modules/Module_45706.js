/**
 * @module Module_45706
 * @description ES module
 * @categories DRM, Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 45706
 * Deobfuscated size: 3259 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 45706
{
                        var p, c;
                        function d(g, f) {
                            var e, h;
                            e = (0,
                            c.Fo)(g, "MSS");
                            if (p.config.vJc)
                                return {
                                    xra: "mss",
                                    nJ: function(k) {
                                        var l, m;
                                        if (k.lower && 2160 <= k.height)
                                            a: {
                                                for (l = k; l.lower; ) {
                                                    if (2160 > l.height && 1080 < l.height) {
                                                        l = true;
                                                        break a;
                                                    }
                                                    if (1080 >= l.height)
                                                        break;
                                                    l = l.lower;
                                                }
                                                l = false;
                                            }
                                        else
                                            l = undefined;
                                        if (l) {
                                            if (undefined === h) {
                                                try {
                                                    m = Da.MSMediaKeys;
                                                    h = m && m.isTypeSupportedWithFeatures ? "probably" === m.isTypeSupportedWithFeatures("com.microsoft.playready.software", 'video/mp4;codecs="avc1,mp4a";features="display-res-x=3840,display-res-y=2160,display-bpc=8"') : false;
                                                } catch (n) {
                                                    e.error("hasUltraHdDisplay exception");
                                                    h = true;
                                                }
                                                h || (e.warn("Restricting resolution due screen size", {
                                                    MaxHeight: k.height
                                                }),
                                                f.fw.set({
                                                    reason: "microsoftScreenSize",
                                                    height: k.height
                                                }));
                                            }
                                            return !h;
                                        }
                                    }
                                };
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.w9c = d;
                        t = a(59032);
                        p = a(29204);
                        c = a(31276);
                        (0,
                        t.Vka)(d);
                    }
