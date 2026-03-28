/**
 * Netflix Cadmium Playercore - Module 49310
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: kLa
 */

// Webpack module 49310
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.config = f;
}
export const kLa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(4203);  // import from Module_04203
g = a(3887);  // import from Module_03887
d.prototype.HRc = function(f, e, h, k) {
    this.config().NWc && (f = f.metrics,
    undefined !== f && f.segment !== f.srcsegment && (h = {
        isBranching: k || undefined,
        isPlaygraph: !k || undefined,
        mid: e.R,
        xid: e.Ia,
        srcxid: h.Ia,
        srcmid: h.R,
        segment: f.segment,
        srcsegment: f.srcsegment,
        srcsegmentduration: f.srcsegmentduration,
        srcoffset: f.srcoffset,
        srcMoffms: f.srcMoffms,
        srcvbitrate: f.srcvbitrate,
        srcvmaf: f.srcvmaf,
        srcVdlid: f.srcVdlid,
        destMoffms: f.destMoffms,
        destvbitrate: f.destvbitrate,
        destvmaf: f.destvmaf,
        destVdlid: f.destVdlid,
        auxMid: f.auxMid,
        auxMidType: f.auxMidType,
        auxSrcmid: f.auxSrcmid,
        auxSrcmidType: f.auxSrcmidType,
        seamlessRequested: f.seamlessRequested,
        transitionType: f.transitionType,
        transitionTypeAtRequest: f.transitionTypeAtRequest,
        nextExitPositionAtRequest: f.nextExitPositionAtRequest,
        delayToTransition: f.delayToTransition,
        durationOfTransition: f.durationOfTransition,
        atRequest: f.atRequest,
        atTransition: f.atTransition,
        discard: f.discard,
        adBreakLocationMs: f.adBreakLocationMs,
        srcadBreakLocationMs: f.srcadBreakLocationMs,
        adBreakTriggerId: f.adBreakTriggerId,
        srcadBreakTriggerId: f.srcadBreakTriggerId,
        srcmaxvencodingbitrate: f.srcmaxvencodingbitrate,
        srcmaxvencodingreason: f.srcmaxvencodingreason,
        destmaxvencodingbitrate: f.destmaxvencodingbitrate,
        destmaxvencodingreason: f.destmaxvencodingreason
    },
    h.moffms = e.j && e.bg && e.R !== e.bg ? (0,
    g.hi)(e.j.VBb()) : (0,
    g.hi)(e.Gs),
    e.WM.lb.transition(h)));
}
;
a = d;
export const kLa = a;
b.kLa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Pc))],

// Detected exports: kLa
