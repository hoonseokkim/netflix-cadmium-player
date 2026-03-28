/**
 * Netflix Cadmium Playercore - Module 65044
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Bfd, Zdd, dwb
 * Dependencies: 22970, 28867, 49165, 50599, 87561
 * Purpose: Encryption/Decryption, Configuration, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_28867 from './Module_28867.js';
// import dep_49165 from './Module_49165.js';
// import dep_50599 from './Module_50599.js';
// import dep_87561 from './Module_87561.js';

// Webpack module 65044
// Parameters: t (module), b (exports), a (require)

var f, e, h, k, l;
function d(m, n) {
    if (m)
        return Object.getOwnPropertyDescriptor(m, n) ? m : d(m.prototype, n) || d(m.__proto__, n);
}
function p(m, n) {
    if (m = d(m, n))
        return Object.getOwnPropertyDescriptor(m, n);
}
function c(m, n) {
    var u;
    for (var q = Object.getPrototypeOf(m), r = []; q !== Object.prototype; )
        (r = r.concat(Object.getOwnPropertyNames(q)),
        q = Object.getPrototypeOf(q));
    m = Object.keys(m).concat(r);
    n.__proxyCtor || (n.__proxyCtor = undefined);
    u = Object.getPrototypeOf(n);
    m.forEach(function(v) {
        Object.getOwnPropertyDescriptor(n, v) || Object.getOwnPropertyDescriptor(u, v) || n[v] || Object.defineProperty(n, v, {
            get: function() {},
            configurable: true,
            enumerable: true
        });
    });
}
function g(m, n, q, r) {
    var w;
    for (var u = [], v = 4; v < arguments.length; v++)
        u[v - 4] = arguments[v];
    w = r();
    if ((null === w || undefined === w ? 0 : w.X_a) || (null === w || undefined === w ? 0 : w.Xa))
        u = u.map(function(x, y) {
            var A;
            y = (0,
            l.PJb)(w.X_a, null === (A = w.Xa) || undefined === A ? undefined : A[y]);
            return (0,
            k.rza)(n, x, q, y);
        });
    u = m.call.apply(m, f.__spreadArray([undefined], f.__read(u), false));
    return (null === w || undefined === w ? 0 : w.return) ? (0,
    k.rza)(n, u, q, w.return, h.jG.IJ) : u;
}

export const Zdd = c;
export const Bfd = g;
f = a(22970);
e = a(50599);
h = a(49165);
k = a(87561);
l = a(28867);
export function dwb(m, n, q, r, u, v) {
    var w, x;
    undefined === v && (v = []);
    w = {};
    x = (0,
    e.yCb)(u);
    c(n, m);
    v.forEach(function(y) {
        return c(y, m);
    });
    return new Proxy(m,{
        get: function(y, A) {
            var z, B, C, D;
            if ("__proxyCtor" === A)
                return m[A] || m.constructor;
            if ((A in n)) {
                C = n[A];
                return "function" === typeof C ? C.bind(n) : C;
            }
            D = w[A];
            if (!D && !p(w, A)) {
                D = null !== (B = null === (z = null === y || undefined === y ? undefined : y.constructor) || undefined === z ? undefined : z.prototype) && undefined !== B ? B : y;
                z = null !== (C = d(D, A)) && undefined !== C ? C : d(D.__proxyCtor, A);
                C = p(D, A);
                if (null === C || undefined === C ? 0 : C.get)
                    return (z = x.bind(null, z, A),
                    y = g.bind(y, function() {
                        return m[A];
                    }, q, r, z),
                    Object.defineProperty(w, A, {
                        get: y,
                        enumerable: true,
                        configurable: true
                    }),
                    y());
                C = y[A];
                return "function" === typeof C ? (z = x.bind(null, y, A),
                y = g.bind(y, C.bind(y), q, r, z),
                w[A] = y) : C;
            }
            return D;
        },
        set: function(y, A, z) {
            if ((A in n))
                return (n[A] = z,
                true);
            y[A] = z;
            delete w[A];
            return true;
        }
    });
}
;

// Detected exports: Bfd, Zdd, dwb
