/**
 * @module Module_58421
 * @description Class module with ES module exports
 * @categories General
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 58421
 * Deobfuscated size: 9662 chars
 * Functions: 40
 * Prototype definitions: 9
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 58421
{
                        var p, c, g, f, e, h;
                        function d(k, l) {
                            this.is = k;
                            this.json = l;
                            (0,
                            c.Rw)(this, "json");
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.YKa = undefined;
                        t = a(22970);
                        c = a(66523);
                        g = a(63368);
                        f = a(22674);
                        e = a(42207);
                        h = a(37187);
                        d.prototype.kPb = function(k) {
                            var l;
                            l = this;
                            return p.read(k, function(m) {
                                return parseInt(m);
                            }, function(m) {
                                return l.is.VOa(m);
                            });
                        }
                        ;
                        d.prototype.D3a = function(k) {
                            var l;
                            l = this;
                            return p.read(k, function(m) {
                                return "true" == m ? true : "false" == m ? false : undefined;
                            }, function(m) {
                                return l.is.Fna(m);
                            });
                        }
                        ;
                        d.prototype.ix = function(k) {
                            var l;
                            l = this;
                            return p.read(k, function(m) {
                                return parseInt(m);
                            }, function(m) {
                                return l.is.O9(m);
                            });
                        }
                        ;
                        d.prototype.vSc = function(k) {
                            var l;
                            l = this;
                            return p.read(k, function(m) {
                                return parseFloat(m);
                            }, function(m) {
                                return l.is.mp(m);
                            });
                        }
                        ;
                        d.prototype.jPb = function(k, l) {
                            return p.read(k, function(m) {
                                return p.ltc(m, l);
                            }, function(m) {
                                return undefined !== m;
                            });
                        }
                        ;
                        d.prototype.H3a = function(k, l) {
                            return p.read(k, function(m) {
                                return m;
                            }, function(m) {
                                return l ? l.test(m) : true;
                            });
                        }
                        ;
                        d.prototype.lPb = function(k) {
                            var l, m;
                            l = this;
                            m = undefined === m ? function() {
                                return true;
                            }
                            : m;
                            try {
                                return p.read(k, function(n) {
                                    return l.json.parse(decodeURIComponent(n));
                                }, function(n) {
                                    return l.is.N9(n) && m(n);
                                });
                            } catch (n) {
                                return new h.Bv();
                            }
                        }
                        ;
                        d.prototype.Rn = function(k, l, m) {
                            var n, q;
                            n = this;
                            m = undefined === m ? 1 : m;
                            k = k.trim();
                            q = l instanceof Function ? l : this.Vlc(l, m);
                            l = k.indexOf("[");
                            m = k.lastIndexOf("]");
                            if (0 != l || m != k.length - 1)
                                return new h.Bv();
                            k = k.substring(l + 1, m);
                            try {
                                return p.xOc(k).map(function(r) {
                                    r = q(n, p.X3c(r));
                                    if (r instanceof h.Bv)
                                        throw r;
                                    return r;
                                });
                            } catch (r) {
                                return r instanceof h.Bv ? r : new h.Bv();
                            }
                        }
                        ;
                        d.prototype.Vlc = function(k, l) {
                            var m;
                            m = this;
                            l = undefined === l ? 1 : l;
                            return function(n, q) {
                                n = p.iyc(k);
                                return 1 < l ? m.Rn(q, k, l - 1) : n(m, q);
                            }
                            ;
                        }
                        ;
                        d.ltc = function(k, l) {
                            var n;
                            for (var m in l) {
                                n = parseInt(m);
                                if (l[n] == k)
                                    return n;
                            }
                        }
                        ;
                        d.read = function(k, l, m) {
                            k = l(k);
                            return undefined !== k && m(k) ? k : new h.Bv();
                        }
                        ;
                        d.iyc = function(k) {
                            switch (k) {
                            case "int":
                                return function(l, m) {
                                    return l.kPb(m);
                                }
                                ;
                            case "bool":
                                return function(l, m) {
                                    return l.D3a(m);
                                }
                                ;
                            case "uint":
                                return function(l, m) {
                                    return l.ix(m);
                                }
                                ;
                            case "float":
                                return function(l, m) {
                                    return l.vSc(m);
                                }
                                ;
                            case "string":
                                return function(l, m) {
                                    return l.H3a(m);
                                }
                                ;
                            case "object":
                                return function(l, m) {
                                    return l.lPb(m);
                                }
                                ;
                            }
                        }
                        ;
                        d.xOc = function(k) {
                            var w;
                            for (var l = [["[", "]"]], m = [], n = 0, q = 0, r = 0, u = [], v = {}; q < k.length; (v = {
                                y5: v.y5
                            },
                            ++q)) {
                                v.y5 = k.charAt(q);
                                w = undefined;
                                "," == v.y5 && 0 == r ? (m.push(k.substr(n, q - n)),
                                n = q + 1) : (w = l.find((function(x) {
                                    return function(y) {
                                        return y[0] == x.y5;
                                    }
                                    ;
                                }
                                )(v))) ? (++r,
                                u.push(w)) : 0 < u.length && u[u.length - 1][1] == v.y5 && (--r,
                                u.pop());
                            }
                            if (n != q)
                                m.push(k.substr(n, q - n));
                            else if (n == q && 0 < n)
                                throw new h.Bv();
                            return m;
                        }
                        ;
                        d.X3c = function(k) {
                            var l;
                            l = k.charAt(0);
                            if ('"' == l || "'" == l) {
                                if (k.charAt(k.length - 1) != l)
                                    throw new h.Bv();
                                return k.substring(1, k.length - 1);
                            }
                            return k;
                        }
                        ;
                        a = p = d;
                        b.YKa = a;
                        b.YKa = a = p = t.__decorate([(0,
                        f.aa)(), t.__param(0, (0,
                        f.v)(e.Zi)), t.__param(1, (0,
                        f.v)(g.jX))], a);
                    }
