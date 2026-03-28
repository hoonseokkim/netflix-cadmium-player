/**
 * Netflix Cadmium Playercore - Module 71897
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: ODa
 * Dependencies: 42031, 61234, 89319, 91176
 * Purpose: Configuration, Error handling
 */

// import dep_42031 from './Module_42031.js';
// import dep_61234 from './Module_61234.js';
// import dep_89319 from './Module_89319.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 71897
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(91176);
p = a(89319);
c = a(42031);
g = a(61234);
t = (function() {
    class f {
    constructor(e, h) {
        undefined === h && (h = g.RDa);
        this.l0a = {};
        this.O1a = {};
        this.o3a = {};
        this.Ru = {};
        this.L1a = {};
        this.$oa = 0;
        this.aRa = {};
        this.gEc = !p.u || "1" !== (0,
        c.TBb)("PERF_CONFIG_BYPASS_MEMOIZATION");
        this.kEb = p.u && "1" === (0,
        c.TBb)("PERF_CONFIG_FORCE_FULL_PATH");
        this.dQc = h;
        this.XEc = 1 === h.length && "OVERRIDES" === h[0];
        this.QCc(e);
    }
    aga(e, h, k, l) {
        this.J4a || h || k || (this.J4a = e);
        this.Ru[e] = {
            P1a: h,
            fU: k,
            wic: l
        };
    }
    iWb(e) {
        var h, k, l, n, q;
        if (this.Ru[e]) {
            l = this.L1a[e];
            if (l) {
                this.$oa++;
                for (var m = 0; m < l.length; m++) {
                    n = l[m];
                    q = null === (k = null === (h = this.O1a[n.cQc]) || undefined === h ? undefined : h[n.ic]) || undefined === k ? undefined : k[n.ORc];
                    q && delete q[n.P1a];
                }
                delete this.L1a[e];
            }
            delete this.aRa[e];
            delete this.Ru[e];
        }
    }
    tS(e, h, k) {
        if (undefined !== k || !this.gEc)
            return this.A4a(e, h, k);
        k = this.aRa[h];
        if ((null === k || undefined === k ? undefined : k.version) === this.$oa)
            return k.config;
        e = this.A4a(e, h);
        this.aRa[h] = {
            version: this.$oa,
            config: e
        };
        return e;
    }
    u0(e, h) {
        var k, l;
        k = {};
        for (l in this.l0a)
            (0,
            d.NI)(k, this.A4a(l, e, h));
        return k;
    }
    JA(e, h, k) {
        var l, m, n, r, u, v;
        this.$oa++;
        n = k !== this.J4a;
        n && (this.kEb = true);
        for (var q in h) {
            r = this.o3a[q];
            if (r) {
                u = this.xtc(k, r) || k;
                v = (l = this.O1a)[e] || (l[e] = {});
                v = v[r] || (v[r] = {});
                (v[q] || (v[q] = {}))[u] = h[q];
                n && ((m = this.L1a)[k] || (m[k] = [])).push({
                    cQc: e,
                    ic: r,
                    ORc: q,
                    P1a: u
                });
            }
        }
    }
    ky(e, h) {
        if (!this.XEc)
            throw Error("The configure() sugar method is only available when using the default precedence stack. Use configureWithPrecedence(precedence, overrides) instead.");
        this.JA("OVERRIDES", e, h);
    }
    A4a(e, h, k) {
        var l, m, u, v, x;
        m = this.l0a[e];
        if (!m)
            return {};
        m = new m();
        for (var n = !this.kEb, q = this.dQc, r = 0; r < q.length; r++) {
            u = q[r];
            v = null === (l = this.O1a[u]) || undefined === l ? undefined : l[e];
            if (v)
                for (var w in v) {
                    x = v[w];
                    x = n ? x[this.J4a] : this.htc(h, x);
                    undefined !== x && (m[w] = x);
                }
            if (u === k)
                break;
        }
        return m;
    }
    htc(e, h) {
        for (; e; ) {
            if ((e in h))
                return h[e];
            e = this.Ru[e];
            e = (null === e || undefined === e ? undefined : e.P1a) || (null === e || undefined === e ? undefined : e.fU);
        }
    }
    xtc(e, h) {
        var k;
        for (; e; ) {
            k = this.Ru[e];
            if (!k)
                break;
            for (var l = k.wic, m = 0; m < l.length; m++)
                if (l[m] === h)
                    return e;
            e = k.fU;
        }
    }
    QCc(e) {
        var k, l;
        for (var h = 0; h < e.length; h++) {
            k = e[h];
            if ((0,
            d.has)(k, {
                config: "*"
            })) {
                l = k.config;
                this.l0a[k.name] = l;
                l = new l();
                for (var m in l) {
                    if ((l = this.o3a[m]) && l !== k.name)
                        throw Error(('Configuration property name collision: "').concat(m, '" is defined in both "').concat(l, '" and "').concat(k.name, '". ') + "Each configuration option name must be globally unique across all components.");
                    this.o3a[m] = k.name;
                }
            }
        }
    }
}
return f;
}
)();
export const ODa = t;

// Detected exports: ODa
