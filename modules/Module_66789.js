/**
 * Netflix Cadmium Playercore - Module 66789
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: M1, Xz
 * Dependencies: 16530, 22970, 32296, 72905, 75589, 87349, 93334
 * Purpose: Buffer/Segment management, Logging, Parsing/Serialization, UI components
 */

// import dep_16530 from './Module_16530.js';
// import dep_22970 from './Module_22970.js';
// import dep_32296 from './Module_32296.js';
// import dep_72905 from './Module_72905.js';
// import dep_75589 from './Module_75589.js';
// import dep_87349 from './Module_87349.js';
// import dep_93334 from './Module_93334.js';

// Webpack module 66789
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k) {
    return "number" === typeof k[0] || undefined === k[0] ? {
        Jl: k[0],
        O: k[1],
        dH: k[2],
        y4a: k[3],
        aV: k[4]
    } : k[0];
}

export function M1(k) {
    var l, m;
    l = new ArrayBuffer(8);
    m = new DataView(l);
    m.setUint32(0, k + 8);
    m.setUint32(4, (0,
    g.jMa)("mdat"));
    return l;
}
;
p = a(22970);
c = a(75589);
t = a(87349);
g = a(32296);
f = a(93334);
e = a(72905);
h = a(16530);
a = (function(k) {
    class l extends k {
    constructor(m, n, q, r) {
        m = k.call(this, m, n, q) || this;
        m.uR = r;
        return m;
    }
    RPb() {
        for (var m = [], n = 0; n < arguments.length; n++)
            m[n] = arguments[n];
        return this.pa(p.__assign(p.__assign({}, d(m)), {
            X3a: false
        }));
    }
    pa(m) {
        var q, r, u, v, w, x, y, A, z, B, C, D, E, G, F, H, J, M, K, L, O, I, N;
        function n(S) {
            z = A[S];
            B = z.Nt("traf");
            if (undefined === B || undefined === B.CA)
                return false;
            G = B.Nt("tfdt");
            if (undefined === G)
                return false;
            C = B.Nt("trun");
            return undefined === C ? false : true;
        }
        q = m.Jl;
        r = m.O;
        u = m.X3a;
        v = m.dH;
        w = m.y4a;
        w = undefined === w ? false : w;
        x = m.aV;
        x = undefined === x ? false : x;
        y = m.wT;
        m = m.Cqa;
        m = undefined === m ? false : m;
        if (!this.parse(this.uR).done)
            return false;
        A = this.Se.moof;
        if (!A || 0 === A.length)
            return false;
        if (undefined !== q) {
            D = q;
            for (q = 0; q < A.length; ++q) {
                if (!n(q, this.We.console.trace))
                    return false;
                (0,
                f.assert)(z && B && G && C && undefined !== C.Vd);
                if (C.Vd > D || u && C.Vd === D)
                    break;
                D -= C.Vd;
            }
            (0,
            f.assert)(z && B && G && C);
        } else if ((q = u ? A.length - 1 : 0,
        !n(q, this.We.console.trace)))
            return false;
        (0,
        f.assert)(z && B && G && C);
        if (u && q < A.length - 1) {
            E = A[q + 1];
            this.We.xr(this.view.byteOffset - E.startOffset, E.startOffset);
        } else
            !u && 0 < q && this.We.xr(z.startOffset, 0);
        E = B.Nt("tfhd");
        if (undefined === E)
            return false;
        G = B.Nt("tfdt");
        F = C.Vd;
        H = B.Nt("saiz");
        J = B.Nt("saio");
        M = B.Nt(c.mib) || B.Nt("senc");
        K = B.Nt("sbgp");
        if (!(!H && !J || H && J))
            return false;
        L = B.Nt("sdtp");
        O = e.Kf.PH(this, "mdat");
        if (O && q < O.length)
            I = O[q];
        else {
            if (q !== A.length - 1)
                return false;
            if (this.We.offset <= this.view.byteLength - 8) {
                O = this.We.offset;
                N = this.We.dc();
                "mdat" === this.We.gC() && (I = new h.default(this.We,"mdat",O,N));
            }
        }
        undefined === D && (D = u ? C.Vd : 0);
        if ("number" === typeof v && 0 < v) {
            O = u ? D : C.Vd - D;
            N = Array(O);
            for (var Q = 0; Q < O; ++Q)
                N[Q] = u ? Q >= O - v ? -Infinity : 0 : Q < v ? -Infinity : 0;
            v = N;
        }
        if (C.pa(B, E, m ? undefined : I || this.We, r, D, B.CA, u))
            C.Nqa && ((0,
            f.assert)(undefined !== C.qTb),
            (0,
            f.assert)(undefined !== C.l4),
            !u && G && G.pa(C.qTb),
            H && J && (H.pa(C.l4, u),
            J.pa(M ? 0 : H.tza, B.CA)),
            M && M.pa(C.l4, u),
            L && L.pa(C.l4, F, u),
            K && K.pa(C.l4, u));
        else if (!u) {
            if (q === A.length - 1)
                return false;
            this.We.xr(A[q + 1].startOffset - z.startOffset, z.startOffset);
        } else if (0 === C.l4)
            return false;
        Array.isArray(v) && I && this.stream.profile && undefined !== w && !m && C.WJc(B, E, I, v, this.stream.profile, w, x, y);
        u = this.We.pa();
        r = u.Na;
        u = u.QL;
        v = r.reduce(function(S, T) {
            return S + T.byteLength;
        }, 0);
        return {
            Na: r,
            length: v,
            bU: this.We.view.byteLength,
            QL: u
        };
    }
}
p.l.prototype.$Pb = function() {
        for (var m = [], n = 0; n < arguments.length; n++)
            m[n] = arguments[n];
        return this.pa(p.__assign(p.__assign({}, d(m)), {
            X3a: true
        }));
    }
    ;
    return l;
}
)((function(k) {
    function l(m, n, q) {
        return k.call(this, m, n, q) || this;
    }
    p.__extends(l, k);
    return l;
}
)(t.Wz));
export const Xz = a;

// Detected exports: M1, Xz
