/**
 * Netflix Cadmium Playercore - Module 26502
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: rz
 * Dependencies: 13550, 19188, 65161, 91176
 * Purpose: Audio handling, Configuration, Playback control, ABR/Quality selection
 */

// import dep_13550 from './Module_13550.js';
// import dep_19188 from './Module_19188.js';
// import dep_65161 from './Module_65161.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 26502
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(91176);
p = a(65161);
c = a(13550);
g = a(19188);
t = (function() {
    var C4I;
    function f(h, k) {
        var K2m, l, m;
        K2m = 2;
        for (; K2m !== 13; ) {
            switch (K2m) {
            case 6:
                return Math.floor(h.d + (l.d - h.d) * (k - h.r) / (l.r - h.r));
                break;
            case 8:
                W60rd.N4Z(0);
                h = l[W60rd.w9O(1, m)];
                l = l[m];
                K2m = 6;
                break;
            case 14:
                return h.$s;
                break;
            case 9:
                return l[l.length - 1].d;
                break;
            case 3:
                K2m = -1 === m ? 9 : 8;
                break;
            case 4:
                return l[0].d;
                break;
            case 5:
                K2m = 0 === m ? 4 : 3;
                break;
            case 1:
                (l = h.rM,
                m = (0,
                d.hn)(l, function(n) {
                    var W2n;
                    W2n = 2;
                    for (; W2n !== 1; ) {
                        switch (W2n) {
                        case 2:
                            return k <= n.r;
                            break;
                        case 4:
                            return k >= n.r;
                            break;
                        }
                    }
                }));
                K2m = 5;
                break;
            case 2:
                K2m = h.rM ? 1 : 14;
                break;
            }
        }
    }
    C4I = 2;
    function e(h, k) {
        var w7o, l;
        w7o = 2;
        for (; w7o !== 4; ) {
            switch (w7o) {
            case 2:
                k.some(function(m) {
                    var d77, n;
                    d77 = 2;
                    for (; d77 !== 4; ) {
                        switch (d77) {
                        case 2:
                            n = m.profiles;
                            (n = n && 0 <= n.indexOf(h)) && (l = m.override);
                            return n;
                            break;
                        }
                    }
                });
                return l;
                break;
            }
        }
    }
    for (; C4I !== 5; ) {
        switch (C4I) {
        case 2:
            var x39 = "1";
            x39 += "SIYbZrNJC";
            x39 += "p9";
            x39;
            return {
                HNa: function(h) {
                    var O1Q, k, l, m, n, q, r;
                    O1Q = 2;
                    for (; O1Q !== 9; ) {
                        switch (O1Q) {
                        case 2:
                            (k = h.config,
                            l = h.player,
                            m = h.Lw);
                            h = h.el.first;
                            O1Q = 5;
                            break;
                        case 5:
                            (n = new c.ih(),
                            q = Math.max(k.Uy, k.HT),
                            r = (0,
                            c.hAa)(h[0].L, k.oT) && m ? (0,
                            g.tDb)(h, k) : Infinity);
                            n.Bd = (0,
                            d.kc)(h.filter(function(u) {
                                var q8g, v, w;
                                q8g = 2;
                                for (; q8g !== 9; ) {
                                    switch (q8g) {
                                    case 12:
                                        return (u.cw ? u.cw < v : ~8) || w;
                                        break;
                                    case 3:
                                        return (u.cw ? u.cw <= v : true) && w;
                                        break;
                                    case 2:
                                        (v = u.fj(p.l.V)) ? (v = v.Zc,
                                        v = k && k.cq && 0 <= k.cq.indexOf(v) ? e(v, k.vJ) : e(v, k.Aoa)) : v = undefined;
                                        v = v ? null !== (w = v.maxInitAudioBitrate) && undefined !== w ? w : k.$u : k.$u;
                                        w = u.Pt ? u.Pt <= k.IB : true;
                                        q8g = 3;
                                        break;
                                    }
                                }
                            }).filter(function(u) {
                                var O96;
                                O96 = 2;
                                for (; O96 !== 1; ) {
                                    switch (O96) {
                                    case 2:
                                        return u.Pt && u.Pt <= r;
                                        break;
                                    }
                                }
                            }).reverse(), function(u) {
                                var r1J, w, v;
                                r1J = 2;
                                for (; r1J !== 8; ) {
                                    switch (r1J) {
                                    case 5:
                                        w = u.bitrate * l.playbackRate;
                                        r1J = 4;
                                        break;
                                    case 2:
                                        v = u.sb;
                                        r1J = 1;
                                        break;
                                    case 3:
                                        return v;
                                        break;
                                    case 1:
                                        r1J = u.bitrate > q ? 5 : 9;
                                        break;
                                    case 9:
                                        var F8_ = "no_his";
                                        F8_ += "to";
                                        F8_ += "rical_lte_minbitrate";
                                        var a5O = "hist_tput_lt_";
                                        a5O += "min";
                                        a5O += "bitrate";
                                        var X4A = "lt_";
                                        X4A += "hist_";
                                        X4A += "lte_m";
                                        X4A += "in";
                                        X4A += "bitrate";
                                        v && u.bitrate * l.playbackRate <= v ? (n.Lu = v,
                                        n.reason = X4A,
                                        v = true) : v ? (n.Lu = v,
                                        n.reason = a5O,
                                        v = false) : (n.reason = F8_,
                                        v = true);
                                        r1J = 3;
                                        break;
                                    case 4:
                                        var q8y = "hi";
                                        q8y += "st";
                                        q8y += "_buf";
                                        q8y += "ft";
                                        q8y += "ime";
                                        v ? (u = f(k, w),
                                        w = (0,
                                        c.ktb)(k.Pp, w * k.CT),
                                        (0,
                                        c.AKb)(w, v) <= u ? (n.Lu = v,
                                        n.reason = q8y,
                                        v = true) : v = false) : v = false;
                                        r1J = 3;
                                        break;
                                    }
                                }
                            }) || h[0];
                            return n;
                            break;
                        }
                    }
                }
            };
            break;
        }
    }
}
)().HNa;
export const rz = t;

// Detected exports: rz
