/**
 * Netflix Cadmium Playercore - Module 24251
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 */

// Webpack module 24251
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.C$a = undefined;
d = a(91176);  // import from Module_91176
t = (function() {
    function p(c) {
        this.config = c;
    }
    p.prototype.GRc = function(c) {
        var g, f, e;
        g = this.config;
        f = [];
        e = [];
        c.forEach(function(n, q) {
            undefined === n.Wb ? e.push(q) : f.push(q);
        });
        if (0 !== e.length)
            for (var h = -1, k = -1, l = function(n) {
                var q, r, u, v, w, x;
                q = e[n];
                r = c[q];
                if (0 === n || q !== e[n - 1] + 1)
                    (h = f[(0,
                    d.Vrb)(f, function(y) {
                        return y < q;
                    })] || -1,
                    k = f[(0,
                    d.hn)(f, function(y) {
                        return y > q;
                    })] || -1);
                u = 0;
                v = g.OIc;
                n = 0;
                w = g.PIc;
                -1 < k && (v = c[k].bitrate,
                w = c[k].Wb);
                -1 < h && (n = c[h].Wb,
                u = c[h].bitrate);
                v = Math.log(v);
                u = 0 === u ? 0 : Math.log(u);
                x = Math.log(r.bitrate);
                r.jra = Math.max(0, Math.min(110, Math.round((n * (v - x) + w * (x - u)) / (v - u) * 100) / 100));
            }, m = 0; m < e.length; m++)
                l(m);
    }
    ;
    return p;
}
)();
b.C$a =

