/**
 * @module Module_85933
 * @description ES module
 * @categories Network, Logging
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 85933
 * Deobfuscated size: 3997 chars
 * Functions: 8
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 85933
{
                        var c, g, f, e, h;
                        function d(k) {
                            return function(l) {
                                var m, n, q, r, u;
                                m = l.k$;
                                n = l.xQa;
                                q = l.target && l.target.isArray();
                                r = !l.RI || !l.RI.target || !l.target || !l.RI.target.rIc(l.target.ti);
                                if (q && r)
                                    return n.map(function(v) {
                                        return d(k)(v);
                                    });
                                q = null;
                                if (!l.target.oGb() || 0 !== m.length) {
                                    u = m[0];
                                    m = u.scope === g.Qz.GKa;
                                    r = u.scope === g.Qz.Request;
                                    if (m && u.bOa)
                                        return u.cache;
                                    if (r && null !== k && k.has(u.id))
                                        return k.get(u.id);
                                    if (u.type === g.Lm.abb)
                                        q = u.cache;
                                    else if (u.type === g.Lm.Function)
                                        q = u.cache;
                                    else if (u.type === g.Lm.bbb)
                                        q = u.$q;
                                    else if (u.type === g.Lm.Ybb && null !== u.w_)
                                        q = p("toDynamicValue", u.ti, function() {
                                            return u.w_(l.V2);
                                        });
                                    else if (u.type === g.Lm.eFa && null !== u.Au)
                                        q = p("toFactory", u.ti, function() {
                                            return u.Au(l.V2);
                                        });
                                    else if (u.type === g.Lm.pkb && null !== u.IU)
                                        q = p("toProvider", u.ti, function() {
                                            return u.IU(l.V2);
                                        });
                                    else if (u.type === g.Lm.Instance && null !== u.$q)
                                        q = h.XUc(u.$q, n, d(k));
                                    else
                                        throw (n = e.M0(l.ti),
                                        Error(c.O1b + " " + n));
                                    "function" === typeof u.YE && (q = u.YE(l.V2, q));
                                    m && (u.cache = q,
                                    u.bOa = true);
                                    r && null !== k && !k.has(u.id) && k.set(u.id, q);
                                    return q;
                                }
                            }
                            ;
                        }
                        function p(k, l, m) {
                            try {
                                return m();
                            } catch (n) {
                                if (f.wGb(n))
                                    throw Error(c.XZb(k, l.toString()));
                                throw n;
                            }
                        }
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        c = a(25640);
                        g = a(5493);
                        f = a(69523);
                        e = a(48530);
                        h = a(40198);
                        b.resolve = function(k) {
                            return d(k.d3.K4a.DUc)(k.d3.K4a);
                        }
                        ;
                    }
