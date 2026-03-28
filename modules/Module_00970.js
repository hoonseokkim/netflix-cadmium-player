/**
 * Netflix Cadmium Playercore - Module 970
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: CRc
 */

// Webpack module 970
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
export function CRc(e, h, k) {
    var m;
    for (var l; (l = e.read(3)) !== f; ) {
        m = e.read(4);
        switch (l) {
        case c:
            (0,
            d.sRc)(e, h, k);
            break;
        case g:
            (0,
            p.tRc)(e, m, k);
            break;
        default:
            throw Error(("Unsupported AAC element ").concat(l));
        }
    }
    e.Zec();
}
;
d = a(79602);  // import from Module_79602
p = a(30109);  // import from Module_30109
c = 1;
g = 6;
f = 7

// Detected exports: CRc
