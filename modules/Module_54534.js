/**
 * Netflix Cadmium Playercore - Module 54534
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Hwc, Iwc, Jwc
 * Dependencies: 17612, 56800, 64232, 75568, 88195
 * Purpose: DRM/License handling, Network/HTTP, Video handling, Encryption/Decryption
 */

// import dep_17612 from './Module_17612.js';
// import dep_56800 from './Module_56800.js';
// import dep_64232 from './Module_64232.js';
// import dep_75568 from './Module_75568.js';
// import dep_88195 from './Module_88195.js';

// Webpack module 54534
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
export function Jwc(e) {
    return Object.assign(Object.assign({}, (0,
    g.Lba)()), {
        sy: "F",
        zu: e.zE ? "NFCDFF-MC-" : e.uB ? "NFCDFF-02-" : e.Tta ? "NFCDFF-AP-" : e.bda ? "NFCDFF-AT-" : e.YS ? "NFCDFF-PH-" : "NFCDFF-LX-",
        DL: "firefox-cadmium"
    });
}
;
export function Hwc(e) {
    var h, k, l, m;
    h = (0,
    g.Kba)();
    k = Object.assign(Object.assign({}, h), {
        ND: true,
        LL: true,
        gW: true
    });
    l = [p.H.$J];
    if (e.uB) {
        m = {
            minimumCores: 5
        };
        k.yi = [].concat(Ba((0,
        c.az).apply(null, [h.yi].concat(Ba(l)))), Ba((0,
        c.Tf)([p.H.zx, p.H.Bx].concat(Ba(l), [p.H.Dx, p.H.Fx]), m)));
        k.yi = [].concat(Ba(k.yi), Ba((0,
        c.Tf)([].concat(Ba(p.Bc.LW), Ba(p.Bc.KW), Ba(p.Bc.JW), Ba(p.Bc.IW)))));
        k.fk = [].concat(Ba(k.fk), Ba((0,
        c.Tf)([p.H.yx, p.H.Ax, p.H.Cx, p.H.Ex], m)));
    }
    e.zE && (e = {
        minimumCores: 3
    },
    k.yi = [].concat(Ba((0,
    c.az).apply(null, [h.yi].concat(Ba(l)))), Ba((0,
    c.Tf)([p.H.zx, p.H.Bx].concat(Ba(l), [p.H.Dx, p.H.Fx]), e))),
    k.fk = [].concat(Ba(k.fk), Ba((0,
    c.Tf)([p.H.yx, p.H.Ax, p.H.Cx, p.H.Ex], e))));
    return k;
}
;
export function Iwc(e) {
    var h;
    h = {
        droppedFrameRateFilterEnabled: true,
        defaultHeaderCacheSize: 15,
        enableMediaPrefetch: true,
        enableLdlPrefetch: true,
        prepareCadmium: true,
        enableSeamless: true,
        videoCapabilityDetectorType: d.ks.PW,
        enableCDMAttestedDescriptors: true,
        enablePRK: true,
        preciseSeeking: true,
        useEncryptedEvent: false,
        forceAppendEncryptedStreamHeaderFirst: false,
        retainSbrOnFade: true,
        applyProfileStreamingOffset: true
    };
    e.uB && 144 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableAvcHighHwdrm: true,
        enableHevcPrkHwdrm: true,
        microsoftClearLeadRequiresSwdrm: true,
        prepareLdlCacheMaxCount: 15,
        microsoftHwdrmRequiresHevc: true,
        microsoftHwdrmRequiresQHD: true,
        enableKeySystemRestrictor: true,
        enableCachedErrors: true,
        enableHEVC: true,
        enableHdcp: true,
        enableHDR: true,
        validateKeySystemAccess: true,
        enableFullHdForHWDRM: true,
        keySystemList: [f.wb.ijb, f.wb.xma],
        minimumMajorOsVersionForHwdrm: 0
    }));
    (e.uB || e.zE) && 125 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableFullHdForSWDRM: true,
        enableAV1: true
    }));
    134 <= e.gw && (h = Object.assign(Object.assign({}, h), {
        enableMediaCapabilities: true
    }));
    return h;
}
;
d = a(56800);
p = a(75568);
c = a(88195);
g = a(64232);
f = a(17612);

// Detected exports: Hwc, Iwc, Jwc
