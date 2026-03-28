/**
 * Netflix Cadmium Playercore - Module 88774
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: Ukb
 */

// Webpack module 88774
// Parameters: t (module), b (exports), a (require)

var d, p;
export const Ukb = undefined;
t = a(22970);  // import from Module_22970
d = a(42486);  // import from Module_42486
a(36911);
p = t.__importDefault(a(10690));
t.__importDefault(a(32260));
a = (function() {
    function c() {
        this.s3a = {};
        this.zOb = {};
    }
    c.prototype.Rac = function(g, f) {
        if (!(f instanceof d.Cla))
            throw new p.default("Incorrect key data type " + f + ".");
        this.s3a[g] = f;
    }
    ;
    c.prototype.hDb = function(g) {
        return this.s3a[g];
    }
    ;
    c.prototype.Hyc = function(g) {
        return this.zOb[g];
    }
    ;
    c.prototype.clear = function() {
        this.s3a = {};
        this.zOb = {};
    }
    ;
    return c;
}
)();
b.Ukb =

// Detected exports: Ukb
