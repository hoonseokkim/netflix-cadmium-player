/**
 * Netflix Cadmium Playercore - Module 44053
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ngb
 * Dependencies: 22970, 53914, 58487, 63206, 66164, 71077, 78203, 79122, 81621, 87887, 90745, 91176
 * Purpose: Network/HTTP, Logging, Event handling, Configuration
 */

// import dep_22970 from './Module_22970.js';
// import dep_53914 from './Module_53914.js';
// import dep_58487 from './Module_58487.js';
// import dep_63206 from './Module_63206.js';
// import dep_66164 from './Module_66164.js';
// import dep_71077 from './Module_71077.js';
// import dep_78203 from './Module_78203.js';
// import dep_79122 from './Module_79122.js';
// import dep_81621 from './Module_81621.js';
// import dep_87887 from './Module_87887.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 44053
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q;

d = a(22970);
p = a(91176);
c = a(66164);
g = a(90745);
f = a(71077);
e = a(53914);
h = a(87887);
k = a(58487);
l = a(79122);
m = a(63206);
n = a(81621);
q = a(78203);
t = (function() {
    class r {
    constructor(u, v, w, x, y) {
        this.L = u;
        this.console = w;
        this.Lzb = x;
        this.xo = y;
        this.events = new g.EventEmitter();
        this.pNa = [];
        u = new f.BGa(u,v);
        this.pNa = [new k.yfb(u,v.nwa), new m.Jmb(), new h.Nmb(), new q.Egb(v.bJc), new e.Lgb()];
        this.Lzb = (0,
        n.Ozb)(x, v.Jnc);
    }
    Cwc() {
        var u;
        u = this;
        return function(v) {
            return function(w, x) {
                return u.KTb(w, x, v, 0);
            }
            ;
        }
        ;
    }
    KTb(u) {
        return d.__awaiter(this, arguments, undefined, function(v, w, x, y) {
            var A, z, B, C, D, E, G, F, H, J, M, K, L, O, I, N, Q, S, T;
            undefined === w && (w = {});
            return d.__generator(this, function(U) {
                switch (U.label) {
                case 0:
                    (A = x.qa,
                    z = x.wa,
                    B = new p.yma(),
                    w.signal && B.P6a(w.signal),
                    (0,
                    p.UUb)(B.signal),
                    C = new Request(v,d.__assign(d.__assign({}, w), {
                        signal: B.signal
                    })),
                    E = c.platform.time.fa(),
                    U.label = 1);
                case 1:
                    return (U.ac.push([1, 3, , 4]),
                    false,
                    G = this.Lzb(C),
                    this.V8b = c.platform.time.fa() - E,
                    null === (N = this.xo) || undefined === N ? undefined : N.F1c(G),
                    [4, G]);
                case 2:
                    return (D = U.T(),
                    D.ok ? (null === (Q = this.xo) || undefined === Q ? undefined : Q.BMc(y),
                    [2, D]) : [3, 4]);
                case 3:
                    F = U.T();
                    false;
                    if ((0,
                    p.xM)(F) && (false,
                    null === (S = this.xo) || undefined === S ? undefined : S.zMc(y),
                    B.signal.aborted))
                        throw F;
                    D = Response.error(C.url, {
                        headers: new Headers(),
                        status: 0,
                        statusText: "Unhandled error in fetch"
                    });
                    return [3, 4];
                case 4:
                    H = {
                        request: C,
                        attempt: y,
                        response: D,
                        Bm: x,
                        AFc: E
                    };
                    this.events.emit("errorReceived", {
                        Azb: D,
                        attempt: y
                    });
                    J = this.CM(H);
                    M = J.At;
                    K = J.WN;
                    L = J.LDc;
                    false;
                    K && this.WN(H);
                    L && this.events.emit("eosReceived", {
                        qa: A,
                        wa: z
                    });
                    if (!M)
                        return [3, 7];
                    O = this.sZ(H);
                    if (!(0 < O))
                        return [3, 6];
                    I = (0,
                    p.ooa)(B.signal, true);
                    false;
                    return [4, Promise.race([I, new Promise(function(X) {
                        return setTimeout(X, O);
                    }
                    )])];
                case 5:
                    (U.T(),
                    U.label = 6);
                case 6:
                    return [2, this.KTb(v, w, x, y + 1)];
                case 7:
                    return (false,
                    null === (T = this.xo) || undefined === T ? undefined : T.AMc(y),
                    [2, D]);
                }
            });
        });
    }
    WN(u) {
        u = new l.ahb(u);
        this.L.cz(u);
    }
    sZ(u) {
        var v;
        v = this.pNa.filter(function(w) {
            return w.sZ;
        }).map(function(w) {
            return w.sZ.bind(w);
        });
        return p.$F.vM(u, v).vaa;
    }
    CM(u) {
        var v;
        v = this.pNa.filter(function(w) {
            return w.CM;
        }).map(function(w) {
            return w.CM.bind(w);
        });
        return p.$F.vM(u, v);
    }
}
Object.defineProperties(r.prototype, {
        wZa: {
            get: function() {
                return this.V8b;
            },
            enumerable: false,
            configurable: true
        }
    });
    return r;
}
)();
export const Ngb = t;

// Detected exports: Ngb
