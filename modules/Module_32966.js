/**
 * Netflix Cadmium Playercore - Module 32966
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: GA
 * Dependencies: 65161
 * Purpose: ABR/Quality selection
 */

// import dep_65161 from './Module_65161.js';

// Webpack module 32966
// Parameters: t (module), b (exports), a (require)

var d;

d = a(65161);
a(13550);
export const GA = (function() {
    var g6k;
    g6k = 2;
    for (; g6k !== 1; ) {
        switch (g6k) {
        case 2:
            return {
                I7b: function(p, c, g, f, e, h) {
                    var j_w = W60rd;
                    function k(w) {
                        var G5N;
                        G5N = 2;
                        for (; G5N !== 7; ) {
                            switch (G5N) {
                            case 2:
                                G5N = !f.Ta ? 1 : 5;
                                break;
                            case 1:
                                return 0;
                                break;
                            case 9:
                                w = f.Ta.get(w.index);
                                return (r - p.Zw) / (r + (w.offset + w.la) - u);
                                break;
                            case 4:
                                G5N = undefined === w ? 3 : 9;
                                break;
                            case 3:
                                return 0;
                                break;
                            case 5:
                                w = f.Ta.YTa(p.Ld + w, undefined, true);
                                G5N = 4;
                                break;
                            }
                        }
                    }
                    var Q5S, l, m, u, n, q, r, v;
                    Q5S = 2;
                    for (; Q5S !== 54; ) {
                        switch (Q5S) {
                        case 23:
                            Q5S = l >= n ? 22 : 38;
                            break;
                        case 42:
                            return (n = Math.min(q, l + v),
                            {
                                complete: false,
                                $N: n,
                                progress: k(n)
                            });
                            break;
                        case 2:
                            (l = p.yl - p.Ld,
                            m = c === d.Yd.Qm);
                            c = f.sb || 0;
                            Q5S = 5;
                            break;
                        case 31:
                            m = undefined;
                            Q5S = 30;
                            break;
                        case 28:
                            m = f.Ta.get(h);
                            j_w.N4Z(9);
                            var w0j = j_w.i2_(136, 16, 0, 8);
                            v = w0j * v * g / c - m.qa.G - n;
                            Q5S = 43;
                            break;
                        case 7:
                            j_w.V3W(10);
                            var G7s = j_w.w9O(9, 4, 6);
                            n = h.Pp * (m ? h.Vfa : G7s);
                            !f.Da && h.Zqc && f.Db && f.Db.Wh && f.Db.Wh.Fa > h.iva && (n += h.Wna + f.Db.Wh.Fa * h.Mxa);
                            e && !f.Da && (n += e * h.Xna);
                            n = q ? Math.min(q, n) : n;
                            Q5S = 12;
                            break;
                        case 9:
                            Q5S = c <= h.jva && (0 < c || !h.lra) ? 8 : 7;
                            break;
                        case 25:
                            var I_k = "ou";
                            I_k += "t";
                            I_k += "of";
                            I_k += "range";
                            return {
                                complete: true,
                                reason: I_k
                            };
                            break;
                        case 11:
                            var F$7 = "n";
                            F$7 += "oth";
                            F$7 += "rou";
                            F$7 += "ghpu";
                            F$7 += "t";
                            return {
                                complete: false,
                                $N: n,
                                reason: F$7
                            };
                            break;
                        case 18:
                            Q5S = f.Da ? 17 : 16;
                            break;
                        case 43:
                            Q5S = 0 < v ? 42 : 41;
                            break;
                        case 26:
                            Q5S = -1 === e ? 25 : 24;
                            break;
                        case 3:
                            var c31 = "m";
                            c31 += "a";
                            c31 += "xsi";
                            c31 += "z";
                            c31 += "e";
                            return {
                                complete: true,
                                reason: c31
                            };
                            break;
                        case 21:
                            var C$z = "h";
                            C$z += "i";
                            C$z += "ght";
                            C$z += "p";
                            return {
                                complete: true,
                                reason: C$z
                            };
                            break;
                        case 24:
                            u = f.Ta.Rf(e);
                            Q5S = 23;
                            break;
                        case 16:
                            Q5S = !f.Ta || !f.Ta.length ? 15 : 27;
                            break;
                        case 5:
                            (n = 0,
                            q = Math.min(h.BI, h.Cia && !m ? h.NE : h.nea));
                            Q5S = 4;
                            break;
                        case 17:
                            var F6y = "lo";
                            F6y += "w";
                            F6y += "Live";
                            F6y += "B";
                            F6y += "uffer";
                            var x5H = "live";
                            x5H += "Buf";
                            x5H += "f";
                            x5H += "erLe";
                            x5H += "vel";
                            return c > m && l > n ? {
                                complete: true,
                                reason: x5H
                            } : {
                                complete: false,
                                $N: n,
                                sb: c,
                                bitrate: m,
                                reason: F6y
                            };
                            break;
                        case 22:
                            Q5S = c > m * h.b0 ? 21 : 35;
                            break;
                        case 29:
                            Q5S = h > e ? 28 : 39;
                            break;
                        case 8:
                            var d0Q = "lowThr";
                            d0Q += "ough";
                            d0Q += "put";
                            return {
                                complete: false,
                                Xda: true,
                                reason: d0Q
                            };
                            break;
                        case 12:
                            Q5S = !c ? 11 : 10;
                            break;
                        case 15:
                            return (c < m && (n = Math.min(q, Math.max(h.v3 * (m / c - 1), n))),
                            {
                                complete: false,
                                $N: n,
                                progress: 0
                            });
                            break;
                        case 10:
                            r = p.Ta.reduce(function(w, x) {
                                var h1O;
                                h1O = 2;
                                for (; h1O !== 1; ) {
                                    switch (h1O) {
                                    case 2:
                                        return w + (x.Sb.G > p.Ld ? x.la : 0);
                                        break;
                                    }
                                }
                            }, 0);
                            g = Math.max(g, 1);
                            m = g * f.bitrate;
                            Q5S = 18;
                            break;
                        case 4:
                            Q5S = l >= q ? 3 : 9;
                            break;
                        case 41:
                            v = m.offset;
                            Q5S = 40;
                            break;
                        case 39:
                            var J8Z = "n";
                            J8Z += "o";
                            J8Z += "r";
                            J8Z += "ebuff";
                            return {
                                complete: true,
                                reason: J8Z
                            };
                            break;
                        case 27:
                            e = f.Ta.QH(p.fl);
                            Q5S = 26;
                            break;
                        case 35:
                            n = f.Ta.og(e);
                            h = Math.min(e + Math.floor(h.v3 / n), f.Ta.length - 1);
                            v = f.Ta.Rf(h);
                            j_w.V3W(11);
                            var k55 = j_w.w9O(20, 0, 160);
                            n = k55 * u * g / c - p.Ld;
                            Q5S = 31;
                            break;
                        case 30:
                            --h;
                            Q5S = 29;
                            break;
                        case 38:
                            var c93 = "1";
                            c93 += "SIYb";
                            c93 += "Zr";
                            c93 += "NJCp9";
                            0 < c && c < m && (n = Math.min(q, Math.max(h.v3 * (m / c - 1), n)));
                            c93;
                            return {
                                complete: false,
                                $N: n,
                                progress: k(n)
                            };
                            break;
                        case 40:
                            --h;
                            Q5S = 29;
                            break;
                        }
                    }
                }
            };
            break;
        }
    }
}
)().I7b;

// Detected exports: GA
