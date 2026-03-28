/**
 * @module Module_41161
 * @description Class module with ES module exports
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 41161
 * Deobfuscated size: 6037 chars
 * Functions: 20
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 41161
{
                        var d, p, c, g, f, e;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.Ydb = undefined;
                        t = a(22970);
                        d = t.__importDefault(a(10690));
                        p = t.__importDefault(a(42979));
                        c = a(89752);
                        g = t.__importDefault(a(79804));
                        f = a(25078);
                        e = t.__importDefault(a(48795));
                        a = (function() {
                            function h(k, l) {
                                this.IMa = k;
                                this.am = l;
                                this.Tb = new f.wja();
                                this.Bma = this.zq = undefined;
                                this.Mg = false;
                                this.DQ = new c.S5();
                            }
                            h.prototype.setTimeout = function(k) {
                                this.am = k;
                            }
                            ;
                            h.prototype.nca = function(k) {
                                var l;
                                l = this;
                                this.DQ.Afa(-1, {
                                    result: function(m) {
                                        p.default(k, function() {
                                            m && l.DQ.add(m);
                                            return m;
                                        });
                                    },
                                    timeout: function() {
                                        p.default(k, function() {
                                            l.zq = {
                                                yE: true
                                            };
                                            l.DQ.add(l.zq);
                                            l.abort();
                                            throw new d.default("Timeout while waiting for HttpOutputStream.getResponse() despite no timeout being specified.");
                                        });
                                    },
                                    error: function(m) {
                                        p.default(k, function() {
                                            l.zq = {
                                                yE: true
                                            };
                                            l.DQ.add(l.zq);
                                            throw m;
                                        });
                                    }
                                });
                            }
                            ;
                            h.prototype.abort = function() {
                                this.Bma && this.Bma.abort();
                                this.Mg = true;
                            }
                            ;
                            h.prototype.close = function(k, l) {
                                var m;
                                m = this;
                                g.default(l, function() {
                                    var n;
                                    if (m.zq || m.Bma || m.Mg)
                                        return true;
                                    n = m.Tb.T4();
                                    0 < n.length && (m.Bma = m.IMa.nca({
                                        body: n
                                    }, {
                                        result: function(q) {
                                            m.zq = {
                                                response: q
                                            };
                                            m.DQ.add(m.zq);
                                        },
                                        timeout: function() {
                                            m.zq = {
                                                nua: true
                                            };
                                            m.DQ.add(m.zq);
                                        },
                                        error: function(q) {
                                            m.zq = {
                                                yE: true,
                                                error: q
                                            };
                                            m.DQ.add(m.zq);
                                        }
                                    }));
                                    return true;
                                });
                            }
                            ;
                            h.prototype.write = function(k, l, m, n, q) {
                                var r;
                                r = this;
                                g.default(q, function() {
                                    if (r.zq)
                                        throw new e.default("HttpOutputStream already closed.");
                                    r.Tb.write(k, l, m, n, q);
                                }, this);
                            }
                            ;
                            h.prototype.flush = function(k, l) {
                                var m;
                                m = this;
                                g.default(l, function() {
                                    if (m.zq)
                                        return true;
                                    m.Tb.flush(k, l);
                                });
                            }
                            ;
                            return h;
                        }
                        )();
                        b.Ydb = a;
                    }
