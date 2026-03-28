/**
 * Netflix Cadmium Playercore - Module 75948
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Hka
 */

// Webpack module 75948
// Parameters: t, b

export const Hka = undefined;
t = (function() {
    function a(d) {
        this.name = d;
        a.nC[d] = this;
    }
    a.prototype.toString = function() {
        return this.name;
    }
    ;
    a.pca = function(d) {
        return a.nC[d] ? a.nC[d] : null;
    }
    ;
    a.nC = {};
    return a;
}
)();
b["default"] = t;
b.Hka = {
    dCa: new t("ASYMMETRIC_WRAPPED"),
    D_b: new t("DIFFIE_HELLMAN"),
    Z8c: new t("JWE_LADDER"),
    $8c: new t("JWK_LADDER"),
    Cad: new t("SYMMETRIC_WRAPPED")
};

// Detected exports: Hka
