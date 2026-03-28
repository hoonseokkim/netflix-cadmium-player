/**
 * Netflix Cadmium Playercore - Module 8239
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Cbb, Dbb, K0b, i0b, j0b
 * Dependencies: 22970, 51117
 * Purpose: Logging, Configuration, Class definition, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_51117 from './Module_51117.js';

// Webpack module 8239
// Parameters: t (module), b (exports), a (require)

var d, p, c;
export const Dbb = b.i0b = b.Cbb =
d = a(22970);
p = a(51117);
a = (function() {
    return function() {}
    ;
}
)();
export const j0b = a;
c = (function() {
    class g {
    constructor(f, e, h, k, l) {
        this.alpha = f;
        this.Fa = e;
        this.weight = k;
        this.HKa = h * this.weight;
        this.$ha = l;
    }
    su() {
        return new g(this.alpha,this.Fa,this.xg,this.weight,this.$ha);
    }
    update(f, e, h) {
        var k, l, m, n;
        k = this.alpha;
        l = this.weight;
        m = this.$ha;
        n = k * (f - m);
        5 < n && (this.weight /= Math.exp(n),
        this.$ha = m = f);
        f = Math.exp(k * (e - m)) - Math.exp(k * (f - m));
        e = this.weight += f;
        k = this.Fa;
        this.Fa = m = k + f * (h - k) / e;
        this.HKa = l ? this.HKa * (e - f) / l + f * (h - m) * (h - k) : 0;
    }
    stop() {}
    flush() {}
    start(f) {
                var X9j;
                X9j = 2;
                for (; X9j !== 1; ) {
                    switch (X9j) {
                    case 2:
                        null === this.Dz && (this.Dz = f);
                        X9j = 1;
                        break;
                    }
                }
            }
    add(f, e, h) {
                var y_N = W60rd;
                var k0J, k;
                k0J = 2;
                for (; k0J !== 7; ) {
                    switch (k0J) {
                    case 2:
                        k = this.Dz;
                        this.Dz = null === k ? e : Math.min(k, e);
                        k = this.wO;
                        this.wO = null === k ? h : Math.max(k, h);
                        k0J = 3;
                        break;
                    case 3:
                        y_N.V3W(0);
                        k = Math.max(y_N.i2_(e, h), 1);
                        k0J = 9;
                        break;
                    case 9:
                        y_N.V3W(1);
                        this.yV.update(e, h, y_N.w9O(f, k));
                        y_N.V3W(2);
                        this.zV.update(e, h, y_N.w9O(f, k, 8));
                        k0J = 7;
                        break;
                    }
                }
            }
    get(f, e) {
                var P7Q = W60rd;
                var N$g, h, k, l, m, n, q, u, v, r;
                N$g = 2;
                for (; N$g !== 16; ) {
                    switch (N$g) {
                    case 6:
                        l = Math.max(l, m);
                        N$g = 14;
                        break;
                    case 5:
                        N$g = (n = new c(n.alpha,n.Fa,n.xg,n.weight,n.$ha),
                        q = new c(q.alpha,q.Fa,q.xg,q.weight,q.$ha),
                        0 < n.weight && 0 !== e) ? 4 : 20;
                        break;
                    case 10:
                        l = 1E-11 < u ? Math.max(v / u, l) : l + 2 * r / m;
                        N$g = 14;
                        break;
                    case 7:
                        N$g = 0 === r ? 6 : 12;
                        break;
                    case 14:
                        P7Q.N4Z(0);
                        n.update(P7Q.w9O(h, k), P7Q.w9O(h, f, P7Q.V3W(0)), P7Q.i2_(e, l, P7Q.N4Z(1)));
                        N$g = 13;
                        break;
                    case 4:
                        undefined === e && (e = this.bKb);
                        N$g = 3;
                        break;
                    case 1:
                        N$g = 0 < l ? 5 : 17;
                        break;
                    case 13:
                        P7Q.N4Z(0);
                        q.update(P7Q.i2_(h, k), P7Q.i2_(h, f), 0);
                        N$g = 20;
                        break;
                    case 2:
                        (h = this.Dz || 0,
                        k = this.wO || 0,
                        l = f - k,
                        m = this.IJc,
                        n = this.yV,
                        q = this.zV);
                        N$g = 1;
                        break;
                    case 17:
                        (n = this.yV,
                        q = this.zV);
                        N$g = 20;
                        break;
                    case 12:
                        (u = new p.Dka(m,r).rgc(l),
                        v = m - u[1]);
                        P7Q.V3W(3);
                        var A7j = P7Q.i2_(13, 4, 5, 13);
                        u = A7j - u[0];
                        N$g = 10;
                        break;
                    case 3:
                        l >= m && (e = Math.min(e, this.bKb));
                        m = e * n.Fa;
                        P7Q.V3W(4);
                        var Y2G = P7Q.w9O(9, 11, 4);
                        r = Math.pow(e, Y2G) * n.xg;
                        N$g = 7;
                        break;
                    case 20:
                        f = n.weight;
                        e = q.weight;
                        return {
                            Fa: f ? n.Fa : null,
                            xg: f ? n.xg : null,
                            gZ: e ? q.Fa : null,
                            q5: e ? q.xg : null
                        };
                        break;
                    }
                }
            }
    toString() {
                var k6i;
                k6i = 2;
                for (; k6i !== 1; ) {
                    switch (k6i) {
                    case 2:
                        var S_S = "D";
                        S_S += "eliv";
                        S_S += "er";
                        S_S += "yDist(";
                        return S_S.concat(this.fB, ")");
                        break;
                    }
                }
            }
    su(f) {
                var P6$;
                P6$ = 2;
                for (; P6$ !== 8; ) {
                    switch (P6$) {
                    case 4:
                        f.yV = this.yV.su();
                        f.zV = this.zV.su();
                        return f;
                        break;
                    case 2:
                        f || (f = new g(this.Lo));
                        f.Dz = this.Dz;
                        f.wO = this.wO;
                        P6$ = 4;
                        break;
                    }
                }
            }
    reset() {
                var U5F, f;
                U5F = 2;
                for (; U5F !== 3; ) {
                    switch (U5F) {
                    case 2:
                        f = -Math.log(.5) / this.fB;
                        this.yV = new c(f,0,0,0,0);
                        this.zV = new c(f,0,0,0,0);
                        this.Dz = this.wO = null;
                        U5F = 3;
                        break;
                    }
                }
            }
}
Object.defineProperties(g.prototype, {
        xg: {
            get: function() {
                return this.weight ? this.HKa / this.weight : 0;
            },
            enumerable: false,
            configurable: true
        }
    });
    return g;
}
)();
export const K0b = c;
t = (function() {
    function g(f) {
        var e3O, e, h;
        e3O = 2;
        for (; e3O !== 7; ) {
            switch (e3O) {
            case 2:
                var b6o = "1SI";
                b6o += "YbZrN";
                b6o += "J";
                b6o += "Cp9";
                this.Lo = f;
                b6o;
                (e = f.min_b,
                h = f.min_iv);
                this.fB = f.hl;
                this.bKb = e;
                this.IJc = h;
                this.reset();
                e3O = 7;
                break;
            }
        }
    }
    var p7k;
    p7k = 2;
    for (; p7k !== 14; ) {
        switch (p7k) {
        case 8:
            return g;
            break;
        case 5:
            p7k = 8;
            break;
        case 2:
            p7k = 5;
            break;
        }
    }
}
)();
export const Cbb = t;
a = (function(g) {
    class f extends g {
    constructor() {
        return null !== g && g.apply(this, arguments) || this;
    }
    get() {
        var e, h, k;
        if (0 === this.yV.weight || 0 === this.zV.weight)
            return {
                low: null,
                high: null,
                initial: null
            };
        switch (this.Lo.f2) {
        case "deliverytime":
            e = this.yV;
            e = new p.Dka(e.Fa,e.xg);
            (h = this.Lo.accuracy,
            k = this.Lo.BIc);
            return {
                low: 8 / e.xU(this.Lo.Eca, h, k),
                high: 8 / e.xU(this.Lo.Tda, h, k),
                initial: 8 / e.xU(this.Lo.Kta, h, k)
            };
        default:
            return (e = this.zV,
            e = new p.Dka(e.Fa,e.xg),
            h = this.Lo.accuracy,
            k = this.Lo.BIc,
            {
                low: e.xU(this.Lo.Tda, h, k),
                high: e.xU(this.Lo.Eca, h, k),
                initial: e.xU(this.Lo.Kta, h, k)
            });
        }
    }
    su() {
        var e;
        e = new f(this.Lo);
        g.prototype.su.call(this, e);
        return e;
    }
    toString() {
        return ("DeliveryDistCI([").concat((this.Lo.Tda,
        this.Lo.Eca), "])");
    }
}
d.return f;
}
)(a);
export const i0b = a;
t = (function(g) {
    function f(e) {
        var h;
        h = g.call(this, e) || this;
        h.Lo = e;
        return h;
    }
    d.__extends(f, g);
    return f;
}
)(t);
export const Dbb = t;

// Detected exports: Cbb, Dbb, K0b, i0b, j0b
