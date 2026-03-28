/**
 * Netflix Cadmium Playercore - Module 23512
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: GDa
 */

// Webpack module 23512
// Parameters: t (module), b (exports), a (require)

var p;
function d() {
    var g;
    function c(f, e) {
        var h, k;
        h = this;
        k = typeof e;
        if ("object" === k || "function" === k)
            if (((k = (0,
            p.kc)(g, function(l) {
                return l.object === h;
            })) ? (g.splice(k.index + 1),
            k.key = f) : g.push({
                index: g.length,
                key: f,
                object: this
            }),
            f = (0,
            p.kc)(g, function(l) {
                return l.object === e;
            })))
                (f = g.slice(0, f.index).map(function(l) {
                    return l.key;
                }).join("."),
                e = ("[Cycle Detected: ").concat(f.length ? " " + f : f, "]"),
                c.state.ZRa = true);
        return e;
    }
    g = [];
    c.state = {
        ZRa: false
    };
    return c;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const GDa = undefined;
p = a(27192);  // import from Module_27192
b.GDa = (function() {
    function c() {}
    c.stringify = function(g) {
        var f;
        f = d();
        return [JSON.stringify(g, f), f.state];
    }
    ;
    return c;
}
)

// Detected exports: GDa
