/**
 * Netflix Cadmium Playercore - Module 29727
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: dPb, WYa, h0b
 */

// Webpack module 29727
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    return !(null === f || undefined === f || !f.signal);
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const h0b = b.WYa = undefined;
b.$gd = d;
export function dPb(f, e) {
    return p.__awaiter(this, arguments, undefined, function(h, k, l) {
        var m, n;
        undefined === l && (l = false);
        return p.__generator(this, function(q) {
            switch (q.label) {
            case 0:
                return (m = d(h) ? h.signal : h,
                n = (0,
                c.ooa)(m, !l),
                [4, Promise.race([n, Promise.resolve(k)])]);
            case 1:
                return [2, q.T()];
            }
        });
    });
}
;
p = a(22970);  // import from Module_22970
c = a(43155);  // import from Module_43155
g = a(43529);  // import from Module_43529
a(86823);
export function WYa(f) {
    return "function" === typeof (null === f || undefined === f ? undefined : f.then);
}
;
t = (function() {
    function f() {}
    f.prototype.nO = function(e) {
        (0,
        g.assert)(this.J8b);
        this.J8b.nO(e);
    }
    ;
    return f;
}
)();
b.h0b =

// Detected exports: dPb, WYa, h0b
