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
        complete: !0,
        Gz: 0
    });
    D = C.root;
    E = C.complete;
    G = C.eac;
    F = C.rQb;
    F = void 0 === F ? 0 : F;
    C = C.Gz;
    H = F < y.length && y[F].id === e.id;
    J = F < y.length ? y[F].id : k && x.get(k.id);
    M = l && k && J !== e.id ? void 0 !== J ? {
        qf: 0
    } : k.Ffc(e.id) : {
        qf: 1
    };
    x = M.qf;
    M = M.kM;
    K = void 0 === M ? 0 : M;
    M = (x + K) * (null !== (m = null === l || void 0 === l ? void 0 : l.XI) && void 0 !== m ? m : 1);
    g && v.trace(("reevaluateBranches: visiting ").concat(e.id, ", ") + ("distance: ").concat(h, ", ") + ("probability: ").concat(M, ", ") + ("predecessor: ").concat(null === k || void 0 === k ? void 0 : k.id, ", ") + ("decision: ").concat(J, ", ") + ("predecessorComplete: ").concat(E, ", ") + ("isOnRequiredPath: ").concat(H, ", ") + ("requiredPathIndex: ").concat(F, ", ") + ("activeDistance: ").concat(G, ", ") + ("seamless ").concat(x, ", ") + ("immediate ").concat(K, ", ") + ("predecessor sum of: successor weights=").concat(null === k || void 0 === k ? void 0 : k.S6a, ", ") + ("immediate weights= ").concat(null === k || void 0 === k ? void 0 : k.MAa));
    m = null !== (q = null === (n = w[e.id]) || void 0 === n ? void 0 : n.shift()) && void 0 !== q ? q : e.Ob.G;
    n = 0 === m;
    if (!H) {
        if (0 === M)
            return {
                oW: !1,
                foa: !0
            };
        if (!E && 0 === K && C > B)
            return (f.IL = Math.min(f.IL || Infinity, C - B),
            {
                oW: !1,
                foa: !0
            });
        if (!n && h >= A && 1 > M || !1 === D && M < z)
            return {
                oW: !1,
                foa: !0
            };
    }
    if (F < y.length) {
        (0,
        p.assert)(y[F].id === e.id, "");
        L = {
            duration: y[F].duration
        };
    }
    l = (null === l || void 0 === l ? void 0 : l.xh) || [];
    k && 1 > x && (0 === K ? l = l.concat([{
        qf: x
    }]) : (y = (null === (u = null === (r = k.km) || void 0 === r ? void 0 : r[0]) || void 0 === u ? void 0 : u[0]) || 0,
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
        oW: !0,
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
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.O3a = function(f, e, h, k, l, m, n, q, r) {
    var u, v, w, x;
    v = {
        xF: new c.pma()
    };
    w = (null === (u = h.$b) || void 0 === u ? void 0 : u.da(h.nb).G) || 0;
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
        root: !1,
        complete: !0,
        rQb: 0,
        Gz: 0
    });
    return v;
}
;
b.tnd = d;
b.Fmd = function(f, e, h) {
    var k;
    k = (0,
    c.eRc)(e, function(l) {
        return ("").concat(l.K.id);
    });
    h(("requiredBranches(").concat(f, ")"), k.replace(/\n/g, "<>"));
    h(("requiredBranches(").concat(f, ")"), e.values.map(function(l) {
        var m;
        return ("").concat(l.K.id, "::").concat(null === (m = e.parent(l)) || void 0 === m ? void 0 : m.K.id);
    }).join(", "));
}
;
p = a(52571);
t = a(48170);
c = a(61520);
g = t.u && !1;


// Detected exports: O3a, tnd, Fmd