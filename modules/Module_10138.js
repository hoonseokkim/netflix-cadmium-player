/**
 * Netflix Cadmium Playercore - Module 10138
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: Nkb
 */

// Webpack module 10138
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Nkb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
c = a(63616);  // import from Module_63616
g = a(71913);  // import from Module_71913
f = a(73548);  // import from Module_73548
t = (function() {
    function e(h) {
        var k;
        k = this;
        this.type = c.mK.RESPONSE_TIME_BUCKET_PERCENTILES;
        this.stop = this.start = this.YK = p.eh;
        this.getState = p.oN;
        this.Jg = p.nN;
        this.Me = this.CZa = 0;
        this.sx = new f.kDa(h);
        this.vA = new g.vja(h.ro,{
            fxa: p.eh,
            A2: function() {
                k.sx.zra();
            },
            D2: function() {
                k.sx.ETb();
            }
        });
    }
    e.prototype.DSb = function(h) {
        this.CZa = h;
    }
    ;
    e.prototype.aL = function(h) {
        !isFinite(h) || 0 > h || (this.Me++,
        this.vA.Mgc(this.CZa),
        this.sx.drb(h));
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
        this.Me = this.CZa = 0;
    }
    ;
    return e;
}
)();
b.Nkb =

// Detected exports: Nkb
