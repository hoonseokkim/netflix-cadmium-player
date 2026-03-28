/**
 * Netflix Cadmium Playercore - Module 47743
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: HCa
 * Dependencies: 22970, 45691, 50247, 50468, 51440, 52571, 66164, 85254, 87225
 * Purpose: Class definition
 */

// import dep_22970 from './Module_22970.js';
// import dep_45691 from './Module_45691.js';
// import dep_50247 from './Module_50247.js';
// import dep_50468 from './Module_50468.js';
// import dep_51440 from './Module_51440.js';
// import dep_52571 from './Module_52571.js';
// import dep_66164 from './Module_66164.js';
// import dep_85254 from './Module_85254.js';
// import dep_87225 from './Module_87225.js';

// Webpack module 47743
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m;

d = a(22970);
p = a(66164);
c = a(52571);
t = a(85254);
g = d.__importDefault(a(14282));
f = a(50468);
e = a(50247);
h = p.platform.Bi;
k = a(51440);
l = a(45691);
m = a(87225);
a = (function(n) {
    var R8;
    R8 = 2;
    class q extends n {
    constructor(r, u, v, w, x, y, A, z) {
        var N4r, B;
        N4r = 2;
        for (; N4r !== 7; ) {
            switch (N4r) {
            case 3:
                u.NB = false;
                f.Xo.Gb(u, r, x, v, z);
                return u;
                break;
            case 2:
                var G0q = "m";
                G0q += "ed";
                G0q += "ia";
                var d3x = "med";
                d3x += "ia(";
                d3x += "edit)";
                var u97 = "1SIY";
                u97 += "bZrNJ";
                u97 += "Cp9";
                u97;
                B = v.pa ? d3x : G0q;
                undefined === v.responseType && (v.responseType = v.pa || h.Fg && !h.Fg.C4a.sKa ? 0 : 1);
                u = n.call(this, r, u, B, v, w, x, y, A) || this;
                N4r = 3;
                break;
            }
        }
    }
    Ey() {
                var v6H;
                v6H = 2;
                for (; v6H !== 1; ) {
                    switch (v6H) {
                    case 2:
                        return this.Uta() && n.prototype.Ey.call(this);
                        break;
                    }
                }
            }
    toString() {
                var K$X;
                K$X = 2;
                for (; K$X !== 1; ) {
                    switch (K$X) {
                    case 2:
                        var T8F = "I";
                        T8F += "D";
                        T8F += ":";
                        T8F += " ";
                        return T8F + this.pg() + ":" + f.Xo.prototype.toString.call(this);
                        break;
                    }
                }
            }
}
for (; R8 !== 9; ) {
        switch (R8) {
        case 5:
            return q;
            break;
        case 2:
            d.q.create = function(r, u, v, w, x, y, A, z) {
                var D77;
                D77 = 2;
                for (; D77 !== 8; ) {
                    switch (D77) {
                    case 4:
                        D77 = u.Zqa && r.mediaType !== g.default.pq.Ea && 0 === w.la ? 3 : 9;
                        break;
                    case 9:
                        return new q(r,v,w,x,y,u,A,z);
                        break;
                    case 2:
                        D77 = !u.Xn && w.pa ? 1 : 9;
                        break;
                    case 3:
                        var s9I = "stream mu";
                        s9I += "st";
                        s9I += " be a Live";
                        s9I += "AseStre";
                        s9I += "am";
                        return ((0,
                        c.assert)(r instanceof m.zGa, s9I),
                        new l.nja(r,v,w,x,y,u,A,z));
                        break;
                    case 1:
                        D77 = r.mediaType === g.default.pq.U && 0 < w.la ? 5 : 4;
                        break;
                    case 5:
                        return new k.z$a(r,v,w,x,y,u,A,z);
                        break;
                    }
                }
            }
            ;
            R8 = 5;
            break;
        }
    }
}
)(e.N5);
export const HCa = a;
(0,
t.Ol)(f.Xo, a, false);

// Detected exports: HCa
