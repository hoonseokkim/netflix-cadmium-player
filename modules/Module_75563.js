/**
 * @module Module_75563
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 75563
 * Deobfuscated size: 2769 chars
 * Functions: 7
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 75563
{
                        var d, p, c, g, f, e, h;
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.yOc = b.v5b = undefined;
                        d = a(22970);
                        t = a(58768);
                        p = a(36332);
                        c = d.__importDefault(a(42979));
                        g = d.__importDefault(a(6838));
                        f = d.__importDefault(a(88257));
                        e = d.__importDefault(a(36114));
                        h = (function(k) {
                            function l(m, n) {
                                var q;
                                q = k.call(this, p.dG.a5b) || this;
                                q.rya = m;
                                q.profile = n;
                                return q;
                            }
                            d.__extends(l, k);
                            l.prototype.nE = function() {
                                return this.rya + "-" + this.profile;
                            }
                            ;
                            l.prototype.rS = function(m, n) {
                                var q;
                                q = this;
                                c.default(n, function() {
                                    var r;
                                    r = m.zf();
                                    r.put("pskid", q.rya);
                                    r.put("profile", q.profile);
                                    return r;
                                });
                            }
                            ;
                            l.prototype.equals = function(m) {
                                return this === m ? true : m instanceof l ? k.prototype.equals.call(this, m) && this.rya == m.rya && this.profile == m.profile : false;
                            }
                            ;
                            return l;
                        }
                        )(t.n6);
                        b.v5b = h;
                        b.yOc = function(k) {
                            var l, m;
                            try {
                                l = k.Be("pskid");
                                m = k.Be("profile");
                                return new h(l,m);
                            } catch (n) {
                                if (n instanceof g.default)
                                    throw new f.default(e.default.lf,"psk profile authdata " + k);
                                throw n;
                            }
                        }
                        ;
                    }
