/**
 * Netflix Cadmium Playercore - Module 43522
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: AFa
 */

// Webpack module 43522
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const AFa = undefined;
d = a(22970);  // import from Module_22970
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.prototype.encode = function(g) {
        g = this.PWc(g);
        return this.opa.encrypt(g);
    }
    ;
    c.prototype.decode = function() {
        throw Error("HTTPQueryTransport does not support decoding (upstream only)");
    }
    ;
    c.prototype.PWc = function(g) {
        return Object.keys(g).map(function(f) {
            return encodeURIComponent(f) + "=" + encodeURIComponent(JSON.stringify(g[f]));
        }).join("&");
    }
    ;
    return c;
}
)(a(66026).EKa);
b.AFa =

// Detected exports: AFa
