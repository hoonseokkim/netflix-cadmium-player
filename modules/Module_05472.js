/**
 * Netflix Cadmium Playercore - Module 5472
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Configuration
 * Exports: TNb
 */

// Webpack module 5472
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const TNb = undefined;
b.TNb = {
    "*": {
        fzb: ["logdata"],
        rules: [{
            nk: function(a) {
                return a.QF;
            }
        }]
    },
    segmentPresenting: [{
        nk: function(a) {
            return a.QF;
        },
        config: {
            vt: ["metrics"]
        }
    }, {
        nk: function(a) {
            return a.Sd;
        }
    }, {
        nk: function(a) {
            return a.Sd;
        },
        config: {
            vt: ["metrics", "srcStartPosition"]  /* config: metrics = "srcStartPosition" */,
            ztb: true
        }
    }, {
        nk: function(a) {
            return a.Sd;
        },
        config: {
            vt: ["metrics", "srcTransitionPosition"]  /* config: metrics = "srcTransitionPosition" */,
            ztb: true
        }
    }, {
        nk: function(a) {
            return a.Sd;
        },
        config: {
            vt: ["metrics", "destPosition"]  /* config: metrics = "destPosition" */
        }
    }, {
        nk: function(a) {
            return a.Adc;
        }
    }],
    streamPresenting: [{
        nk: function(a) {
            return a.Sd;
        }
    }],
    segmentAppended: [{
        nk: function(a) {
            return a.Qga;
        }
    }],
    fragmentsMissing: [{
        nk: function(a) {
            return a.Sd;
        },
        config: {
            vt: ["nextAvailableGraphPosition"]
        }
    }]
};

// Detected exports: TNb
