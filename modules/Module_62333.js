/**
 * @module Module_62333
 * @description ES module
 * @categories Network, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 62333
 * Deobfuscated size: 2625 chars
 * Functions: 2
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 62333
{
                        var d, p, c, g, f, e, h;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.tmc = function(k, l, m, n) {
                            k = {
                                direction: g.pP.nl,
                                transport: {
                                    uBa: new p.AFa({
                                        Sf: k
                                    })
                                },
                                Ml: l,
                                UWb: d.__spreadArray([], d.__read(f), false),
                                h1a: m,
                                console: n,
                                Sf: k
                            };
                            return new g.DKa(k);
                        }
                        ;
                        b.Ilc = function(k, l, m, n, q) {
                            k = {
                                direction: g.pP.rja,
                                transport: {
                                    uBa: new p.AFa({
                                        Sf: k
                                    }),
                                    LSa: new c.Edb({
                                        Sf: k
                                    })
                                },
                                Ml: l,
                                UWb: d.__spreadArray([], d.__read(e), false),
                                fpc: d.__spreadArray([], d.__read(h), false),
                                h1a: m,
                                wnc: n || 1E3,
                                console: q,
                                Sf: k
                            };
                            return new g.DKa(k);
                        }
                        ;
                        d = a(22970);
                        p = a(43522);
                        c = a(96309);
                        g = a(24606);
                        f = ("bufferScore clientTimestamp playPositionMs ccspSlowStart ccspCongestionAvoidance ccspRecovery hybridMode hybridPaceRate hybridCatchUp hybridRequestLogging hybridMaxsegHint byteRangeHint blackBoxReason").split(" ");
                        e = ["blackBoxReason"];
                        h = ("serverTimeMs encoderTag encoderRegion liveEventStart liveEventEnd maxBitrate prefetchStart prefetchDuration postplayStart postplayDuration").split(" ");
                    }
