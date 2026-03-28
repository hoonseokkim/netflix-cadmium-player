/**
 * @module Module_69882
 * @description Class module with ES module exports
 * @categories Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 69882
 * Deobfuscated size: 4073 chars
 * Functions: 6
 * Prototype definitions: 4
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 69882
{
                        var p, c;
                        function d() {}
                        Object.defineProperty(b, "__esModule", {
                            value: true
                        });
                        b.GJa = undefined;
                        t = a(22970);
                        p = a(45146);
                        a = a(22674);
                        d.prototype.f3c = function(g) {
                            this.jp = g;
                            this.HIb = this.Klc(this.jp.ba[this.jp.Ef].Mp);
                        }
                        ;
                        d.prototype.H0 = function(g) {
                            var k;
                            (0,
                            p.ta)(this.jp, "Playgraph should be initialized");
                            for (var f = this.jp.Ef, e = 0, h = new Set(); f && !h.has(f); ) {
                                k = this.jp.ba[f];
                                if (!k || !k.eb)
                                    break;
                                if (g && g === f)
                                    break;
                                e += k.eb - k.Va;
                                h.add(f);
                                f = k.Oc;
                            }
                            return e;
                        }
                        ;
                        d.prototype.qWc = function(g, f, e) {
                            var h, k, l, m, n;
                            (0,
                            p.ta)(this.jp, "Playgraph should be initialized");
                            l = this.jp.ba[f];
                            m = this.H0(f);
                            n = l.Mp;
                            if (l && undefined !== n && undefined !== m) {
                                m = m + g - l.Va;
                                if (n === l.J)
                                    return g;
                                g = null === (h = this.HIb.get(f)) || undefined === h ? undefined : h.before;
                                f = null === (k = this.HIb.get(f)) || undefined === k ? undefined : k.after;
                                k = g ? this.jp.ba[g].eb : 0;
                                e = f ? this.jp.ba[f].Va : e;
                                h = g ? this.H0(g) + this.jp.ba[g].eb - this.jp.ba[g].Va : 0;
                                f = f ? this.H0(f) : this.H0();
                                if (undefined != k && undefined != e && undefined != h && undefined != f)
                                    return k + (m - h) * (e - k) / (f - h);
                            }
                        }
                        ;
                        d.prototype.Klc = function(g) {
                            var m;
                            (0,
                            p.ta)(this.jp, "Playgraph should be initialized");
                            for (var f, e = this.jp.Ef, h = [], k = new Map(), l = new Set(); e && !l.has(e); ) {
                                m = this.jp.ba[e];
                                m.J === g ? (k.set(e, {
                                    before: e,
                                    after: e
                                }),
                                f = e,
                                h.forEach(function(n) {
                                    if (n = k.get(n))
                                        n.after = f;
                                }),
                                h = []) : (k.set(e, {
                                    before: f,
                                    after: undefined
                                }),
                                h.push(e));
                                e = m.Oc;
                            }
                            return k;
                        }
                        ;
                        c = d;
                        b.GJa = c;
                        b.GJa = c = t.__decorate([(0,
                        a.aa)()], c);
                    }
