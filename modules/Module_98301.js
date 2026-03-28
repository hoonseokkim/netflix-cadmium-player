/**
 * @module Module_98301
 * @description ES module
 * @categories ABR, Player
 *
 * Extracted from: cadmium-playercore-6.0055.939.911.js
 * Bundle module ID: 98301
 * Deobfuscated size: 28726 chars
 * Functions: 15
 * Prototype definitions: 0
 *
 * Deobfuscation applied:
 *   - Decoded \xHH and \uHHHH escape sequences
 *   - Replaced !0 -> true, !1 -> false
 *   - Replaced void 0 -> undefined
 */

// Module 98301
{
                        var d, p, c, g, f, e, h, k;
                        Object.defineProperties(b, {
                            __esModule: {
                                value: true
                            }
                        });
                        b.SSa = b.dua = b.Uf = undefined;
                        t = a(22970);
                        p = t.__importStar(a(17267));
                        c = a(91176);
                        g = a(50468);
                        f = a(13550);
                        e = t.__importDefault(a(62737));
                        h = a(65161);
                        k = a(20880);
                        b.Uf = (d = (function() {
                            function m(n, q, r) {
                                var f6O, u;
                                f6O = 2;
                                for (; f6O !== 3; ) {
                                    switch (f6O) {
                                    case 5:
                                        u = (r.Sha || r.sb) / r.sb;
                                        return 1 >= u ? n.Cva : Math.min(Math.max((n.dZc * Math.min(8 * q / r.bitrate, n.BI) - n.HB) / (u - 1), n.jKb), n.Cva);
                                        break;
                                    case 1:
                                        return n.jKb;
                                        break;
                                    case 8:
                                        f6O = +r.sb ? 4 : 1;
                                        break;
                                    case 2:
                                        f6O = !r.sb ? 1 : 5;
                                        break;
                                    }
                                }
                            }
                            var g07;
                            g07 = 2;
                            function l(n, q, r, u, v, w, x, y, A, z, B, C, D, E, G, F, H, J, M) {
                                var o2l, O, I, N, Q, L, S, K;
                                o2l = 2;
                                for (; o2l !== 16; ) {
                                    switch (o2l) {
                                    case 14:
                                        o2l = !K || K < q.bitrate * J * n.Fca || !N ? 13 : 12;
                                        break;
                                    case 19:
                                        r.forEach(function(T) {
                                            var Z6u, U, X;
                                            Z6u = 2;
                                            for (; Z6u !== 4; ) {
                                                switch (Z6u) {
                                                case 2:
                                                    (U = T.stream,
                                                    X = T.blocks);
                                                    T = T.Ve;
                                                    p.wc(T) && U.Ta && S.add(U.Ta.sC.subarray(T, T + X));
                                                    Z6u = 4;
                                                    break;
                                                }
                                            }
                                        });
                                        u.forEach(function(T) {
                                            var M$s, U, X;
                                            M$s = 2;
                                            for (; M$s !== 4; ) {
                                                switch (M$s) {
                                                case 2:
                                                    (U = T.stream,
                                                    X = T.blocks);
                                                    T = T.Ve;
                                                    0 < G && p.wc(T) && U.Ta && S.add(U.Ta.sC.subarray(T, T + X));
                                                    M$s = 4;
                                                    break;
                                                }
                                            }
                                        });
                                        return 0 < E || 0 < G ? (0,
                                        e.default)({
                                            luc: S,
                                            blocks: B + E + G,
                                            Ld: w,
                                            yl: y,
                                            iZc: x,
                                            Zw: C,
                                            fl: A,
                                            Ve: B,
                                            Jtc: B + E,
                                            Jqa: H,
                                            WAb: D,
                                            sb: (K - M) / J,
                                            FJc: F,
                                            Vy: n.Vy,
                                            sqc: false
                                        }) : K > q.Sy ? {
                                            result: true,
                                            Zda: 0,
                                            Cw: true
                                        } : {
                                            result: false,
                                            Zda: 0,
                                            Cw: true
                                        };
                                        break;
                                    case 8:
                                        (O = y - w,
                                        I = v.length,
                                        N = q.Ta && q.Ta.length,
                                        Q = (null === L || undefined === L ? undefined : L.Ta) && (null === L || undefined === L ? undefined : L.Ta.length));
                                        W60rd.N4Z(5);
                                        (0,
                                        c.assert)(W60rd.i2_(B, I));
                                        n.$da && (F = Math.min(F, O));
                                        o2l = 14;
                                        break;
                                    case 4:
                                        var X6t = "F";
                                        X6t += "i";
                                        X6t += "rst";
                                        X6t += " stream";
                                        X6t += " undefined";
                                        L = null === (K = u[0]) || undefined === K ? undefined : K.stream;
                                        (0,
                                        c.assert)(q, X6t);
                                        K = q.sb;
                                        o2l = 8;
                                        break;
                                    case 12:
                                        Q || (L = q);
                                        S = new k.Glb(v);
                                        E = Math.max(0, Math.min(E, q.Ta.length - z));
                                        G = Math.max(0, Math.min(G, L.Ta.length - z - E));
                                        o2l = 19;
                                        break;
                                    case 13:
                                        return false;
                                        break;
                                    case 2:
                                        undefined === M && (M = 0);
                                        q = r[0].stream;
                                        o2l = 4;
                                        break;
                                    }
                                }
                            }
                            for (; g07 !== 5; ) {
                                switch (g07) {
                                case 2:
                                    var G2T = "1SIY";
                                    G2T += "bZrN";
                                    G2T += "JCp9";
                                    G2T;
                                    return {
                                        dua: l,
                                        Uf: function(n) {
                                            var V$o, S, T, z, B, C, D, E, G, F, H, J, M, K, L, O, I, N, Q, q, r, u, v, w, x, y, A;
                                            V$o = 2;
                                            for (; V$o !== 16; ) {
                                                switch (V$o) {
                                                case 17:
                                                    return B;
                                                    break;
                                                case 11:
                                                    q = (r.pha || x) && M >= r.Via ? z.length : D + 2;
                                                    (S = (function(U) {
                                                        var b64, S9O;
                                                        b64 = 2;
                                                        for (; b64 !== 4; ) {
                                                            switch (b64) {
                                                            case 2:
                                                                var k9C = "var";
                                                                k9C += "i";
                                                                k9C += "ab";
                                                                k9C += "le";
                                                                S9O = r.lAa;
                                                                b64 = S9O === k9C ? 1 : 3;
                                                                break;
                                                            case 1:
                                                                return z.slice(0, U).map(function(X) {
                                                                    var m9v;
                                                                    m9v = 2;
                                                                    for (; m9v !== 1; ) {
                                                                        switch (m9v) {
                                                                        case 2:
                                                                            return [m(r, u.buffer.ru, X), 0];
                                                                            break;
                                                                        }
                                                                    }
                                                                });
                                                                break;
                                                            case 3:
                                                                b64 = 5;
                                                                break;
                                                            case 5:
                                                                return z.slice(0, U).map(function(X, Y) {
                                                                    var S$p;
                                                                    S$p = 2;
                                                                    for (; S$p !== 1; ) {
                                                                        switch (S$p) {
                                                                        case 2:
                                                                            return Y < D ? [r.Hca, r.Vda] : Y === D ? [r.Gca, r.Uda] : [r.Ica, r.Wda];
                                                                            break;
                                                                        }
                                                                    }
                                                                });
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    )(q),
                                                    T = z.slice(0, q).map(function(U, X) {
                                                        var R6G = W60rd;
                                                        var n19, Y;
                                                        n19 = 2;
                                                        for (; n19 !== 5; ) {
                                                            switch (n19) {
                                                            case 2:
                                                                R6G.N4Z(14);
                                                                Y = R6G.w9O(D, X);
                                                                return function() {
                                                                    var A8e, da, ba, aa, ca, ea, R, P, V, Z, fa, la, ka, sa, qa;
                                                                    A8e = 2;
                                                                    for (; A8e !== 5; ) {
                                                                        switch (A8e) {
                                                                        case 2:
                                                                            a: {
                                                                                R6G.N4Z(0);
                                                                                da = Math.max(R6G.i2_(1, X), 0);
                                                                                ba = S[X][0];
                                                                                aa = S[X][1];
                                                                                ca = u.playbackRate;
                                                                                P = v.FWa(X, J, ba);
                                                                                V = P.C7a;
                                                                                P = P.D6a;
                                                                                R6G.N4Z(8);
                                                                                Z = v.FWa(da, R6G.w9O(J, V), aa);
                                                                                da = Z.C7a;
                                                                                fa = Z.D6a;
                                                                                Z = P[0].stream;
                                                                                la = null === (ea = fa[0]) || undefined === ea ? undefined : ea.stream;
                                                                                ea = Z.sb || 0;
                                                                                ka = Z.Ta && Z.Ta.length;
                                                                                sa = x ? r.Gsc : ka ? r.b0 : r.Hsc;
                                                                                sa = Y ? r.fba : sa;
                                                                                if (I && !I.ura && I.sb >= ea && I.bitrate <= Z.bitrate || Infinity !== r.K_a && 0 < r.K_a && Z.Ta && J < Z.Ta.length && 8 * Z.Ta.gZc()[J] / Z.Ta.gyb()[J] > r.K_a) {
                                                                                    qa = false;
                                                                                } else {
                                                                                    Y || ka || (Z.qx = true);
                                                                                    if (!Y || !ka)
                                                                                        if (ka) {
                                                                                            if (ea >= Math.max(Z.Sy * ca, Z.bitrate * ca * sa) && Z.Cw) {
                                                                                                qa = true;
                                                                                                break a;
                                                                                            }
                                                                                        } else if (ea >= Z.bitrate * ca * sa) {
                                                                                            qa = true;
                                                                                            break a;
                                                                                        }
                                                                                    ca = !r.S$ || Z === C || Z.Hb === C.Hb && w ? 0 : (ca = Z.Db) && ca.Wh && ca.Wh.Fa ? ca.Wh.Fa + r.O$ * (ca.Wh.xg ? Math.sqrt(ca.Wh.xg) : 0) : 0;
                                                                                    R6G.V3W(8);
                                                                                    ka = R6G.i2_(ba, aa);
                                                                                    ba = (null !== (qa = Z.cw) && undefined !== qa ? qa : 0) * ba / ka + (null !== (R = null === la || undefined === la ? undefined : la.cw) && undefined !== R ? R : 0) * aa / ka;
                                                                                    (qa = l(r, z, P, fa, N, G + ca - E, L, H - E, F - E, J, N.length, K, Q, V, da, O, u.Jqa, u.playbackRate, ba)) && qa.result && (B.iid = qa.Zda);
                                                                                    I = {
                                                                                        ura: qa && qa.result,
                                                                                        sb: ea,
                                                                                        bitrate: Z.bitrate
                                                                                    };
                                                                                    qa = qa && qa.result;
                                                                                }
                                                                            }
                                                                            return qa;
                                                                            break;
                                                                        }
                                                                    }
                                                                }
                                                                ;
                                                                break;
                                                            }
                                                        }
                                                    }));
                                                    (0,
                                                    c.assert)(T.length === S.length);
                                                    T[D]() ? D + 1 < z.length && M > r.GB && (undefined === A || n && n > A || F - A > r.qT && M > r.Yda) && (y = (0,
                                                    c.cPa)(z.slice(D + 1, q), function(U, X) {
                                                        var B57;
                                                        B57 = 2;
                                                        for (; B57 !== 1; ) {
                                                            switch (B57) {
                                                            case 2:
                                                                return T[D + 1 + X]();
                                                                break;
                                                            }
                                                        }
                                                    })) : y.Ta && y.Ta.length && ((y = (0,
                                                    c.cPa)(z.slice(0, D), function(U, X) {
                                                        var P1v;
                                                        P1v = 2;
                                                        for (; P1v !== 1; ) {
                                                            switch (P1v) {
                                                            case 2:
                                                                return T[X]();
                                                                break;
                                                            case 4:
                                                                return T[X]();
                                                                break;
                                                            }
                                                        }
                                                    })) || (y = z[0]));
                                                    B.Bd = y || C;
                                                    V$o = 17;
                                                    break;
                                                case 9:
                                                    var x76 = "Selected stream not fou";
                                                    x76 += "nd in stre";
                                                    x76 += "am";
                                                    x76 += " l";
                                                    x76 += "ist";
                                                    var y5x = "n";
                                                    y5x += "um";
                                                    y5x += "b";
                                                    y5x += "e";
                                                    y5x += "r";
                                                    var h67 = "num";
                                                    h67 += "b";
                                                    h67 += "er";
                                                    (0,
                                                    c.assert)(h67 === typeof u.buffer.ru);
                                                    (0,
                                                    c.assert)(y5x === typeof u.Jqa);
                                                    (z = v.first,
                                                    B = new f.ih(),
                                                    C = y,
                                                    D = (0,
                                                    c.hn)(z, function(U) {
                                                        var U_r;
                                                        U_r = 2;
                                                        for (; U_r !== 1; ) {
                                                            switch (U_r) {
                                                            case 2:
                                                                return U.isEqual(y);
                                                                break;
                                                            }
                                                        }
                                                    }));
                                                    W60rd.N4Z(15);
                                                    (0,
                                                    c.assert)(W60rd.w9O(D, 0), x76);
                                                    (E = u.buffer.Nb,
                                                    G = u.buffer.Ld,
                                                    F = u.buffer.fl,
                                                    H = u.buffer.yl,
                                                    J = u.Ve,
                                                    M = H - G,
                                                    K = u.state === h.Yb.Bg || u.state === h.Yb.aj ? u.buffer.Zw : 0,
                                                    L = r.CI,
                                                    O = null !== (q = r.HB) && undefined !== q ? q : 1E3);
                                                    v.TL(function(U, X, Y) {
                                                        var Q4p, da;
                                                        Q4p = 2;
                                                        for (; Q4p !== 5; ) {
                                                            switch (Q4p) {
                                                            case 2:
                                                                undefined !== Y && (U = U[Y],
                                                                null !== (da = U.Ta) && undefined !== da && da.length || (U.qx = true));
                                                                Q4p = 5;
                                                                break;
                                                            }
                                                        }
                                                    });
                                                    (N = g.Xo.Tpa(u.buffer.Ta),
                                                    Q = u.buffer.ru - N.la);
                                                    V$o = 11;
                                                    break;
                                                case 2:
                                                    var u4X = "i";
                                                    u4X += "nvalid ";
                                                    u4X += "p";
                                                    u4X += "layer fragmen";
                                                    u4X += "tIndex";
                                                    var a1d = "Must have";
                                                    a1d += " a selected str";
                                                    a1d += "eam";
                                                    (r = n.config,
                                                    u = n.player,
                                                    v = n.el,
                                                    w = n.Mca,
                                                    x = n.h0,
                                                    y = n.rn,
                                                    A = n.Dua);
                                                    n = n.IZa;
                                                    (0,
                                                    c.assert)(y, a1d);
                                                    undefined === u.Ve && (u.Ve = 0);
                                                    (0,
                                                    c.assert)(p.wc(u.Ve), u4X);
                                                    V$o = 9;
                                                    break;
                                                }
                                            }
                                        },
                                        SSa: m
                                    };
                                    break;
                                }
                            }
                        }
                        )(),
                        d.Uf);
                        b.dua = d.dua;
                        b.SSa = d.SSa;
                    }
