/**
 * Netflix Cadmium Playercore - Module 81954
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: UQb
 */

// Webpack module 81954
// Parameters: t, b

function a(d, p, c, g) {
    var e;
    if (Array.isArray(d))
        d.forEach(function(h, k) {
            h = a(h, p, d, k.toString());
            undefined !== h ? d[k] = h : delete d[k];
        });
    else if (null !== d && "object" === typeof d)
        for (var f in d)
            if (d.hasOwnProperty(f)) {
                e = a(d[f], p, d, f);
                undefined !== e ? d[f] = e : delete d[f];
            }
    return p.call(c, g, d);
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const UQb = undefined;
export function UQb(d, p) {
    null !== d && "object" === typeof d && a(d, p, undefined, "");
}
;

// Detected exports: UQb
