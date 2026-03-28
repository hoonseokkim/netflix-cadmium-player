/**
 * Netflix Cadmium Playercore - Module 62629
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ncd, Pcd, Ufc, Yfc, wtb
 * Dependencies: 48170, 52571, 65161
 * Purpose: Buffer/Segment management, Logging
 */

// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_65161 from './Module_65161.js';

// Webpack module 62629
// Parameters: t (module), b (exports), a (require)

var m, n, q;
function d(r) {
    return r.So - r.vp;
}
function p(r, u) {
    return Math.exp(-(Math.log(2) / r) * u);
}
function c(r, u) {
    r = Math.log(2) * u / r;
    return (1 - Math.exp(-r)) / r;
}
function g(r, u) {
    var v, w, x, y, A;
    v = u.GU;
    w = u.FU;
    x = u.WI;
    if (0 === u.xh.length)
        return {
            $na: false
        };
    y = u.xh[0];
    u = y.qf;
    A = y.kM;
    y = y.duration;
    if (!A || 1 === x)
        return {
            $na: false
        };
    (0,
    n.assert)(y, "duration should be defined when immediate probability is included in probabilities array");
    (0,
    n.assert)(0 < x, "presenting segment seamless probability cannot be zero");
    w -= y;
    if (v < w)
        return {
            $na: false
        };
    w = v - w;
    v = x + w / y * (1 - x);
    y -= w;
    A = A * (1 - v) / (1 - x);
    r = u * v / x * p(r, y) + A * c(r, y);
    (0,
    n.assert)(1 >= r);
    return {
        $na: true,
        tbc: r
    };
}
function f(r) {
    var u, v, w, x, y;
    u = r.th;
    v = r.x4;
    w = r.nx;
    x = r.So;
    y = r.vp;
    r = r.g0;
    (0,
    n.assert)(undefined !== v);
    (0,
    n.assert)(undefined !== u);
    w = 1 - w;
    x -= y;
    r ? (y = v - r - x,
    u -= r,
    0 >= y ? r = Math.max(0, (v - r) / u) : (v = u - y,
    r = 0 < v ? x / v : 0,
    w *= 0 < v ? v / u : 1)) : (y = v - x,
    0 >= y ? r = v / u : (v = u - y,
    r = 0 < v ? x / v : 0,
    w *= 0 < v ? v / u : 1));
    (0,
    n.assert)(0 <= r);
    (0,
    n.assert)(1 >= r);
    (0,
    n.assert)(0 <= w);
    (0,
    n.assert)(1 >= w);
    return 1 - r * w;
}
function e(r, u) {
    r = Math.log(2) / r.tPb;
    return h(u) * Math.exp(-r * d(u));
}
function h(r) {
    var u;
    return (null !== (u = r.dB) && undefined !== u ? u : 1) * r.xh.reduce(function(v, w) {
        var x;
        x = w.kM;
        return v * (w.qf + (undefined === x ? 0 : x));
    }, 1);
}
function k(r) {
    var u, v, w, x;
    if (0 === r.xh.length)
        return 0;
    v = 0;
    if (1 > r.WI) {
        v = r.GU;
        w = r.FU;
        x = null !== (u = r.xh[0].duration) && undefined !== u ? u : 0;
        v = Math.max(0, Math.min(x, v - (w - x)));
    }
    return r.xh.reduce(function(y, A) {
        A = A.duration;
        return y + (undefined === A ? 0 : A);
    }, 0) - v;
}
function l(r) {
    return r.xh.filter(function(u) {
        return !u.kM;
    }).reduce(function(u, v) {
        return u * v.qf;
    }, 1);
}
export const Pcd = d;
export function Ufc(r, u, v) {
    var w, x, y, A, z, B, C, D;
    if (!r.C_ || (0,
    m.Ts)(u.se))
        return e(r, u);
    x = r.tPb;
    r = d(u);
    y = k(u);
    A = l(u);
    z = g(x, u);
    B = z.$na;
    z = z.tbc;
    z = undefined === z ? 1 : z;
    C = 1 > u.nx ? f(u) : 1;
    D = (null !== (w = u.dB) && undefined !== w ? w : 1) * A * p(x, r - y) * z * C * u.xh.filter(function(E, G) {
        return E.kM && (0 < G || !B);
    }).reduce(function(E, G) {
        var F, H;
        F = G.kM;
        H = G.duration;
        H = undefined === H ? 0 : H;
        F = undefined === F ? 0 : F;
        G = G.qf * p(x, H) + F * c(x, H);
        return E * G;
    }, 1);
    q.u && (null === v || undefined === v ? undefined : v.log(("{").concat(u.groupId, "} [").concat(u.mediaType, "] calculateStreamablePriority: ") + ("sp: ").concat(u.nx, ", ") + ("pssp: ").concat(u.WI, ", ") + ("streamingDuration: ").concat(u.x4, ", ") + ("duration: ").concat(u.th, ", ") + ("seamlessProbability: ").concat(A, ", ") + ("distance: ").concat(r, ", immediateDistance: ").concat(y, ", ") + ("risk:").concat(p(x, r - y), ", ") + ("adjustedFirstTerm: ").concat(z, ", streamingAdjustment: ").concat(C, ", ") + ("probabilities: ").concat(JSON.stringify(u.xh), " => ").concat(D)));
    return D;
}
;
export const Ncd = e;
export const Yfc = h;
export const wtb = l;
m = a(65161);
n = a(52571);
q = a(48170);

// Detected exports: Ncd, Pcd, Ufc, Yfc, wtb
