/**
 * Netflix Cadmium Playercore - Module 13777
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 11479, 13044, 15348, 29204, 31276, 33096, 36129, 45118, 59219, 62898, 66476, 87386, 91581
 * Purpose: Network/HTTP, Manifest handling, Buffer/Segment management, Logging
 */

// import dep_11479 from './Module_11479.js';
// import dep_13044 from './Module_13044.js';
// import dep_15348 from './Module_15348.js';
// import dep_29204 from './Module_29204.js';
// import dep_31276 from './Module_31276.js';
// import dep_33096 from './Module_33096.js';
// import dep_36129 from './Module_36129.js';
// import dep_45118 from './Module_45118.js';
// import dep_59219 from './Module_59219.js';
// import dep_62898 from './Module_62898.js';
// import dep_66476 from './Module_66476.js';
// import dep_87386 from './Module_87386.js';
// import dep_91581 from './Module_91581.js';

// Webpack module 13777
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n;
t = a(11479);
b = a(36129);
d = a(87386);
p = a(91581);
c = a(15348);
g = a(33096);
f = a(29204);
e = a(31276);
h = a(13044);
k = a(59219);
l = a(62898);
m = a(66476);
n = a(45118);
e.Za.get(t.vk).register(b.ea.seb, function(q) {
    var v, w, x, y;
    function r(A, z) {
        return undefined === A || undefined === z ? Promise.reject("Invalid email and/or password") : e.Za.get(l.Kib).ef({
            log: this.log,
            BPa: {
                email: A,
                password: z
            }
        }, {}).then(function() {});
    }
    function u(A) {
        var z;
        z = e.Za.get(m.YP);
        return z.Nzb.fetch(A, z);
    }
    if (f.config.psc) {
        v = e.Za.get(c.YIa);
        w = e.Za.get(p.Vt);
        x = e.Za.get(d.Bb).zb("Test");
        y = e.Za.get(n.oq);
        k.fD.UQ.test = {
            setPboRequestsListener: function(A) {
                return v.DXc(A);
            },
            playbacks: h.tq,
            playgraphManager: {
                isNextSegmentReady: function(A) {
                    var z, B;
                    return undefined !== (null === (B = null === (z = h.tq.find(function(C) {
                        return C.Ia === A;
                    })) || undefined === z ? undefined : z.fb) || undefined === B ? undefined : {
                        IPa: 0
                    });
                },
                isNextSegmentBuffering: function(A, z) {
                    var B, C;
                    return null === (C = null === (B = h.tq.find(function(D) {
                        return D.Ia === A;
                    })) || undefined === B ? undefined : B.fb) || undefined === C ? undefined : C.dca(z).r$;
                }
            },
            live: {
                isLive: function(A) {
                    var z;
                    return null === (z = h.tq.find(function(B) {
                        return B.Ia === A;
                    })) || undefined === z ? undefined : z.Hc.Da;
                },
                isAtLiveEdge: function(A) {
                    var z;
                    return null === (z = h.tq.find(function(B) {
                        return B.Ia === A;
                    })) || undefined === z ? undefined : z.Hc.Fy();
                }
            },
            device: {
                esn: Da._cad_global.device.wj,
                esnPrefix: w.zu,
                errorPrefix: w.sy
            },
            log: {
                info: function(A, z) {
                    for (var B = [], C = 1; C < arguments.length; ++C)
                        B[C - 1] = arguments[C];
                    return x.info(A, B);
                },
                error: function(A, z) {
                    for (var B = [], C = 1; C < arguments.length; ++C)
                        B[C - 1] = arguments[C];
                    return x.error(A, B);
                },
                warn: function(A, z) {
                    for (var B = [], C = 1; C < arguments.length; ++C)
                        B[C - 1] = arguments[C];
                    return x.warn(A, B);
                },
                trace: function(A, z) {
                    for (var B = [], C = 1; C < arguments.length; ++C)
                        B[C - 1] = arguments[C];
                    return x.trace(A, B);
                },
                log: function(A, z) {
                    for (var B = [], C = 1; C < arguments.length; ++C)
                        B[C - 1] = arguments[C];
                    return x.log(A, B);
                },
                debug: function(A, z) {
                    for (var B = [], C = 1; C < arguments.length; ++C)
                        B[C - 1] = arguments[C];
                    return x.debug(A, B);
                },
                flush: function() {
                    return y.flush();
                }
            },
            login: r,
            getManifest: u
        };
    }
    q(g.ai);
});

