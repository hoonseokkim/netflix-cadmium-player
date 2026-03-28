/**
 * Netflix Cadmium Playercore - Module 43607
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Om
 * Dependencies: 2050, 3265, 22970, 25564, 35202, 48014, 49420, 64280, 72905, 75589, 89931, 91056, 93334, 98516
 * Purpose: Buffer/Segment management, Encryption/Decryption, Logging, Configuration
 */

// import dep_2050 from './Module_2050.js';
// import dep_3265 from './Module_3265.js';
// import dep_22970 from './Module_22970.js';
// import dep_25564 from './Module_25564.js';
// import dep_35202 from './Module_35202.js';
// import dep_48014 from './Module_48014.js';
// import dep_49420 from './Module_49420.js';
// import dep_64280 from './Module_64280.js';
// import dep_72905 from './Module_72905.js';
// import dep_75589 from './Module_75589.js';
// import dep_89931 from './Module_89931.js';
// import dep_91056 from './Module_91056.js';
// import dep_93334 from './Module_93334.js';
// import dep_98516 from './Module_98516.js';

// Webpack module 43607
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r;

d = a(22970);
p = a(3265);
c = a(89931);
g = a(93334);
f = a(49420);
e = a(72905);
t = a(91056);
h = a(64280);
k = a(25564);
l = a(2050);
m = a(98516);
n = a(75589);
q = a(48014);
r = a(35202);
d.__exportStar(a(56122), b);
a = (function() {
    class u {
    constructor(v, w, x, y, A, z) {
        this.console = v;
        this.stream = w;
        this.lC = y;
        this.kbc = A;
        this.view = x instanceof ArrayBuffer ? new DataView(x) : new DataView(x.data,x.offset,x.length);
        this.config = z || ({});
        this.jBc = (0,
        l.gwc)();
    }
    parse(v) {
        var w;
        w = this.SVc();
        if (!w.done) {
            if (w.JKb)
                return {
                    TB: false,
                    Yna: w.JKb
                };
            this.console.error("Scan error: " + w.error);
            return {
                TB: false,
                parseError: w.error || "unknown mp4 scan error"
            };
        }
        v && (v.mediaType = this.stream.mediaType,
        v.CNc = v.Ha);
        this.view = new DataView(this.view.buffer,this.view.byteOffset,w.offset);
        v = this.lOc(v);
        return v.done ? this.Sic() : (this.console.error("Parse error: " + v.error),
        {
            TB: false,
            parseError: v.error || "unknown mp4 parse error"
        });
    }
    PH(v) {
        return e.Kf.PH(this, v);
    }
    wn(v) {
        return e.Kf.wn(this, v);
    }
    SVc() {
        var v, w;
        v = new q.Sdb(this.lC,this.kbc ? [n.ala, n.$ka] : [],this.config && this.config.kmd || ["moof", n.qhb] /* moof */,this.config && this.config.b2a);
        w = d.__assign(d.__assign({}, this.config), {
            Fxa: false
        });
        return new k.T5(u.S4a,v,this.view,this.console,w).parse();
    }
    lOc(v) {
        var w, x, y;
        w = new q.Xja(this.view.byteLength);
        x = Object.create(m.o2.Se);
        this.config && ((this.config.dNb || this.config.JVb || this.config.pAa) && p(m.o2.O4a, x),
        this.config.M7a && p(m.o2.L1c, x),
        this.config.JVb && p(m.o2.KVb, x));
        y = d.__assign(d.__assign({}, this.config), {
            Fxa: true
        });
        this.We = new k.T5(x,w,this.view,this.console,y);
        v = this.We.parse(v);
        v.done && (this.Se = this.We.Se);
        return v;
    }
    Sic() {
        var v, w, x, y, A, z, B, C;
        w = {
            TB: true
        };
        x = u.path(this, ["moov"]);
        y = null === x || undefined === x ? undefined : x.PH("trak");
        if (1 === (null === y || undefined === y ? undefined : y.length)) {
            A = y[0].Nt("tkhd");
            A && (w.trackId = A.Uc.trackId);
        }
        A = u.path(x, ["trak", "mdia", "minf", "stbl", "stsd"] /* trak */);
        if (this.config.dNb)
            if (A)
                (w.Ha = A.Ha,
                w.fld = A.Se);
            else
                return {
                    TB: false,
                    parseError: "Missing sample descriptions"
                };
        z = u.path(A, ["encv", "sinf", "schi"] /* encv */);
        z && (z = u.path(z, ["tenc"]) || u.path(z, [n.nib])) && (w.trc = {
            qdd: z.xB,
            pZa: z.pZa,
            Fhd: false
        });
        if (z = u.path(x, ["trak", "mdia", "mdhd"] /* trak */))
            w.O = z.O;
        if (z = u.path(x, ["mvex", "trex"] /* mvex */))
            w.iqa = z && z.Uc.iqa;
        w.iqa && w.O && (w.Ha = new f.I(w.iqa,w.O));
        (z = u.path(x, ["trak", "edts", "elst"] /* trak */)) && (null === (v = z.Jaa) || undefined === v ? 0 : v.length) && w.O && (w.y_ = new f.I(z.Jaa[0].fJc,w.O));
        if (v = u.path(this, ["sidx"])) {
            z = (z = u.path(this, [n.ala])) && z.YIc;
            B = u.path(this, [n.$ka]);
            B = B && B.en;
            w.Ta = v.Ta;
            w.n2 = z;
            w.en = B;
        }
        if (z = this.Se.vmaf && this.Se.vmaf[0])
            w.PF = z.PF;
        if (this.config.b4a && (z = u.path(x, ["mvex"])) && y && y.length) {
            C = y.reduce(function(D, E) {
                return E.byteOffset > D.byteOffset ? E : D;
            });
            C.byteOffset > z.byteOffset && (y = new Uint8Array(this.view.buffer,this.view.byteOffset,this.view.byteLength),
            B = (0,
            r.UVb)(y, Uint8Array, z.byteOffset, z.byteOffset + z.byteLength),
            C = (0,
            r.UVb)(y, Uint8Array, z.byteOffset + z.byteLength, C.byteOffset + C.byteLength),
            y.set(C, z.byteOffset),
            y.set(B, z.byteOffset + C.byteLength));
        }
        if (this.config.pVc)
            if (x)
                (this.trim(x.byteOffset + x.byteLength),
                this.config.pAa && A && 1 < A.ZR && v && (w.ck = this.pAa(A, v)),
                undefined === w.ck && (x = this.We.Nqa ? (0,
                c.concat)(this.We.pa().Na) : this.view.buffer,
                w.ck = [{
                    Ve: 0,
                    data: x
                }]));
            else
                return {
                    TB: false,
                    parseError: "Missing movie box"
                };
        w.TB = true;
        w.Gxa = this.We.offset;
        return w;
    }
    trim(v) {
        var w;
        w = this.view.buffer.slice(this.view.byteOffset, this.view.byteOffset + Math.min(v, this.view.byteLength));
        this.We.trim(v);
        this.view = new DataView(w);
    }
    pAa(v, w) {
        var x, y, A;
        x = Object.keys(v.Se);
        y = x.filter(function(z) {
            return "encv" !== z;
        });
        if (!(2 > x.length || y.length === x.length || 0 === y.length)) {
            x = u.path(this, ["ftyp"]);
            A = u.Jxc(x);
            if (A)
                return (x = [],
                this.We.eSc(),
                v.XPb("encv"),
                x.push({
                    Ve: 0,
                    ry: false,
                    data: (0,
                    c.concat)(this.We.pa().Na)
                }),
                this.We.TPc(),
                v.XPb(y[0]),
                v = u.ttc(A, w),
                x.push({
                    Ve: v,
                    ry: true,
                    data: (0,
                    c.concat)(this.We.pa().Na)
                }),
                x);
        }
    }
}
u.path = function(v, w) {
        return w.reduce(function(x, y) {
            return x && x.Se[y] && x.Se[y][0];
        }, v);
    }
    ;
    u.Jxc = function(v) {
        return v && v.SQa && -1 !== v.SQa.indexOf("mcl0") ? "mcl0" : undefined;
    }
    ;
    u.ttc = function(v, w) {
        var x, y;
        (0,
        g.assert)("mcl0" === v, "Unsupported McClearen brand");
        x = w.Ta;
        v = x.og;
        w = new f.I(120,1).Rc(x.O).$;
        y = 0;
        for (x = x.rv; y < v.length && x < w; )
            x += v[y++];
        return y;
    }
    ;
    u.S4a = {};
    return u;
}
)();
export const Om = a;
a.S4a[n.RHa] = t.default;
a.S4a[n.SHa] = h.default;

// Detected exports: Om
