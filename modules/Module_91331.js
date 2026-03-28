/**
 * Netflix Cadmium Playercore - Module 91331
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: sma
 */

// Webpack module 91331
// Parameters: t, b

export const sma = undefined;
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
b.sma = {
    zEa: new t("EMAIL_PASSWORD"),
    cbd: new t("USER_ID_TOKEN")
};

// Detected exports: sma
