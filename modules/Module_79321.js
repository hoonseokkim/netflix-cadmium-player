/**
 * @module Module_79321
 * @description ES module
 * @categories ABR, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 79321
 * Deobfuscated size: 1472 chars
 * Functions: 3
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 79321
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.acd = function(c, g, f) {
                            (0,
                            d.assert)(undefined !== c.buffer.ru && 0 < c.buffer.ru, "Buffer capacity must be > 0");
                            g.TL(function(e) {
                                (0,
                                d.assert)(0 < e.length, "Stream list is empty");
                            });
                            g.JAb(function(e) {
                                (0,
                                d.assert)(e.er, "Stream isUsable is false");
                            });
                            (0,
                            d.assert)(0 < c.playbackRate, "invalid playback rate");
                            (0,
                            d.assert)("undefined" === typeof f === (c.state === p.Yb.Ul), "player must be in starting state when there is no prior selection");
                            (0,
                            d.assert)("undefined" !== typeof f === (c.state !== p.Yb.Ul), "player cannot be in starting state when there is a prior selection");
                        }
                        ;
                        d = a(52571);
                        p = a(65161);
                    }
