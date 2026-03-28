/**
 * Netflix Cadmium Playercore - Module 91631
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Jlb, Kcb, Kk, Mw, v9a
 * Dependencies: 22970, 50214, 66164
 * Purpose: Configuration, Error handling, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_50214 from './Module_50214.js';
// import dep_66164 from './Module_66164.js';

// Webpack module 91631
// Parameters: t (module), b (exports), a (require)

var d, p, c;
export const Kcb = b.Mw = b.Kk =
d = a(22970);
p = a(66164);
c = a(50214);
export function Jlb(g) {
    return undefined !== g.SA.nZc ? g.sZa + g.SA.nZc : Infinity;
}
;
export function v9a(g) {
    return undefined !== g.SA.absolute ? g.SA.absolute : Infinity;
}
;
export function Kk(g) {
    if (!g)
        return Infinity;
    g = Math.min((0,
    b.Jlb)(g), (0,
    b.v9a)(g));
    return isNaN(g) ? Infinity : g;
}
;
export function Mw(g, f) {
    null !== f && undefined !== f ? f : f = p.platform.time.now();
    return (0,
    b.Kk)(g) <= f;
}
;
t = (function() {
    class g {
    constructor(f) {
        this.VMc = f;
        this.JF = new c.LP([],function(e, h) {
            e = (0,
            b.Kk)(e);
            h = (0,
            b.Kk)(h);
            return e - h;
        }
        );
    }
    has(f) {
        return this.JF.contains(f);
    }
    track(f) {
        this.has(f) ? this.Zfa(f) : (this.JF.push(f),
        this.tg());
    }
    delete(f) {
        var e;
        e = this.has(f);
        e && this.JF.remove(f);
        return e;
    }
    clear() {
        this.JF.clear();
    }
    Zfa(f) {
        f.sZa = p.platform.time.now();
        this.JF.Zfa(f);
        this.tg();
    }
    tg() {
        var e, h, k, l;
        function f(r) {
            var u;
            u = (0,
            b.Kk)(r);
            if (isFinite(u))
                return (l.HF = setTimeout(function() {
                    h.HF = undefined;
                    h.ozb(u);
                }, u - k),
                "break");
            l.delete(r);
        }
        h = this;
        this.HF && clearTimeout(this.HF);
        k = p.platform.time.now();
        this.ozb(k, false);
        l = this;
        try {
            for (var m = d.__values(this.JF.Ij()), n = m.next(); !n.done && "break" !== f(n.value); n = m.next())
                ;
        } catch (r) {
            var q;
            q = {
                error: r
            };
        } finally {
            try {
                n && !n.done && (e = m.return) && e.call(m);
            } finally {
                if (q)
                    throw q.error;
            }
        }
    }
    ozb(f, e) {
        var h;
        for (undefined === e && (e = true); (0,
        b.Mw)(this.JF.mr(), f); ) {
            h = this.JF.pop();
            this.VMc(h);
        }
        e && this.tg();
    }
}
Object.defineProperties(g.prototype, {
        size: {
            get: function() {
                return this.JF.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        values: {
            get: function() {
                return this.JF.Ij();
            },
            enumerable: false,
            configurable: true
        }
    });
    return g;
}
)();
export const Kcb = t;

// Detected exports: Jlb, Kcb, Kk, Mw, v9a
