/**
 * Netflix Cadmium Playercore - Module 70753
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 13550, 22970, 24653, 91176
 * Purpose: Audio handling, Buffer/Segment management, Configuration, Playback control
 */

// import dep_13550 from './Module_13550.js';
// import dep_22970 from './Module_22970.js';
// import dep_24653 from './Module_24653.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 70753
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e, h) {
    var k;
    h.some(function(l) {
        var m;
        m = l.profiles;
        (m = m && 0 <= m.indexOf(e)) && (k = l.override);
        return m;
    });
    return k;
}
p = a(22970);
c = a(91176);
g = a(13550);
t = p.__importDefault(a(32028));
f = a(24653);
a = (function(e) {
    var H2I;
    H2I = 2;
    for (; H2I !== 3; ) {
        switch (H2I) {
        case 1:
            return h;
            break;
        case 2:
            p.H2I = 1;
            break;
        }
    }
    function h() {
        var d_E, k;
        d_E = 2;
        for (; d_E !== 4; ) {
            switch (d_E) {
            case 9:
                k = e.call(this) && this;
                "";
                return k;
                break;
            case 2:
                var K07 = "1SIYbZrN";
                K07 += "J";
                K07 += "Cp9";
                k = e.call(this) || this;
                K07;
                return k;
                break;
            }
        }
    }
}
)(t.default);
b["default"] = a;
class h extends e {
    constructor() {
        var d_E, k;
        d_E = 2;
        for (; d_E !== 4; ) {
            switch (d_E) {
            case 9:
                k = e.call(this) && this;
                "";
                return k;
                break;
            case 2:
                var K07 = "1SIYbZrN";
                K07 += "J";
                K07 += "Cp9";
                k = e.call(this) || this;
                K07;
                return k;
                break;
            }
        }
    }
    rz(k) {
                var s8D, l, m, n, q, r, u;
                s8D = 2;
                for (; s8D !== 3; ) {
                    switch (s8D) {
                    case 2:
                        (r = k.config,
                        u = k.el.first);
                        u = (k.rn || u[0]).Zc;
                        u = r && r.cq && 0 <= r.cq.indexOf(u) ? d(u, r.vJ) : d(u, r.Aoa);
                        return (0,
                        f.GRb)({
                            player: k.player,
                            el: k.el,
                            config: u ? {
                                mPa: null !== (l = u.audioBwFactor) && undefined !== l ? l : r.mPa,
                                Ty: null !== (m = u.minInitAudioBitrate) && undefined !== m ? m : r.Ty,
                                $u: null !== (n = u.maxInitAudioBitrate) && undefined !== n ? n : r.$u,
                                i2: null !== (q = u.minRequiredAudioBuffer) && undefined !== q ? q : r.i2
                            } : r
                        });
                        break;
                    }
                }
            }
    Uf(k) {
                var Q18, l, m, n, q, r, u, v, w, C, y, A, z, B, x;
                Q18 = 2;
                for (; Q18 !== 33; ) {
                    switch (Q18) {
                    case 27:
                        q--;
                        Q18 = 17;
                        break;
                    case 16:
                        Q18 = (r = x[q],
                        r.oI && (0 === q || r.bitrate * m.playbackRate * k.Uoc < A)) ? 15 : 27;
                        break;
                    case 2:
                        var B3d = "Mus";
                        B3d += "t have at lea";
                        B3d += "st ";
                        B3d += "one selected stream";
                        (l = k.config,
                        m = k.player,
                        n = k.rn,
                        q = k.Dua,
                        r = k.IZa,
                        u = k.el.first);
                        (0,
                        c.assert)(n, B3d);
                        (v = n.Zc,
                        w = n.Da);
                        Q18 = 4;
                        break;
                    case 22:
                        Q18 = ++z < x.length ? 21 : 20;
                        break;
                    case 3:
                        return new g.ih(n);
                        break;
                    case 35:
                        B = z;
                        Q18 = 20;
                        break;
                    case 26:
                        Q18 = z < x.length - 1 && A > k.z2c * y * m.playbackRate ? 25 : 20;
                        break;
                    case 25:
                        y = m.buffer;
                        C = y.yl - y.Ld;
                        Q18 = 23;
                        break;
                    case 14:
                        (y = n.bitrate,
                        A = k = undefined);
                        w ? (k = l.xdc,
                        A = Math.max(.1, 1 - l.RUb) * Math.pow(Math.min(1, (m.buffer.yl - m.buffer.Ld) / l.Tk), l.QUb),
                        A = n.Db ? n.Db.sb.Fa * A : 0) : (k = l.wdc,
                        A = n.sb || 0);
                        (z = (0,
                        c.hn)(x, function(D) {
                            var q$k;
                            q$k = 2;
                            for (; q$k !== 1; ) {
                                switch (q$k) {
                                case 4:
                                    return D.isEqual(n);
                                    break;
                                case 2:
                                    return D.isEqual(n);
                                    break;
                                }
                            }
                        }),
                        B = z);
                        Q18 = 11;
                        break;
                    case 34:
                        return new g.ih(k);
                        break;
                    case 23:
                        Q18 = (n.Ta && n.Ta.length || w) && m.Ky && C > k.GB && (undefined === q || Number(r) > q || y.fl - q > k.qT) ? 22 : 20;
                        break;
                    case 17:
                        Q18 = 0 <= q ? 16 : 20;
                        break;
                    case 21:
                        Q18 = (q = x[z],
                        q.oI && A > k.z2c * q.bitrate * m.playbackRate) ? 35 : 22;
                        break;
                    case 19:
                        Q18 = z && A < k.Uoc * y * m.playbackRate ? 18 : 26;
                        break;
                    case 9:
                        l.vJ.some(function(D) {
                            var L4H, F, H, J, M, E, G;
                            L4H = 2;
                            for (; L4H !== 9; ) {
                                switch (L4H) {
                                case 4:
                                    x = u.filter(function(K) {
                                        var G7k, L;
                                        G7k = 2;
                                        for (; G7k !== 5; ) {
                                            switch (G7k) {
                                            case 2:
                                                L = K.bitrate;
                                                return L >= H && L <= J && 0 <= E.indexOf(K.Zc) && L * F / 8 < M;
                                                break;
                                            }
                                        }
                                    });
                                    L4H = 3;
                                    break;
                                case 5:
                                    (F = (D = D.override) && D.minRequiredAudioBuffer || l.i2,
                                    H = D && D.minAudioBitrate || -Infinity,
                                    J = D && D.maxAudioBitrate || Infinity,
                                    M = m.buffer.ru || Infinity);
                                    L4H = 4;
                                    break;
                                case 1:
                                    L4H = G ? 5 : 3;
                                    break;
                                case 3:
                                    return G;
                                    break;
                                case 2:
                                    (E = D.profiles,
                                    G = E && 0 <= E.indexOf(v));
                                    L4H = 1;
                                    break;
                                }
                            }
                        });
                        k = n;
                        Q18 = 6;
                        break;
                    case 4:
                        Q18 = !(l && l.cq && 0 <= l.cq.indexOf(v)) ? 3 : 9;
                        break;
                    case 11:
                        Q18 = 0 > z ? 10 : 19;
                        break;
                    case 20:
                        k = x[B];
                        Q18 = 34;
                        break;
                    case 18:
                        W60rd.V3W(0);
                        q = W60rd.i2_(1, z);
                        Q18 = 17;
                        break;
                    case 10:
                        B = 0;
                        Q18 = 20;
                        break;
                    case 6:
                        Q18 = x && 1 < x.length ? 14 : 34;
                        break;
                    case 15:
                        B = q;
                        Q18 = 20;
                        break;
                    }
                }
            }
}

