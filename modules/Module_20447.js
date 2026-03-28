/**
 * Netflix Cadmium Playercore - Module 20447
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: hyc, fyc, gyc
 */

// Webpack module 20447
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
export function hyc(f) {
    return Object.assign(Object.assign({}, (0,
    g.Lba)()), {
        sy: "O",
        zu: f.Tta ? "NFCDOP-AP-" : f.bda ? "NFCDOP-AT-" : f.YS ? "NFCDOP-PH-" : "NFCDOP-01-",
        DL: "opera-cadmium"
    });
}
;
export function fyc(f) {
    var e, h, k, l, m, n;
    e = (0,
    g.Kba)();
    h = Object.assign(Object.assign({}, e), {
        ND: true,
        LL: true,
        gW: true
    });
    k = [p.H.$J];
    l = [p.H.ZW];
    m = {
        minimumCores: 3
    };
    n = {
        minimumCores: 5
    };
    f.zE ? (h.yi = [].concat(Ba((0,
    c.az).apply(null, [e.yi].concat(Ba(k)))), Ba((0,
    c.Tf)([p.H.zx, p.H.Bx].concat(Ba(k), [p.H.Dx, p.H.Fx]), m))),
    h.fk = [].concat(Ba((0,
    c.az).apply(null, [e.fk].concat(Ba(l)))), Ba((0,
    c.Tf)([p.H.yx, p.H.Ax].concat(Ba(l), [p.H.Cx, p.H.Ex]), m)))) : (h.yi = [].concat(Ba((0,
    c.az).apply(null, [e.yi].concat(Ba(k)))), Ba((0,
    c.Tf)([p.H.zx, p.H.Bx].concat(Ba(k), [p.H.Dx, p.H.Fx]), n))),
    h.fk = [].concat(Ba((0,
    c.az).apply(null, [e.fk].concat(Ba(l)))), Ba((0,
    c.Tf)([p.H.yx, p.H.Ax].concat(Ba(l), [p.H.Cx, p.H.Ex]), n))));
    return h;
}
;
export function gyc(f) {
    var e;
    e = {
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
        useEncryptedEvent: false,
        retainSbrOnFade: true,
        enableFullHdForSWDRM: true
    };
    67 <= f.gw && (e = Object.assign(Object.assign({}, e), {
        enableAV1: true,
        enablePRK: true
    }));
    return e;
}
;
d = a(56800);  // import from Module_56800
p = a(75568);  // import from Module_75568
c = a(88195);  // import from Module_88195
g = a(6423

// Detected exports: hyc, fyc, gyc
