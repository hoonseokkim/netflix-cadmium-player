/**
 * Netflix Cadmium Playercore - Module 22224
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Vwc, ezc, fzc, gzc
 * Dependencies: 5021, 17612, 56800, 64232, 75568, 88195
 * Purpose: DRM/License handling, Media Source Extensions, Network/HTTP, Audio handling
 */

// import dep_5021 from './Module_5021.js';
// import dep_17612 from './Module_17612.js';
// import dep_56800 from './Module_56800.js';
// import dep_64232 from './Module_64232.js';
// import dep_75568 from './Module_75568.js';
// import dep_88195 from './Module_88195.js';

// Webpack module 22224
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d() {
    return Object.assign(Object.assign({}, (0,
    h.Kba)()), {
        iL: (0,
        e.Tf)([f.Vc.ap, f.Vc.fG, f.Vc.hp]),
        yi: (0,
        e.Tf)([].concat(Ba(f.Bc.C5), Ba(f.Bc.W5), Ba(f.Bc.KW), Ba(f.Bc.LW), Ba(f.Bc.IW), Ba(f.Bc.JW), Ba(f.Bc.mDa), Ba(f.Bc.nDa), Ba(f.Bc.oDa), Ba(f.Bc.UZb))),
        fk: (0,
        e.Tf)([].concat(Ba(f.Bc.B5), Ba(f.Bc.Bja), Ba(f.Bc.Aja), Ba(f.Bc.Cja))),
        yB: g.wb.P0b,
        AI: (0,
        p.pc)(31E3)
    });
}
export function gzc(k) {
    return Object.assign(Object.assign({}, (0,
    h.Lba)()), {
        sy: "S",
        zu: k.YS ? "NFCDSF-PH-" : "NFCDSF-01-",
        DL: "safari-cadmium"
    });
}
;
export function Vwc(k) {
    return Object.assign(Object.assign({}, d(k)), {
        wBa: true,
        H_: false,
        DC: [f.gs.wma]
    });
}
;
export const ezc = d;
export function fzc(k) {
    var l;
    l = {
        delayErrorHandling: {
            7361: "100",
            7371: "100",
            7373: "100"
        },
        licenseRenewalRequestDelay: 5E3,
        addFailedLogBlobsToQueue: false,
        logUnexpectedRewindDelay: 0,
        fatalOnUnexpectedSeeking: false,
        fatalOnUnexpectedSeeked: false,
        waitForDrmToAppendMedia: true,
        forceAppendHeadersAfterDrm: true,
        videoCapabilityDetectorType: c.ks.aG,
        enableSeamless: true,
        enableCombinedPlaygraphs: true,
        enableAdPlaygraphs: true,
        forceAppendEncryptedStreamHeaderFirst: false,
        retainSbrOnFade: true,
        enableMissingSegmentsReplacement: false,
        enableMediaPrefetch: true,
        defaultHeaderCacheSize: 15,
        prepareCadmium: true,
        enableLdlPrefetch: true,
        monitorFrozenFrames: true
    };
    (0,
    h.pGb)(k, 10, 15, 5) && (l = Object.assign(Object.assign({}, l), {
        useEncryptedEvent: false,
        enablePRK: true,
        enableDV: true,
        enableHEVC: true,
        enableHDR: true,
        enableCDMAttestedDescriptors: true,
        waitForDrmToAppendMedia: false,
        forceAppendHeadersAfterDrm: false,
        enableMediaCapabilities: true,
        powerEfficientForVideo: true,
        spatialRenderingForDolbyAudio: false,
        preciseSeeking: true
    }));
    (0,
    h.pGb)(k, 10, 15, 6) && (l = Object.assign(Object.assign({}, l), {
        keyStatusFilterEnabled: true,
        enableUHD: true
    }));
    (0,
    h.TFb)(k, 16) && (l = Object.assign(Object.assign({}, l), {
        enableAV1: true
    }));
    (0,
    h.TFb)(k, 16) && !k.YS && (l = Object.assign(Object.assign({}, l), {
        enableXHEAAC: true,
        enableMediaCapabilitiesSourceBufferCheck: true
    }));
    return l;
}
;
p = a(5021);
c = a(56800);
g = a(17612);
f = a(75568);
e = a(88195);
h = a(64232);

// Detected exports: Vwc, ezc, fzc, gzc
