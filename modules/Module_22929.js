/**
 * Netflix Cadmium Playercore - Module 22929
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 */

// Webpack module 22929
// Parameters: t (module), b (exports), a (require)

var d;
d = a(72632);  // import from Module_72632
t = (function() {
    function p(c, g, f, e, h) {
        this.id = d.id();
        this.ti = c;
        this.V2 = g;
        this.RI = f;
        this.target = h;
        this.xQa = [];
        this.k$ = Array.isArray(e) ? e : [e];
        this.DUc = null === f ? new Map() : null;
    }
    p.prototype.Jqb = function(c, g, f) {
        c = new p(c,this.V2,this,g,f);
        this.xQa.push(c);
        return c;
    }
    ;
    return p;
}
)();
b.Request =

