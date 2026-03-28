/**
 * Netflix Cadmium Playercore - Module 26540
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: Oua
 * Original signature: function(t, b)
 */

// Webpack module 26540
// Parameters: t (module), b (exports)
export function Oua(a) {
    var p;
    function d() {
        p || (p = a());
        return p;
    }
    p = undefined;
    d.clear = function() {
        p = undefined;
    }
    ;
    d.xEb = function() {
        return undefined !== p;
    }
    ;
    return d;
}
;
