/**
 * Netflix Cadmium Playercore - Module 94810
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: Fld, kHc
 */

// Webpack module 94810
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Fld(e) {
    f = e;
}
;
export function kHc(e) {
    return d.__awaiter(this, undefined, undefined, function() {
        return d.__generator(this, function() {
            if (f)
                return [2, f(e)];
            if ("js" === e.ZSa)
                return [2, (0,
                p.nIb)({
                    zPa: e.XSa,
                    sxa: "ella-object",
                    version: c.Ama,
                    filename: e.pyb,
                    oTb: e.qyb
                })];
            if ("wasm" === e.ZSa)
                return [2, (0,
                p.nIb)({
                    zPa: e.XSa,
                    sxa: "ella-object-wasm",
                    version: g.Ama,
                    filename: e.pyb,
                    oTb: e.qyb
                })];
            throw Error(("Unknown ella implementation '").concat(e.ZSa, "'. Must be 'js' or 'wasm'."));
        });
    });
}
;
d = a(22970);  // import from Module_22970
p = a(15410);  // import from Module_15410
c = a(90808);  // import from Module_90808
g = a(1663

// Detected exports: Fld, kHc
