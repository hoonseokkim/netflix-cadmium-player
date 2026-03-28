/**
 * Netflix Cadmium Playercore - Module 68539
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ra
 * Dependencies: 36948
 * Purpose: Manifest handling, Audio handling, Video handling
 */

// import dep_36948 from './Module_36948.js';

// Webpack module 68539
// Parameters: t (module), b (exports), a (require)

t = a(36948);
export const Ra = {
    Uy: 560,
    IB: Infinity,
    Ty: 0,
    $u: 65535,
    IT: -Infinity,
    hea: Infinity,
    cq: ["ddplus-5.1-dash", "ddplus-5.1hq-dash", "ddplus-atmos-dash"],
    vJ: [{
        profiles: ["ddplus-5.1-dash", "ddplus-5.1hq-dash"],
        override: {
            minInitAudioBitrate: 0,
            maxInitAudioBitrate: 65535
        }
    }, {
        profiles: ["ddplus-atmos-dash"],
        override: {
            minInitAudioBitrate: 0,
            maxInitAudioBitrate: 65535
        }
    }],
    HT: 235,
    Vy: 3E4,
    Pp: 7800,
    zea: 999999,
    Vfa: 1,
    Cia: true,
    NE: 45E3,
    nea: Infinity,
    $s: 2600,
    Pva: 0,
    Uva: 0,
    rM: null,
    MV: 15,
    h$: 10,
    i$: false,
    j$: [{
        m: 65,
        b: 8E3
    }, {
        m: 65,
        b: 3E4
    }, {
        m: 50,
        b: 6E4
    }, {
        m: 45,
        b: 9E4
    }, {
        m: 40,
        b: 12E4
    }, {
        m: 20,
        b: 18E4
    }, {
        m: 5,
        b: 24E4
    }],
    P$: 20,
    Jha: false,
    R$: 0,
    Q$: [{
        m: 80,
        b: 8E3
    }, {
        m: 80,
        b: 3E4
    }, {
        m: 70,
        b: 6E4
    }, {
        m: 60,
        b: 9E4
    }, {
        m: 50,
        b: 12E4
    }, {
        m: 30,
        b: 18E4
    }, {
        m: 10,
        b: 24E4
    }],
    AT: 0,
    pha: false,
    Via: 8E3,
    Gca: 9E4,
    Uda: 51E4,
    Ica: 3E5,
    Wda: 3E5,
    Hca: 6E5,
    Vda: 0,
    Fca: .5,
    GB: 15E3,
    qT: 15E3,
    Yda: 25E3,
    HB: 2E4,
    $da: false,
    CT: 1,
    CI: 1E4,
    V9: 262144,
    Jia: 1048576,
    b0: 3,
    fba: 1,
    BI: 24E4,
    rJb: 24E4,
    kAa: true,
    S$: false,
    O$: 1,
    Ava: 20,
    iea: 12E4,
    Qda: 6E4,
    YI: false,
    wya: 8E3,
    QQ: true,
    vya: 100,
    S1: 300,
    tva: 2,
    Cca: 4096,
    S_: false,
    g2: 1E4,
    pr: false,
    Bva: 3,
    p6a: 0,
    Y9: 32768,
    Pia: 65536,
    qta: 32768,
    btb: 2E3,
    aw: 0,
    yA: 3E5,
    h3: 24E4,
    Mxa: 2,
    iva: 200,
    Wna: 2E3,
    Xna: 8E3,
    v3: 6E4,
    TR: true,
    aE: false,
    mT: false,
    GV: false,
    CX: {
        lv: 5,
        mx: 240
    },
    Yqa: false,
    hqa: 4,
    gqa: 8E3,
    kwa: 2E3,
    jwa: 12E4,
    oea: 3,
    Rha: 2E3,
    jva: 400,
    lra: false,
    YU: true,
    iTa: false,
    LKb: 36E3,
    fKb: 8E3,
    Hzb: 10368E3,
    Isb: 5184E3,
    Dzb: 86400,
    mzb: false,
    xta: false,
    Xva: 500,
    Wva: 131072,
    yya: 2E3,
    xya: 262144,
    IEb: 2E3,
    csb: "optimized",
    Lda: "livesimple",
    zda: false,
    Dyb: ("throughput-ewma throughput-sw throughput-sw-fast throughput-iqr throughput-tdigest avtp entropy").split(" "),
    Pzb: {},
    cxb: "throughput-ewma",
    tRb: "none",
    gSa: {
        "throughput-ewma": {
            type: "discontiguous-ewma",
            mw: 5E3,
            wt: 5E3
        },
        "throughput-sw": {
            type: "slidingwindow",
            mw: 5E3
        },
        "throughput-sw-fast": {
            type: "slidingwindow",
            mw: 500
        },
        "throughput-iqr": {
            type: "iqr",
            mx: Infinity,
            mn: 5,
            bw: 15E3,
            iv: 1E3
        },
        "throughput-iqr-history": {
            type: "iqr-history"
        },
        "throughput-location-history": {
            type: "discrete-ewma",
            hl: 14400,
            "in": 3600
        },
        "respconn-location-history": {
            type: "discrete-ewma",
            hl: 100,
            "in": 25
        },
        "throughput-tdigest": {
            type: "tdigest",
            maxc: 25,
            c: .5,
            b: 1E3,
            w: 15E3,
            mn: 6
        },
        "throughput-tdigest-history": {
            type: "tdigest-history",
            maxc: 25,
            rc: "ewma",
            c: .5,
            hl: 7200
        },
        "respconn-ewma": {
            type: "discrete-ewma",
            hl: 10,
            "in": 10
        },
        avtp: {
            type: "avtp"
        },
        entropy: {
            type: "entropy",
            mw: 2E3,
            sw: 6E4,
            "in": "none",
            mins: 1,
            hdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958],
            uhdl: [150, 230, 352, 539, 825, 1264, 1936, 2966, 4543, 6958, 10657, 16322, 25E3]
        }
    },
    s$: "default",
    Ypa: false,
    $pa: 0,
    Fza: "none",
    sva: "simple",
    npa: "throughput-ci",
    lAa: "default",
    nzb: ["throughput-wssl"],
    mwa: "video_location",
    H_a: Infinity,
    b0a: 5,
    rfa: 3E5,
    Iga: 18E4,
    fwa: true,
    Noa: true,
    xva: Infinity,
    LB: 4E3,
    QE: 4E3,
    Ona: false,
    xXa: 0,
    wXa: 0,
    yXa: {
        numB: Infinity,
        bSizeMs: 1E3,
        fillS: "last",
        fillHl: 1E3
    },
    Gea: 3E3,
    qKb: 500,
    mea: 30,
    Dea: 3E5,
    OBa: false,
    Jra: false,
    KAb: true,
    sAa: false,
    $ya: false,
    O1: 3,
    Tua: true,
    koa: true,
    Bea: 2E3,
    PR: true,
    $D: true,
    RR: true,
    dba: false,
    qy: false,
    F_: true,
    N3: false,
    cba: [],
    C_: false,
    uba: [],
    tba: 0,
    MJ: false,
    bnd: false,
    eL: false,
    maa: {
        ticks: -3268,
        timescale: 48E3
    },
    Lfa: {
        "heaac-2-dash": {
            64: {
                ticks: -3268,
                timescale: 48E3
            },
            96: {
                ticks: -3268,
                timescale: 48E3
            }
        },
        "heaac-2hq-dash": {
            128: {
                ticks: -3268,
                timescale: 48E3
            }
        },
        "heaac-5.1-dash": {
            192: {
                ticks: -3268,
                timescale: 48E3
            }
        },
        AMP_AUDIO_PROFILE_DEFAULT: {
            194: {
                ticks: -3268,
                timescale: 48E3
            }
        },
        FMP4_AAC: {
            194: {
                ticks: -3268,
                timescale: 48E3
            }
        }
    },
    ci: false,
    vea: false,
    vga: false,
    wga: false,
    jO: "fallback",
    EY: false,
    Tw: 1,
    GT: 1,
    II: 1,
    P1: 4,
    Eea: 3E3,
    Aha: .3,
    cR: 7800,
    K_: false,
    K3: [],
    pfa: 100,
    m5: t.ke.m5[1],
    k5: t.ke.k5[1],
    Bia: true,
    kU: {
        enabled: false,
        earlyManifestProcessing: false
    },
    uxa: 1E3,
    eU: "flexible",
    vxa: "padding",
    Z6a: false,
    Rxa: 2E3,
    Sxa: 6E3,
    UR: false,
    oga: 1E4,
    FAa: .75,
    Xqa: false,
    Mda: true,
    Mua: 4,
    Vua: "strict",
    Zua: true,
    Kda: 850,
    E1: 6,
    $ua: Infinity,
    Uqa: false,
    hwa: 1E3,
    eva: true,
    SR: true,
    tV: false,
    XZa: false,
    bva: true,
    cva: true,
    n_: 1E3,
    fqa: 1E3,
    E_: true,
    F1: 3E4,
    dva: 0,
    Zqa: true,
    oT: false,
    Wua: 0,
    Jda: -500,
    F4: true,
    J4: 0,
    M9: false,
    I_: true,
    Lp: 1E4,
    Wu: 5E3,
    Mha: "",
    Paa: true,
    QR: true,
    JL: true,
    Tk: 1E4,
    lT: 0,
    THb: true,
    $Jb: 0,
    lKb: 0,
    mKb: 0,
    Gfa: true,
    h2: 6E4,
    jea: 96E4,
    kTa: t.ke.kTa[1],
    Qha: t.ke.Qha[1],
    mya: t.ke.mya[1],
    G_: t.ke.G_[1],
    J1: t.ke.J1[1],
    K1: t.ke.K1[1],
    cN: t.ke.cN[1],
    j5: t.ke.j5[1],
    Raa: false,
    j2: t.ke.j2[1],
    G4: t.ke.G4[1],
    C1: t.ke.C1[1],
    GH: false,
    Maa: true,
    D_: false,
    B_: false,
    jb: t.ke.jb[1],
    p1: t.ke.p1[1],
    u1: t.ke.u1[1],
    r1: t.ke.r1[1],
    t1: t.ke.t1[1],
    q1: t.ke.q1[1]
};

// Detected exports: Ra
