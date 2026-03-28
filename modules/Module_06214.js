/**
 * Netflix Cadmium Playercore - Module 6214
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: knb
 */

// Webpack module 6214
// Parameters: t, b

function a() {
    this.searchParams = {};
}
function d(p) {
    this.zs = p;
    this.searchParams = new a();
}
export const knb = undefined;
d.prototype.toString = function() {
    return this.href;
}
;
Ha.Object.defineProperties(d.prototype, {
    href: {
        configurable: true,
        enumerable: true,
        get: function() {
            return "" + this.zs + this.searchParams.toString();
        }
    }
});
export const knb = d;
a.prototype.get = function(p) {
    return this.searchParams[p];
}
;
a.prototype.set = function(p, c) {
    this.searchParams[p] = c;
}
;
a.prototype.toString = function() {
    return Object.entries(this.searchParams).reduce(function(p, c, g) {
        var f;
        f = Fa(c);
        c = f.next().value;
        f = f.next().value;
        return "" + p + (0 == g ? "?" : "&") + c + "=" + f;
    }, "");
}
;
a.prototype.toJSON = function() {
    return this.searchParams;
}
;

// Detected exports: knb
