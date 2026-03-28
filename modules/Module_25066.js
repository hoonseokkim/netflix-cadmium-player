/**
 * Netflix Cadmium Playercore - Module 25066
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Kvc, Lvc, Mvc
 * Dependencies: 17612, 56800, 64232, 75568, 88195
 * Purpose: DRM/License handling, Media Source Extensions, Network/HTTP, Video handling
 */

// import dep_17612 from './Module_17612.js';
// import dep_56800 from './Module_56800.js';
// import dep_64232 from './Module_64232.js';
// import dep_75568 from './Module_75568.js';
// import dep_88195 from './Module_88195.js';

// Webpack module 25066
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
export function Mvc(e) {
    return Object.assign(Object.assign({}, (0,
    f.Lba)()), {
        sy: e.xGb ? "T" : e.mua ? "Q" : e.dda ? "C" : "M",
        zu: e.xGb ? "NFCDTS-01-" : e.mua ? "NFCDQS-01-" : e.uB ? "NFCDCH-02-" : e.zE ? "NFCDCH-MC-" : e.dda ? "NFCDCH-01-" : e.Tta ? "NFCDCH-AP-" : e.bda ? "NFCDCH-AT-" : e.YS ? "NFCDCH-PH-" : "NFCDCH-LX-",
        DL: e.dda ? "chromeos-cadmium" : "chrome-cadmium"
    });
}
;
export function Kvc(e) {
    var h, k, l, m, n, q;
    h = (0,
    f.Kba)();
    k = Object.assign(Object.assign({}, h), {
        ND: true,
        LL: true,
        gW: true
    });
    l = [c.H.$J];
    m = [c.H.ZW];
    n = {
        minimumCores: 3
    };
    q = {
        minimumCores: 5
    };
    e.uB && (k.yi = [].concat(Ba((0,
    g.az).apply(null, [h.yi].concat(Ba(l)))), Ba((0,
    g.Tf)([c.H.zx, c.H.Bx, c.H.YO, c.H.ZO].concat(Ba(l), [c.H.Dx, c.H.Fx, c.H.$O, c.H.aP]), q))),
    k.fk = [].concat(Ba((0,
    g.az).apply(null, [h.fk].concat(Ba(m)))), Ba((0,
    g.Tf)([c.H.yx, c.H.Ax].concat(Ba(m), [c.H.Cx, c.H.Ex]), q))),
    115 <= e.gw && (k.yi = [].concat(Ba(k.yi), Ba((0,
    g.Tf)([].concat(Ba(c.Bc.W5), Ba(c.Bc.LW), Ba(c.Bc.KW), Ba(c.Bc.JW), Ba(c.Bc.IW), Ba(c.Bc.nDa), Ba(c.Bc.mDa)))))));
    e.zE && (k.yi = [].concat(Ba((0,
    g.az).apply(null, [h.yi].concat(Ba(l)))), Ba((0,
    g.Tf)([c.H.zx, c.H.Bx, c.H.YO, c.H.ZO].concat(Ba(l), [c.H.Dx, c.H.Fx, c.H.$O, c.H.aP]), n))),
    k.fk = [].concat(Ba((0,
    g.az).apply(null, [h.fk].concat(Ba(m)))), Ba((0,
    g.Tf)([c.H.yx, c.H.Ax].concat(Ba(m), [c.H.Cx, c.H.Ex]), n))));
    e.dda && (k.yi = (0,
    g.Tf)([].concat(Ba(c.Bc.C5), Ba(c.Bc.W5), Ba(c.Bc.KW), Ba(c.Bc.LW), Ba(c.Bc.IW), Ba(c.Bc.JW))),
    k.fk = (0,
    g.Tf)([].concat(Ba(c.Bc.B5), Ba(c.Bc.Bja), Ba(c.Bc.Aja), Ba(c.Bc.Cja))));
    e.GYa && (k.yi = [].concat(Ba((0,
    g.az).apply(null, [h.yi].concat(Ba(l)))), Ba((0,
    g.Tf)([c.H.zx, c.H.Bx].concat(Ba(l), [c.H.Dx, c.H.Fx]), q))),
    k.fk = [].concat(Ba((0,
    g.az).apply(null, [h.fk].concat(Ba(m)))), Ba((0,
    g.Tf)([c.H.yx, c.H.Ax].concat(Ba(m), [c.H.Cx, c.H.Ex]), q))));
    e.mua && (k.iL = (0,
    g.Tf)([c.Vc.ap, c.Vc.fG, c.Vc.hp, c.Vc.lP, c.Vc.mP, c.Vc.nP]),
    k.yi = (0,
    g.Tf)([].concat(Ba(c.Bc.C5), Ba(c.Bc.W5), Ba(c.Bc.KW), Ba(c.Bc.LW), Ba(c.Bc.IW), Ba(c.Bc.JW), Ba(c.Bc.oDa))),
    k.fk = (0,
    g.Tf)([].concat(Ba(c.Bc.B5), Ba(c.Bc.Bja), Ba(c.Bc.Aja), Ba(c.Bc.Cja))));
    return k;
}
;
export function Lvc(e) {
    var h;
    h = {
        droppedFrameRateFilterEnabled: true,
        workaroundValueForSeekIssue: 500,
        logMediaPipelineStatus: true,
        prepareCadmium: true,
        enableLdlPrefetch: true,
        captureBatteryStatus: true,
        enableMediaPrefetch: true,
        defaultHeaderCacheSize: 15,
        enableSeamless: true,
        videoCapabilityDetectorType: d.ks.PW,
        preciseSeeking: true,
        webkitDecodedFrameCountIncorrectlyReported: true,
        enableCDMAttestedDescriptors: true,
        enablePRK: true,
        useEncryptedEvent: false,
        applyProfileStreamingOffset: true,
        applyProfileTimestampOffset: true
    };
    80 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableMediaCapabilities: true,
        enableMediaCapabilitiesSourceBufferCheck: true
    }));
    e.bda && (h = Object.assign(Object.assign({}, h), {
        enableFullHdForHWDRM: true
    }));
    e.dda && (h = Object.assign(Object.assign({}, h), {
        enableHWDRM: false,
        enableHwdrmOnArm: true,
        prepareLdlCacheMaxCount: 15,
        enableFullHdForHWDRM: true,
        enableAvcHighHwdrm: true,
        enableHevcPrkHwdrm: true
    }),
    89 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableHEVC: true,
        enableHDR: true,
        enableMediaCapabilities: true,
        enableHdcp: true
    })));
    115 <= e.gw && e.uB && (h = Object.assign(Object.assign({}, h), {
        enableHWDRM: true,
        enableAvcHighHwdrm: true,
        enableHevcPrkHwdrm: true,
        prepareLdlCacheMaxCount: 15,
        microsoftClearLeadRequiresSwdrm: true,
        microsoftHwdrmRequiresHevc: true,
        microsoftHwdrmRequiresQHD: true,
        enableKeySystemRestrictor: true,
        enableCachedErrors: true,
        enableHEVC: true,
        enableHdcp: true,
        enableHDR: true,
        validateKeySystemAccess: true,
        keySystemList: [p.wb.cd, p.wb.xma],
        enableNonSeamlessTransitions: true,
        playreadySegmentTypesRequiringNonSeamlessTransitions: ["paddingToContent", "paddingToAd", "contentToAd", "adToContent"] /* paddingToContent */
    }));
    if (e.uB || e.zE)
        h = Object.assign(Object.assign({}, h), {
            enableFullHdForSWDRM: true
        });
    e.uB && 99 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableAV1: true
    }));
    e.zE && 113 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableAV1: true
    }));
    e.GYa && 113 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableAV1: true
    }));
    (e.zE || e.uB) && 113 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableXHEAAC: true
    }));
    e.mua && (h = Object.assign(Object.assign({}, h), {
        enableHWDRM: true,
        prepareCadmium: false,
        prepareLdlCacheMaxCount: 10,
        enableFullHdForHWDRM: true,
        enableSeamless: false,
        enableDDPlus51: true,
        enableDDPlusAtmos: true
    }));
    return h;
}
;
d = a(56800);
p = a(17612);
c = a(75568);
g = a(88195);
f = a(64232);

// Detected exports: Kvc, Lvc, Mvc
