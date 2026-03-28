/**
 * Netflix Cadmium Playercore - Module 48603
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: Pab
 */

// Webpack module 48603
// Parameters: t (module), b (exports), a (require)

var d;
export const Pab = undefined;
d = a(22970).__importDefault(a(10690));
t = (function() {
    function p() {}
    p.prototype.encrypt = function(c, g, f, e) {
        e.result(c);
    }
    ;
    p.prototype.decrypt = function(c, g, f) {
        f.result(c);
    }
    ;
    p.prototype.QF = function(c, g, f, e) {
        e.error(new d.default("Wrap is unsupported by the MSL token crypto context."));
    }
    ;
    p.prototype.KO = function(c, g, f, e) {
        e.error(new d.default("Unwrap is unsupported by the MSL token crypto context."));
    }
    ;
    p.prototype.sign = function(c, g, f, e) {
        e.result(new Uint8Array(0));
    }
    ;
    p.prototype.verify = function(c, g, f, e) {
        e.result(false);
    }
    ;
    return p;
}
)();
b.Pab =

// Detected exports: Pab
