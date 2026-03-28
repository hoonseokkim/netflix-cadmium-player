/**
 * @module Module_40981
 * @description Class module with ES module exports
 * @categories Media, Player, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 40981
 * Deobfuscated size: 10440 chars
 * Functions: 15
 * Prototype definitions: 6
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 40981
{
                        var d, p, c, g, f, e, h;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.mka = undefined;
                        d = a(22970);
                        p = a(66164);
                        c = a(61996);
                        g = a(94328);
                        f = a(52571);
                        e = a(48170);
                        h = a(35779);
                        t = (function() {
                            function k(l, m, n, q) {
                                var u, v;
                                function r(w, x) {
                                    return w.M === x.M && w.offset.equal(x.offset);
                                }
                                this.kfa = l;
                                this.za = m;
                                this.config = n;
                                this.irb = q;
                                this.u5 = new WeakMap();
                                this.t5 = new WeakMap();
                                this.console = new p.platform.Console(("GRAPHLOCATIONSERVICE ").concat(null !== (v = null === (u = this.irb) || undefined === u ? undefined : u.replace(":", "")) && undefined !== v ? v : ""));
                                this.ve = new c.Tm({
                                    Ej: this,
                                    source: (q || "") + "GraphLocation",
                                    console: this.console
                                });
                                (0,
                                h.R3a)(this, "d", new h.pX(n,r));
                                (0,
                                h.R3a)(this, "u", new h.pX(n,r));
                            }
                            k.prototype.Gb = function() {
                                var l, m, n;
                                l = this;
                                "temp" !== this.irb && (null === (m = this.za().events) || undefined === m ? undefined : m.on("segmentNormalized", function() {
                                    (0,
                                    h.cVa)(l).forEach(function(q) {
                                        return q.clear();
                                    });
                                    l.u5 = new WeakMap();
                                    l.t5 = new WeakMap();
                                }),
                                null === (n = this.za().events) || undefined === n ? undefined : n.on("playgraphUpdating", function() {
                                    (0,
                                    h.cVa)(l).forEach(function(q) {
                                        return q.clear();
                                    });
                                    l.u5 = new WeakMap();
                                    l.t5 = new WeakMap();
                                }));
                            }
                            ;
                            k.prototype.iW = function(l) {
                                return new k(function() {
                                    return l.Q2;
                                }
                                ,function() {
                                    return {
                                        Ib: l
                                    };
                                }
                                ,this.config,"temp");
                            }
                            ;
                            k.prototype.CH = function(l) {
                                var m, n, q, r, u, v;
                                e.u && this.console.trace("downConverting", l);
                                if (this.u5.has(l))
                                    return this.u5.get(l);
                                try {
                                    n = this.kfa().Z;
                                    q = this.za().Ib.Z;
                                    if (n === q)
                                        return m = l;
                                    if (q.ba[l.M]) {
                                        n.ba[l.M] || e.u && this.console.warn("Received a down converted position unexpectedly", l, Error().stack);
                                        r = this.za().Ib;
                                        return m = this.ljc(l, r) || l;
                                    }
                                    u = (0,
                                    g.kub)(l, this.kfa());
                                    v = this.kfa().fIc({
                                        offset: u.lub,
                                        M: l.M
                                    });
                                    (0,
                                    f.assert)(!!v, "mapPositionDown on uxPlaygraph should return a value");
                                    m = {
                                        offset: u.xu.add(v.offset),
                                        M: v.M
                                    };
                                    e.u && this.console.trace("downConverting ret:", m, this.kfa().identifier);
                                    return m;
                                } finally {
                                    m && (this.u5.set(l, m),
                                    this.t5.set(m, l));
                                }
                            }
                            ;
                            k.prototype.JJ = function(l) {
                                var m, n, q, r, u, v;
                                e.u && this.console.trace("upConverting", l);
                                if (this.t5.has(l))
                                    return this.t5.get(l);
                                try {
                                    m = this.kfa().Z;
                                    n = this.za().Ib.Z;
                                    if (m === n)
                                        return l;
                                    if (m.ba[l.M])
                                        return (n.ba[l.M] || e.u && this.console.warn("Received a up converted position unexpectedly", l, Error().stack),
                                        l);
                                    q = this.za().Ib;
                                    r = (0,
                                    g.kub)(l, q);
                                    u = q.z_a({
                                        offset: r.lub,
                                        M: l.M
                                    });
                                    (0,
                                    f.assert)(!!u, "mapPositionUp on combinedPlaygraph should return a value");
                                    v = {
                                        offset: r.xu.add(u.offset),
                                        M: u.M
                                    };
                                    e.u && this.console.trace("upConverting ret:", v, q.identifier);
                                    return v;
                                } finally {
                                    v && (this.t5.set(l, v),
                                    this.u5.set(v, l));
                                }
                            }
                            ;
                            k.prototype.mxc = function(l) {
                                var m;
                                m = this.CH(l);
                                (0,
                                f.assert)(!!m, "mapPositionDown on uxPlaygraph should return a value");
                                for (var n = m.M, q = this.za().Ib, r = q.CE.SH(n), u = r.next(); !u.done; ) {
                                    u = u.value;
                                    if (q.zI(u.id) !== l.M && n !== m.M)
                                        break;
                                    n = u.id;
                                    u = r.next();
                                }
                                (0,
                                f.assert)(n, ("Could not find any segments in the path of ").concat(l));
                                return n;
                            }
                            ;
                            k.prototype.ljc = function(l, m) {
                                var n;
                                n = m.get(l.M);
                                if (n) {
                                    if (!n.Ob.isFinite() || l.offset.lessThan(n.Ob))
                                        return l;
                                    n = l.offset;
                                    l = m.CE.SH(l.M);
                                    for (m = l.next(); !m.done; ) {
                                        m = m.value;
                                        if (!m.Ob.isFinite() || n.lessThan(m.Ob))
                                            return {
                                                M: m.id,
                                                offset: n
                                            };
                                        n = n.da(m.Ob);
                                        m = l.next();
                                    }
                                }
                            }
                            ;
                            d.__decorate([(0,
                            c.kb)({
                                methodName: "downConvertPosition",
                                df: true,
                                gn: true,
                                return: true
                            }), (0,
                            h.VPa)("d")], k.prototype, "CH", null);
                            d.__decorate([(0,
                            c.kb)({
                                methodName: "upConvertPosition",
                                df: true,
                                gn: true,
                                return: true
                            }), (0,
                            h.VPa)("u")], k.prototype, "JJ", null);
                            return k;
                        }
                        )();
                        b.mka = t;
                    }
