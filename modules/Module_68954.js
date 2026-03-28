/**
 * Netflix Cadmium Playercore - Module 68954
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: DRM / content protection
 * Exports: ndc, n4c, NJ, e4c, pdc, zoa
 */

// Webpack module 68954
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const ndc = b.mdc = b.odc = b.ldc = b.zoa = b.pdc = b.l4c = b.Mia = b.e4c = b.NJ = b.n4c = b.QO = undefined;
d = a(85017);  // import from Module_85017
Object.defineProperties(b, {
    QO: {
        enumerable: true,
        get: function() {
            return d.QO;
        }
    }
});
export const n4c = ["padding"];
export const NJ = ["h264", "h264hpl", "hevc-main10", "av1"]  /* config: h264 = "h264hpl", "hevc-main10", "av1" */;
export const e4c = ["16:9", "4:3"];
b.Mia = {
    h264: /h264mpl/,
    h264hpl: /h264hpl/,
    "hevc-main10": /hevc-main10/,
    av1: /av1/
};
b.l4c = {
    h264: "playready-h264mpl30-dash",
    h264hpl: "playready-h264hpl30-dash",
    "hevc-main10": "hevc-main10-L30-dash-cenc-prk-do",
    av1: "av1-main-L30-dash-cbcs-prk"
};
export const pdc = ["silence"];
export const zoa = ["heaac", "ddp", "xheaac"]  /* config: heaac = "ddp", "xheaac" */;
b.ldc = {
    heaac: [64, 96, 128],
    xheaac: [32, 64, 96, 192],
    ddp: [192, 256, 384, 448, 640]
};
b.odc = {
    xheaac: {
        32: "xheaac-dash",
        64: "xheaac-dash",
        96: "xheaac-dash",
        192: "xheaac-dash"
    },
    heaac: {
        64: "heaac-2-dash",
        96: "heaac-2-dash",
        128: "heaac-2hq-dash"
    },
    ddp: {
        192: "ddplus-5.1-dash",
        256: "ddplus-5.1hq-dash",
        384: "ddplus-5.1hq-dash",
        448: "ddplus-5.1hq-dash",
        640: "ddplus-5.1hq-dash"
    }
};
b.mdc = {
    xheaac: {
        32: "2.0",
        64: "2.0",
        96: "2.0",
        192: "2.0"
    },
    heaac: {
        64: "2.0",
        96: "2.0",
        128: "2.0"
    },
    ddp: {
        192: "5.1",
        256: "5.1",
        384: "5.1",
        448: "5.1",
        640: "5.1"
    }
};
b.ndc = {
    xheaac: {
        $: 2048,
        O: 48E3
    },
    heaac: {
        $: 1024,
        O: 24E3
    },
    ddp: {
        $: 1536,
        O: 48E3
    }

// Detected exports: ndc, n4c, NJ, e4c, pdc, zoa
