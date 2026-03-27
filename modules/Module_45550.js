/**
 * Netflix Cadmium Playercore - Module 45550
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 45550
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.gP = void 0;
d = a(15913);
p = a(52571);
t = (function() {
    function c(g) {
        this.config = g;
        this.reset();
    }
    c.instance = function() {
        (0,
        p.assert)(void 0 !== c.mA);
        return c.mA;
    }
    ;
    c.Kic = function(g) {
        c.mA = new c(g);
    }
    ;
    c.prototype.push = function(g) {
        this.Nl && this.Nl.push(g);
    }
    ;
    c.prototype.Db = function() {
        if (this.Nl)
            return (this.Nl.op(),
            this.Nl.kk([.25, .5, .75, .9, .95, .99]).map(function(g) {
                return g ? parseFloat(g.toFixed(1)) : 0;
            }));
    }
    ;
    c.prototype.reset = function() {
        this.config.brc && this.config.bGa && (this.Nl = new d.TDigest(this.config.bGa.c,this.config.bGa.maxc));
    }
    ;
    return c;
}
)();
b.gP = t;


// Detected exports: gP