/**
 * Netflix Cadmium Playercore - Module 77705
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 77705
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(45146);
p = a(3887);
c = a(32687);
(function() {
    var f, e, h;
    function g(k) {
        (0,
        d.ta)(undefined !== f[k]);
        return f[k];
    }
    f = {
        '"': '""',
        "\r": "",
        "\n": " "
    };
    e = /["\r\n]/g;
    h = /[", ]/;
    export function zwb(k) {
        return (0,
        c.gd)(k) ? (0,
        c.wc)(k) ? k : (0,
        c.Ri)(k) ? k.replace(e, g) : (0,
        c.RFb)(k) ? k : isNaN(k) ? "NaN" : "" : "";
    }
    ;
    export function r_a(k) {
        var l, m;
        l = zwb;
        m = "";
        (0,
        p.Qi)(k, function(n, q) {
            n = l(n) + "=" + l(q);
            h.test(n) && (n = '"' + n + '"');
            m = m ? m + ("," + n) : n;
        });
        return m;
    }
    ;
}
)();

// Detected exports: zwb, r_a