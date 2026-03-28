/**
 * Netflix Cadmium Playercore - Module 70078
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Caching / storage
 */

// Webpack module 70078
// Parameters: t (module), b (exports), a (require)

var d, p;
d = a(5493);  // import from Module_05493
p = a(72632);  // import from Module_72632
t = (function() {
    function c(g, f) {
        this.id = p.id();
        this.bOa = false;
        this.ti = g;
        this.scope = f;
        this.type = d.Lm.X1b;
        this.pR = function() {
            return true;
        }
        ;
        this.w_ = this.YE = this.IU = this.Au = this.cache = this.$q = null;
    }
    c.prototype.clone = function() {
        var g;
        g = new c(this.ti,this.scope);
        g.bOa = false;
        g.$q = this.$q;
        g.w_ = this.w_;
        g.scope = this.scope;
        g.type = this.type;
        g.Au = this.Au;
        g.IU = this.IU;
        g.pR = this.pR;
        g.YE = this.YE;
        g.cache = this.cache;
        return g;
    }
    ;
    return c;
}
)();
b.xZb =

