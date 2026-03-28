/**
 * Netflix Cadmium Playercore - Module 44133
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Sab
 */

// Webpack module 44133
// Parameters: t (module), b (exports), a (require)

var p;
function d() {}
export const Sab = undefined;
p = a(22365);  // import from Module_22365
d.jjc = function(c) {
    var g;
    if (p.$i.queryCommandSupported && p.$i.queryCommandSupported("copy")) {
        g = p.$i.createElement("textarea");
        g.textContent = c;
        g.style.position = "fixed";
        p.$i.body.appendChild(g);
        g.select();
        try {
            p.$i.execCommand("copy");
        } catch (f) {
            console.warn("Copy to clipboard failed.", f);
        } finally {
            p.$i.body.removeChild(g);
        }
    }
}
;
b.Sab =

// Detected exports: Sab
