/**
 * Netflix Cadmium Playercore - Module 90510
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: eia
 */

// Webpack module 90510
// Parameters: t, b

function a(p) {
    return p.match(/_/) ? "_" : p.match(/-/) ? "-" : "UPPERCASE";
}
function d(p, c) {
    switch (c) {
    case "-":
    case "_":
        return p.split(c);
    case "UPPERCASE":
        return p.replace(/[A-Z](?:[A-Z]+)(?=[A-Z][a-z])/, function(g) {
            return g.charAt(0) + g.slice(1).toLowerCase();
        }).split(/(?=[A-Z][a-z])/);
    case "AUTO":
        return d(p, a(p));
    }
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const eia = undefined;
export function eia(p, c) {
    undefined === c && (c = "AUTO");
    return d(p, c).map(function(g) {
        return g.toLowerCase();
    });
}
;

// Detected exports: eia
