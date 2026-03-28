/**
 * Netflix Cadmium Playercore - Module 20615
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: umb
 */

// Webpack module 20615
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const umb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
c = a(63616);  // import from Module_63616
g = a(71913);  // import from Module_71913
f = a(73548);  // import from Module_73548
t = (function() {
    function e(h) {
        var k;
        k = this;
        this.type = c.mK.THROUGHPUT_BUCKET_PERCENTILES;
        this.stop = this.start = this.aL = p.eh;
        this.getState = p.oN;
        this.Jg = p.nN;
        this.Me = 0;
        this.sx = new f.kDa(h);
        this.vA = new g.vja(h.ro,{
            fxa: function(l, m) {
                k.sx.drb(8 * l / m);
            },
            A2: function() {
                k.sx.zra();
            },
            D2: function() {
                k.sx.ETb();
            }
        });
    }
    e.prototype.YK = function(h, k, l) {
        0 >= h || l <= k || (this.Me++,
        this.vA.$G(h, k, l));
    }
    ;
    e.prototype.flush = function() {
        this.sx.sEb && this.vA.flush();
    }
    ;
    e.prototype.Wq = function() {
        return d.__assign(d.__assign({}, this.sx.Wq()), {
            Me: this.Me
        });
    }
    ;
    e.prototype.reset = function() {
        this.vA.reset();
        this.sx.reset();
        this.Me = 0;
    }
    ;
    return e;
}
)();
b.umb =

// Detected exports: umb
