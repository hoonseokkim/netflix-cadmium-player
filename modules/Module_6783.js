/**
 * Webpack Module 6783
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */
// function(t, b, a) 
{
                        var d, p;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: !0
                            }
                        });
                        b.Ds = function(c, g, f, e) {
                            var h, k, l, q, r, u;
                            void 0 === e && (e = {});
                            l = p.I.max(f, p.I.ia);
                            try {
                                for (var m = d.__values(Object.keys(c.ba)), n = m.next(); !n.done; n = m.next()) {
                                    q = n.value;
                                    r = c.ba[q];
                                    if (r.J === g) {
                                        u = p.I.Ca(r.Va);
                                        if (l.$f(u) && (!isFinite(null !== (k = r.eb) && void 0 !== k ? k : NaN) || l.lessThan(p.I.Ca(r.eb))))
                                            return {
                                                M: q,
                                                offset: f.da(u)
                                            };
                                    }
                                }
                            } catch (w) {
                                var v;
                                v = {
                                    error: w
                                };
                            } finally {
                                try {
                                    n && !n.done && (h = m.return) && h.call(m);
                                } finally {
                                    if (v)
                                        throw v.error;
                                }
                            }
                            if (e.sRb && (r = Object.keys(c.ba).map(function(w) {
                                return {
                                    key: w,
                                    K: c.ba[w]
                                };
                            }).filter(function(w) {
                                return w.K.J === g;
                            }).map(function(w) {
                                var x, y;
                                x = p.I.abs(f.da(p.I.Ca(w.K.Va)));
                                if (w.K.eb && isFinite(w.K.eb)) {
                                    y = p.I.abs(f.da(p.I.Ca(w.K.eb)));
                                    x = p.I.min(x, y);
                                }
                                return d.__assign(d.__assign({}, w), {
                                    xu: x
                                });
                            }),
                            r.sort(function(w, x) {
                                return w.xu.G - x.xu.G;
                            }),
                            u = d.__read(r, 1)[0]))
                                return (r = u.K,
                                e = u.key,
                                u = p.I.Ca(r.Va),
                                {
                                    M: e,
                                    offset: f.da(u)
                                });
                        }
                        ;
                        d = a(22970);
                        p = a(91176);
                    }
