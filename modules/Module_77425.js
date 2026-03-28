/**
 * @module Module_77425
 * @description Class module with ES module exports
 * @categories Network, Media, ABR, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 77425
 * Deobfuscated size: 6613 chars
 * Functions: 8
 * Prototype definitions: 3
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 77425
{
                        var c, g, f, e, h, k, l, m, n, q, r;
                        function d(u, v, w, x, y, A) {
                            this.$a = u;
                            this.VH = v;
                            this.config = w;
                            this.Je = y;
                            this.cJc = A;
                            this.log = x.zb("MediaRequestDownloader");
                        }
                        function p(u) {
                            switch (u) {
                            case r.l.V:
                                return h.mj.audio;
                            case r.l.U:
                                return h.mj.video;
                            case r.l.Ea:
                                return h.mj.zJ;
                            case r.l.yk:
                                return h.mj.Lva;
                            default:
                                return "unknown";
                            }
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.yHa = undefined;
                        t = a(22970);
                        c = a(22674);
                        g = a(87386);
                        f = a(32934);
                        e = a(24240);
                        h = a(51344);
                        k = a(48220);
                        l = a(81918);
                        m = a(5021);
                        n = a(34231);
                        q = a(4203);
                        r = a(26388);
                        d.prototype.Pra = function(u, v, w) {
                            var y, A, z, B, C;
                            function x() {
                                var D;
                                u.removeEventListener(k.ye.Mm.oK, x);
                                if (u.aborted)
                                    y.log.debug("MediaRequest aborted, not retrying (" + u + ")");
                                else {
                                    D = y.config().Csc;
                                    undefined === u.Z_ ? u.Z_ = 0 : u.Z_++;
                                    u.Z_ >= D.length && (u.Z_ = D.length - 1);
                                    Da.clearTimeout(u.STa);
                                    u.STa = Da.setTimeout(function() {
                                        u.FM();
                                    }, D[u.Z_]);
                                }
                            }
                            y = this;
                            u.qhd = true;
                            u.aborted = false;
                            A = 0 === v.start && -1 === v.end;
                            z = this.VH.Hz || !A && undefined !== u.NL;
                            B = p(u.mediaType);
                            v = {
                                url: u.url,
                                responseType: this.Je.Jla.Q$a,
                                withCredentials: false,
                                EL: B,
                                offset: A ? undefined : v.start,
                                length: A ? undefined : u.jq,
                                track: {
                                    type: B
                                },
                                stream: {
                                    ob: u.Oa,
                                    bitrate: u.bitrate
                                },
                                Yc: {
                                    id: u.md
                                },
                                hN: u,
                                rC: w,
                                Hz: z,
                                ox: u.ox
                            };
                            w = u.NL;
                            undefined !== w && undefined !== w.Wf && undefined !== w.GE && undefined !== w.Py && (v.NL = [w.Py, w.GE, w.Wf, w.Aub]);
                            C = this.wS();
                            v = this.cJc.download(v, function(D) {
                                D.success && u.readyState !== k.ye.he.DONE && (u.readyState === k.ye.he.wx ? false : (u.readyState === k.ye.he.sG ? u.jLb({
                                    mediaRequest: u,
                                    readyState: u.readyState,
                                    timestamp: u.Ee ? C : y.wS(),
                                    connect: false,
                                    responseHeaders: D.headers,
                                    httpCode: D.Mk
                                }) : u.readyState !== k.ye.he.sG && u.readyState !== k.ye.he.Rm && false,
                                D = {
                                    mediaRequest: u,
                                    readyState: u.readyState,
                                    timestamp: y.wS(),
                                    cadmiumResponse: D,
                                    response: D.content
                                },
                                u.vic = D,
                                u.w2(D)));
                            });
                            u.addEventListener(k.ye.Mm.oK, x);
                            u.GXa = v.abort;
                        }
                        ;
                        d.prototype.KQ = function(u) {
                            try {
                                u.aborted = true;
                                Da.clearTimeout(u.STa);
                                u.STa = undefined;
                                u.Z_ = undefined;
                                u.GXa();
                            } catch (v) {
                                this.log.warn("exception aborting request");
                            }
                        }
                        ;
                        d.prototype.wS = function() {
                            return this.$a.Fc().na(m.Ba);
                        }
                        ;
                        a = d;
                        b.yHa = a;
                        b.yHa = a = t.__decorate([(0,
                        c.aa)(), t.__param(0, (0,
                        c.v)(l.re)), t.__param(1, (0,
                        c.v)(n.Rt)), t.__param(2, (0,
                        c.v)(q.Pc)), t.__param(3, (0,
                        c.v)(g.Bb)), t.__param(4, (0,
                        c.v)(f.Sz)), t.__param(5, (0,
                        c.v)(e.Qgb))], a);
                    }
