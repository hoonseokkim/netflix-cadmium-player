/**
 * Netflix Cadmium Playercore - Module 6298
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: wmb
 */

// Webpack module 6298
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const wmb = undefined;
d = a(91176);  // import from Module_91176
p = a(63616);  // import from Module_63616
c = a(71913);  // import from Module_71913
t = (function() {
    function g(f) {
        var e;
        e = this;
        this.type = p.mK.THROUGHPUT_SWITCHES;
        this.stop = this.start = this.aL = d.eh;
        this.getState = d.oN;
        this.Jg = d.nN;
        this.wR = this.caa = 0;
        this.Efa = undefined;
        this.Me = this.p$ = this.Kha = 0;
        this.config = f;
        this.vA = new c.vja(f.ro,{
            fxa: function(h, k) {
                e.caa += h;
                e.wR += k;
            },
            A2: function() {
                e.zra();
            },
            D2: function() {
                e.caa = 0;
                e.wR = 0;
            }
        });
    }
    g.prototype.YK = function(f, e, h) {
        0 >= f || h <= e || (this.Me++,
        this.vA.$G(f, e, h));
    }
    ;
    g.prototype.flush = function() {
        0 < this.wR && this.vA.flush();
    }
    ;
    g.prototype.Wq = function() {
        return {
            Kha: this.Kha,
            p$: this.p$,
            Me: this.Me
        };
    }
    ;
    g.prototype.reset = function() {
        this.vA.reset();
        this.wR = this.caa = 0;
        this.Efa = undefined;
        this.Me = this.p$ = this.Kha = 0;
    }
    ;
    g.prototype.zra = function() {
        var f, e, h;
        if (0 !== this.wR) {
            f = 8 * this.caa / this.wR;
            this.p$++;
            if (undefined !== this.Efa) {
                e = Math.abs(f - this.Efa);
                h = e >= this.config.$Na;
                e >= this.Efa * this.config.U3a && h && this.Kha++;
            }
            this.Efa = f;
        }
    }
    ;
    return g;
}
)();
b.wmb =

// Detected exports: wmb
