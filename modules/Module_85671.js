/**
 * Netflix Cadmium Playercore - Module 85671
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: HLa
 * Dependencies: 4203, 5021, 18148, 22674, 22970, 32573, 32737, 42207, 62665, 67590, 79538, 81918, 87386, 87657, 90745, 91176
 * Purpose: DRM/License handling, Manifest handling, Video handling, Logging
 */

// import dep_4203 from './Module_4203.js';
// import dep_5021 from './Module_5021.js';
// import dep_18148 from './Module_18148.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_32573 from './Module_32573.js';
// import dep_32737 from './Module_32737.js';
// import dep_42207 from './Module_42207.js';
// import dep_62665 from './Module_62665.js';
// import dep_67590 from './Module_67590.js';
// import dep_79538 from './Module_79538.js';
// import dep_81918 from './Module_81918.js';
// import dep_87386 from './Module_87386.js';
// import dep_87657 from './Module_87657.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 85671
// Parameters: t (module), b (exports), a (require)

var c, g, f, e, h, k, l, m, n, q, r, u, v, w, x;
class d {
    constructor(y, A, z, B, C, D, E, G, F, H) {
    this.f5c = z;
    this.oc = B;
    this.Hi = C;
    this.tc = D;
    this.Nzb = E;
    this.Psc = G;
    this.vra = F;
    this.events = new x.EventEmitter();
    this.log = y.zb("VideoPreparer");
    this.config = A();
    this.f9a = {};
    this.bwa = {};
    this.stats = {
        num_of_calls: 0,
        num_of_movies: 0
    };
    this.vra.Gb(this);
    this.mg = H.mg;
}
    dXc(y, A, z) {
    this.mg.setData(y, "ldl", A, z);
}
    fEb(y) {
    return this.mg.zca(y, "ldl");
}
    Fhc(y) {
    this.mg.clearData(y, "ldl", undefined, true);
}
    Gba(y, A) {
    return this.mg.getData(y, A);
}
    Avc(y) {
    var A;
    A = this.mg.getData(y, "ldl");
    this.mg.clearData(y, "ldl", undefined, true);
    return A;
}
    R8a(y) {
    return this.PTb === y || this.nwb === y;
}
    CU(y, A) {
    var z, B, C;
    z = this;
    y = y.map(function(D) {
        D.Xa = D.Xa || ({
            Goa: {
                dPc: false
            },
            co: 0
        });
        z.oc.p_(D.Xa.co) || (D.Xa.co = 0);
        z.oc.p_(D.yd) && (D.Xa.Nb = D.yd);
        return D;
    });
    B = y.map(function(D) {
        return z.vmc(D, A);
    }).reduce(function(D, E) {
        return D.concat(E);
    }, []);
    C = B.map(function(D) {
        return D.R + "-" + D.type;
    });
    this.log.trace("prepare tasks", C);
    this.tc.$ac(B);
    this.stats.num_of_calls++;
    this.stats.num_of_movies += y.length;
}
    getStats(y, A, z) {
    return Object.assign(Object.assign({}, z && this.bwa[z] || ({})), {
        KV: this.tc.getStats(y, A, z),
        cache: this.mg.getStats(y, A),
        zuc: Object.assign(Object.assign({}, this.stats), this.vra.getStats())
    });
}
    RAc(y) {
    this.PTb = y;
}
    PAc(y) {
    this.log.trace("task scheduler paused on playback created");
    this.tc.pause();
    this.config.aoc && this.mg.DQa(y, ["manifest"]);
    this.config.$nc && this.mg.DQa(y, ["ldl"]);
    this.config.Ync && this.mg.clearData(y, "manifest");
    this.vra.PPb(y);
    this.nwb = y;
}
    WDb() {
    this.log.info("ad played, clearing all manifests from cache");
    this.FAb();
}
    OAc(y) {
    var A;
    A = this;
    this.config.Znc ? this.mg.clearData(y, "manifest") : this.mg.zca(y, "manifest") && this.mg.getData(y, "manifest").then(function(z) {
        z.Aa.isSupplemental || A.config.hTa && (0,
        w.qB)(z.Aa.rf) ? z.E8a = true : A.mg.clearData(y, "manifest");
    }, function(z) {
        A.log.warn("Failed to get manifest for movieId [" + y + "] from cacheManager.", z);
    });
    this.mg.getState().reduce(function(z, B) {
        B = B.movieId;
        z.includes(B) || z.push(B);
        return z;
    }, []).forEach(function(z) {
        A.mg.getData(z, "manifest").then(function(B) {
            var C, D;
            (null === (D = null === (C = B.Aa.EF) || undefined === C ? undefined : C.tO) || undefined === D ? 0 : D.tB) && ["manifest", "ldl"] /* manifest */.forEach(function(E) {
                return A.mg.uWb(z, E);
            });
        }).catch(function() {
            A.mg.clearData(z, "ldl");
        });
    });
    this.zub(y);
    this.PTb = this.nwb = undefined;
    this.events.emit("playbackClosing", {
        J: y,
        type: "playbackClosing",
        target: this
    });
}
    FAb() {
    this.mg.DQa("none", ["manifest", "ldl"] /* manifest */);
}
    zub(y) {
    delete this.f9a[y];
}
    cB(y) {
    return this.f9a[y];
}
    NRa(y) {
    return this.f9a[y] = this.f5c.wH();
}
    yYc(y, A) {
    if (this.fEb(y))
        return q.Yr.fd;
    if (!A.iM)
        return q.Yr.hQa;
}
    vmc(y, A) {
    var z, B;
    y.Ye && y.Xa && (y.Xa.Ye = y.Ye);
    this.l3c(y.R, y.zp);
    z = this.Nlc(y, A);
    B = this.Hlc(y, null === z || undefined === z ? undefined : z.id, A);
    y = this.Slc(y, null === z || undefined === z ? undefined : z.id, A);
    return [z, B, y].filter(p);
}
    Nlc(y, A) {
    if (this.mg.zca(y.R, "manifest"))
        this.log.trace("manifest exists in cache for " + y.R);
    else
        return new c.wla("manifest",this.Hi.Fc().na(n.Ba),!!y.Xa.lRb,undefined,A,this.Nzb,y,this);
}
    Hlc(y, A, z) {
    if (this.config.Wqa)
        if (this.mg.zca(y.R, "ldl"))
            false;
        else
            return new c.wla("license",this.Hi.Fc().na(n.Ba),!!y.Xa.lRb,A,z,this.Psc,y,this);
}
    Slc(y, A, z) {
    if (this.config.Yqa)
        return new c.wla("getMedia",this.Hi.Fc().na(n.Ba),!!y.Xa.lRb,A,z,this.vra,y,this);
}
    l3c(y, A) {
    this.bwa[y] || (this.bwa[y] = {
        iya: 0,
        zp: 0
    });
    y = this.bwa[y];
    y.iya = (undefined !== y ? undefined !== y.iya ? y.iya : 0 : 0) + 1;
    y.zp = A;
}
}
function p(y) {
    return undefined !== y;
}

t = a(22970);
c = a(79538);
g = a(4203);
f = a(22674);
e = a(87386);
h = a(62665);
k = a(42207);
l = a(87657);
m = a(81918);
n = a(5021);
q = a(32573);
r = a(18148);
u = a(32737);
v = a(67590);
w = a(91176);
x = a(90745);
d.prototype.$Db = function() {
    this.log.info("track changed, clearing all manifests from cache");
    this.FAb();
}
;
a = d;
export const HLa = a;
export const HLa = a = t.__decorate([(0,
f.aa)(), t.__param(0, (0,
f.v)(e.Bb)), t.__param(1, (0,
f.v)(g.Pc)), t.__param(2, (0,
f.v)(h.gG)), t.__param(3, (0,
f.v)(k.Zi)), t.__param(4, (0,
f.v)(m.re)), t.__param(5, (0,
f.v)(l.akb)), t.__param(6, (0,
f.v)(u.$jb)), t.__param(7, (0,
f.v)(u.Zjb)), t.__param(8, (0,
f.v)(v.QCa)), t.__param(9, (0,
f.v)(r.vDa))], a);

// Detected exports: HLa
