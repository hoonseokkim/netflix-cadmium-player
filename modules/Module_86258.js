/**
 * @module Module_86258
 * @description ES module
 * @categories Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 86258
 * Deobfuscated size: 3886 chars
 * Functions: 18
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 86258
{
                        var d, p, c, g, f, e;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.j5b = function(h) {
                            var m, n, q, r;
                            function k() {
                                n || (h.qg("pdsb"),
                                n = c.Za.get(g.S7)().then(function(u) {
                                    r = u;
                                    h.qg("pdsc");
                                    return u;
                                }).catch(function(u) {
                                    m.error("Unable to initialize the playdata services", u);
                                    h.qg("pdse");
                                    throw u;
                                }));
                                return n;
                            }
                            function l() {
                                q = true;
                                r && r.close();
                                p.Ce.removeListener(p.Dn, l);
                            }
                            m = (0,
                            c.Fo)(h, "PlayDataManager");
                            q = false;
                            h.qg("pdctor");
                            h.addEventListener(f.ja.Fh, function() {
                                p.Ce.removeListener(p.Dn, l);
                            });
                            h.addEventListener(f.ja.Fh, function() {
                                var u;
                                if (!q) {
                                    h.D4c();
                                    u = [(function() {
                                        return k().then(function(v) {
                                            return v.zha(h.ga);
                                        }).then(function() {
                                            m.info("Sent the playdata");
                                        }).catch(function(v) {
                                            m.error("Unable to send the playdata", v);
                                        });
                                    }
                                    )(), (function() {
                                        return new Promise(function(v) {
                                            c.Za.get(e.oq).flush(false).catch(function() {
                                                m.error("Unable to send logblob");
                                                v(undefined);
                                            }).then(function() {
                                                v(undefined);
                                            });
                                        }
                                        );
                                    }
                                    )()];
                                    Promise.all(u).then(function() {
                                        h.Ewa();
                                    }).catch(function() {
                                        h.Ewa();
                                    });
                                }
                            });
                            p.Ce.addListener(p.Dn, l);
                            return {};
                        }
                        ;
                        d = a(33096);
                        p = a(37509);
                        c = a(31276);
                        t = a(36129);
                        g = a(96687);
                        f = a(85001);
                        e = a(45118);
                        a = a(11479);
                        c.Za.get(a.vk).register(t.ea.cK, function(h) {
                            h(d.ai);
                        });
                    }
