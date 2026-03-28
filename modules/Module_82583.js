/**
 * Netflix Cadmium Playercore - Module 82583
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Ejb
 */

// Webpack module 82583
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ejb = undefined;
t = (function() {
    function a(d, p) {
        this.bn = 0;
        this.filter = d;
        this.cya = p;
        this.bn = 0;
    }
    a.prototype.gea = function(d) {
        return 0 < this.cya.filter(function(p) {
            var c;
            return p === (null === (c = d.uz) || undefined === c ? undefined : c.Mh);
        }).length;
    }
    ;
    a.prototype.add = function(d, p, c, g) {
        this.gea(g) && this.filter.add(d, p, c, g);
    }
    ;
    a.prototype.start = function(d, p) {
        this.filter.start && this.gea(p) && this.filter.start(d);
    }
    ;
    a.prototype.stop = function(d, p) {
        this.filter.stop && this.gea(p) && this.filter.stop(d);
    }
    ;
    a.prototype.get = function(d) {
        if (this.filter.get)
            return this.filter.get(d);
    }
    ;
    a.prototype.flush = function() {
        this.filter.flush && this.filter.flush();
    }
    ;
    a.prototype.reset = function() {
        this.bn = 0;
        this.filter.reset && this.filter.reset();
    }
    ;
    a.prototype.vF = function(d, p) {
        this.gea(p) && (this.bn += 1,
        this.filter.vF && this.filter.vF(d, p));
    }
    ;
    a.prototype.wF = function(d, p, c) {
        this.gea(c) && (this.bn = Math.max(this.bn - 1, 0),
        0 === this.bn && this.stop(d, c),
        this.filter.wF && this.filter.wF(d, c));
    }
    ;
    return a;
}
)();
export const Ejb = t;

// Detected exports: Ejb
