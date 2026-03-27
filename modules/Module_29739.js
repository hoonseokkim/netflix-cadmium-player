/**
 * Netflix Cadmium Playercore - Module 29739
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 29739
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.cKa = void 0;
d = a(22970);
t = (function() {
    function p(c) {
        this.um = c;
        this.ic = p.ic;
        this.enabled = !0;
        this.wQa = new Map();
    }
    p.prototype.qCc = function(c, g) {
        this.wQa.set(c, {
            id: g || "",
            Rza: c
        });
    }
    ;
    p.prototype.Ph = function(c) {
        var g;
        g = Array.from(this.wQa.values()).map(function(f) {
            var e;
            e = f.id;
            f = f.Rza.Ph(c.Ui, c.Xs);
            return [e, f];
        }).filter(function(f) {
            return (f = d.__read(f, 2)[1]) && Object.keys(f).length;
        });
        if (g.length)
            return {
                nUc: g.map(function(f) {
                    return {
                        id: f[0],
                        report: f[1]
                    };
                })
            };
    }
    ;
    p.prototype.WPb = function(c) {
        this.wQa.delete(c);
    }
    ;
    p.ic = "wrapped-reporter";
    return p;
}
)();
b.cKa = t;


// Detected exports: cKa