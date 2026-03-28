/**
 * Netflix Cadmium Playercore - Module 44510
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Algorithm, Dvb, elc
 * Dependencies: 22970, 24153, 44847
 * Purpose: Caching/Storage, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_24153 from './Module_24153.js';
// import dep_44847 from './Module_44847.js';

// Webpack module 44510
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    var e;
    return null !== (e = f.Wwb) && undefined !== e ? e : f.name;
}

export function Dvb(f, e) {
    var h;
    h = 0;
    return Object.assign(function(k, l) {
        for (var m = [], n = 2; n < arguments.length; n++)
            m[n - 2] = arguments[n];
        for (n = h; n < f.length; n++)
            if (f[n].apply(undefined, p.__spreadArray([k, l], p.__read(m), false))) {
                if ((h++,
                h === f.length))
                    return (h = 0,
                    true);
            } else
                break;
        e.apply(undefined, p.__spreadArray([k, l], p.__read(m), false)) && (h = 0);
        return false;
    }, {
        reset: function() {
            return h = 0;
        },
        Wwb: ("combinator(").concat(f.map(d).join(", "), ")")
    });
}
;
export function elc(f) {
    var k, l, m, n, q, r, u;
    function e() {
        null === r || undefined === r ? undefined : r.La();
        r = undefined;
        u = false;
    }
    function h() {
        u = true;
        r = undefined;
    }
    k = f.Dic;
    l = f.bnc;
    m = f.cDc;
    n = undefined === m ? k : m;
    q = f.tc;
    u = false;
    return Object.assign(function(v, w) {
        for (var x = [], y = 2; y < arguments.length; y++)
            x[y - 2] = arguments[y];
        u || r || !k.apply(undefined, p.__spreadArray([v, w], p.__read(x), false)) || (r = q.uu(c.ie.Mz(g.I.Ca(l)), h));
        n.apply(undefined, p.__spreadArray([v, w], p.__read(x), false)) && e();
        (x = u) && (u = false);
        return x;
    }, {
        reset: e,
        Wwb: ("debounced(").concat(d(k), ", ").concat(l, "ms)")
    });
}
;
p = a(22970);
c = a(24153);
g = a(44847);
t = (function() {
    class f {
    constructor(e, h) {
        this.rules = e;
        this.store = h.store;
        this.gWa = h.gWa || (function() {
            return [];
        }
        );
        this.store.addListener("update", this.cO.bind(this));
    }
    reset() {
        this.rules.forEach(function(e) {
            var h, k;
            return null === (k = (h = p.__read(e, 1)[0]).reset) || undefined === k ? undefined : k.call(h);
        });
    }
    cO(e) {
        var h, k, l, m, n, q, r, u, v, w, A, z;
        m = e.jz;
        e = e.next;
        this.store.HZc();
        try {
            n = p.__values(this.rules);
            q = n.next();
            a: for (; !q.done; q = n.next()) {
                r = p.__read(q.value, 2);
                u = r[0];
                v = r[1];
                w = Array.isArray(v) ? v : [v];
                if (u.apply(undefined, p.__spreadArray([m, e], p.__read(this.gWa()), false))) {
                    try {
                        for (var x = (k = undefined,
                        p.__values(w)), y = x.next(); !y.done; y = x.next()) {
                            A = y.value;
                            z = null === A || undefined === A ? undefined : A(e, d(u));
                            z && z.reset ? this.store.reset(z.Yy) : z && z.Yy && this.store.next(z.Yy);
                            if (z && z.uec)
                                break a;
                        }
                    } catch (C) {
                        k = {
                            error: C
                        };
                    } finally {
                        try {
                            y && !y.done && (l = x.return) && l.call(x);
                        } finally {
                            if (k)
                                throw k.error;
                        }
                    }
                    e = this.store.value;
                }
            }
        } catch (C) {
            var B;
            B = {
                error: C
            };
        } finally {
            try {
                q && !q.done && (h = n.return) && h.call(n);
            } finally {
                if (B)
                    throw B.error;
            }
        }
        this.store.vrc();
    }
}
return f;
}
)();
export const Algorithm = t;

// Detected exports: Algorithm, Dvb, elc
