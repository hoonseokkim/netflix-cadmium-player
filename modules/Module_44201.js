/**
 * Netflix Cadmium Playercore - Module 44201
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: Jbb
 */

// Webpack module 44201
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Jbb = undefined;
d = a(43529);  // import from Module_43529
p = a(50214);  // import from Module_50214
c = a(58191);  // import from Module_58191
t = (function() {
    function g(f) {
        this.wpc = f;
        this.S8a = false;
        this.MBa = new c.skb();
    }
    g.prototype.GXb = function(f, e, h) {
        var l, m;
        function k() {
            var r, u, v, w, x, y;
            r = n.pop();
            u = r.node;
            v = r.hoa;
            r = v.gQc;
            w = v.Oq;
            v = v.state;
            if (!q.MBa.has(u)) {
                r = e(u, w, r, v);
                x = r.oW;
                y = r.state;
                r.foa || q.MBa.add(u);
                m(u).forEach(function(A) {
                    var z;
                    z = A.b4c;
                    l.MBa.has(z) || (A = w + A.weight,
                    x && n.push({
                        node: z,
                        hoa: {
                            Oq: A,
                            gQc: u,
                            state: y
                        }
                    }));
                });
            }
        }
        l = this;
        m = this.wpc;
        (0,
        d.assert)(!this.S8a);
        this.S8a = true;
        this.MBa.clear();
        for (var n = new p.LP([{
            node: f,
            hoa: {
                Oq: 0,
                state: h
            }
        }],function(r, u) {
            return r.hoa.Oq - u.hoa.Oq;
        }
        ), q = this; !n.empty; )
            k();
        this.S8a = false;
    }
    ;
    return g;
}
)();
b.Jbb =

// Detected exports: Jbb
