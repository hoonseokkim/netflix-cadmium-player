/**
 * Netflix Cadmium Playercore - Module 4969
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ar
 * Dependencies: 13550, 91176, 98301
 * Purpose: Configuration, Playback control, ABR/Quality selection
 */

// import dep_13550 from './Module_13550.js';
// import dep_91176 from './Module_91176.js';
// import dep_98301 from './Module_98301.js';

// Webpack module 4969
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(91176);
p = a(13550);
c = a(98301);
export const Ar = (function() {
    var N5l;
    N5l = 2;
    for (; N5l !== 5; ) {
        switch (N5l) {
        case 2:
            var N5W = "1S";
            N5W += "I";
            N5W += "YbZrN";
            N5W += "JCp";
            N5W += "9";
            N5W;
            return {
                Ar: function(f) {
                    var Y01;
                    Y01 = 2;
                    for (; Y01 !== 1; ) {
                        switch (Y01) {
                        case 2:
                            var j9t = "pla";
                            j9t += "y";
                            j9t += "in";
                            j9t += "g";
                            return j9t === f.config.s$ ? (0,
                            c.Uf)(f) : g(f);
                            break;
                        }
                    }
                }
            };
            break;
        }
    }
    function g(f) {
        var Z0j, u, h, k, l, m, n, q, r;
        Z0j = 2;
        function e(v) {
            var D7z, w;
            D7z = 2;
            for (; D7z !== 8; ) {
                switch (D7z) {
                case 1:
                    D7z = !w || (v.bitrate > n ? h.VWb : 1) * v.bitrate * k.playbackRate > w ? 5 : 4;
                    break;
                case 5:
                    return false;
                    break;
                case 4:
                    var S$J = "buff_lt";
                    S$J += "_h";
                    S$J += "i";
                    S$J += "s";
                    S$J += "t";
                    r = S$J;
                    u = w;
                    return true;
                    break;
                case 2:
                    w = v.sb;
                    D7z = 1;
                    break;
                }
            }
        }
        for (; Z0j !== 27; ) {
            switch (Z0j) {
            case 20:
                u = null === m || undefined === m ? undefined : m.sb;
                Z0j = 18;
                break;
            case 2:
                var J4K = "Mu";
                J4K += "st have at ";
                J4K += "least one selected";
                J4K += " stream";
                (h = f.config,
                k = f.player,
                l = f.el,
                m = f.rn);
                (0,
                d.assert)(m, J4K);
                l = l.first;
                n = m.bitrate;
                f = m;
                Z0j = 9;
                break;
            case 19:
                var e2C = "select_feasible_";
                e2C += "bu";
                e2C += "ffer";
                e2C += "ing";
                r = e2C;
                Z0j = 20;
                break;
            case 9:
                Z0j = m.sb ? 8 : 18;
                break;
            case 12:
                Z0j = undefined === m ? 11 : 19;
                break;
            case 18:
                l = new p.ih();
                l.Bd = m;
                f.Oa !== m.Oa && (l.reason = r,
                l.Lu = u);
                return l;
                break;
            case 11:
                m = l[0];
                Z0j = 10;
                break;
            case 8:
                q = undefined;
                q = (0,
                d.hn)(l, function(v) {
                    var a8_;
                    a8_ = 2;
                    for (; a8_ !== 1; ) {
                        switch (a8_) {
                        case 4:
                            return v.isEqual(m);
                            break;
                        case 2:
                            return v.isEqual(m);
                            break;
                        }
                    }
                });
                q = Math.max(q, 0);
                q = Math.min(q + (h.xrb ? 2 : 1), l.length);
                Z0j = 13;
                break;
            case 13:
                m = (0,
                d.kc)(l.slice(0, q).reverse(), e);
                Z0j = 12;
                break;
            case 10:
                var m3w = "fa";
                m3w += "llb";
                m3w += "ack_lowest_acceptable_str";
                m3w += "eam";
                r = m3w;
                Z0j = 20;
                break;
            }
        }
    }
}
)().Ar;

// Detected exports: Ar
