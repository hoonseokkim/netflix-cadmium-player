/**
 * Netflix Cadmium Playercore - Module 23179
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: D6b, bZb, f7b, yFa
 * Dependencies: 22674, 22970, 23002, 26388, 31149, 36129, 52794, 70673, 75568, 78029, 79542, 87386, 91122
 * Purpose: Audio handling, Video handling, Logging, Parsing/Serialization
 */

// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_23002 from './Module_23002.js';
// import dep_26388 from './Module_26388.js';
// import dep_31149 from './Module_31149.js';
// import dep_36129 from './Module_36129.js';
// import dep_52794 from './Module_52794.js';
// import dep_70673 from './Module_70673.js';
// import dep_75568 from './Module_75568.js';
// import dep_78029 from './Module_78029.js';
// import dep_79542 from './Module_79542.js';
// import dep_87386 from './Module_87386.js';
// import dep_91122 from './Module_91122.js';

// Webpack module 23179
// Parameters: t (module), b (exports), a (require)

var f, e, h, k, l, m, n, q, r, u, v, w;
class d {
    constructor(x, y) {
    this.qaa = y;
    this.xa = x.filter(function(A) {
        return A.FJ[m.gs.wma];
    }).map(function(A) {
        return {
            track: A,
            stream: A.FJ[m.gs.wma],
            id: A.byb[m.gs.wma]
        };
    });
}
    iVa() {
    return this.qaa;
}
    getMetadata() {
    return this.xa;
}
}
class p {
    constructor(x, y, A) {
    var z;
    this.IV = y;
    this.Tw = A;
    z = x[0];
    this.jia = z.streams.map(function(B) {
        return {
            track: z,
            Dca: B.ATb,
            stream: B
        };
    });
}
    x5a(x) {
    var y, A;
    y = this;
    if (!x.find(function(z) {
        return undefined !== z;
    }))
        throw l.we.eYb(k.ea.ueb, k.Y.dHa);
    A = this.jia.map(function(z, B) {
        if (B = x[B])
            return {
                track: z.track,
                stream: z.stream,
                Ta: B,
                IV: y.IV
            };
    }).filter(v.sGb);
    this.xa = this.lyc(A);
}
    getMetadata() {
    return this.xa;
}
    lyc(x) {
    var y, A, z;
    y = this;
    x.sort(function(B) {
        return B.stream.bitrate;
    });
    A = x.findIndex(function(B) {
        var C;
        return (null !== (C = B.stream.Wb) && undefined !== C ? C : 0) >= y.Tw;
    });
    if (-1 !== A && A !== x.length - 1) {
        z = x[A];
        x.splice(A, 1);
        x.push(z);
    }
    x.reverse();
    return x;
}
}
class c {
    constructor(x, y, A, z) {
    function B(C, D) {
        return C.bitrate > D.bitrate ? C : D;
    }
    this.log = x;
    this.IV = A;
    this.qaa = z;
    this.jia = y.map(function(C) {
        var D;
        D = C.streams.reduce(B);
        return {
            track: C,
            Dca: D.Po ? D.Po.offset + D.Po.size : undefined,
            stream: D
        };
    });
}
    x5a(x) {
    var y;
    y = this;
    if (!x.find(function(A) {
        return undefined !== A;
    }))
        throw l.we.eYb(k.ea.ueb, k.Y.cHa);
    this.xa = this.jia.map(function(A, z) {
        if (z = x[z])
            return {
                track: A.track,
                stream: A.stream,
                Ta: z,
                IV: y.IV
            };
    }).filter(v.sGb);
}
    getMetadata() {
    return this.xa;
}
    iVa() {
    var x, y;
    x = this;
    if (!this.xa.find(function(A) {
        return A.track.ff === x.qaa;
    }) && 0 < this.xa.length) {
        y = this.xa[0].track.ff;
        this.log.warn("Did not find metadata for audio track " + this.qaa + ", falling back to " + y);
        return y;
    }
    return this.qaa;
}
}
class g {
    constructor(x, y, A, z, B, C) {
    this.yBc = x;
    this.zBc = y;
    this.PPc = A;
    this.tgc = z;
    this.Jca = B;
    this.Jh = C;
    this.va = C.zb("HLSPlaylistBuilderImpl");
}
    build(x, y) {
    var A, z, B, C, D, E;
    A = this;
    C = x.Aa;
    x = this.ivc(C, y);
    D = this.mAc(C, y);
    E = null !== (B = null === (z = C.iC) || undefined === z ? undefined : z.Cz) && undefined !== B ? B : C.Kt.find(function(G) {
        var F;
        return G.id === (null === (F = C.raa) || undefined === F ? undefined : F[0].uUb);
    }).ff;
    z = new d(C.Kt,E);
    return Promise.all([x, D, z]).then(function(G) {
        var F, H;
        F = Fa(G);
        G = F.next().value;
        H = F.next().value;
        F = F.next().value;
        G = {
            audio: G.getMetadata(),
            video: H.getMetadata(),
            text: F.getMetadata(),
            $wb: G.iVa(),
            Gnc: F.iVa(),
            duration: C.duration,
            $k: C.$k
        };
        H = A.tgc.Fvc(G);
        y("h_s");
        return {
            ZHc: A.PPc.transform(G, H),
            wgc: H,
            B_c: G
        };
    });
}
    mAc(x, y) {
    var A;
    A = new p(x.il,this.Jca.LEb,this.Jca.Tw);
    return this.Vxb(A.jia, w.l.U, y).then(function(z) {
        A.x5a(z);
        return A;
    });
}
    ivc(x, y) {
    var A, z, B, C;
    B = null !== (z = null === (A = x.iC) || undefined === A ? undefined : A.ew) && undefined !== z ? z : x.kn.find(function(D) {
        var E;
        return D.id === (null === (E = x.raa) || undefined === E ? undefined : E[0].ew);
    }).ff;
    C = new c(this.va,x.kn,this.Jca.LB,B);
    return this.Vxb(C.jia, w.l.V, y).then(function(D) {
        C.x5a(D);
        return C;
    });
}
    Y1a(x, y, A, z) {
    if (x = this.zBc.parse(y, x, A))
        return x;
    this.va.error("Failed to parse headers", {
        type: y === w.l.V ? "audio" : "video",
        downloadableId: z.stream.sh
    });
}
    Vxb(x, y, A) {
    var z;
    z = this;
    return Promise.all(x.map(function(B, C) {
        if (B.Dca)
            return z.yBc.download({
                urls: B.stream.urls,
                offset: 0,
                length: B.Dca
            }).then(function(D) {
                A("h_" + (0 === y ? "A" : "V") + "_" + C + "_s");
                return z.Y1a(D, y, y == w.l.V ? z.Jca.LB : z.Jca.QE, B);
            }).catch(function() {
                A("h_" + B.track.jj[0] + "_" + C + "_f");
                z.va.warn("Failed to download and parse headers for " + B.stream.sh);
            });
        z.va.warn("Stream data offset is missing", {
            downloadableId: B.stream.sh
        });
    }));
}
}
export const D6b = b.f7b =
t = a(22970);
f = a(22674);
e = a(70673);
h = a(23002);
k = a(36129);
l = a(31149);
m = a(75568);
n = a(52794);
q = a(91122);
r = a(78029);
u = a(87386);
v = a(79542);
w = a(26388);
a = g;
export const yFa = a;
export const yFa = a = t.__decorate([(0,
f.aa)(), t.__param(0, (0,
f.v)(e.Ndb)), t.__param(1, (0,
f.v)(h.Qdb)), t.__param(2, (0,
f.v)(n.Cdb)), t.__param(3, (0,
f.v)(q.Lab)), t.__param(4, (0,
f.v)(r.xFa)), t.__param(5, (0,
f.v)(u.Bb))], a);
export const bZb = c;
export const f7b = p;
export const D6b = d;

// Detected exports: D6b, bZb, f7b, yFa
