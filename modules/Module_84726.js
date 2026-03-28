/**
 * Netflix Cadmium Playercore - Module 84726
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Mbb
 * Dependencies: 22970, 52885, 90745, 91176
 * Purpose: Encryption/Decryption, Event handling, Configuration, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_52885 from './Module_52885.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 84726
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(22970);
p = a(91176);
c = a(91176);
g = a(90745);
f = a(52885);
t = (function() {
    class e {
    constructor(h, k, l, m, n) {
        this.Jp = h;
        this.Eb = k;
        this.q8b = l;
        this.ub = m;
        this.E7b = n;
        this.BQ = new Map();
        this.VG = new Map();
        this.events = new g.EventEmitter();
        this.rQ = new Map();
    }
    yGb(h) {
        var k;
        undefined === k && (k = true);
        if (k)
            return this.BQ.has(h);
        h = this.Jp(h);
        return this.VG.has(h);
    }
    tg(h) {
        var k, l, m, n;
        k = this;
        l = Array.from(this.VG.keys());
        m = new Map(h.map(function(q) {
            return [k.Jp(q), q];
        }));
        n = Array.from(m.keys());
        h = (0,
        p.np)(l, n, function(q, r) {
            return q === r;
        });
        l = (0,
        p.np)(n, l).map(function(q) {
            return m.get(q);
        });
        h.forEach(function(q) {
            return k.xq(k.VG.get(q), true, "evicted");
        });
        this.j$b(l);
    }
    qVc(h) {
        this.VG.set(this.Jp(h.st), h.st);
        this.yFb(h, false);
    }
    yFb(h, k) {
        var l;
        undefined === k && (k = false);
        l = this.Jp(h.st);
        this.rQ.set(l, h);
        this.events.emit("itemAdded", {
            item: h,
            FKc: k
        });
    }
    gB(h) {
        h = "string" === typeof h ? h : this.Jp(h);
        return this.rQ.has(h);
    }
    nrb(h) {
        var k, l, q;
        h = Math.max(0, this.size - h);
        if (0 < h) {
            l = Array.from(this.VG.values()).sort(c.c3a);
            try {
                for (var m = d.__values(l), n = m.next(); !n.done; n = m.next()) {
                    q = n.value;
                    if (0 >= h)
                        break;
                    h--;
                    this.xq(q, true, "evicted");
                }
            } catch (u) {
                var r;
                r = {
                    error: u
                };
            } finally {
                try {
                    n && !n.done && (k = m.return) && k.call(m);
                } finally {
                    if (r)
                        throw r.error;
                }
            }
        }
    }
    claim(h) {
        var k;
        k = this.Bp(h);
        this.xq(h, false, "claimed");
        return k;
    }
    remove(h) {
        this.xq(h, true, "deleted");
    }
    xq(h, k, l) {
        var m, n;
        h = this.Jp(h);
        m = this.VG.get(h);
        if (m) {
            n = this.BQ.get(m);
            k && n && n.abort();
            this.BQ.delete(m);
            this.VG.delete(h);
            k = this.rQ.get(h);
            this.rQ.delete(h);
            k && this.events.emit("itemRemoved", {
                item: k,
                reason: l
            });
        }
    }
    Bp(h) {
        h = this.Jp(h);
        if (this.rQ.has(h))
            return this.rQ.get(h);
    }
    clear() {
        this.nrb(0);
    }
    values() {
        return this.rQ.values();
    }
}
Object.defineProperties(e.prototype, {
        size: {
            get: function() {
                return this.VG.size;
            },
            enumerable: false,
            configurable: true
        }
    });
    e.prototype.j$b = function(h) {
        var k;
        k = this;
        h = h.map(function(l) {
            var m, n;
            m = k.Jp(l);
            n = new p.AbortController();
            k.BQ.set(l, n);
            k.VG.set(m, l);
            return {
                Xa: l,
                Vv: n.signal
            };
        });
        this.q8b.Qsc({
            tb: h,
            $dc: {
                Vs: true
            }
        }).entries.forEach(function(l, m) {
            return d.__awaiter(k, undefined, undefined, function() {
                var n, q;
                return d.__generator(this, function(r) {
                    switch (r.label) {
                    case 0:
                        return (r.ac.push([0, 2, , 3]),
                        [4, l]);
                    case 1:
                        return (n = r.T().S,
                        q = this.BQ.get(m),
                        this.yGb(m) && !q.signal.aborted && (this.$K(m, n),
                        this.BQ.delete(m)),
                        [3, 3]);
                    case 2:
                        return (r.T(),
                        q = this.BQ.get(m),
                        this.yGb(m) && !q.signal.aborted ? this.xq(m, true, "evicted") : this.xq(m, false, "evicted"),
                        0,
                        [3, 3]);
                    case 3:
                        return [2];
                    }
                });
            });
        });
    }
    ;
    e.prototype.$K = function(h, k, l) {
        var m, n;
        l = null !== (m = null === l || undefined === l ? undefined : l.$x) && undefined !== m ? m : this.E7b(k);
        n = (0,
        p.Oua)(function() {
            return JSON.stringify(k).length;
        });
        h = new f.fHa({
            S: Promise.resolve(k),
            st: h,
            ED: true,
            SA: {
                absolute: l
            },
            Nfa: function() {},
            get eR() {
                return n();
            },
            Vs: h.Vs
        });
        this.yFb(h, true);
    }
    ;
    return e;
}
)();
export const Mbb = t;

// Detected exports: Mbb
