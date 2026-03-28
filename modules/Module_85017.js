/**
 * Netflix Cadmium Playercore - Module 85017
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: DUa, QO
 */

// Webpack module 85017
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const QO = b.zba = undefined;
export function DUa(a, d) {
    return a.$ / a.O === d.$ / d.O;
}
;
b.zba = {
    23976: {
        $: 24E3,
        O: 1001
    },
    24: {
        $: 24E3,
        O: 1E3
    },
    25: {
        $: 25E3,
        O: 1E3
    },
    2997: {
        $: 3E4,
        O: 1001
    },
    30: {
        $: 3E4,
        O: 1E3
    },
    50: {
        $: 5E4,
        O: 1E3
    },
    5994: {
        $: 6E4,
        O: 1001
    },
    60: {
        $: 6E4,
        O: 1E3
    }
};
b.QO = {
    h264: ["23976", "24", "25", "2997", "30"],
    h264hpl: ["23976", "24", "25", "2997", "30"],
    "hevc-main10": ("23976 24 25 2997 30 50 5994 60").split(" "),
    av1: ("23976 24 25 2997 30 50 5994 60").split(" ")
};

// Detected exports: DUa, QO
