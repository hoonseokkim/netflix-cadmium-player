/**
 * Netflix Cadmium Playercore - Module 12986
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: bA, j8
 */

// Webpack module 12986
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const bA = b.j8 = undefined;
d = a(25320);  // import from Module_25320
(function(c) {
    c[c.hF = 0] = "primary";
    c[c.iS = 1] = "fallback";
}
)(p || (export const j8 = p = {}));
t = (function() {
    function c(g, f) {
        var e, h;
        undefined === f && (f = false);
        h = this;
        this.fpa = f;
        this.filters = (e = {},
        e[p.hF] = [],
        e[p.iS] = [],
        e);
        Array.isArray(g) ? g.forEach(function(k) {
            return h.and(k, p.hF);
        }) : this.and(g);
    }
    c.prototype.and = function(g, f) {
        undefined === f && (f = p.hF);
        g !== d.PP && this.filters[f].push({
            filter: g,
            evb: true
        });
        return this;
    }
    ;
    c.prototype.or = function(g, f) {
        undefined === f && (f = p.hF);
        this.filters[f].push({
            filter: g,
            evb: false
        });
        return this;
    }
    ;
    c.prototype.filter = function(g) {
        var f;
        f = this;
        [p.hF, p.iS].forEach(function(e) {
            f.filters[e] = f.filters[e].filter(function(h) {
                return g(e, h.filter);
            });
        });
    }
    ;
    c.prototype.Oh = function(g, f, e, h) {
        var k;
        k = this;
        return [p.hF, p.iS].reduce(function(l, m) {
            return k.filters[m].reduce(function(n, q) {
                q.evb ? n = q.filter.Oh(n, f, e, h) : 0 === n.length && (n = q.filter.Oh(g, f, e, h));
                return n;
            }, l);
        }, g);
    }
    ;
    return c;
}
)();
b.bA =

// Detected exports: bA, j8
