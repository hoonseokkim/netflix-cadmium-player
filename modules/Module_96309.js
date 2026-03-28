/**
 * Netflix Cadmium Playercore - Module 96309
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: Edb
 */

// Webpack module 96309
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Edb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.encode = function() {
        throw Error("HTTPHeaderTransport does not support encoding (downstream only)");
    }
    ;
    g.prototype.decode = function(f) {
        var e, h;
        if (f && (f = null === (e = (0,
        p.kc)(f.split(";"), function(k) {
            return 0 === k.indexOf("sc=");
        })) || undefined === e ? undefined : e.slice(3))) {
            try {
                h = this.opa.decrypt(f, true);
            } catch (k) {
                return;
            }
            try {
                return JSON.parse(h);
            } catch (k) {}
        }
    }
    ;
    return g;
}
)(a(66026).EKa);
b.Edb =

// Detected exports: Edb
