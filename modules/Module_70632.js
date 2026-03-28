/**
 * Netflix Cadmium Playercore - Module 70632
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 2248, 11479, 13044, 20318, 21941, 22365, 22970, 24066, 27758, 29204, 31276, 33096, 36129, 45247, 51790, 53754, 59416, 67263, 84408, 90762
 * Purpose: Media Source Extensions, Audio handling, Video handling, Buffer/Segment management
 */

// import dep_2248 from './Module_2248.js';
// import dep_11479 from './Module_11479.js';
// import dep_13044 from './Module_13044.js';
// import dep_20318 from './Module_20318.js';
// import dep_21941 from './Module_21941.js';
// import dep_22365 from './Module_22365.js';
// import dep_22970 from './Module_22970.js';
// import dep_24066 from './Module_24066.js';
// import dep_27758 from './Module_27758.js';
// import dep_29204 from './Module_29204.js';
// import dep_31276 from './Module_31276.js';
// import dep_33096 from './Module_33096.js';
// import dep_36129 from './Module_36129.js';
// import dep_45247 from './Module_45247.js';
// import dep_51790 from './Module_51790.js';
// import dep_53754 from './Module_53754.js';
// import dep_59416 from './Module_59416.js';
// import dep_67263 from './Module_67263.js';
// import dep_84408 from './Module_84408.js';
// import dep_90762 from './Module_90762.js';

// Webpack module 70632
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y;
d = a(22970);
p = a(45247);
c = a(51790);
g = a(27758);
f = a(90762);
e = a(29204);
h = a(33096);
k = a(67263);
l = a(53754);
m = a(24066);
t = a(36129);
n = a(31276);
q = a(21941);
r = a(22365);
u = a(59416);
b = a(11479);
v = a(13044);
w = a(20318);
x = a(2248);
y = a(84408);
n.Za.get(b.vk).register(t.ea.feb, function(A) {
    var z, B, C, D, E, G, F, H, J, M;
    z = n.Za.get(q.Fhb).Xlc();
    B = n.Za.get(k.sEa).k6;
    C = n.Za.get(c.Vgb).Bi;
    D = n.Za.get(x.Km);
    E = n.Za.get(y.zG);
    G = {
        Wxa: (0,
        n.Cba)("ASE"),
        ucc: (0,
        n.Cba)("JS-ASE", undefined, "Platform"),
        An: n.Cba,
        storage: u.storage,
        cyc: r.ubb,
        getTime: m.jy,
        aqa: function(K) {
            return D.decode(K).buffer;
        },
        AL: function(K) {
            return E.encode(K);
        },
        $qa: function(K) {
            return E.decode(K);
        },
        kT: {},
        Bi: C,
        Pm: g.Pm,
        k6: B,
        MediaSource: l.Ygb,
        SourceBuffer: f.rHa,
        C0: function() {
            return [e.config.poa, e.config.roa, e.config.qoa];
        },
        SD: function(K) {
            v.tq.forEach(function(L) {
                L.KSb(K);
            });
        }
    };
    B = new Promise(function(K) {
        u.storage.load("nh", function(L) {
            G.kT.nh = L.success ? L.data : undefined;
            K();
        });
    }
    );
    C = new Promise(function(K) {
        u.storage.load("lh", function(L) {
            G.kT.lh = L.success ? L.data : undefined;
            K();
        });
    }
    );
    F = new Promise(function(K) {
        u.storage.load("gh", function(L) {
            G.kT.gh = L.success ? L.data : undefined;
            K();
        });
    }
    );
    H = new Promise(function(K) {
        u.storage.load("sth", function(L) {
            G.kT.sth = L.success ? L.data : undefined;
            K();
        });
    }
    );
    J = new Promise(function(K) {
        u.storage.load("vb", function(L) {
            G.kT.vb = L.success ? L.data : undefined;
            K();
        });
    }
    );
    M = new Promise(function(K) {
        u.storage.load("ab", function(L) {
            G.kT.ab = L.success ? L.data : undefined;
            K();
        });
    }
    );
    Promise.all([B, C, M, J, H, F]).then(function() {
        return d.__awaiter(this, undefined, undefined, function L() {
            var O, I;
            return Va(L, function(N) {
                if (1 == N.et)
                    return (O = a(92623)(G),
                    w.$v.tl = a(21457),
                    w.$v.tl.declare(p.ke),
                    w.$v.tl.set(a(87141)(e.config), true, (0,
                    n.Cba)("ASE")),
                    fb(N, p.eca(O), 2));
                I = N.tW;
                I.open(w.$v.tl, z);
                I.bXc({
                    audio: e.config.poa,
                    video: e.config.roa,
                    text: e.config.qoa
                }, {
                    G: e.config.CI,
                    la: undefined
                });
                w.$v.qk = I;
                A(h.ai);
                N.et = 0;
            });
        });
    }).catch(function(K) {
        G.Wxa.error("Exception loading location history from local storage", K);
    });
});

