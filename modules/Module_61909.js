/**
 * Netflix Cadmium Playercore - Module 61909
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: wKa
 */

// Webpack module 61909
// Parameters: t (module), b (exports), a (require)

var c, g, f, e;
function d(h) {
    this.ao = h;
    (0,
    g.Rw)(this, "timers");
}
function p(h, k) {
    this.ao = h;
    this.lgc = k;
}
export const wKa = undefined;
t = a(22970);  // import from Module_22970
c = a(22674);  // import from Module_22674
g = a(66523);  // import from Module_66523
f = a(63368);  // import from Module_63368
e = a(5021);  // import from Module_05021
p.prototype.cancel = function() {
    this.lgc(this.ao);
}
;
d.prototype.tg = function(h) {
    return this.zr(e.ia, h);
}
;
d.prototype.zr = function(h, k) {
    var l;
    l = this.ao.setTimeout(k, h.na(e.Ba));
    return new p(this.ao,function(m) {
        m.clearTimeout(l);
    }
    );
}
;
d.prototype.gV = function(h, k) {
    var l;
    l = this.ao.setInterval(k, h.na(e.Ba));
    return new p(this.ao,function(m) {
        m.clearInterval(l);
    }
    );
}
;
a = d;
export const wKa = a;
b.wKa = a = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(f.Onb))],

// Detected exports: wKa
