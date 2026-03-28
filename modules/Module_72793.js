/**
 * Netflix Cadmium Playercore - Module 72793
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 */

// Webpack module 72793
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.j$a = undefined;
d = a(66164);  // import from Module_66164
p = a(65161);  // import from Module_65161
c = a(7559);  // import from Module_07559
t = (function() {
    function g(f) {
        this.config = f;
    }
    g.prototype.Oh = function(f, e, h, k, l) {
        var m, n;
        m = this.config;
        n = d.platform.C0()[p.l.V];
        return f.filter(function(q) {
            var r, u;
            r = (0,
            c.gvc)(q, m);
            u = q.bitrate * r.i2 / 8 > n;
            return (l === p.Yb.Ul ? q.bitrate >= r.Ty && q.bitrate <= r.$u : q.bitrate >= r.DJc && q.bitrate <= r.sIc) && !u;
        });
    }
    ;
    return g;
}
)();
b.j$a =

