/**
 * Netflix Cadmium Playercore - Module 36974
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: Wcb
 */

// Webpack module 36974
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Wcb = undefined;
d = a(95316);  // import from Module_95316
p = a(91176);  // import from Module_91176
t = (function() {
    function c() {}
    c.prototype.MRb = function(g) {
        var f, e, h, k;
        e = g.profile;
        h = g.frameRate;
        g = null !== (f = (0,
        p.kc)(d.NJ, function(l) {
            return d.Mia[l].test(e);
        })) && undefined !== f ? f : "h264hpl";
        f = d.QO[g].some(function(l) {
            return (0,
            d.DUa)(h, d.zba[l]);
        }) ? h : null;
        if (!f) {
            k = {
                $: h.$ / 2,
                O: h.O
            };
            f = d.QO[g].some(function(l) {
                return (0,
                d.DUa)(k, d.zba[l]);
            }) ? k : null;
        }
        f || (f = d.zba[d.QO[g][0]]);
        return {
            profile: g,
            frameRate: f
        };
    }
    ;
    return c;
}
)();
b.Wcb =

// Detected exports: Wcb
