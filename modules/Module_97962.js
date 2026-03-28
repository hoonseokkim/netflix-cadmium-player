/**
 * Netflix Cadmium Playercore - Module 97962
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Encryption / cryptography
 * Exports: Phb
 */

// Webpack module 97962
// Parameters: t, b

export const Phb = undefined;
t = (function() {
    function a() {}
    a.prototype.encrypt = function(d, p, c, g) {
        g.result(d);
    }
    ;
    a.prototype.decrypt = function(d, p, c) {
        c.result(d);
    }
    ;
    a.prototype.QF = function(d, p, c, g) {
        g.result(d);
    }
    ;
    a.prototype.KO = function(d, p, c, g) {
        g.result(d);
    }
    ;
    a.prototype.sign = function(d, p, c, g) {
        g.result(new Uint8Array(0));
    }
    ;
    a.prototype.verify = function(d, p, c, g) {
        g.result(true);
    }
    ;
    return a;
}
)();
export const Phb = t;

// Detected exports: Phb
