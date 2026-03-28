/**
 * @module Module_89936
 * @description Class module with ES module exports
 * @categories Network, Media, ABR, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 89936
 * Deobfuscated size: 16267 chars
 * Functions: 34
 * Prototype definitions: 23
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 89936
{
                        var p, c, g, f, e, h, k, l, m, n;
                        function d(q, r, u, v, w, x) {
                            function y(z, B) {
                                this.track = z;
                                this.label = B;
                                this.Dg = l.ye.he.UNSENT;
                                this.bytesReceived = 0;
                                this.hJ = [];
                            }
                            function A(z, B, C) {
                                this.requestId = x.wH().toString();
                                this.oc = u;
                                this.log = r.zb("MediaRequest");
                                this.config = q;
                                this.Xb = new k.jl();
                                this.label = B;
                                "notification" === this.label ? this.config().TR && (this.tea = v) : this.tea = w;
                                C && (this.mediaType = C.mediaType,
                                this.Oa = C.Oa,
                                this.bitrate = C.bitrate,
                                this.md = C.md || 0,
                                this.rB = C.rB,
                                this.M = C.M);
                                this.Yca = this.Xoa = this.Yoa = undefined;
                                this.track = z;
                                this.lZ = this.url = this.responseType = undefined;
                                this.Dg = l.ye.he.UNSENT;
                                this.dh = this.eE = this.Zg = this.status = undefined;
                                this.bytesReceived = 0;
                                this.connect = this.gUa = this.nR = this.VM = this.yZa = this.Aj = this.fUa = this.loadTime = this.zq = undefined;
                                this.hJ = [];
                                this.pn = false;
                                false;
                            }
                            y.prototype.addEventListener = function(z, B, C) {
                                this.Xb.addListener.call(this, z, B, C);
                            }
                            ;
                            y.prototype.removeEventListener = function(z, B) {
                                this.Xb.removeListener.call(this, z, B);
                            }
                            ;
                            y.prototype.emit = function(z, B, C) {
                                this.Xb.qd.call(this, z, B, C);
                            }
                            ;
                            y.prototype.gLc = function(z) {
                                this.Dg === l.ye.he.OPENED && (this.Yca = true,
                                this.loadTime = this.Aj = z.timestamp,
                                false,
                                this.Dg = l.ye.he.sG,
                                this.emit(l.ye.Mm.Shb, z));
                            }
                            ;
                            y.prototype.jLb = function(z) {
                                var B;
                                z.responseHeaders && (this.iza = z.responseHeaders);
                                z.httpCode && (this.status = z.httpCode);
                                if (this.Dg < l.ye.he.Rm) {
                                    this.hJ = [];
                                    B = z.timestamp - this.loadTime;
                                    !this.Ee && 0 < B && (this.connect = true,
                                    this.hJ.push(B));
                                    true === this.config().gCc ? this.fUa = z.timestamp : this.fUa = this.Aj = z.timestamp;
                                    false;
                                    this.Dg = l.ye.he.Rm;
                                    200 <= this.status && 299 >= this.status && this.emit(l.ye.Mm.Rhb, z);
                                }
                            }
                            ;
                            y.prototype.jLc = function(z) {
                                this.Dg === l.ye.he.Rm && (false,
                                this.yZa = this.Aj = z.timestamp,
                                z.newBytes = z.bytesLoaded - this.bytesReceived,
                                this.bytesReceived = z.bytesLoaded,
                                this.oc.Mi(this.yZa) && 200 <= this.status && 299 >= this.status && this.emit(l.ye.Mm.Thb, z));
                            }
                            ;
                            y.prototype.w2 = function(z) {
                                var B;
                                if (-1 < [l.ye.he.sG, l.ye.he.Rm].indexOf(this.Dg)) {
                                    this.Yca = false;
                                    false;
                                    this.Aj = z.timestamp;
                                    this.Dg = l.ye.he.DONE;
                                    B = this.bytesReceived;
                                    this.bytesReceived = z.cadmiumResponse.gr.uo;
                                    (0,
                                    n.ta)(this.bytesReceived === this.jq, "bytesReceived do not match expected totalBytes.");
                                    z.newBytes = this.jq - B;
                                    this.oc.Mi(this.nR) && (this.Aj = this.nR,
                                    0 === z.newBytes && (this.yZa = this.nR));
                                    this.oc.Mi(this.VM) && (this.loadTime = this.VM);
                                    this.zq = z.response;
                                    this.emit(l.ye.Mm.O7, z);
                                    this.track.emit("mediaRequestComplete", {
                                        type: "mediaRequestComplete",
                                        uUc: z
                                    });
                                }
                            }
                            ;
                            y.prototype.aLc = function(z) {
                                this.Yca = false;
                                false;
                                this.emit(l.ye.Mm.Q3b, z);
                            }
                            ;
                            y.prototype.L0a = function(z) {
                                var B, C;
                                this.Aj = z.timestamp;
                                this.status = null !== (B = z.httpcode) && undefined !== B ? B : this.status;
                                this.iza = null !== (C = z.responseHeaders) && undefined !== C ? C : this.iza;
                                this.Zg = z.errorcode;
                                this.eE = l.ye.Rr.name[this.Zg];
                                this.dh = z.nativecode;
                                false;
                                this.track.emit("transportreport", {
                                    type: "transportreport",
                                    Wrc: z
                                });
                                this.emit(l.ye.Mm.oK, z);
                                this.Yca = false;
                            }
                            ;
                            y.prototype.open = function(z, B, C, D, E, G, F, H, J) {
                                this.zz = false;
                                this.lZ = B;
                                this.rC = F;
                                this.ox = H;
                                this.NL = J;
                                this.url = z;
                                this.responseType = C;
                                false;
                                return this.url ? this.FM() : (false,
                                false);
                            }
                            ;
                            y.prototype.FM = function() {
                                this.Dg = l.ye.he.OPENED;
                                this.status = this.bytesReceived = 0;
                                this.dh = this.eE = this.Zg = this.iza = undefined;
                                this.tea.Pra(this, this.lZ, this.rC);
                                return true;
                            }
                            ;
                            y.prototype.Ue = function() {
                                false;
                                -1 !== [l.ye.he.OPENED, l.ye.he.sG, l.ye.he.Rm].indexOf(this.Dg) && this.abort();
                                return true;
                            }
                            ;
                            y.prototype.I4 = function(z) {
                                false;
                                this.url = z;
                                return this.Dg > l.ye.he.UNSENT ? (this.abort(),
                                this.FM()) : true;
                            }
                            ;
                            y.prototype.abort = function() {
                                this.Dg = l.ye.he.wx;
                                this.tea.KQ(this);
                                return true;
                            }
                            ;
                            y.prototype.pause = function() {}
                            ;
                            y.prototype.getResponseHeader = function(z) {
                                var B, C;
                                return null !== (C = null === (B = this.iza) || undefined === B ? undefined : B[z.toLowerCase()]) && undefined !== C ? C : null;
                            }
                            ;
                            y.prototype.getAllResponseHeaders = function() {
                                return "";
                            }
                            ;
                            y.prototype.y3 = function() {}
                            ;
                            y.prototype.pg = function() {
                                return this.requestId;
                            }
                            ;
                            y.prototype.toString = function() {
                                var z;
                                z = {
                                    requestId: this.pg(),
                                    segmentId: this.M,
                                    isHeader: this.Ee,
                                    ptsStart: this.PN,
                                    ptsOffset: this.Qfa,
                                    responseType: this.responseType,
                                    duration: this.th,
                                    readystate: this.Dg,
                                    bitrate: this.bitrate
                                };
                                return JSON.stringify(z);
                            }
                            ;
                            y.prototype.toJSON = function() {
                                return this.toString();
                            }
                            ;
                            y.prototype.Tzc = function() {
                                var z, B;
                                if (this.config().gXb && f.$C && f.$C.getEntriesByType && (!this.oc.Mi(this.VM) || !this.oc.Mi(this.nR) && this.oc.Mi(this.url))) {
                                    z = "" + this.url.split("nflxvideo.net")[0].split("//").pop() + ("*nflxvideo.net/range/" + this.Yoa + "-" + this.Xoa + "*");
                                    B = new RegExp(z);
                                    z = f.$C.getEntriesByType("resource").filter(function(C) {
                                        return B.exec(C.name);
                                    })[0];
                                    this.oc.Mi(z) && (0 < z.startTime && (this.VM = z.startTime,
                                    0 < z.requestStart && (this.VM = Math.max(this.VM, z.requestStart))),
                                    0 < z.responseStart && (this.gUa = z.responseStart),
                                    0 < z.responseEnd && (this.nR = z.responseEnd));
                                }
                            }
                            ;
                            y.prototype.tEc = function() {
                                return this.oc.Mi(this.VM) && this.oc.Mi(this.nR) && this.oc.Mi(this.gUa);
                            }
                            ;
                            Ha.Object.defineProperties(y.prototype, {
                                jq: {
                                    configurable: true,
                                    enumerable: true,
                                    get: function() {
                                        return 0 === this.lZ.start && -1 === this.lZ.end ? Number(this.getResponseHeader("content-length")) || this.bytesReceived : this.lZ.end - this.lZ.start + 1;
                                    }
                                },
                                byteLength: {
                                    configurable: true,
                                    enumerable: true,
                                    get: function() {
                                        return this.Xoa - this.Yoa + 1;
                                    }
                                },
                                hBc: {
                                    configurable: true,
                                    enumerable: true,
                                    get: function() {
                                        return !!(this.response && 0 < this.response.byteLength);
                                    }
                                },
                                Ee: {
                                    configurable: true,
                                    enumerable: true,
                                    get: function() {
                                        return !this.rB;
                                    }
                                },
                                response: {
                                    configurable: true,
                                    enumerable: true,
                                    get: function() {
                                        return this.zq;
                                    }
                                },
                                readyState: {
                                    configurable: true,
                                    enumerable: true,
                                    get: function() {
                                        return this.Dg;
                                    }
                                }
                            });
                            Object.getOwnPropertyNames(y.prototype).forEach(function(z) {
                                var B;
                                B = Object.getOwnPropertyDescriptor(y.prototype, z);
                                Object.defineProperty(A.prototype, z, B);
                            });
                            this.Bi = Object.assign(A, l.ye);
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.xHa = undefined;
                        t = a(22970);
                        p = a(22674);
                        c = a(87386);
                        g = a(4203);
                        f = a(22365);
                        e = a(42207);
                        h = a(31034);
                        k = a(94886);
                        l = a(48220);
                        m = a(62665);
                        n = a(45146);
                        b.xHa = d;
                        b.xHa = d = t.__decorate([(0,
                        p.aa)(), t.__param(0, (0,
                        p.v)(g.Pc)), t.__param(1, (0,
                        p.v)(c.Bb)), t.__param(2, (0,
                        p.v)(e.Zi)), t.__param(3, (0,
                        p.v)(h.eib)), t.__param(4, (0,
                        p.v)(h.Wgb)), t.__param(5, (0,
                        p.v)(m.gG))], d);
                    }
