/**
 * Netflix Cadmium Playercore - Module 13904
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports: UCa, WGa; Dependencies: [91176]
 * Original signature: function(t, b, a)
 */

// Webpack module 13904
// Parameters: t (module), b (exports), a (require)
var d;

d = a(91176);
export const UCa = {
    Oh: function(p) {
        return p.filter(function(c) {
            return c.Fp && !c.Go;
        });
    }
};
export const WGa = {
    Oh: function(p) {
        return (p = (0,
        d.kc)(p, function(c) {
            return !!c.Fp && !c.Go;
        })) ? [p] : [];
    }
};
