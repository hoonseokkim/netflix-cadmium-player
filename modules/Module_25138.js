/**
 * Netflix Cadmium Playercore - Module 25138
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: n5b, nJa
 */

// Webpack module 25138
// Parameters: t (module), b (exports), a (require)

var c, g, f, e;
function d(h, k, l, m) {
    this.Ia = h;
    this.HUc = k;
    this.va = l;
    this.Hi = m;
    this.Pf = {};
}
function p(h, k) {
    this.Jh = h;
    this.Hi = k;
    this.xa = {};
    this.va = h.zb("PlaybackMilestoneStoreImpl");
}
export const n5b = b.nJa = undefined;
t = a(22970);  // import from Module_22970
c = a(22674);  // import from Module_22674
g = a(87386);  // import from Module_87386
f = a(81918);  // import from Module_81918
e = a(5021);  // import from Module_05021
p.prototype.xTc = function(h, k) {
    this.xa[h] && this.va.warn("registerPlayback: xid " + h + " already registered, overriding");
    k = (k ? k : this.Hi.Fc()).na(e.Ba);
    this.va.trace("registerPlayback: xid " + h + " at " + k);
    this.xa[h] = new d(h,k,this.va,this.Hi);
    return this.xa[h];
}
;
p.prototype.yyc = function(h) {
    this.xa[h] || this.va.warn("getPlaybackMilestones: xid " + h + " is not registered");
    return this.xa[h];
}
;
p.prototype.TTc = function(h) {
    this.va.trace("removePlayback: xid " + h);
    delete this.xa[h];
}
;
a = p;
export const nJa = a;
b.nJa = a = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(g.Bb)), t.__param(1, (0,
c.v)(f.re))], a);
d.prototype.Yv = function(h, k) {
    k = k ? k.na(e.Ba) : this.Hi.Fc().na(e.Ba) - this.HUc;
    this.va.trace("addMilestone: xid " + this.Ia + " " + h + " at " + k);
    this.Pf[h] = k;
}
;
b.n5b =

// Detected exports: n5b, nJa
