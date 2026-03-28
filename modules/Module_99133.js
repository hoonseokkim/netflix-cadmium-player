/**
 * Netflix Cadmium Playercore - Module 99133
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 4888, 7605, 11479, 12746, 21015, 22365, 31276, 33351, 33554, 35097, 36129, 36475, 37509, 41066, 42933, 49217, 54861, 70865, 87386, 91581
 * Purpose: Encryption/Decryption, Logging, Error handling, Playback control
 */

// import dep_4888 from './Module_4888.js';
// import dep_7605 from './Module_7605.js';
// import dep_11479 from './Module_11479.js';
// import dep_12746 from './Module_12746.js';
// import dep_21015 from './Module_21015.js';
// import dep_22365 from './Module_22365.js';
// import dep_31276 from './Module_31276.js';
// import dep_33351 from './Module_33351.js';
// import dep_33554 from './Module_33554.js';
// import dep_35097 from './Module_35097.js';
// import dep_36129 from './Module_36129.js';
// import dep_36475 from './Module_36475.js';
// import dep_37509 from './Module_37509.js';
// import dep_41066 from './Module_41066.js';
// import dep_42933 from './Module_42933.js';
// import dep_49217 from './Module_49217.js';
// import dep_54861 from './Module_54861.js';
// import dep_70865 from './Module_70865.js';
// import dep_87386 from './Module_87386.js';
// import dep_91581 from './Module_91581.js';

// Webpack module 99133
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y;
d = a(33351);
p = a(12746);
c = a(35097);
g = a(49217);
f = a(41066);
t = a(11479);
e = a(87386);
h = a(91581);
k = a(37509);
l = a(33554);
m = a(31276);
n = a(22365);
q = a(36475);
r = a(4888);
b = a(36129);
u = a(7605);
v = a(21015);
w = a(54861);
x = a(42933);
y = a(70865);
m.Za.get(t.vk).register(b.ea.neb, function(A) {
    var C, D, E, G, F, H, J, M, K, L, O, I, N, Q, S;
    function z() {
        k.Ce.removeListener(k.Qs, B);
        k.Ce.removeListener(k.Dn, z);
        Q && Q();
    }
    function B() {
        N.set(true !== n.$i.hidden);
    }
    C = m.Za.get(v.JKa);
    D = m.Za.get(y.q8);
    if (!C.enabled || !x.OLa.supported || !D.OO)
        return A({
            success: true
        });
    D = m.Za.get(u.Nx);
    E = m.Za.get(q.Iib);
    G = m.Za.get(l.QC);
    F = m.Za.get(h.Vt);
    H = C.groupName;
    J = C.url;
    M = C.BN;
    K = C.nxa;
    L = C.G3;
    O = C.BH;
    I = m.Za.get(e.Bb).zb("SocketRouterClient");
    J = {
        Au: function(T) {
            return (0,
            r.J4c)(T, {
                groupName: H
            });
        },
        enabled: true,
        url: J,
        BN: M,
        nxa: K,
        G3: L,
        BH: O,
        srb: true,
        Rfa: false
    };
    F = F.version;
    N = new p.RCa().set(true !== n.$i.hidden);
    Q = null;
    k.Ce.removeListener(k.Qs, B);
    k.Ce.addListener(k.Qs, B);
    k.Ce.addListener(k.Dn, z);
    D = new d.Bbb({
        sT: function(T, U) {
            switch (T) {
            case "error":
                I.error("socket-router-client-error", U);
                break;
            case "warn":
                false;
                break;
            default:
                false;
            }
        },
        info: {
            W7a: "WEBSITE",
            groupName: H,
            Hia: {
                $a: "",
                build: "",
                W7a: D.uiVersion,
                platform: D.uiPlatform,
                player: F
            }
        },
        RY: {
            wj: G().wj,
            crypto: new c.X9a(),
            wg: new g.c$a(),
            YRc: function() {
                return E.ef({
                    log: I
                }, {}).then(function(T) {
                    return T.provisionResponse;
                });
            }
        },
        visible: N
    });
    S = new f.Llb(J,D);
    Q = function() {
        S.disconnect();
    }
    ;
    S.start();
    m.Za.get(w.fma).Gb(S, C);
    A({
        success: true
    });
});

