/**
 * Webpack Module 5653
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */
// function(t, b, a) 
{
                        var d, p, c;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: !0
                            }
                        });
                        b.uBb = b.RCb = b.$Ua = b.Ikb = void 0;
                        d = a(22970);
                        p = a(48170);
                        c = a(91967);
                        t = (function() {
                            function g(f) {
                                this.Mb = f;
                            }
                            Object.defineProperties(g.prototype, {
                                ic: {
                                    get: function() {
                                        return g.ic;
                                    },
                                    enumerable: !1,
                                    configurable: !0
                                }
                            });
                            Object.defineProperties(g.prototype, {
                                um: {
                                    get: function() {
                                        return "qaudit";
                                    },
                                    enumerable: !1,
                                    configurable: !0
                                }
                            });
                            Object.defineProperties(g.prototype, {
                                enabled: {
                                    get: function() {
                                        return p.u;
                                    },
                                    enumerable: !1,
                                    configurable: !0
                                }
                            });
                            g.prototype.Ph = function(f) {
                                var e, h, k, n;
                                h = f.Ui;
                                k = f.Xs;
                                f = h === c.Sc.Mr;
                                if (h === c.Sc.Wj || f || "transition" === k)
                                    if (h = this.Mb.VUa()) {
                                        k = {};
                                        try {
                                            for (var l = d.__values(h.zPc), m = l.next(); !m.done; m = l.next()) {
                                                n = m.value;
                                                k[n.mediaType] = this.eIc(n);
                                            }
                                        } catch (r) {
                                            var q;
                                            q = {
                                                error: r
                                            };
                                        } finally {
                                            try {
                                                m && !m.done && (e = l.return) && e.call(l);
                                            } finally {
                                                if (q)
                                                    throw q.error;
                                            }
                                        }
                                        return {
                                            branchQueue: (0,
                                            b.uBb)(h.nSc, f),
                                            playerIterator: k,
                                            driftStats: this.Mb.Y8a
                                        };
                                    }
                            }
                            ;
                            g.prototype.eIc = function(f) {
                                return null === f || void 0 === f ? void 0 : f.iCb();
                            }
                            ;
                            g.ic = "queue-audit";
                            return g;
                        }
                        )();
                        b.Ikb = t;
                        b.$Ua = function(g, f) {
                            var e, h;
                            if (g) {
                                e = g.K;
                                h = {};
                                g.$A().forEach(function(k) {
                                    h[k.mediaType] = (0,
                                    b.RCb)(k, f);
                                });
                                return {
                                    sId: null === e || void 0 === e ? void 0 : e.id,
                                    cancelled: g.fd,
                                    RM: h
                                };
                            }
                            return g;
                        }
                        ;
                        b.RCb = function(g, f) {
                            var e, h, k, l;
                            if (g && g.pe)
                                return (f = f ? g.pe.Pvc() : {},
                                d.__assign(d.__assign(d.__assign({}, g.pe.iDb()), {
                                    unsentRequests: g.pe.JO,
                                    lastFragmentContentEndPts: null === (e = g.Lc) || void 0 === e ? void 0 : e.wa.G,
                                    trackAttributes: null === (h = g.track) || void 0 === h ? void 0 : h.Ps(),
                                    bitrate: null === (k = g.Lc) || void 0 === k ? void 0 : k.bitrate,
                                    lastAppendedTimestamp: null === (l = g.kHb) || void 0 === l ? void 0 : l.G
                                }), f));
                        }
                        ;
                        b.uBb = function(g, f) {
                            return g.map(function(e) {
                                return (0,
                                b.$Ua)(e, f);
                            });
                        }
                        ;
                    }
