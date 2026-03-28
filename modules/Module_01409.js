/**
 * Netflix Cadmium Playercore - Module 1409
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: Nlb
 */

// Webpack module 1409
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Nlb = undefined;
d = a(62411);  // import from Module_62411
t = (function() {
    function p(c) {
        this.Rk = c;
    }
    p.prototype.nonce = function(c) {
        var g;
        g = this.Rk.rpa(c);
        switch (g.type) {
        case "nonce":
            return g.nonce;
        case "unauthorized":
            throw (0,
            d.hnb)(c);
        }
    }
    ;
    p.prototype.response = function(c, g) {
        return JSON.stringify(this.Rk.Cdc({
            encryptedNonce: g,
            aleToken: c
        }));
    }
    ;
    p.prototype.validate = function(c) {
        var g;
        if ("AUTHENTICATED" === (null === (g = c.payload) || undefined === g ? undefined : g.aleResponseState))
            return true;
        throw (0,
        d.VEa)(c);
    }
    ;
    return p;
}
)();
b.Nlb =

// Detected exports: Nlb
