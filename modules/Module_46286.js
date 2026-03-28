/**
 * @module Module_46286
 * @description Class module with ES module exports
 * @categories Media, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 46286
 * Deobfuscated size: 5247 chars
 * Functions: 18
 * Prototype definitions: 13
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 46286
{
                        var p, c, g, f, e, h;
                        function d(k, l, m, n) {
                            var q;
                            q = g.jP.call(this, k, l, p.l.pnb, n) || this;
                            q.config = k;
                            q.li = l;
                            q.is = m;
                            q.Fva = n;
                            q.type = p.ks.aG;
                            return q;
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.oP = undefined;
                        p = a(56800);
                        c = a(75568);
                        g = a(65264);
                        f = a(48617);
                        e = a(45266);
                        h = a(7802);
                        Ia(d, g.jP);
                        d.prototype.FV = function() {
                            return Promise.resolve(false);
                        }
                        ;
                        d.prototype.Wba = function() {
                            return Promise.resolve("");
                        }
                        ;
                        d.prototype.Eha = function() {
                            return this.config().gTa ? this.Fva.DYa() ? this.Fva.gba(c.H.cX).then(function(k) {
                                return {
                                    result: k.supported,
                                    reason: "media-capabilities"
                                };
                            }) : Promise.resolve({
                                result: false,
                                reason: "non-hdr-display"
                            }) : Promise.resolve({
                                result: false,
                                reason: "disabled"
                            });
                        }
                        ;
                        d.prototype.TAa = function() {
                            return this.config().gTa ? this.Fva.DYa() ? this.Fva.gba(c.H.SW).then(function(k) {
                                return {
                                    result: k.supported,
                                    reason: "media-capabilities"
                                };
                            }) : Promise.resolve({
                                result: false,
                                reason: "non-hdr-display"
                            }) : Promise.resolve({
                                result: false,
                                reason: "disabled"
                            });
                        }
                        ;
                        d.prototype.Fha = function() {
                            return Promise.resolve(false);
                        }
                        ;
                        d.prototype.wOa = function() {}
                        ;
                        d.prototype.bIc = function(k) {
                            switch (k) {
                            case p.Jx.Kka:
                                return "1.4";
                            case p.Jx.FP:
                                return "2.2";
                            }
                        }
                        ;
                        d.prototype.LA = function() {
                            return f.jEa.LA();
                        }
                        ;
                        d.prototype.gDb = function() {
                            var l;
                            function k(m, n) {
                                return (0,
                                e.fWb)(function(q, r) {
                                    return q.name === r.name;
                                }, m, n);
                            }
                            l = k(this.config().jrb, this.config().yi);
                            return k(l, this.config().fk);
                        }
                        ;
                        d.prototype.hca = function() {
                            return Promise.resolve(undefined);
                        }
                        ;
                        d.prototype.Ppa = function(k) {
                            var l;
                            l = [];
                            this.is.Mi(k) && l.push(this.bIc(k));
                            return [{
                                type: "DigitalVideoOutputDescriptor",
                                outputType: "unknown",
                                supportedHdcpVersions: l,
                                isHdcpEngaged: !!l.length
                            }];
                        }
                        ;
                        d.prototype.hba = function(k) {
                            return this.config().PNc ? Promise.resolve(new h.Ala(k,k.map(function() {
                                return {
                                    supported: true
                                };
                            }))) : g.jP.prototype.hba.call(this, k);
                        }
                        ;
                        b.oP = d;
                    }
