/**
 * Netflix Cadmium Playercore - Module 28867
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: PJb
 */

// Webpack module 28867
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const PJb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
export function PJb(c, g) {
    var f;
    if (c || g) {
        f = (null === c || undefined === c ? 0 : c.rules) && (null === g || undefined === g ? 0 : g.rules) ? (0,
        p.XY)(c.rules, g.rules) : (null === c || undefined === c ? undefined : c.rules) || (null === g || undefined === g ? undefined : g.rules);
        return d.__assign(d.__assign(d.__assign({}, c), g), {
            rules: f
        });
    }
}

// Detected exports: PJb
