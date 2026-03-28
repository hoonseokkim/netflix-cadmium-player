/**
 * @module Module_30837
 * @description ES module
 * @categories DRM, Crypto, Network, Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 30837
 * Deobfuscated size: 9150 chars
 * Functions: 12
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 30837
{
                        var m, n, q, r, u, v, w;
                        function d(x, y) {
                            var A, z;
                            if (x)
                                (A = 1440 <= Da.screen.height * Da.devicePixelRatio,
                                z = (x = f() && e() && (A || h() || p())) || g());
                            else
                                z = (x = null === (z = Da.MSMediaKeys) || undefined === z ? undefined : z.isTypeSupported(n.wb.cd, u.zc.$_a)) || (null === (A = Da.MSMediaKeys) || undefined === A ? undefined : A.isTypeSupported(n.wb.aD, u.zc.$_a));
                            y && (x = z = false);
                            return {
                                oEc: x,
                                qGb: z
                            };
                        }
                        function p() {
                            var x;
                            return !(null === (x = Da.matchMedia) || undefined === x || !x.call(Da, "(dynamic-range: high)").matches);
                        }
                        function c(x, y) {
                            var A, z;
                            try {
                                return "probably" === (null === (z = null === (A = Da.MSMediaKeys) || undefined === A ? undefined : A.isTypeSupportedWithFeatures) || undefined === z ? undefined : z.call(A, x, y));
                            } catch (B) {
                                return false;
                            }
                        }
                        function g() {
                            return c(n.wb.aD, u.zc.yJc);
                        }
                        function f() {
                            return c(n.wb.cd, "video/mp4;codecs=" + u.zc.TF + ";features=" + w.Nm.JQa.join(","));
                        }
                        function e() {
                            var x;
                            return null === (x = Da.MSMediaKeys) || undefined === x ? undefined : x.isTypeSupported(n.wb.cd, u.zc.zJc);
                        }
                        function h() {
                            return c(n.wb.cd, "video/mp4;codecs=" + u.zc.Ai + ";features=" + w.Nm.KUa.join(","));
                        }
                        function k(x) {
                            var y;
                            x = x.data;
                            return "false" !== (null !== (y = null === x || undefined === x ? undefined : x.enableHWDRMForHEVCAndQHDOnly) && undefined !== y ? y : "true").toString().toLowerCase();
                        }
                        function l(x) {
                            var y;
                            x = x.data;
                            return "true" === (null !== (y = null === x || undefined === x ? undefined : x.disablePlayReady) && undefined !== y ? y : "false").toString().toLowerCase();
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.rwc = function(x) {
                            return Object.assign(Object.assign({}, (0,
                            r.Lba)()), {
                                sy: "D",
                                zu: x.zE ? "NFCDIE-04-" : x.GYa ? "NFCDIE-LX-" : x.Tta ? "NFCDIE-AP-" : x.bda ? "NFCDIE-AT-" : x.YS ? "NFCDIE-PH-" : "NFCDIE-03-",
                                DL: "edge-cadmium"
                            });
                        }
                        ;
                        b.pwc = function(x) {
                            var y, A;
                            y = Object.assign(Object.assign({}, (0,
                            r.Kba)()), {
                                iL: (0,
                                v.Tf)([q.Vc.ap, q.Vc.fG, q.Vc.lP, q.Vc.mP, q.Vc.nP, q.Vc.hp]),
                                yi: (0,
                                v.Tf)([].concat(Ba(q.Bc.C5), Ba(q.Bc.W5), Ba(q.Bc.KW), Ba(q.Bc.LW), Ba(q.Bc.IW), Ba(q.Bc.JW), Ba(q.Bc.mDa), Ba(q.Bc.nDa), Ba(q.Bc.oDa))),
                                fk: (0,
                                v.Tf)([].concat(Ba(q.Bc.B5), Ba(q.Bc.Bja), Ba(q.Bc.Aja), Ba(q.Bc.Cja))),
                                yB: undefined,
                                Oca: false
                            });
                            A = k(x);
                            x = l(x);
                            d(A, x).qGb || (y.ND = true,
                            y.LL = true,
                            y.gW = true);
                            return y;
                        }
                        ;
                        b.Ofd = d;
                        b.qgd = p;
                        b.UAa = c;
                        b.Dha = g;
                        b.dmd = f;
                        b.fmd = e;
                        b.emd = h;
                        b.qwc = function(x, y) {
                            var A, z, B, C;
                            x = x.uB;
                            A = k(y);
                            y = l(y);
                            A = d(A, y);
                            y = A.qGb;
                            z = A.oEc;
                            B = (0,
                            v.Tf)([q.H.YJ, q.H.ZJ]);
                            C = (0,
                            v.Tf)([q.H.YJ, q.H.ZJ, q.H.$J]);
                            A = {
                                nudgeSourceBuffer: true,
                                audioCapabilityDetectorType: m.XF.lG,
                                videoCapabilityDetectorType: m.ks.lG,
                                microsoftHwdrmRequiresHevc: true,
                                microsoftScreenSizeFilterEnabled: true,
                                addFailedLogBlobsToQueue: false,
                                bookmarkIgnoreBeginning: "2000",
                                forceAppendEncryptedStreamHeaderFirst: true,
                                retainSbrOnFade: true,
                                enableXHEAAC: true,
                                useEncryptedEvent: false
                            };
                            z = {
                                prepareCadmium: true,
                                enableLdlPrefetch: !y || z,
                                licenseRenewalRequestDelay: 5E3,
                                enableMediaPrefetch: true,
                                defaultHeaderCacheSize: 15,
                                prepareLdlCacheMaxCount: 15
                            };
                            B = {
                                audioCapabilityDetectorType: m.XF.aG,
                                videoCapabilityDetectorType: m.ks.PW,
                                microsoftScreenSizeFilterEnabled: false,
                                keySystemList: [n.wb.xma],
                                licenseRenewalRequestDelay: 0,
                                audioProfiles: (0,
                                v.Tf)([q.Vc.ap, q.Vc.fG, q.Vc.hp]),
                                videoProfiles: x ? C : B,
                                liveVideoProfiles: (0,
                                v.Tf)([q.H.uP, q.H.vP]),
                                droppedFrameRateFilterEnabled: true,
                                enableCDMAttestedDescriptors: true,
                                enableFullHdForSWDRM: x ? true : false
                            };
                            A = Object.assign(Object.assign({}, A), z);
                            x && (A = Object.assign(Object.assign({}, A), {
                                webkitDecodedFrameCountIncorrectlyReported: true,
                                noRenderTimeoutMilliseconds: 1E4
                            }));
                            return y ? Object.assign(Object.assign({}, A), {
                                microsoftClearLeadRequiresSwdrm: true,
                                enableHWDRM: true,
                                enableHEVC: true,
                                enablePRK: true,
                                enableDV: true,
                                enableHDR: true,
                                microsoftHwdrmRequiresHevc: false,
                                enableDDPlus51: true,
                                enableDDPlusAtmos: true,
                                keySystemList: [n.wb.cd, n.wb.k5b],
                                validateKeySystemAccess: true,
                                enableCDMAttestedDescriptors: true,
                                enableCachedErrors: true,
                                enableKeySystemRestrictor: true
                            }) : Object.assign(Object.assign({}, A), B);
                        }
                        ;
                        m = a(56800);
                        n = a(17612);
                        q = a(75568);
                        r = a(64232);
                        u = a(73796);
                        v = a(88195);
                        w = a(75456);
                    }
