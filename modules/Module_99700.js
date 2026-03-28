/**
 * Netflix Cadmium Playercore - Module 99700
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Lja
 * Dependencies: 5493, 11499, 25640, 48530, 49825, 62240, 70078, 72632, 75262, 85933
 * Purpose: Encryption/Decryption, Caching/Storage, Error handling, Class definition
 */

// import dep_5493 from './Module_5493.js';
// import dep_11499 from './Module_11499.js';
// import dep_25640 from './Module_25640.js';
// import dep_48530 from './Module_48530.js';
// import dep_49825 from './Module_49825.js';
// import dep_62240 from './Module_62240.js';
// import dep_70078 from './Module_70078.js';
// import dep_72632 from './Module_72632.js';
// import dep_75262 from './Module_75262.js';
// import dep_85933 from './Module_85933.js';

// Webpack module 99700
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q;
d = this && this.__awaiter || (function(r, u, v, w) {
    return new (v || (v = Promise))(function(x, y) {
        function A(C) {
            try {
                B(w.next(C));
            } catch (D) {
                y(D);
            }
        }
        function z(C) {
            try {
                B(w["throw"](C));
            } catch (D) {
                y(D);
            }
        }
        function B(C) {
            C.done ? x(C.value) : new v(function(D) {
                D(C.value);
            }
            ).then(A, z);
        }
        B((w = w.apply(r, u || [])).next());
    }
    );
}
);
p = this && this.__generator || (function(r, u) {
    var x, y, A, z, B;
    function v(C) {
        return function(D) {
            return w([C, D]);
        }
        ;
    }
    function w(C) {
        if (y)
            throw new TypeError("Generator is already executing.");
        for (; x; )
            try {
                if ((y = 1,
                A && (z = A[C[0] & 2 ? "return" : C[0] ? "throw" : "next"]) && !(z = z.call(A, C[1])).done))
                    return z;
                if ((A = 0,
                z))
                    C = [0, z.value];
                switch (C[0]) {
                case 0:
                case 1:
                    z = C;
                    break;
                case 4:
                    return (x.label++,
                    {
                        value: C[1],
                        done: false
                    });
                case 5:
                    x.label++;
                    A = C[1];
                    C = [0];
                    continue;
                case 7:
                    C = x.SB.pop();
                    x.ac.pop();
                    continue;
                default:
                    if (!(z = x.ac,
                    z = 0 < z.length && z[z.length - 1]) && (6 === C[0] || 2 === C[0])) {
                        x = 0;
                        continue;
                    }
                    if (3 === C[0] && (!z || C[1] > z[0] && C[1] < z[3]))
                        x.label = C[1];
                    else if (6 === C[0] && x.label < z[1])
                        (x.label = z[1],
                        z = C);
                    else if (z && x.label < z[2])
                        (x.label = z[2],
                        x.SB.push(C));
                    else {
                        z[2] && x.SB.pop();
                        x.ac.pop();
                        continue;
                    }
                }
                C = u.call(r, x);
            } catch (D) {
                C = [6, D];
                A = 0;
            } finally {
                y = z = 0;
            }
        if (C[0] & 5)
            throw C[1];
        return {
            value: C[0] ? C[1] : undefined,
            done: true
        };
    }
    x = {
        label: 0,
        T: function() {
            if (z[0] & 1)
                throw z[1];
            return z[1];
        },
        ac: [],
        SB: []
    };
    return (B = {
        next: v(0),
        "throw": v(1),
        "return": v(2)
    },
    "function" === typeof Symbol && (B[Symbol.iterator] = function() {
        return this;
    }
    ),
    B);
}
);
c = a(70078);
g = a(25640);
f = a(5493);
a(37425);
e = a(11499);
h = a(75262);
k = a(85933);
l = a(49825);
m = a(72632);
n = a(48530);
a(95817);
q = a(62240);
t = (function() {
    class r {
    constructor(u) {
        u = u || ({});
        if ("object" !== typeof u)
            throw Error("" + g.k_b);
        if (undefined === u.AR)
            u.AR = f.Qz.oma;
        else if (u.AR !== f.Qz.GKa && u.AR !== f.Qz.oma && u.AR !== f.Qz.Request)
            throw Error("" + g.i_b);
        if (undefined === u.d$)
            u.d$ = false;
        else if ("boolean" !== typeof u.d$)
            throw Error("" + g.h_b);
        if (undefined === u.uV)
            u.uV = false;
        else if ("boolean" !== typeof u.uV)
            throw Error("" + g.j_b);
        this.options = {
            d$: u.d$,
            AR: u.AR,
            uV: u.uV
        };
        this.id = m.id();
        this.dQ = new q.m2b();
        this.q$b = [];
        this.parent = this.YMa = null;
        this.l9b = new e.DHa();
    }
    load() {
        var x, y;
        for (var u = [], v = 0; v < arguments.length; v++)
            u[v] = arguments[v];
        v = this.Fob();
        for (var w = 0; w < u.length; w++) {
            x = u[w];
            y = v(x.id);
            x.S3a(y.Ssb, y.aWb, y.FGb, y.sPb);
        }
    }
    Nda() {
        for (var u = [], v = 0; v < arguments.length; v++)
            u[v] = arguments[v];
        d(this, undefined, undefined, function() {
            var w, x, y, A, z;
            return p(this, function(B) {
                switch (B.label) {
                case 0:
                    (w = this.Fob(),
                    x = 0,
                    y = u,
                    B.label = 1);
                case 1:
                    if (!(x < y.length))
                        return [3, 4];
                    A = y[x];
                    z = w(A.id);
                    return [4, A.S3a(z.Ssb, z.aWb, z.FGb, z.sPb)];
                case 2:
                    (B.T(),
                    B.label = 3);
                case 3:
                    return (x++,
                    [3, 1]);
                case 4:
                    return [2];
                }
            });
        });
    }
    gWb() {
        function u(y) {
            return function(A) {
                return A.sKb === y;
            }
            ;
        }
        for (var v = this, w = [], x = 0; x < arguments.length; x++)
            w[x] = arguments[x];
        w.forEach(function(y) {
            y = u(y.id);
            v.dQ.JTc(y);
        });
    }
    bind(u) {
        var v;
        v = new c.xZb(u,this.options.AR || f.Qz.oma);
        this.dQ.add(u, v);
        return new l.zZb(v);
    }
    GSc(u) {
        this.$Vb(u);
        return this.bind(u);
    }
    SFb(u) {
        var v;
        v = this.dQ.lEb(u);
        !v && this.parent && (v = this.parent.SFb(u));
        return v;
    }
    restore() {
        var u;
        u = this.q$b.pop();
        if (undefined === u)
            throw Error(g.A3b);
        this.dQ = u.k$;
        this.YMa = u.xJc;
    }
    Bvb() {
        var u;
        u = new r(this.options);
        u.parent = this;
        return u;
    }
    get(u) {
        return this.Eob(false, false, f.wG.FLa, u);
    }
    getAll(u) {
        return this.Eob(true, true, f.wG.FLa, u);
    }
    resolve(u) {
        var v;
        v = this.Bvb();
        v.bind(u).hVb();
        return v.get(u);
    }
    Fob() {
        var y;
        function u(A) {
            return function(z) {
                z = y.GSc.bind(y)(z);
                z.vd.sKb = A;
                return z;
            }
            ;
        }
        function v() {
            return function(A) {
                return y.SFb.bind(y)(A);
            }
            ;
        }
        function w() {
            return function(A) {
                y.$Vb.bind(y)(A);
            }
            ;
        }
        function x(A) {
            return function(z) {
                z = y.bind.bind(y)(z);
                z.vd.sKb = A;
                return z;
            }
            ;
        }
        y = this;
        return function(A) {
            return {
                Ssb: x(A),
                FGb: v(A),
                sPb: u(A),
                aWb: w(A)
            };
        }
        ;
    }
    Eob(u, v, w, x) {
        var y;
        y = null;
        u = {
            Ndc: u,
            ajc: function(A) {
                return A;
            },
            hEc: v,
            key: undefined,
            ti: x,
            M0c: w,
            value: undefined
        };
        if (this.YMa) {
            if ((y = this.YMa(u),
            undefined === y || null === y))
                throw Error(g.S1b);
        } else
            y = this.T9b()(u);
        return y;
    }
    T9b() {
        var u;
        u = this;
        return function(v) {
            var w;
            w = h.d3(u.l9b, u, v.hEc, v.M0c, v.ti, v.key, v.value, v.Ndc);
            w = v.ajc(w);
            return k.resolve(w);
        }
        ;
    }
}
r.Jn = function(u, v) {
        var x, y;
        function w(A, z) {
            A.M1c(function(B, C) {
                C.forEach(function(D) {
                    z.add(D.ti, D.clone());
                });
            });
        }
        x = new r();
        y = h.YUa(x);
        u = h.YUa(u);
        v = h.YUa(v);
        w(u, y);
        w(v, y);
        return x;
    }
    ;
    r.prototype.$Vb = function(u) {
        try {
            this.dQ.remove(u);
        } catch (v) {
            throw Error(g.SZb + " " + n.M0(u));
        }
    }
    ;
    return r;
}
)();
export const Lja = t;

// Detected exports: Lja
