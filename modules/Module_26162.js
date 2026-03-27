/**
 * Netflix Cadmium Playercore - Module 26162
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 26162
// Parameters: t (module), b (exports), a (require)


var c, g, f, e, h, k, l;
function d(m) {
    m = c.__spreadArray([], c.__read(m.CE.SH(m.initial.id)), !1);
    (0,
    g.assert)(m.every(function(n) {
        return 1 >= n.FF;
    }), "Must be linear playgraph");
    return m;
}
function p(m, n) {
    return m.type === f.ed.Sa || n.type === f.ed.Sa ? f.ed.Sa : m.type;
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.lJc = function(m, n) {
    var q, r, u, v, w, x, y, A, z, B, C, D, E, G, J, M, K, L, N, Q, S, T;
    x = {};
    y = {};
    A = {};
    z = d(n);
    B = m.Kz;
    C = n.Kz;
    B = (0,
    g.dPa)(B, C);
    (0,
    g.assert)(1 === B.length, "Playgraphs to be merged should have exactly one shared viewable");
    D = B[0];
    if (z.length) {
        E = z[z.length - 1];
        E.J === D && Infinity !== E.eb && (z[z.length - 1] = E.extend(g.I.uh));
    }
    G = {};
    try {
        for (var F = c.__values(m.filter(function(ba) {
            return ba.J === D;
        })), H = F.next(); !H.done; H = F.next()) {
            J = H.value;
            M = J.nb;
            K = J.$b;
            L = M.equal(g.I.ia) ? 1 : 0;
            B = [];
            try {
                for (var O = (r = void 0,
                c.__values(z)), I = O.next(); !I.done; I = O.next()) {
                    N = I.value;
                    Q = C = void 0;
                    N.J === D ? 0 === L ? N.OZ(M) && (Q = (0,
                    l.sUb)(N, M, K),
                    N.OZ(K) && (N.$b.isFinite() || K.isFinite()) ? (C = ("").concat(J.id),
                    L = 2) : (C = ("").concat(J.id, ":").concat(N.id),
                    L = 1)) : (C = ("").concat(J.id, ":").concat(N.id),
                    N.OZ(K) ? (N.nb.lessThan(K) && (Q = (0,
                    l.sUb)(N, M, K)),
                    L = 2) : Q = N) : 1 === L && (C = ("").concat(J.id, ":").concat(N.id),
                    Q = N);
                    if (C && Q && (x[C] = J.id,
                    y[C] = N.id,
                    B.length || (A[J.id] = C),
                    B.push({
                        id: C,
                        B4: Q
                    }),
                    1 < B.length)) {
                        S = c.__read(B.slice(-2), 2);
                        T = S[0];
                        E = S[1];
                        T.B4 = c.__assign(c.__assign({}, (0,
                        f.pRa)(T.B4)), {
                            Oc: E.id,
                            next: (v = {},
                            v[E.id] = {},
                            v)
                        });
                    }
                    if (2 === L) {
                        B.length && (E = B[B.length - 1],
                        E.B4 = c.__assign(c.__assign({}, (0,
                        f.pRa)(E.B4)), {
                            type: p(E.B4, J),
                            Oc: J.Oc,
                            next: J.next
                        }));
                        break;
                    }
                }
            } catch (ba) {
                r = {
                    error: ba
                };
            } finally {
                try {
                    I && !I.done && (u = O.return) && u.call(O);
                } finally {
                    if (r)
                        throw r.error;
                }
            }
            B.forEach(function(ba) {
                return G[ba.id] = ba.B4;
            });
        }
    } catch (ba) {
        var U;
        U = {
            error: ba
        };
    } finally {
        try {
            H && !H.done && (q = F.return) && q.call(F);
        } finally {
            if (U)
                throw U.error;
        }
    }
    try {
        for (var X = c.__values(m.filter(function(ba) {
            return ba.J !== D;
        })), Y = X.next(); !Y.done; Y = X.next())
            (J = Y.value,
            G[J.id] = J,
            x[J.id] = J.id);
    } catch (ba) {
        var da;
        da = {
            error: ba
        };
    } finally {
        try {
            Y && !Y.done && (w = X.return) && w.call(X);
        } finally {
            if (da)
                throw da.error;
        }
    }
    U = k.fA.create(new e.Cv().J5a(G, function() {
        return !0;
    }, A).BF(A[m.initial.id] || m.initial.id).build());
    m = new h.CJa(m,U,x);
    n = new h.CJa(n,U,y);
    return {
        d2: U,
        ZFc: m,
        tVc: n
    };
}
;
c = a(22970);
g = a(91176);
f = a(58304);
e = a(48456);
h = a(43341);
k = a(7314);
l = a(48781);


// Detected exports: lJc