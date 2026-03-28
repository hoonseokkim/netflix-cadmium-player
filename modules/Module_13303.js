/**
 * Netflix Cadmium Playercore - Module 13303
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: E9a
 * Dependencies: 22970, 48170, 91176
 * Purpose: Logging, Error handling, Playback control
 */

// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 13303
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(22970);
p = a(91176);
c = a(48170);
t = (function() {
    class g {
    constructor(f, e, h, k, l) {
        this.dn = f;
        this.od = e;
        this.jE = h;
        this.Lz = k;
        this.console = l;
        this.Nya = [];
        this.od.Kna = this;
    }
    pBc(f) {
        return this.Nya.some(function(e) {
            return e.qOa === f;
        });
    }
    kXa(f) {
        var e, h, k, l, m, r, u, v, w, A;
        if (this.dn.player.bb.some(function(B) {
            return B.K.J === f && B.XOa;
        }))
            return false;
        if (this.Nya.some(function(B) {
            return B.qOa === f;
        }))
            return true;
        try {
            for (var n = d.__values(this.od.Vra()), q = n.next(); !q.done; q = n.next()) {
                r = q.value;
                u = this.od.RUa(r);
                u && (m = u.some(function(B) {
                    var C;
                    return null === (C = B.xa.yb) || undefined === C ? undefined : C.some(function(D) {
                        return D.id === f;
                    });
                }));
                if (!m) {
                    v = this.Lz.get(Number(r));
                    if (v) {
                        w = this.jE(v);
                        if (w)
                            try {
                                for (var x = (h = undefined,
                                d.__values(w.CZc)), y = x.next(); !y.done; y = x.next()) {
                                    A = y.value[0];
                                    if (m = null === (l = null === A || undefined === A ? undefined : A.yb) || undefined === l ? undefined : l.some(function(B) {
                                        return B.id === f;
                                    }))
                                        break;
                                }
                            } catch (B) {
                                h = {
                                    error: B
                                };
                            } finally {
                                try {
                                    y && !y.done && (k = x.return) && k.call(x);
                                } finally {
                                    if (h)
                                        throw h.error;
                                }
                            }
                    }
                }
                if (m)
                    break;
            }
        } catch (B) {
            var z;
            z = {
                error: B
            };
        } finally {
            try {
                q && !q.done && (e = n.return) && e.call(n);
            } finally {
                if (z)
                    throw z.error;
            }
        }
        return m ? (this.Nya.push({
            qOa: f
        }),
        this.dn.bb.filter(function(B) {
            return !B.ag && B.K.J !== f;
        }).forEach(function(B) {
            return B.zEb = true;
        }),
        this.od.OSa(f),
        true) : false;
    }
    Taa(f, e) {
        var h;
        h = this;
        return f.Ab ? e.map(function(k, l) {
            var m, n, q, r, u;
            if (!k.xa.yb)
                return k;
            n = f.Ab && (null === (m = f.wd) || undefined === m ? undefined : m.Uj);
            q = false;
            r = [];
            u = 0;
            k.xa.yb.forEach(function(v) {
                n && q || h.Nya.some(function(w) {
                    return w.qOa === v.id;
                }) ? (q = true,
                u++) : r.push(v);
            });
            if (q)
                c.u && h.console.log("Dropping ads due to error", {
                    Ub: l,
                    Jbd: k.xa.hb,
                    sed: u
                });
            else
                return k;
            l = r.reduce(function(v, w) {
                return v.add(p.I.Ca(w.eb - w.Va));
            }, p.I.ia);
            return {
                xa: d.__assign(d.__assign({}, k.xa), {
                    yb: r,
                    A3: undefined,
                    duration: l
                }),
                state: k.state
            };
        }) : e;
    }
}
return g;
}
)();
export const E9a = t;

// Detected exports: E9a
