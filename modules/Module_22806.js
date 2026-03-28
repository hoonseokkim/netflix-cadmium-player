/**
 * @module Module_22806
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 22806
 * Deobfuscated size: 9400 chars
 * Functions: 12
 * Prototype definitions: 8
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 22806
{
                        var p, c, g, f, e, h, k, l, m;
                        function d(n, q, r, u, v) {
                            this.YY = n;
                            this.Je = r;
                            this.oc = u;
                            this.$a = v;
                            this.log = q.zb("MediaHttp");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.tHa = undefined;
                        t = a(22970);
                        p = a(48220);
                        c = a(24550);
                        g = a(36129);
                        f = a(87386);
                        e = a(22674);
                        h = a(32934);
                        k = a(42207);
                        l = a(81918);
                        m = a(5021);
                        d.prototype.wS = function() {
                            return this.$a.Fc().na(m.Ba);
                        }
                        ;
                        d.prototype.dLc = function(n, q) {
                            n.gLc({
                                mediaRequest: n,
                                timestamp: q
                            });
                        }
                        ;
                        d.prototype.$wa = function(n) {
                            var q, r;
                            r = n.mediaRequest.hN;
                            r.jLb(Object.assign(Object.assign({}, n), {
                                timestamp: n.connect ? n.timestamp : this.wS(),
                                connect: null !== (q = n.connect) && undefined !== q ? q : false,
                                mediaRequest: r,
                                readyState: r.readyState
                            }));
                        }
                        ;
                        d.prototype.C2 = function(n) {
                            this.dLc(n.mediaRequest.hN, n.timestamp);
                        }
                        ;
                        d.prototype.$T = function(n) {
                            var q, r;
                            q = n.mediaRequest.hN;
                            r = n.bytes;
                            "undefined" === typeof q ? false : (q.readyState === p.ye.he.sG && this.$wa(n),
                            this.oc.mp(r) && (n.mediaRequest = q,
                            n.timestamp = this.wS(),
                            r > q.bytesReceived && (n.newBytes = r - q.bytesReceived,
                            n.bytesLoaded = r,
                            q.jLc(n))));
                        }
                        ;
                        d.prototype.bfa = function(n) {
                            var q, r, u, v;
                            q = n.mediaRequest;
                            r = n.errorcode;
                            u = n.httpcode;
                            v = p.ye.Rr;
                            if ("undefined" === typeof q)
                                false;
                            else if ((q = q.hN,
                            "undefined" === typeof q))
                                false;
                            else if (r === g.Y.xP)
                                (n.mediaRequest = q,
                                n.readyState = q.readyState,
                                q.aLc(n));
                            else {
                                switch (r) {
                                case g.Y.g7:
                                    u = v.Bab;
                                    break;
                                case g.Y.EFa:
                                    u = v.CFa;
                                    break;
                                case g.Y.b7:
                                    u = 400 < u && 500 > u ? 452 === u ? v.Jdb : v.vka : 500 <= u ? v.d7 : v.CFa;
                                    break;
                                case g.Y.c7:
                                    u = v.DFa;
                                    break;
                                case g.Y.a7:
                                    u = v.Cab;
                                    break;
                                case g.Y.e7:
                                    u = v.f7;
                                    break;
                                case g.Y.yP:
                                    u = v.f7;
                                    break;
                                case g.Y.Idb:
                                    u = v.Hdb;
                                    break;
                                case g.Y.Fdb:
                                    u = v.vka;
                                    break;
                                case g.Y.d0b:
                                    u = v.DFa;
                                    break;
                                default:
                                    u = v.f7;
                                }
                                n.mediaRequest = q;
                                n.readyState = q.readyState;
                                n.errorcode = u;
                                n.nativecode = r;
                                q.L0a(n);
                            }
                        }
                        ;
                        d.prototype.ZE = function(n, q) {
                            var r, u;
                            r = q.request.hN;
                            if (r)
                                if (q.success) {
                                    if ((false,
                                    n.j && r.readyState !== p.ye.he.DONE)) {
                                        switch (r.readyState) {
                                        case p.ye.he.wx:
                                            false;
                                            return;
                                        case p.ye.he.Rm:
                                            break;
                                        case p.ye.he.sG:
                                            this.$wa({
                                                mediaRequest: q.request,
                                                responseHeaders: q.headers,
                                                httpCode: q.Mk
                                            });
                                            break;
                                        default:
                                            false;
                                        }
                                        if (!r.Ee) {
                                            u = {
                                                mediaRequest: r,
                                                readyState: r.readyState,
                                                timestamp: this.wS(),
                                                cadmiumResponse: q
                                            };
                                            n.j.E7a += 1;
                                            r.Tzc();
                                            r.tEc() && (n.j.B4a += 1,
                                            q.gr.Dm = Math.ceil(r.gUa),
                                            q.gr.lx = Math.ceil(r.nR),
                                            q.gr.fJ = Math.floor(r.VM));
                                            r.vic = u;
                                            r.w2(u);
                                        }
                                    }
                                } else
                                    (false,
                                    r.readyState === p.ye.he.wx ? false : this.bfa({
                                        mediaRequest: q.request,
                                        errorcode: q.Ya,
                                        httpcode: q.Rq,
                                        responseHeaders: q.headers,
                                        cadmiumResponse: q
                                    }));
                        }
                        ;
                        d.prototype.download = function(n, q) {
                            var r;
                            r = this;
                            q = this.Je.download(n, q);
                            n.hN && n.hN.readyState === p.ye.he.OPENED && q.EXc(function(u) {
                                r.C2(u);
                            });
                            q.Mna(function(u) {
                                r.ZE(n, u);
                            });
                            q.RXc(function(u) {
                                r.$T(u);
                            });
                            return q;
                        }
                        ;
                        a = d;
                        b.tHa = a;
                        b.tHa = a = t.__decorate([(0,
                        e.aa)(), t.__param(0, (0,
                        e.v)(c.M5)), t.__param(1, (0,
                        e.v)(f.Bb)), t.__param(2, (0,
                        e.v)(h.Sz)), t.__param(3, (0,
                        e.v)(k.Zi)), t.__param(4, (0,
                        e.v)(l.re))], a);
                    }
