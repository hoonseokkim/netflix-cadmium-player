/**
 * Netflix Cadmium Playercore - Module 71406
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: QDc, rz
 * Dependencies: 13550, 22970, 65161, 88318, 91176
 * Purpose: Audio handling, Video handling, Logging, Configuration
 */

// import dep_13550 from './Module_13550.js';
// import dep_22970 from './Module_22970.js';
// import dep_65161 from './Module_65161.js';
// import dep_88318 from './Module_88318.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 71406
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;

t = a(22970);
d = t.__importStar(a(17267));
p = a(91176);
c = a(65161);
g = a(88318);
t = t.__importStar(a(65167));
f = a(13550);
e = t.ZYc;
a = (function() {
    function m(x, y) {
        var m3U = W60rd;
        var y_V, A;
        y_V = 2;
        for (; y_V !== 9; ) {
            switch (y_V) {
            case 3:
                var I4B = "sig";
                I4B += "mo";
                I4B += "i";
                I4B += "d";
                return 0 === y.jO.lastIndexOf(I4B, 0) ? (A = y.jO,
                (A = y.LRb[A]) && 2 === A.length ? 1E3 * (A[0] + A[1] * e(x)) : y.$s) : y.$s;
                break;
            case 5:
                A = y.jO;
                y_V = 4;
                break;
            case 1:
                var t97 = "l";
                t97 += "o";
                t97 += "g";
                y_V = 0 === y.jO.lastIndexOf(t97, 0) ? 5 : 3;
                break;
            case 4:
                return (A = y.LRb[A]) && 2 === A.length ? 1E3 * (A[0] + A[1] * Math.log(1 + x)) : y.$s;
                break;
            case 2:
                m3U.N4Z(16);
                var h4P = m3U.i2_(12, 12, 14, 1600010, 1700000);
                m3U.N4Z(17);
                var K$n = m3U.i2_(997, 1, 3);
                x = (0,
                f.qpa)(x, 0, h4P) / K$n;
                y_V = 1;
                break;
            }
        }
    }
    var n2E;
    n2E = 2;
    function l(x, y) {
        var G9R, A, z;
        G9R = 2;
        for (; G9R !== 13; ) {
            switch (G9R) {
            case 2:
                G9R = x.rM ? 1 : 14;
                break;
            case 3:
                G9R = -1 === z ? 9 : 8;
                break;
            case 1:
                (A = x.rM,
                z = (0,
                p.hn)(A, function(B) {
                    var u1I;
                    u1I = 2;
                    for (; u1I !== 1; ) {
                        switch (u1I) {
                        case 4:
                            return y < B.r;
                            break;
                        case 2:
                            return y <= B.r;
                            break;
                        }
                    }
                }));
                G9R = 5;
                break;
            case 6:
                return Math.floor(x.d + (A.d - x.d) * (y - x.r) / (A.r - x.r));
                break;
            case 5:
                G9R = 0 === z ? 4 : 3;
                break;
            case 9:
                return A[A.length - 1].d;
                break;
            case 14:
                return x.$s;
                break;
            case 4:
                return A[0].d;
                break;
            case 8:
                W60rd.V3W(0);
                x = A[W60rd.i2_(1, z)];
                A = A[z];
                G9R = 6;
                break;
            }
        }
    }
    function q(x, y) {
        var C$H, A;
        C$H = 2;
        for (; C$H !== 5; ) {
            switch (C$H) {
            case 2:
                A = x.Pt ? x.Pt >= y.Uy : true;
                return (x.cw ? x.cw >= y.Ty : true) && A;
                break;
            }
        }
    }
    for (; n2E !== 5; ) {
        switch (n2E) {
        case 2:
            var N6y = "1";
            N6y += "S";
            N6y += "IYbZ";
            N6y += "r";
            N6y += "NJCp9";
            N6y;
            return {
                HNa: function(x) {
                    var Y0_, y, A, z;
                    Y0_ = 2;
                    for (; Y0_ !== 4; ) {
                        switch (Y0_) {
                        case 2:
                            (y = x.config,
                            A = x.player,
                            z = x.rn);
                            x = x.el.first;
                            return y.EY ? n(y, A, x, z) : v(y, A, x, z);
                            break;
                        }
                    }
                },
                O8b: u
            };
            break;
        }
    }
    function w(x, y) {
        var e60, A;
        e60 = 2;
        for (; e60 !== 4; ) {
            switch (e60) {
            case 2:
                y.some(function(z) {
                    var S0g, B;
                    S0g = 2;
                    for (; S0g !== 4; ) {
                        switch (S0g) {
                        case 2:
                            B = z.profiles;
                            (B = B && 0 <= B.indexOf(x)) && (A = z.override);
                            return B;
                            break;
                        }
                    }
                });
                return A;
                break;
            }
        }
    }
    function h(x, y) {
        var j7Q, B, A, z;
        j7Q = 2;
        for (; j7Q !== 11; ) {
            switch (j7Q) {
            case 7:
                j7Q = (B = d.wc(y.Oza) && 0 <= y.Oza && 100 >= y.Oza && z) ? 6 : 14;
                break;
            case 9:
                z = null === z || undefined === z ? undefined : z.Nl;
                j7Q = 7;
                break;
            case 2:
                A = new f.ih();
                A.Bd = x;
                z = A.Bd.Db;
                A.Db = z;
                x = 0;
                j7Q = 9;
                break;
            case 6:
                (B = g.rmb.syc(z),
                d.Gy(B) ? (z.kk = B,
                B = true) : B = false);
                j7Q = 14;
                break;
            case 14:
                var Q9D = "h";
                Q9D += "ist_throug";
                Q9D += "h";
                Q9D += "pu";
                Q9D += "t";
                var n8i = "hi";
                n8i += "st_";
                n8i += "td";
                n8i += "ig";
                n8i += "est";
                B && z.kk ? (x = z.kk(y.Oza / 100) || A.Bd.sb,
                A.reason = n8i) : A.Bd.sb && (x = A.Bd.sb,
                A.reason = Q9D);
                A.Lu = x;
                return A;
                break;
            }
        }
    }
    function k(x, y, A) {
        var v9d;
        v9d = 2;
        for (; v9d !== 5; ) {
            switch (v9d) {
            case 2:
                x = (0,
                f.ktb)(A.Pp, x * A.CT);
                return (0,
                f.AKb)(x, y);
                break;
            }
        }
    }
    function u(x, y, A, z, B, C) {
        var E_0;
        E_0 = 2;
        for (; E_0 !== 4; ) {
            switch (E_0) {
            case 2:
                var e2p = "n";
                e2p += "o";
                e2p += "_val";
                e2p += "id";
                e2p += "_Bitrate";
                var D8j = "no_";
                D8j += "v";
                D8j += "a";
                D8j += "lid_VMAF";
                var h7w = "no_valid_D";
                h7w += "e";
                h7w += "l";
                h7w += "ayTar";
                h7w += "get";
                W60rd.N4Z(14);
                y = W60rd.w9O(B, z);
                x = A ? x.Wb >= C.Tw && x.Wb <= C.BJb : q(x, C) && r(x, C);
                return (C = y && x) ? {
                    ura: C
                } : {
                    ura: C,
                    reason: x ? h7w : A ? D8j : e2p
                };
                break;
            }
        }
    }
    function n(x, y, A) {
        var W5J, z, B, C, D, E, G;
        W5J = 2;
        for (; W5J !== 19; ) {
            switch (W5J) {
            case 2:
                (z = !!x.Tw && !!x.BJb && A.every(function(F) {
                    var C7K;
                    C7K = 2;
                    for (; C7K !== 1; ) {
                        switch (C7K) {
                        case 2:
                            return F.Wb && 110 >= F.Wb;
                            break;
                        }
                    }
                }),
                B = null,
                C = A.length - 1);
                W5J = 1;
                break;
            case 1:
                W5J = 0 <= C && (z ? A[C].Wb >= x.Tw : q(A[C], x)) ? 5 : 11;
                break;
            case 12:
                C--;
                W5J = 1;
                break;
            case 11:
                var n6k = "fallb";
                n6k += "a";
                n6k += "ck_no_accep";
                n6k += "table_stream";
                var A$Y = "be";
                A$Y += "l";
                A$Y += "ow_minInitVideoBitrate";
                d.Ad(B) && !q(A[C], x) && (B = h(A[C], x),
                B.reason = A$Y);
                d.Ad(B) && (B = h(A[0], x),
                B.reason = n6k);
                return B;
                break;
            case 5:
                D = A[C];
                B = h(D, x);
                (E = k(D.bitrate * y.playbackRate, B.Lu, x),
                G = m(B.Lu, x));
                G = u(D, B.Lu, z, E, G, x);
                D = G.ura;
                G = G.reason;
                W5J = 6;
                break;
            case 14:
                W5J = D ? 11 : 13;
                break;
            case 6:
                B.Y0 = E;
                W5J = 14;
                break;
            case 13:
                B.reason = G;
                W5J = 12;
                break;
            }
        }
    }
    function r(x, y) {
        var r3Z, A, z;
        r3Z = 2;
        for (; r3Z !== 9; ) {
            switch (r3Z) {
            case 2:
                (A = x.fj(c.l.V)) ? (A = A.Zc,
                A = y && y.cq && 0 <= y.cq.indexOf(A) ? w(A, y.vJ) : w(A, y.Aoa)) : A = undefined;
                A = A ? null !== (z = A.maxInitAudioBitrate) && undefined !== z ? z : y.$u : y.$u;
                y = x.Pt ? x.Pt <= y.IB : true;
                return (x.cw ? x.cw <= A : true) && y;
                break;
            }
        }
    }
    function v(x, y, A) {
        var e23, z, B;
        e23 = 2;
        for (; e23 !== 4; ) {
            switch (e23) {
            case 2:
                (z = new f.ih(),
                B = Math.max(x.Uy, x.HT));
                z.Bd = (0,
                p.kc)(A.filter(function(C) {
                    var l$K;
                    l$K = 2;
                    for (; l$K !== 1; ) {
                        switch (l$K) {
                        case 2:
                            return r(C, x);
                            break;
                        case 4:
                            return r(C, x);
                            break;
                        }
                    }
                }).reverse(), function(C) {
                    var w1i, E, D;
                    w1i = 2;
                    for (; w1i !== 6; ) {
                        switch (w1i) {
                        case 7:
                            var S0u = "n";
                            S0u += "o_histor";
                            S0u += "ical_lte_minbi";
                            S0u += "trate";
                            var Q$s = "hist_";
                            Q$s += "tp";
                            Q$s += "ut";
                            Q$s += "_lt_minbi";
                            Q$s += "trate";
                            var C9$ = "lt_hist_lte_m";
                            C9$ += "inb";
                            C9$ += "it";
                            C9$ += "r";
                            C9$ += "ate";
                            D && C.bitrate * y.playbackRate <= D ? (z.Lu = D,
                            z.reason = C9$,
                            D = true) : D ? (z.Lu = D,
                            z.reason = Q$s,
                            D = false) : (z.reason = S0u,
                            D = true);
                            w1i = 9;
                            break;
                        case 1:
                            w1i = C.bitrate > B ? 5 : 7;
                            break;
                        case 8:
                            D = false;
                            w1i = 9;
                            break;
                        case 5:
                            w1i = (C = C.bitrate * y.playbackRate,
                            D) ? 4 : 8;
                            break;
                        case 3:
                            var K3$ = "h";
                            K3$ += "ist_bu";
                            K3$ += "ff";
                            K3$ += "time";
                            k(C, D, x) <= E ? (z.Lu = D,
                            z.reason = K3$,
                            D = true) : D = false;
                            w1i = 9;
                            break;
                        case 4:
                            E = l(x, C);
                            w1i = 3;
                            break;
                        case 2:
                            D = C.sb;
                            w1i = 1;
                            break;
                        case 9:
                            return D;
                            break;
                        }
                    }
                }) || A[0];
                return z;
                break;
            }
        }
    }
}
)();
t = a.O8b;
export const rz = a.HNa;
export const QDc = t;

// Detected exports: QDc, rz
