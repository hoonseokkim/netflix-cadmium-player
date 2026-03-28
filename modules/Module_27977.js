/**
 * Netflix Cadmium Playercore - Module 27977
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: CBb, Ulb
 * Dependencies: 444, 26279, 26388, 48170, 52571, 52629, 79459, 91176, 95316
 * Purpose: Audio handling, Video handling, Logging, Caching/Storage
 */

// import dep_444 from './Module_444.js';
// import dep_26279 from './Module_26279.js';
// import dep_26388 from './Module_26388.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_52629 from './Module_52629.js';
// import dep_79459 from './Module_79459.js';
// import dep_91176 from './Module_91176.js';
// import dep_95316 from './Module_95316.js';

// Webpack module 27977
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n;
function d(q) {
    return function() {
        return ("[").concat(q, ":padding]");
    }
    ;
}

export function CBb(q) {
    return -1 !== q.indexOf("xheaac") ? "xheaac" : -1 !== q.indexOf("heaac") ? "heaac" : "ddp";
}
;
p = a(95316);
c = a(91176);
g = a(26388);
f = a(52571);
e = a(48170);
h = a(26279);
k = a(79459);
l = a(444);
m = a(52629);
t = (function() {
    class q {
    constructor(r, u) {
        n = new p.Tlb(r,u);
    }
    POb(r, u, v, w, x, y, A, z, B, C) {
        var D, E, G, F, H, J, M, K, L;
        D = [];
        w = q.UPa().yzc(v, w, x);
        E = new c.I(w.duration);
        G = new c.I(w.Ha);
        F = G.O;
        H = w.profile;
        J = {
            OFb: true,
            mediaType: g.l.V,
            $Fb: true,
            Zc: H,
            profile: H,
            O: F,
            ck: [{
                Ve: 0,
                data: w.Gb
            }],
            vh: true,
            Ha: G,
            Ge: u,
            ci: B.ci,
            L: r,
            bitrate: w.bitrate,
            Oa: "-1",
            track: {
                trackId: "1",
                mediaType: g.l.V,
                Cp: false,
                Ha: G,
                L: r,
                channels: w.channels,
                sampleRate: 48E3,
                profile: H,
                pPa: "heaac" === v ? "AAC" : "DDP",
                Xd: [],
                cv: x,
                toString: d(g.l.V),
                Rba: function() {
                    return {
                        a0a: undefined,
                        yT: undefined
                    };
                }
            },
            Os: function() {},
            toJSON: function() {
                return {
                    mediaType: J.mediaType,
                    Oa: J.Oa,
                    bitrate: J.bitrate
                };
            }
        };
        J.Ps = J.track.Ps = h.P5.prototype.Ps.bind(J.track);
        J.track.Xd.push(J);
        r = new c.I(w.Ha);
        v = B.ci ? u : c.I.ia;
        x = v.add(E);
        e.u && C.trace(("StaticMedia: audio target duration is ").concat(y.ca()));
        H = c.I.ia;
        u = B.ci ? -Math.ceil(u.Af(G)) : 0;
        B = v;
        for (G = true; B.lessThan(y); ) {
            B = B.add(E);
            B.greaterThan(y) && (M = E.Af(r) - Math.floor(B.da(y).Af(r)));
            K = B.$f(y);
            L = G ? 0 : K ? y.da(H).G : undefined;
            G = new k.MCa(w.Gb,w.Na,J,F,v.Rc(F).$,x.Rc(F).$,r,C,A,z.bind(undefined, F, H),L,G,K);
            G.Nh({
                start: u,
                end: M
            });
            e.u && C.log(("PaddingBranch: enqueing request ").concat(G, ", edit: ").concat(JSON.stringify({
                start: u,
                end: M
            }), ", ") + ("offset ").concat(H.ca()));
            D.push(G);
            H = H.add(E);
            u = undefined;
            G = false;
        }
        return D;
    }
    QOb(r, u, v, w, x, y, A, z, B, C) {
        var D, E, G, F, H, J, M, K, L;
        D = [];
        u = q.UPa().Azc(u, v, w, x, y);
        v = new c.I(u.duration);
        E = u.profile;
        G = u.bitrate;
        F = u.width;
        H = u.height;
        J = u.V1a;
        M = u.W1a;
        w = u.Ha.O;
        x = new c.I(u.Ha);
        K = new l.AG(w,u.Ha.$);
        L = {
            OFb: true,
            mediaType: g.l.U,
            Zc: E,
            profile: E,
            O: w,
            ck: [{
                Ve: 0,
                data: u.Gb
            }],
            vh: true,
            Oa: "-1",
            Ha: x,
            L: r,
            bitrate: G,
            track: {
                trackId: "1",
                mediaType: g.l.U,
                Cp: false,
                Ha: x,
                frameRate: K,
                yva: K,
                Oo: new m.aY({
                    w: F,
                    zy: H
                },{
                    w: J,
                    zy: M
                }),
                L: r,
                profile: E,
                Xd: [],
                cv: y,
                toString: d(g.l.U),
                Rba: function() {
                    return {
                        a0a: undefined,
                        yT: undefined
                    };
                }
            },
            Os: function() {},
            toJSON: function() {
                return {
                    mediaType: L.mediaType,
                    Oa: L.Oa,
                    bitrate: L.bitrate
                };
            }
        };
        L.Ps = L.track.Ps = h.P5.prototype.Ps.bind(L.track);
        e.u && C.trace(("StaticMedia {").concat(z.id, "}: video queue"), L);
        L.track.Xd.push(L);
        E = Math.ceil(A.Af(v));
        A = v.wh(E);
        r = c.I.ia.Rc(w);
        y = r.add(A).Rc(w);
        e.u && C.trace(("PaddingBranch: ").concat(E, " fragments of ").concat(v.ca(), ", ") + ("duration ").concat(A.ca(), ", ") + ("c: ").concat(r.ca(), "-").concat(y.ca(), ", "));
        for (G = c.I.ia; G.lessThan(A); )
            (E = G.add(v),
            G = new k.MCa(u.Gb,u.Na,L,w,0,v.Rc(w).$,x,C,z,B.bind(undefined, w, G),undefined,G.equal(c.I.ia),E.$f(A)),
            e.u && C.trace(("PaddingBranch: appended ").concat(G)),
            D.push(G),
            G = E);
        return {
            qa: r,
            wa: y,
            duration: A,
            Ta: D
        };
    }
    XRc() {
        return q.UPa().zzc();
    }
}
q.UPa = function() {
        (0,
        f.assert)(n, "expected StaticMediaCache to exist");
        return n;
    }
    ;
    return q;
}
)();
export const Ulb = t;

// Detected exports: CBb, Ulb
