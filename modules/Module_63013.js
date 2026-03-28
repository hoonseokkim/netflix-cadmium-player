/**
 * Netflix Cadmium Playercore - Module 63013
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: tCa
 */

// Webpack module 63013
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h, k) {
    var l;
    l = e.Wo.call(this) || this;
    l.$a = h;
    l.paused = false;
    l.hy = function() {
        var m, n, q;
        n = l.Dc.Cq.value;
        q = l.Dc.aB();
        n && q ? (n = null === (m = q.XK) || undefined === m ? undefined : m.vc.id,
        m = l.paused,
        l.paused = l.j.paused.value,
        m !== l.paused && (l.paused ? (l.Kxa = l.$a.Fc(),
        l.D9 = q.position.offset.G,
        l.va.debug("Ad " + n + " paused at " + l.D9 + " ms into the ad")) : undefined !== l.Kxa && undefined !== l.D9 && (q = l.$a.Fc().da(l.Kxa).na(f.Ba),
        l.va.debug("Ad " + n + " resumed. Pause duration: " + q),
        l.trace.push([l.D9, q]),
        l.D9 = undefined,
        l.Kxa = undefined))) : l.unsubscribe();
    }
    ;
    l.va = k.zb("AdPauseStateTracker");
    return l;
}
export const tCa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(81918);  // import from Module_81918
g = a(87386);  // import from Module_87386
f = a(5021);  // import from Module_05021
e = a(87144);  // import from Module_87144
Ia(d, e.Wo);
d.prototype.start = function(h) {
    e.Wo.prototype.start.call(this, h);
    this.BE || (this.j.paused.addListener(this.hy),
    this.BE = true);
}
;
d.prototype.Rsa = function() {
    return {
        pauseTrace: this.trace
    };
}
;
d.prototype.xga = function() {
    this.D9 = undefined;
    this.paused = this.j.paused.value;
    this.Kxa = undefined;
    this.trace = [];
}
;
d.prototype.unsubscribe = function() {
    e.Wo.prototype.unsubscribe.call(this);
    this.j.paused.removeListener(this.hy);
}
;
a = d;
export const tCa = a;
b.tCa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.re)), t.__param(1, (0,
p.v)(g.Bb))],

// Detected exports: tCa
