/**
 * Netflix Cadmium Playercore - Module 19787
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 13550, 22970, 48170, 75498, 91176
 * Purpose: Logging, Configuration, Playback control, ABR/Quality selection
 */

// import dep_13550 from './Module_13550.js';
// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_75498 from './Module_75498.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 19787
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
d = a(22970);
p = a(91176);
c = a(48170);
g = a(13550);
t = a(75498);
t = (function(f) {
    var F82;
    F82 = 2;
    for (; F82 !== 4; ) {
        switch (F82) {
        case 2:
            d.return e;
            break;
        }
    }
    function e() {
        var b3p, h;
        b3p = 2;
        for (; b3p !== 4; ) {
            switch (b3p) {
            case 2:
                var B64 = "1";
                B64 += "SIY";
                B64 += "bZr";
                B64 += "NJC";
                B64 += "p9";
                h = f.call(this) || this;
                B64;
                return h;
                break;
            case 9:
                h = f.call(this) && this;
                "";
                return h;
                break;
            }
        }
    }
}
)(t.cA);
b["default"] = t;
class e extends f {
    constructor() {
        var b3p, h;
        b3p = 2;
        for (; b3p !== 4; ) {
            switch (b3p) {
            case 2:
                var B64 = "1";
                B64 += "SIY";
                B64 += "bZr";
                B64 += "NJC";
                B64 += "p9";
                h = f.call(this) || this;
                B64;
                return h;
                break;
            case 9:
                h = f.call(this) && this;
                "";
                return h;
                break;
            }
        }
    }
    Uf(h) {
                var Y1d, k, l, m, q, r, u, v, n;
                Y1d = 2;
                for (; Y1d !== 27; ) {
                    switch (Y1d) {
                    case 3:
                        var z8K = "Playback stre";
                        z8K += "am";
                        z8K += " selection";
                        c.u && g.console.log(z8K);
                        l = new g.ih(h);
                        m = m.first;
                        Y1d = 7;
                        break;
                    case 6:
                        Y1d = -1 < h ? 14 : 17;
                        break;
                    case 2:
                        var J9A = "player missing fr";
                        J9A += "a";
                        J9A += "gm";
                        J9A += "entInde";
                        J9A += "x";
                        var C07 = "n";
                        C07 += "um";
                        C07 += "ber";
                        var F2t = "Must have";
                        F2t += " a";
                        F2t += "t";
                        F2t += " least one selected stream";
                        (k = h.config,
                        l = h.player,
                        m = h.el);
                        h = h.rn;
                        (0,
                        p.assert)(h, F2t);
                        (0,
                        p.assert)(C07 === typeof l.Ve, J9A);
                        Y1d = 3;
                        break;
                    case 7:
                        W60rd.N4Z(21);
                        var K8s = W60rd.i2_(18, 18, 1, 343);
                        h = m.length - K8s;
                        Y1d = 6;
                        break;
                    case 12:
                        var U8H = ", fea";
                        U8H += "si";
                        U8H += "bl";
                        U8H += "e";
                        U8H += "=";
                        var y8Y = ", ";
                        y8Y += "th";
                        y8Y += "resh";
                        y8Y += "old=";
                        var o04 = ", ";
                        o04 += "b";
                        o04 += "itrate=";
                        var J5y = ": through";
                        J5y += "p";
                        J5y += "ut=";
                        var o1o = "Str";
                        o1o += "e";
                        o1o += "a";
                        o1o += "m";
                        o1o += " ";
                        (q = n.Db.sb.Fa,
                        r = k.a1c,
                        u = n.bitrate,
                        v = u < q - r);
                        c.u && g.console.log(o1o + h + J5y + q + o04 + u + y8Y + r + U8H + v);
                        Y1d = 10;
                        break;
                    case 18:
                        var y6K = ". Ski";
                        y6K += "pping";
                        y6K += ".";
                        var G_5 = "Cannot ";
                        G_5 += "obtain tput stats for";
                        G_5 += " stream ";
                        c.u && g.console.log(G_5 + h + y6K);
                        Y1d = 19;
                        break;
                    case 17:
                        var p57 = "Threshold policy selec";
                        p57 += "ted stre";
                        p57 += "am 0 (no feasi";
                        p57 += "bl";
                        p57 += "e streams).";
                        l.Bd = m[0];
                        c.u && g.console.log(p57);
                        return l;
                        break;
                    case 13:
                        Y1d = n.Db && n.Db.sb ? 12 : 18;
                        break;
                    case 20:
                        var z6m = "Threshold ";
                        z6m += "polic";
                        z6m += "y";
                        z6m += " selected strea";
                        z6m += "m ";
                        return (c.u && g.console.log(z6m + h),
                        l.Bd = n,
                        l);
                        break;
                    case 10:
                        Y1d = v ? 20 : 19;
                        break;
                    case 14:
                        n = m[h];
                        Y1d = 13;
                        break;
                    case 19:
                        --h;
                        Y1d = 6;
                        break;
                    }
                }
            }
}

