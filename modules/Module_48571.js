/**
 * Netflix Cadmium Playercore - Module 48571
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: gIa
 */

// Webpack module 48571
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const gIa = undefined;
t = (function() {
    function a(d, p, c, g) {
        var f;
        f = this;
        this.properties = d;
        this.transform = p;
        this.EA = c;
        this.state = g;
        this.Gb();
        d.forEach(function(e) {
            return e.addListener(f.n1a);
        });
        this.n1a();
    }
    a.prototype.clear = function() {
        var d;
        d = this;
        this.properties.forEach(function(p) {
            return p.removeListener(d.n1a);
        });
    }
    ;
    a.prototype.bGb = function(d) {
        return undefined !== d.equal;
    }
    ;
    a.prototype.Gb = function() {
        var d;
        d = this;
        this.n1a = function() {
            var p, c;
            p = d.state;
            c = d.properties.map(function(g) {
                return g.value;
            });
            d.state = d.transform(c);
            (d.bGb(d.state) && d.bGb(p) ? d.state.equal(p) : p === d.state) || d.EA(d.state);
        }
        ;
    }
    ;
    return a;
}
)();
export const gIa = t;

// Detected exports: gIa
