/**
 * Netflix Cadmium Playercore - Module 52496
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: VC
 */

// Webpack module 52496
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const VC = undefined;
d = a(22970);  // import from Module_22970
b.VC = (function() {
    function p() {}
    p.wy = function(c, g) {
        undefined === g && (g = {
            includeStack: true
        });
        return "function" === typeof (null === c || undefined === c ? undefined : c.wy) ? c.wy() : c instanceof Error ? d.__assign(d.__assign({}, c), {
            name: c.name,
            message: c.message,
            stack: g.includeStack ? c.stack : undefined
        }) : c;
    }
    ;
    return p;
}
)

// Detected exports: VC
