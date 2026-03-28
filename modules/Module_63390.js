/**
 * Netflix Cadmium Playercore - Module 63390
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: LHa
 */

// Webpack module 63390
// Parameters: t (module), b (exports), a (require)

var p;
function d() {
    var c;
    c = this;
    this.ready = false;
    this.mKc = new Promise(function(g) {
        c.YUc = g;
    }
    );
}
export const LHa = undefined;
t = a(22970);  // import from Module_22970
a = a(22674);  // import from Module_22674
d.prototype.nKc = function(c) {
    this.ready || (this.YUc(c),
    this.ready = true);
}
;
d.prototype.Ws = function() {
    return this.ready;
}
;
p = d;
export const LHa = p;
b.LHa = p = t.__decorate([(0,
a.aa)()],

// Detected exports: LHa
