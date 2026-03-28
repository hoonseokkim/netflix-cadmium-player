/**
 * @module Module_42405
 * @description ES module
 * @categories Media, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 42405
 * Deobfuscated size: 6698 chars
 * Functions: 16
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 42405
{
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.yJa = undefined;
                        b.yJa = (function() {
                            function a() {}
                            a.decode = function(d) {
                                return Object.assign({
                                    initialSegment: d.Ef,
                                    segments: a.pnc(d.ba)
                                }, undefined !== d.fe ? {
                                    transitionType: d.fe
                                } : {});
                            }
                            ;
                            a.encode = function(d) {
                                return Object.assign({
                                    Ef: d.initialSegment,
                                    ba: a.orc(d.segments)
                                }, undefined !== d.transitionType ? {
                                    fe: d.transitionType
                                } : {});
                            }
                            ;
                            a.orc = function(d) {
                                return Object.keys(d).reduce(function(p, c) {
                                    p[c] = a.nrc(d[c]);
                                    return p;
                                }, {});
                            }
                            ;
                            a.nrc = function(d) {
                                return Object.assign({
                                    J: d.viewableId,
                                    Va: d.startTimeMs
                                }, d.endTimeMs ? {
                                    eb: d.endTimeMs
                                } : {}, d.defaultNext ? {
                                    Oc: d.defaultNext
                                } : {}, d.weight ? {
                                    weight: d.weight
                                } : {}, d.transitionType ? {
                                    fe: d.transitionType
                                } : {}, d.next ? {
                                    next: a.lrc(d.next)
                                } : {}, d.exitZones ? {
                                    km: d.exitZones
                                } : {}, d.playbackRate ? {
                                    playbackRate: d.playbackRate
                                } : {}, d.uxSegment ? {
                                    J8a: d.uxSegment
                                } : {}, d.type ? {
                                    type: d.type
                                } : {}, undefined !== d.fadeIn ? {
                                    Ls: d.fadeIn
                                } : {}, undefined !== d.fadeOut ? {
                                    Sq: d.fadeOut
                                } : {}, undefined !== d.main ? {
                                    Mp: d.main
                                } : {});
                            }
                            ;
                            a.lrc = function(d) {
                                return Object.keys(d).reduce(function(p, c) {
                                    p[c] = a.mrc(d[c]);
                                    return p;
                                }, {});
                            }
                            ;
                            a.mrc = function(d) {
                                return Object.assign({}, undefined !== d.weight ? {
                                    weight: d.weight
                                } : {}, d.transitionType ? {
                                    fe: d.transitionType
                                } : {});
                            }
                            ;
                            a.pnc = function(d) {
                                return Object.keys(d).reduce(function(p, c) {
                                    p[c] = a.onc(d[c]);
                                    return p;
                                }, {});
                            }
                            ;
                            a.onc = function(d) {
                                return Object.assign({
                                    viewableId: d.J,
                                    startTimeMs: d.Va
                                }, d.eb ? {
                                    endTimeMs: d.eb
                                } : {}, d.Oc ? {
                                    defaultNext: d.Oc
                                } : {}, d.weight ? {
                                    weight: d.weight
                                } : {}, d.fe ? {
                                    transitionType: d.fe
                                } : {}, d.next ? {
                                    next: a.mnc(d.next)
                                } : {}, d.km ? {
                                    exitZones: d.km
                                } : {}, d.playbackRate ? {
                                    playbackRate: d.playbackRate
                                } : {}, d.J8a ? {
                                    uxSegment: d.J8a
                                } : {}, d.type ? {
                                    type: d.type
                                } : {}, undefined !== d.Ls ? {
                                    fadeIn: d.Ls
                                } : {}, undefined !== d.Sq ? {
                                    fadeOut: d.Sq
                                } : {}, undefined !== d.Mp ? {
                                    main: d.Mp
                                } : {});
                            }
                            ;
                            a.mnc = function(d) {
                                return Object.keys(d).reduce(function(p, c) {
                                    p[c] = a.nnc(d[c]);
                                    return p;
                                }, {});
                            }
                            ;
                            a.nnc = function(d) {
                                return Object.assign({}, undefined !== d.weight ? {
                                    weight: d.weight
                                } : {}, d.fe ? {
                                    transitionType: d.fe
                                } : {});
                            }
                            ;
                            return a;
                        }
                        )();
                    }
