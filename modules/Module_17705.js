/**
 * @module Module_17705
 * @description Class module with ES module exports
 * @categories DRM, Network, Manifest, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 17705
 * Deobfuscated size: 13816 chars
 * Functions: 24
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 17705
{
                        var p, c, g, f, e, h, k, l;
                        function d(m, n, q, r) {
                            m = c.Yf.call(this, m, "PboConfigImpl") || this;
                            m.config = n;
                            m.Rbc = q;
                            m.ke = r;
                            return m;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.DIa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(64174);
                        g = a(83767);
                        f = a(12501);
                        e = a(4203);
                        h = a(24747);
                        k = a(5614);
                        l = a(5021);
                        Ia(d, c.Yf);
                        Ha.Object.defineProperties(d.prototype, {
                            uiVersion: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.config().tw.uiVersion || "";
                                }
                            },
                            uiPlatform: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.config().tw.uiPlatform || "";
                                }
                            },
                            version: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return 2;
                                }
                            },
                            organization: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return "cadmium";
                                }
                            },
                            languages: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.config().tw.S2a;
                                }
                            },
                            lGb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return false;
                                }
                            },
                            Sza: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return Object.assign({
                                        logblob: {
                                            service: "logblob",
                                            isLogsApiDirect: true,
                                            version: "1",
                                            useSocketRouter: true
                                        },
                                        manifest: {
                                            service: "manifest",
                                            isPlayApiDirect: true,
                                            version: "1"
                                        },
                                        licensedmanifest: {
                                            service: "licensedmanifest",
                                            isPlayApiDirect: true,
                                            version: "1"
                                        },
                                        license: {
                                            service: "pbo_licenses",
                                            version: "^1.0.0"
                                        },
                                        events: {
                                            service: "event",
                                            isPlayApiDirect: true,
                                            version: "1",
                                            useSocketRouter: true
                                        },
                                        bind: {
                                            service: this.Rbc.Tsb,
                                            version: "^1.0.0"
                                        },
                                        ping: {
                                            service: "pbo_events",
                                            version: "^1.0.0"
                                        },
                                        config: {
                                            service: "pbo_config",
                                            version: "^1.0.0"
                                        },
                                        prefetchLiveAds: {
                                            service: "prefetchLiveAds",
                                            isPlayApiDirect: true,
                                            version: "1"
                                        },
                                        aleProvision: {
                                            service: "pbo_tokens",
                                            version: "^1.0.0",
                                            orgOverride: "nrdjs"
                                        }
                                    }, this.aSb);
                                }
                            },
                            aSb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return {};
                                }
                            },
                            CPb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return false;
                                }
                            },
                            BXa: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return 10;
                                }
                            },
                            frb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return false;
                                }
                            },
                            ND: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.ke.ND;
                                }
                            },
                            LL: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.ke.LL;
                                }
                            },
                            gW: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.ke.gW;
                                }
                            },
                            iXb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return false;
                                }
                            },
                            Fyb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return true;
                                }
                            },
                            $Wb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return [];
                                }
                            },
                            Lyb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return true;
                                }
                            },
                            Myb: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return false;
                                }
                            },
                            H_: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.ke.H_;
                                }
                            },
                            Hpa: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return this.ke.Hpa;
                                }
                            },
                            timeout: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return (0,
                                    l.ri)(59);
                                }
                            },
                            jTa: {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return true;
                                }
                            }
                        });
                        a = d;
                        b.DIa = a;
                        t.__decorate([f.config(f.string, "uiVersion")], a.prototype, "uiVersion", null);
                        t.__decorate([f.config(f.string, "uiPlatform")], a.prototype, "uiPlatform", null);
                        t.__decorate([f.config(f.Ez, "pboVersion")], a.prototype, "version", null);
                        t.__decorate([f.config(f.string, "pboOrganization")], a.prototype, "organization", null);
                        t.__decorate([f.config(f.y4, "pboLanguages")], a.prototype, "languages", null);
                        t.__decorate([f.config(f.zd, "hasLimitedPlaybackFunctionality")], a.prototype, "lGb", null);
                        t.__decorate([f.config(f.object(), "pboCommands")], a.prototype, "Sza", null);
                        t.__decorate([f.config(f.object(), "pboCommandsOverride")], a.prototype, "aSb", null);
                        t.__decorate([f.config(f.zd, "pboRecordHistory")], a.prototype, "CPb", null);
                        t.__decorate([f.config(f.Ez, "pboHistorySize")], a.prototype, "BXa", null);
                        t.__decorate([f.config(f.zd, "pboAddXEsnHeader")], a.prototype, "frb", null);
                        t.__decorate([f.config(f.zd, "combineManifestAndLicense")], a.prototype, "ND", null);
                        t.__decorate([f.config(f.zd, "enableLicensedManifestForPrefetch")], a.prototype, "LL", null);
                        t.__decorate([f.config(f.zd, "useLdlForPrefetchLicensedManifest")], a.prototype, "gW", null);
                        t.__decorate([f.config(f.zd, "pboUseStudioManifest")], a.prototype, "iXb", null);
                        t.__decorate([f.config(f.zd, "pboEnableLeanManifest")], a.prototype, "Fyb", null);
                        t.__decorate([f.config(f.zd, "useHeaderForRequestNames")], a.prototype, "$Wb", null);
                        t.__decorate([f.config(f.zd, "pboEnableV2OptimizedManifest")], a.prototype, "Lyb", null);
                        t.__decorate([f.config(f.zd, "pboEnableV3Manifest")], a.prototype, "Myb", null);
                        t.__decorate([f.config(f.zd, "pboEnableManifestPartialHydrationSupport")], a.prototype, "H_", null);
                        t.__decorate([f.config(f.y4, "pboContentPlaygraphTypes")], a.prototype, "Hpa", null);
                        t.__decorate([f.config(f.Jo, "pboTimeout")], a.prototype, "timeout", null);
                        t.__decorate([f.config(f.zd, "enablePboBackoff")], a.prototype, "jTa", null);
                        b.DIa = a = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(g.gp)), t.__param(1, (0,
                        p.v)(e.Pc)), t.__param(2, (0,
                        p.v)(h.jja)), t.__param(3, (0,
                        p.v)(k.IX))], a);
                    }
