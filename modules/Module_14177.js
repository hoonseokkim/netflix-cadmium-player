/**
 * Netflix Cadmium Playercore - Module 14177
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: yCa
 */

// Webpack module 14177
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h, k) {
    var l;
    l = e.Wo.call(this) || this;
    l.Jh = h;
    l.aSa = k;
    l.hy = function() {
        var m, n;
        m = l.Dc.Cq.value;
        n = l.Dc.aB();
        m && n ? (m = l.trace[l.trace.length - 1],
        n = n.position.offset.G,
        m && m[0] === n && l.trace.pop(),
        (m = l.trace[l.trace.length - 1]) && m[1] === l.j.j_ || l.trace.push([n, l.j.j_])) : l.unsubscribe();
    }
    ;
    l.va = h.zb("AdVolumeTracker");
    l.BTa = k((0,
    f.ri)(1));
    return l;
}
export const yCa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(34043);  // import from Module_34043
g = a(87386);  // import from Module_87386
f = a(5021);  // import from Module_05021
e = a(87144);  // import from Module_87144
Ia(d, e.Wo);
d.prototype.start = function(h) {
    e.Wo.prototype.start.call(this, h);
    this.BE || (this.j.volume.addListener(this.Xpa),
    this.j.muted.addListener(this.Xpa),
    this.BE = true);
}
;
d.prototype.Rsa = function() {
    return {
        volumeChangeTrace: this.trace,
        volume: this.j.j_
    };
}
;
d.prototype.xga = function() {
    this.trace = [];
}
;
d.prototype.unsubscribe = function() {
    e.Wo.prototype.unsubscribe.call(this);
    this.j.volume.removeListener(this.Xpa);
    this.j.muted.removeListener(this.Xpa);
}
;
a = d;
export const yCa = a;
b.yCa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.Bb)), t.__param(1, (0,
p.v)(c.Uja))],

// Detected exports: yCa
