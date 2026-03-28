/**
 * Netflix Cadmium Playercore - Module 26012
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: xKa
 */

// Webpack module 26012
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const xKa = undefined;
d = a(91967);  // import from Module_91967
t = (function() {
    function p() {
        this.um = this.ic = p.ic;
        this.enabled = true;
        this.Bga = [];
        this.JQb = 0;
    }
    p.prototype.Tac = function(c) {
        this.Bga.push(c);
        5 < this.Bga.length && this.Bga.shift();
    }
    ;
    p.prototype.Uac = function() {
        this.JQb++;
    }
    ;
    p.prototype.Ph = function(c) {
        var g;
        g = c.Ui;
        c = c.Xs;
        if ((g === d.Sc.Gm || g === d.Sc.Mr || g === d.Sc.Wj || undefined === g && undefined === c) && this.Bga.length)
            return {
                restarts: this.Bga.map(function(f) {
                    return {
                        s: f.AZc,
                        d: f.poc,
                        r: f.rPb,
                        atMs: f.F2a.G
                    };
                }),
                restartsCompleted: this.JQb
            };
    }
    ;
    p.ic = "seamlessManager";
    return p;
}
)();
b.xKa =

// Detected exports: xKa
