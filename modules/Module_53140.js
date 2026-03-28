/**
 * Netflix Cadmium Playercore - Module 53140
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: nG
 */

// Webpack module 53140
// Parameters: t (module), b (exports), a (require)

var d, p, c;
export const nG = undefined;
t = a(22970);  // import from Module_22970
d = t.__importDefault(a(1966));
p = t.__importDefault(a(36114));
c = t.__importDefault(a(48795));
b.nG = (function() {
    function g() {}
    g.register = function(f, e) {
        e ? g.Ata[f] = e : delete g.Ata[f];
    }
    ;
    g.IXc = function(f) {
        if (1 > f)
            throw new RangeError("The maximum deflate ratio must be at least one.");
        g.G_a = f;
    }
    ;
    g.SVa = function() {
        return g.G_a;
    }
    ;
    g.op = function(f, e) {
        var h, k;
        h = g.Ata[f];
        if (!h)
            throw new d.default(p.default.bnb,f);
        try {
            k = h.op(e);
            return k && k.length < e.length ? k : null;
        } catch (l) {
            if (l instanceof c.default)
                throw new d.default(p.default.YZb,"algo " + f,l);
            throw l;
        }
    }
    ;
    g.GJ = function(f, e) {
        var h;
        h = g.Ata[f];
        if (!h)
            throw new d.default(p.default.bnb,f);
        try {
            return h.GJ(e, g.G_a);
        } catch (k) {
            if (k instanceof c.default)
                throw new d.default(p.default.G6b,"algo " + f,k);
            throw k;
        }
    }
    ;
    g.Ata = {};
    g.G_a = 200;
    return g;
}
)

// Detected exports: nG
