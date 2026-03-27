/**
 * Netflix Cadmium Playercore - Module 25317
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 25317
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f, e, h, k, l) {
    var m, n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F, H, J, M, K, L;
    v = f.console;
    w = f.v2c;
    x = f.fi;
    y = f.NUc;
    A = f.Noc;
    z = f.e0a;
    B = f.GPa;
    f = f.cU;
    C = l || ({
        complete: true,
        Gz: 0
    });
    D = C.root;
    E = C.complete;
    G = C.eac;
    F = C.rQb;
    F = undefined === F ? 0 : F;
    C = C.Gz;
    H = F < y.length && y[F].id === e.id;
    J = F < y.length ? y[F].id : k && x.get(k.id);
    M = l && k && J !== e.id ? undefined !== J ? {
        qf: 0
    } : k.Ffc(e.id) : {
        qf: 1
    };
    x = M.qf;
    M = M.kM;
    K = undefined === M ? 0 : M;
    M = (x + K) * (null !== (m = null === l || undefined === l ? undefined : l.XI) && undefined !== m ? m : 1);
    g && v.trace(("reevaluateBranches: visiting ").concat(e.id, ", ") + ("distance: ").concat(h, ", ") + ("probability: ").concat(M, ", ") + ("predecessor: ").concat(null === k || undefined === k ? undefined : k.id, ", ") + ("decision: ").concat(J, ", ") + ("predecessorComplete: ").concat(E, ", ") + ("isOnRequiredPath: ").concat(H, ", ") + ("requiredPathIndex: ").concat(F, ", ") + ("activeDistance: ").concat(G, ", ") + ("seamless ").concat(x, ", ") + ("immediate ").concat(K, ", ") + ("predecessor sum of: successor weights=").concat(null === k || undefined === k ? undefined : k.S6a, ", ") + ("immediate weights= ").concat(null === k || undefined === k ? undefined : k.MAa));
    m = null !== (q = null === (n = w[e.id]) || undefined === n ? undefined : n.shift()) && undefined !== q ? q : e.Ob.G;
    n = 0 === m;
    if (!H) {
        if (0 === M)
            return {
                oW: false,
                foa: true
            };
        if (!E && 0 === K && C > B)
            return (f.IL = Math.min(f.IL || Infinity, C - B),
            {
                oW: false,
                foa: true
            });
        if (!n && h >= A && 1 > M || false === D && M < z)
            return {
                oW: false,
                foa: true
            };
    }
    if (F < y.length) {
        (0,
        p.assert)(y[F].id === e.id, "");
        L = {
            duration: y[F].duration
        };
    }
    l = (null === l || undefined === l ? undefined : l.xh) || [];
    k && 1 > x && (0 === K ? l = l.concat([{
        qf: x
    }]) : (y = (null === (u = null === (r = k.km) || undefined === r ? undefined : r[0]) || undefined === u ? undefined : u[0]) || 0,
    r = Math.max(0, k.Ob.G - y),
    g && v.trace(("reevaluateBranches: immediate: ").concat(k.Ob.G, ",\n                ").concat(y, ", ").concat(r)),
    l = l.concat([{
        qf: x,
        kM: K,
        duration: r
    }])));
    r = f.xF.kAb(function(O) {
        return O.K === k;
    });
    f.xF.add({
        K: e,
        xh: l,
        ma: L
    }, r);
    h = E ? h + e.Ob.G : G;
    g && v.trace(("reevaluateBranches: added ").concat(e.id, ", visiting successors, ") + ("active distance: ").concat(h, " ") + ("probabilities: ").concat(JSON.stringify(l)));
    return {
        oW: true,
        foa: H,
        state: {
            root: !k,
            complete: n,
            XI: M,
            xh: l,
            eac: h,
            rQb: F + 1,
            Gz: C + m
        }
    };
}O3a = function(f, e, h, k, l, m, n, q, r) {
    var u, v, w, x;
    v = {
        xF: new c.pma()
    };
    w = (null === (u = h.$b) || undefined === u ? undefined : u.da(h.nb).G) || 0;
    0 < m.length && (0,
    p.assert)(h.id === m[0].id, "First segment of required path (if it exists) must equal reevaluateBranches start segment.");
    g && f.trace(("reevaluateBranches: starting at ").concat(h.id, " ") + ("requiredPath: ").concat(JSON.stringify(m)));
    x = {
        console: f,
        v2c: k,
        fi: l,
        NUc: m,
        Noc: n.G + w,
        e0a: q,
        GPa: r.G,
        cU: v
    };
    e.GXb(h, function(y, A, z, B) {
        return d(x, y, A, z, B);
    }, {
        root: false,
        complete: true,
        rQb: 0,
        Gz: 0
    });
    return v;
}
;
export const tnd = d;
export function Fmd(f, e, h) {
    var k;
    k = (0,
    c.eRc)(e, function(l) {
        return ("").concat(l.K.id);
    });
    h(("requiredBranches(").concat(f, ")"), k.replace(/\n/g, "<>"));
    h(("requiredBranches(").concat(f, ")"), e.values.map(function(l) {
        var m;
        return ("").concat(l.K.id, "::").concat(null === (m = e.parent(l)) || undefined === m ? undefined : m.K.id);
    }).join(", "));
}
;
p = a(52571);
t = a(48170);
c = a(61520);
g = t.u && false;

// Detected exports: O3a, tnd, Fmd