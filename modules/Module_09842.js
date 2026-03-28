/**
 * Netflix Cadmium Playercore - Module 9842
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: fh, tP
 * Purpose: Network/HTTP, Buffer/Segment management, Logging, Event handling
 */

// Webpack module 9842
// Parameters: t (module), b (exports)

export const tP = b.Ag = {
    cFa: "fragment",
    Zr: "request_response",
    sK: "title",
    b8: "session"
};
export const fh = {
    nl: "upstream",
    yv: "downstream",
    rja: "both"
};
export const tP = {
    Eec: {
        name: "bufferScore",
        Zh: "bs",
        Cd: b.Ag.Zr,
        direction: b.fh.nl,
        validate: function(a) {
            return 1 <= a && 5 >= a;
        }
    },
    Rhc: {
        name: "clientTimestamp",
        Zh: "tm",
        Cd: b.Ag.Zr,
        direction: b.fh.nl,
        encode: function(a) {
            return String(a);
        }
    },
    tPc: {
        name: "playPositionMs",
        Zh: "play_ms",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    qgc: {
        name: "ccspSlowStart",
        Zh: "cpr_ss",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    ogc: {
        name: "ccspCongestionAvoidance",
        Zh: "cpr_ca",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    pgc: {
        name: "ccspRecovery",
        Zh: "cpr_rec",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    RBc: {
        name: "hybridMode",
        Zh: "hybrid",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    SBc: {
        name: "hybridPaceRate",
        Zh: "cspr",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    PBc: {
        name: "hybridCatchUp",
        Zh: "cu",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    TBc: {
        name: "hybridRequestLogging",
        Zh: "cldl",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    QBc: {
        name: "hybridMaxsegHint",
        Zh: "h_ms",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    $ec: {
        name: "byteRangeHint",
        Zh: "br",
        Cd: b.Ag.Zr,
        direction: b.fh.nl,
        encode: function(a) {
            return ("").concat(a.start, ).concat(a.size);
        }
    },
    n$: {
        name: "blackBoxReason",
        Zh: "bb_reason",
        Cd: b.Ag.Zr,
        direction: b.fh.nl
    },
    sessionId: {
        name: "sessionId",
        Zh: "s_xid",
        Cd: b.Ag.b8,
        direction: b.fh.nl
    },
    s_: {
        name: "dlreportEnabled",
        Zh: "dl",
        Cd: b.Ag.b8,
        direction: b.fh.nl,
        encode: function(a) {
            return a ? 1 : 0;
        }
    },
    SKc: {
        name: "nginxRateLimit",
        Zh: "limit_rate",
        Cd: b.Ag.b8,
        direction: b.fh.nl
    },
    dVc: {
        name: "responsePadding",
        Zh: "r_pad",
        Cd: b.Ag.b8,
        direction: b.fh.nl,
        encode: function(a) {
            return a ? 1 : 0;
        }
    },
    Wf: {
        name: "serverTimeMs",
        Zh: "time",
        Cd: b.Ag.Zr,
        direction: b.fh.yv,
        decode: function(a) {
            return Number(a);
        },
        validate: function(a) {
            return !isNaN(a);
        }
    },
    Bo: {
        name: "encoderTag",
        Zh: "encoder-tag",
        Cd: b.Ag.cFa,
        direction: b.fh.yv
    },
    Ao: {
        name: "encoderRegion",
        Zh: "encoder-region",
        Cd: b.Ag.cFa,
        direction: b.fh.yv
    },
    Yua: {
        name: "liveEventStart",
        Zh: "live-msg-start",
        Cd: b.Ag.sK,
        direction: b.fh.yv,
        decode: function(a) {
            var d;
            a = String(a);
            d = new Date(a).getTime();
            return {
                time: a,
                fq: isNaN(d) ? undefined : d
            };
        }
    },
    Xua: {
        name: "liveEventEnd",
        Zh: "live-msg-end",
        Cd: b.Ag.sK,
        direction: b.fh.yv,
        decode: function(a) {
            var d;
            a = String(a);
            d = new Date(a).getTime();
            return {
                time: a,
                fq: isNaN(d) ? undefined : d
            };
        }
    },
    maxBitrate: {
        name: "maxBitrate",
        Zh: "maxBitrate",
        Cd: b.Ag.sK,
        direction: b.fh.yv,
        decode: function(a) {
            return Number(a);
        },
        validate: function(a) {
            return !isNaN(a) && 0 <= a;
        }
    },
    BU: {
        name: "prefetchStart",
        Zh: "live-msg-prefetch-start",
        Cd: b.Ag.sK,
        direction: b.fh.yv,
        decode: function(a) {
            var d;
            a = String(a);
            d = new Date(a).getTime();
            return {
                time: a,
                fq: isNaN(d) ? undefined : d
            };
        }
    },
    zU: {
        name: "prefetchDuration",
        Zh: "live-msg-prefetch-dur",
        Cd: b.Ag.sK,
        direction: b.fh.yv,
        decode: function(a) {
            return Number(a);
        },
        validate: function(a) {
            return !isNaN(a);
        }
    },
    wU: {
        name: "postplayStart",
        Zh: "live-msg-pp-start",
        Cd: b.Ag.sK,
        direction: b.fh.yv,
        decode: function(a) {
            var d;
            a = String(a);
            d = new Date(a).getTime();
            return {
                time: a,
                fq: isNaN(d) ? undefined : d
            };
        }
    },
    vU: {
        name: "postplayDuration",
        Zh: "live-msg-pp-dur",
        Cd: b.Ag.sK,
        direction: b.fh.yv,
        decode: function(a) {
            return Number(a);
        },
        validate: function(a) {
            return !isNaN(a);
        }
    }
};

// Detected exports: fh, tP
