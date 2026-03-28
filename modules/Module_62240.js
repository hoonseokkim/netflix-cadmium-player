/**
 * Netflix Cadmium Playercore - Module 62240
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 */

// Webpack module 62240
// Parameters: t (module), b (exports), a (require)

var d;
d = a(25640);  // import from Module_25640
t = (function() {
    function p() {
        this.kh = new Map();
    }
    p.prototype.xCb = function() {
        return this.kh;
    }
    ;
    p.prototype.add = function(c, g) {
        var f;
        if (null === c || undefined === c)
            throw Error(d.L7);
        if (null === g || undefined === g)
            throw Error(d.L7);
        f = this.kh.get(c);
        undefined !== f ? (f.push(g),
        this.kh.set(c, f)) : this.kh.set(c, [g]);
    }
    ;
    p.prototype.get = function(c) {
        if (null === c || undefined === c)
            throw Error(d.L7);
        c = this.kh.get(c);
        if (undefined !== c)
            return c;
        throw Error(d.Zeb);
    }
    ;
    p.prototype.remove = function(c) {
        if (null === c || undefined === c)
            throw Error(d.L7);
        if (!this.kh.delete(c))
            throw Error(d.Zeb);
    }
    ;
    p.prototype.JTc = function(c) {
        var g;
        g = this;
        this.kh.forEach(function(f, e) {
            f = f.filter(function(h) {
                return !c(h);
            });
            0 < f.length ? g.kh.set(e, f) : g.kh.delete(e);
        });
    }
    ;
    p.prototype.lEb = function(c) {
        if (null === c || undefined === c)
            throw Error(d.L7);
        return this.kh.has(c);
    }
    ;
    p.prototype.clone = function() {
        var c;
        c = new p();
        this.kh.forEach(function(g, f) {
            g.forEach(function(e) {
                return c.add(f, e.clone());
            });
        });
        return c;
    }
    ;
    p.prototype.M1c = function(c) {
        this.kh.forEach(function(g, f) {
            c(f, g);
        });
    }
    ;
    return p;
}
)();
b.m2b =

