/**
 * Netflix Cadmium Playercore - Module 56386
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: uCa
 */

// Webpack module 56386
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h, k) {
    var l;
    l = e.Wo.call(this) || this;
    l.aSa = k;
    l.WUc = function() {
        0 === l.trace.length ? l.hy() : l.BTa.tg(function() {
            l.hy();
        });
    }
    ;
    l.hy = function() {
        var m, n, q, r;
        m = l.Dc.Cq.value;
        n = l.Dc.aB();
        if (m && n) {
            (m = l.trace[l.trace.length - 1]) && m[0] === n.position.offset.G && l.trace.pop();
            m = l.trace[l.trace.length - 1];
            q = l.j.nv.getBoundingClientRect();
            r = q.height;
            q = q.width;
            0 < r && 0 < q && (!m || m[1] !== q || m[2] !== r) && l.trace.push([n.position.offset.G, q, r]);
        } else
            l.unsubscribe();
    }
    ;
    l.va = h.zb("AdResizeTracker");
    l.BTa = k((0,
    f.ri)(1));
    return l;
}
export const uCa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(34043);  // import from Module_34043
g = a(87386);  // import from Module_87386
f = a(5021);  // import from Module_05021
e = a(87144);  // import from Module_87144
Ia(d, e.Wo);
d.prototype.start = function(h) {
    e.Wo.prototype.start.call(this, h);
    this.BE || (this.BLb = new ResizeObserver(this.WUc),
    this.BLb.observe(this.j.nv),
    this.BE = true);
}
;
d.prototype.Rsa = function() {
    return {
        resizeTrace: this.trace.slice(1)
    };
}
;
d.prototype.xga = function() {
    this.trace = [];
}
;
d.prototype.unsubscribe = function() {
    var h;
    e.Wo.prototype.unsubscribe.call(this);
    null === (h = this.BLb) || undefined === h ? undefined : h.disconnect();
}
;
a = d;
export const uCa = a;
b.uCa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.Bb)), t.__param(1, (0,
p.v)(c.Uja))],

// Detected exports: uCa
