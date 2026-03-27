/**
 * Netflix Cadmium Playercore - Module 29217
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 29217
// Parameters: t (module), b (exports), a (require)

var d;

d = a(22970);
t = (function() {
    function p(c, g, f) {
        var e, h, k;
        this.ht = c;
        "HYBRID" === c ? this.kB = f : "CCSP" === c && (this.CF = null !== (e = g.CF) && undefined !== e ? e : 0,
        this.QD = null !== (h = g.QD) && undefined !== h ? h : 0,
        this.sF = null !== (k = g.sF) && undefined !== k ? k : 0);
    }
    Object.defineProperties(p.prototype, {
        gPb: {
            get: function() {
                var c;
                return "HYBRID" === this.ht ? [null !== (c = this.kB.Nn) && undefined !== c ? c : 0] : "CCSP" === this.ht ? [this.CF, this.QD, this.sF] : [];
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.iKb = function() {
        return Math.min(this.CF, this.QD, this.sF);
    }
    ;
    p.prototype.jua = function() {
        return this.gPb.some(function(c) {
            return 0 < c;
        });
    }
    ;
    p.prototype.R4a = function(c) {
        return new p(this.ht,{
            CF: c * this.CF,
            QD: c * this.QD,
            sF: c * this.sF
        });
    }
    ;
    p.prototype.F_a = function(c, g, f, e) {
        var h;
        h = 8 * c / Math.max(f - g, 1);
        if (!this.jua())
            return false;
        c = this.gPb.map(function(k) {
            return Math.abs(h - k) / k;
        });
        return Math.min.apply(Math, d.__spreadArray([], d.__read(c), false)) < e;
    }
    ;
    return p;
}
)();
export const GX = t;

// Detected exports: GX