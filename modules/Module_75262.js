/**
 * Netflix Cadmium Playercore - Module 75262
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: YUa, d3, zdd
 * Dependencies: 4595, 5493, 22929, 23927, 25640, 34912, 37425, 48530, 57197, 67258, 69523, 91734
 * Purpose: Caching/Storage, Error handling
 */

// import dep_4595 from './Module_4595.js';
// import dep_5493 from './Module_5493.js';
// import dep_22929 from './Module_22929.js';
// import dep_23927 from './Module_23927.js';
// import dep_25640 from './Module_25640.js';
// import dep_34912 from './Module_34912.js';
// import dep_37425 from './Module_37425.js';
// import dep_48530 from './Module_48530.js';
// import dep_57197 from './Module_57197.js';
// import dep_67258 from './Module_67258.js';
// import dep_69523 from './Module_69523.js';
// import dep_91734 from './Module_91734.js';

// Webpack module 75262
// Parameters: t (module), b (exports), a (require)

var f, e, h, k, l, m, n, q, r, u, v, w;
function d(x, y, A, z, B) {
    var C, D;
    C = g(A.Fb, B.ti);
    D = [];
    C.length === f.aDa.Jhb && A.Fb.options.d$ && "function" === typeof B.ti && x.GBb(B.ti).Tub && (A.Fb.bind(B.ti).hVb(),
    C = g(A.Fb, B.ti));
    D = y ? C : C.filter(function(E) {
        var G;
        G = new v.Request(E.ti,A,z,E,B);
        return E.pR(G);
    });
    p(B.ti, D, B, A.Fb);
    return D;
}
function p(x, y, A, z) {
    switch (y.length) {
    case f.aDa.Jhb:
        if (A.oGb())
            return y;
        x = m.M0(x);
        y = e.x3b;
        y += m.fGc(x, A);
        y += m.WHb(z, x, g);
        throw Error(y);
    case f.aDa.U3b:
        if (!A.isArray())
            return y;
    default:
        if (A.isArray())
            return y;
        x = m.M0(x);
        y = e.zYb + " " + x;
        y += m.WHb(z, x, g);
        throw Error(y);
    }
}
function c(x, y, A, z, B, C) {
    var D;
    if (null === B) {
        y = d(x, y, z, null, C);
        D = new v.Request(A,z,null,y,C);
        A = new r.i5b(z,D);
        z.Mac(A);
    } else
        (y = d(x, y, z, B, C),
        D = B.Jqb(C.ti, y, C));
    y.forEach(function(E) {
        var G, F, H;
        G = null;
        if (C.isArray())
            G = D.Jqb(E.ti, E, C);
        else {
            if (E.cache)
                return;
            G = D;
        }
        if (E.type === h.Lm.Instance && null !== E.$q) {
            F = u.bwc(x, E.$q);
            if (!z.Fb.options.uV) {
                H = u.qvc(x, E.$q);
                if (F.length < H)
                    throw (E = e.BYb(u.getFunctionName(E.$q)),
                    Error(E));
            }
            F.forEach(function(J) {
                c(x, false, J.ti, z, G, J);
            });
        }
    });
}
function g(x, y) {
    var A, z;
    A = [];
    z = x.dQ;
    z.lEb(y) ? A = z.get(y) : null !== x.parent && (A = g(x.parent, y));
    return A;
}
f = a(57197);
e = a(25640);
h = a(5493);
k = a(37425);
l = a(69523);
m = a(48530);
n = a(91734);
q = a(67258);
r = a(4595);
u = a(34912);
v = a(22929);
w = a(23927);
export function YUa(x) {
    return x.dQ;
}
;
export function d3(x, y, A, z, B, C, D, E) {
    undefined === E && (E = false);
    y = new n.fbb(y);
    A = new q.Metadata(A ? k.JP : k.j7,B);
    z = new w.kma(z,"",B,A);
    undefined !== C && (C = new q.Metadata(C,D),
    z.xa.push(C));
    try {
        return (c(x, E, B, y, null, z),
        y);
    } catch (G) {
        throw (l.wGb(G) && y.d3 && m.thc(y.d3.K4a),
        G);
    }
}
;
export function zdd(x, y, A, z) {
    A = new w.kma(h.wG.FLa,"",y,new q.Metadata(A,z));
    x = new n.fbb(x);
    return new v.Request(y,x,null,[],A);
}
;

// Detected exports: YUa, d3, zdd
