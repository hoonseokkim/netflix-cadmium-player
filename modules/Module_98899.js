/**
 * Netflix Cadmium Playercore - Module 98899
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: Tjb
 */

// Webpack module 98899
// Parameters: t (module), b (exports), a (require)

var p;
function d(c) {
    this.Z = c;
    this.r5 = {};
    this.$E();
}
export const Tjb = undefined;
p = a(56819);  // import from Module_56819
d.prototype.$E = function() {
    var c;
    c = this;
    Object.values(this.Z.Qn.ba).forEach(function(g) {
        g = g.J;
        c.r5[g] || c.wFb(g);
    });
    this.pBa();
}
;
d.prototype.KS = function(c) {
    return this.r5[c];
}
;
d.prototype.sXc = function(c) {
    this.fca(c).state = p.ZP.Vcb;
    this.pBa();
}
;
d.prototype.rXc = function(c, g) {
    c = this.fca(c);
    c.state = p.ZP.Error;
    c.error = g;
    c.EQb(false);
    this.pBa();
}
;
d.prototype.iSb = function(c) {
    c = this.fca(c);
    c.state = p.ZP.l0b;
    c.EQb(true);
    this.pBa();
}
;
d.prototype.Oac = function(c, g) {
    this.fca(c).Xa = g;
}
;
d.prototype.$K = function(c, g) {
    this.fca(c).S = g;
}
;
d.prototype.fca = function(c) {
    var g;
    return null !== (g = this.KS(c)) && undefined !== g ? g : this.wFb(c);
}
;
d.prototype.wFb = function(c) {
    var g, f;
    g = undefined;
    f = new Promise(function(e, h) {
        g = function(k) {
            (k ? e : h)();
        }
        ;
    }
    );
    return this.r5[c] = {
        state: p.ZP.Lhb,
        BSc: f,
        EQb: g
    };
}
;
d.prototype.pBa = function() {
    var g;
    for (var c = this.Z.Li; c = this.Z.cca(c); ) {
        g = this.Zf(c);
        if (this.r5[g].state === p.ZP.Error)
            break;
        if (this.r5[g].state === p.ZP.Vcb)
            break;
        if (this.r5[g].state === p.ZP.Lhb)
            break;
    }
}
;
d.prototype.Zf = function(c) {
    return this.Z.Qn.ba[c].J;
}
;
b.Tjb =

// Detected exports: Tjb
