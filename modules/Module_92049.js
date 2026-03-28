/**
 * @module Module_92049
 * @description Class module with ES module exports
 * @categories DRM, Media
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 92049
 * Deobfuscated size: 3555 chars
 * Functions: 6
 * Prototype definitions: 5
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 92049
{
                        var p, c, g, f, e, h;
                        function d(k, l, m, n) {
                            k = f.Wja.call(this, k, l, n) || this;
                            k.is = m;
                            k.type = p.XF.lG;
                            return k;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.hhb = undefined;
                        p = a(56800);
                        c = a(75568);
                        g = a(17612);
                        f = a(31741);
                        e = a(40290);
                        h = a(73796);
                        Ia(d, f.Wja);
                        d.prototype.SAa = function() {
                            return Promise.resolve(this.config().Naa && this.jw(g.wb.aD, "avc1", ["audio-endpoint-codec=DD+JOC"]));
                        }
                        ;
                        d.prototype.Dha = function() {
                            return Promise.resolve(this.config().Vqa && this.jw(g.wb.aD, "avc1", ["audio-endpoint-codec=DD+JOC"]));
                        }
                        ;
                        d.prototype.LA = function() {
                            var k, l;
                            k = {
                                Dd: "avc1",
                                keySystem: g.wb.aD,
                                features: ["audio-endpoint-codec=DD+JOC"]
                            };
                            l = {};
                            return (l[c.Vc.ap] = h.zc.ap,
                            l[c.Vc.fG] = h.zc.ap,
                            l[c.Vc.oka] = undefined,
                            l[c.Vc.hp] = h.zc.hp,
                            l[c.Vc.lP] = this.config().Naa ? k : undefined,
                            l[c.Vc.mP] = this.config().Naa ? k : undefined,
                            l[c.Vc.nP] = this.config().Vqa ? k : undefined,
                            l);
                        }
                        ;
                        d.prototype.WTa = function(k) {
                            var l, m, n;
                            k = this.l3a[k];
                            l = [];
                            m = g.wb.aD;
                            if (k) {
                                if (this.is.du(k))
                                    n = k;
                                else
                                    (l = k.features,
                                    n = k.Dd,
                                    m = k.keySystem);
                                return this.jw(m, n, l) ? Promise.resolve({
                                    supported: true
                                }) : Promise.resolve({
                                    supported: false,
                                    reason: "ms-can-present-codec-with-features"
                                });
                            }
                            return Promise.resolve({
                                supported: false,
                                reason: "ms-no-properties"
                            });
                        }
                        ;
                        d.prototype.jw = function(k, l, m) {
                            k = e.fK.Qpa(k, l, m);
                            return this.uZ(k);
                        }
                        ;
                        b.hhb = d;
                    }
