/**
 * @module Module_44236
 * @description Class module with ES module exports
 * @categories Media, Text, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 44236
 * Deobfuscated size: 1721 chars
 * Functions: 4
 * Prototype definitions: 2
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 44236
{
                        function a(d) {
                            this.dd = d;
                            this.Cf = JSON.stringify(this.Axc());
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Agb = undefined;
                        a.prototype.Axc = function() {
                            var d;
                            d = [];
                            (!this.dd.di || 0 >= this.dd.di.length) && d.push({
                                error: "No CDN."
                            });
                            this.dd.naa || d.push({
                                error: "No default audio track.",
                                foundTracks: this.vVa(this.dd.ul)
                            });
                            this.dd.saa || d.push({
                                error: "No default video track.",
                                foundTracks: this.vVa(this.dd.Jz)
                            });
                            this.dd.paa || d.push({
                                error: "No default subtitle track.",
                                foundTracks: this.vVa(this.dd.sk)
                            });
                            return d;
                        }
                        ;
                        a.prototype.vVa = function(d) {
                            return d && 0 < d.length ? d.map(function(p) {
                                return p.trackId;
                            }) : "No tracks found.";
                        }
                        ;
                        b.Agb = a;
                    }
