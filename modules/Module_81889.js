/**
 * @module Module_81889
 * @description Class module with ES module exports
 * @categories Network, Media, Manifest, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 81889
 * Deobfuscated size: 2595 chars
 * Functions: 2
 * Prototype definitions: 1
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 81889
{
                        function a() {}
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.pJa = undefined;
                        a.prototype.y_a = function(d) {
                            d = undefined === d ? {} : d;
                            return {
                                co: d.trackingId,
                                Goa: d.authParams,
                                Dr: d.sessionParams,
                                Ye: d.uiLabel,
                                yBa: d.uxLabels,
                                ESa: d.disableTrackStickiness,
                                JC: d.uiPlayStartTime,
                                Kra: d.forceAudioTrackId,
                                Lra: d.forceTimedTextTrackId,
                                bh: d.isBranching,
                                playbackState: d.playbackState ? {
                                    currentTime: d.playbackState.currentTime,
                                    volume: d.playbackState.volume,
                                    muted: d.playbackState.muted,
                                    playbackRate: d.playbackState.playbackRate
                                } : undefined,
                                M_: d.enableTrickPlay,
                                uXa: d.heartbeatCooldown,
                                AE: d.isPlaygraph,
                                fva: d.loadImmediately || false,
                                BNb: d.pin,
                                eF: d.preciseSeeking,
                                Nb: d.startPts,
                                Xg: d.endPts,
                                Cj: d.logicalEnd,
                                Vya: d.renderTimedText,
                                szb: d.extraManifestParams,
                                T9: d.assetId,
                                kdc: d.audioLanguages,
                                V0c: d.textLanguages,
                                xXb: d.videoLanguage,
                                uXb: d.videoAspectRatio,
                                jt: d.packageId,
                                uxb: d.desiredDownloadables,
                                n4a: d.requestReference,
                                jbc: d.additionalAudioAssets,
                                mbc: d.additionalTextAssets
                            };
                        }
                        ;
                        b.pJa = a;
                    }
