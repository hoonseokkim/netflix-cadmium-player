/**
 * Netflix Cadmium Playercore - Module 70494
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: Ijb
 */

// Webpack module 70494
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ijb = undefined;
t = (function() {
    function a(d) {
        this.console = d;
        this.CQa();
    }
    a.prototype.get = function(d) {
        return this.o_[d] || this.fi[d];
    }
    ;
    a.prototype.set = function(d, p) {
        undefined === this.fi[d] && (this.fi[d] = p);
    }
    ;
    a.prototype.nXc = function(d, p) {
        undefined === this.get(d) && (this.o_[d] = p);
    }
    ;
    a.prototype.clear = function(d) {
        this.qub(d);
        this.fi[d] = undefined;
    }
    ;
    a.prototype.qub = function(d) {
        this.o_[d] = undefined;
    }
    ;
    a.prototype.Hhc = function(d) {
        var p;
        this.fi = (p = {},
        p[d] = this.fi[d],
        p);
        this.o_ = {};
    }
    ;
    a.prototype.CQa = function() {
        this.fi = {};
        this.o_ = {};
    }
    ;
    a.prototype.toJSON = function() {
        return {
            fi: this.fi,
            o_: this.o_
        };
    }
    ;
    return a;
}
)();
export const Ijb = t;

// Detected exports: Ijb
