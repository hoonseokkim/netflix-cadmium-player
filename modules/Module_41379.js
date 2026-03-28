/**
 * Netflix Cadmium Playercore - Module 41379
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ar
 * Dependencies: 10592, 13550, 19188, 57862, 91176
 * Purpose: Buffer/Segment management, Configuration, Playback control, ABR/Quality selection
 */

// import dep_10592 from './Module_10592.js';
// import dep_13550 from './Module_13550.js';
// import dep_19188 from './Module_19188.js';
// import dep_57862 from './Module_57862.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 41379
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(91176);
p = a(13550);
c = a(57862);
g = a(19188);
f = a(10592);
export const Ar = (function() {
    var G4p;
    G4p = 2;
    function e(h) {
        var Q$U, x, l, m, n, q, r, v, w, u, y;
        Q$U = 2;
        for (; Q$U !== 26; ) {
            switch (Q$U) {
            case 20:
                var x2D = "f";
                x2D += "allback_lowest_acce";
                x2D += "pta";
                x2D += "bl";
                x2D += "e_stream";
                x = x2D;
                Q$U = 19;
                break;
            case 2:
                var j_A = "Must hav";
                j_A += "e at least";
                j_A += " one selected stream";
                (l = h.config,
                m = h.player,
                n = h.el,
                q = h.Lw,
                r = h.rn);
                (0,
                d.assert)(r, j_A);
                n = n.first;
                Q$U = 4;
                break;
            case 18:
                var N8d = "sel";
                N8d += "ect_feasib";
                N8d += "le_buffering";
                x = N8d;
                Q$U = 19;
                break;
            case 12:
                r = (0,
                d.kc)(n.slice(0, v).filter(function(A) {
                    var S4Z;
                    S4Z = 2;
                    for (; S4Z !== 1; ) {
                        switch (S4Z) {
                        case 2:
                            return A.Pt && A.Pt <= w;
                            break;
                        }
                    }
                }).reverse(), k);
                Q$U = 11;
                break;
            case 9:
                Q$U = r.sb ? 8 : 17;
                break;
            case 8:
                v = undefined;
                v = (0,
                d.hn)(n, function(A) {
                    var O$I;
                    O$I = 2;
                    for (; O$I !== 1; ) {
                        switch (O$I) {
                        case 4:
                            return A.isEqual(r);
                            break;
                        case 2:
                            return A.isEqual(r);
                            break;
                        }
                    }
                });
                v = Math.max(v, 0);
                v = Math.min(v + (l.xrb ? 2 : 1), n.length);
                w = (0,
                p.hAa)(n[0].L, l.oT) && q ? (0,
                g.tDb)(n, l) : Infinity;
                Q$U = 12;
                break;
            case 4:
                u = r.bitrate;
                h = r;
                Q$U = 9;
                break;
            case 11:
                Q$U = undefined === r ? 10 : 18;
                break;
            case 17:
                q = new p.ih();
                q.Bd = r;
                h.Oa !== r.Oa && (q.reason = x,
                q.Lu = y);
                return q;
                break;
            case 10:
                r = n[0];
                Q$U = 20;
                break;
            case 19:
                y = null === r || undefined === r ? undefined : r.sb;
                Q$U = 17;
                break;
            }
        }
        function k(A) {
            var f7p, z;
            f7p = 2;
            for (; f7p !== 7; ) {
                switch (f7p) {
                case 2:
                    z = (0,
                    f.rBb)(l.cXb, A, m.Ve);
                    f7p = 1;
                    break;
                case 1:
                    A = A.sb;
                    f7p = 5;
                    break;
                case 3:
                    var D1N = "bu";
                    D1N += "f";
                    D1N += "f_l";
                    D1N += "t_his";
                    D1N += "t";
                    x = D1N;
                    y = A;
                    return true;
                    break;
                case 5:
                    f7p = !A || (z > u ? l.VWb : 1) * z * m.playbackRate > A ? 4 : 3;
                    break;
                case 4:
                    return false;
                    break;
                }
            }
        }
    }
    for (; G4p !== 5; ) {
        switch (G4p) {
        case 2:
            var M0R = "1SIY";
            M0R += "b";
            M0R += "Z";
            M0R += "rNJ";
            M0R += "Cp9";
            M0R;
            return {
                Ar: function(h) {
                    var N6o;
                    N6o = 2;
                    for (; N6o !== 1; ) {
                        switch (N6o) {
                        case 2:
                            var X_v = "p";
                            X_v += "la";
                            X_v += "yi";
                            X_v += "ng";
                            return X_v === h.config.s$ ? (0,
                            c.Uf)(h) : e(h);
                            break;
                        }
                    }
                }
            };
            break;
        }
    }
}
)().Ar;

// Detected exports: Ar
