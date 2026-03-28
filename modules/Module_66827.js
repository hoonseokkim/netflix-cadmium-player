/**
 * Netflix Cadmium Playercore - Module 66827
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: kEa
 */

// Webpack module 66827
// Parameters: t, b

var a;
export const kEa = undefined;
a = {
    0: "early",
    1: "late"
};
t = (function() {
    function d(p) {
        undefined === p && (p = 4E3);
        this.X8b = p;
        this.reset(0);
    }
    d.prototype.Lqb = function(p, c) {
        var g;
        p = Math.max(p, this.$l);
        c -= p;
        if (!(0 > c)) {
            g = this.XMa[+(p - this.$l > this.X8b)];
            g.count++;
            g.Jt += c;
            c > g.max && (g.max = c,
            g.yd = p);
        }
    }
    ;
    d.prototype.Bsa = function() {
        var g;
        for (var p = {}, c = 0; c < this.XMa.length; c++) {
            g = this.XMa[c];
            g.count && (p[a[c]] = {
                Hkd: g.yd,
                Lid: g.max,
                qcd: Math.round(g.Jt / g.count)
            });
        }
        return p;
    }
    ;
    d.prototype.reset = function(p) {
        this.XMa = [{
            Jt: 0,
            max: 0,
            yd: 0,
            count: 0
        }, {
            Jt: 0,
            max: 0,
            yd: 0,
            count: 0
        }];
        this.$l = p;
    }
    ;
    return d;
}
)();
export const kEa = t;

// Detected exports: kEa
