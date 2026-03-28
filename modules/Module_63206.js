/**
 * Netflix Cadmium Playercore - Module 63206
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Jmb
 */

// Webpack module 63206
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Jmb = undefined;
t = (function() {
    function a() {}
    a.prototype.CM = function(d, p) {
        var c;
        p = p(d);
        this.nua(d) && (p.At = null !== (c = p.At) && undefined !== c ? c : true);
        return p;
    }
    ;
    a.prototype.sZ = function(d, p) {
        p = p(d);
        this.nua(d) && (p.vaa = 0);
        return p;
    }
    ;
    a.prototype.nua = function(d) {
        d = d.response;
        if (!d.ok && (0 === d.status || 900 === d.status))
            return true;
    }
    ;
    return a;
}
)();
export const Jmb = t;

// Detected exports: Jmb
