/**
 * Netflix Cadmium Playercore - Module 13060
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: J9a
 * Dependencies: 10940, 13303, 14103, 14430, 22970, 28143, 31300, 40345, 41456, 48170, 53787, 54366, 54953, 60575, 63026, 66164, 67288, 75462, 90745, 91176, 95650
 * Purpose: Network/HTTP, Encryption/Decryption, Logging, Event handling
 */

// import dep_10940 from './Module_10940.js';
// import dep_13303 from './Module_13303.js';
// import dep_14103 from './Module_14103.js';
// import dep_14430 from './Module_14430.js';
// import dep_22970 from './Module_22970.js';
// import dep_28143 from './Module_28143.js';
// import dep_31300 from './Module_31300.js';
// import dep_40345 from './Module_40345.js';
// import dep_41456 from './Module_41456.js';
// import dep_48170 from './Module_48170.js';
// import dep_53787 from './Module_53787.js';
// import dep_54366 from './Module_54366.js';
// import dep_54953 from './Module_54953.js';
// import dep_60575 from './Module_60575.js';
// import dep_63026 from './Module_63026.js';
// import dep_66164 from './Module_66164.js';
// import dep_67288 from './Module_67288.js';
// import dep_75462 from './Module_75462.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';
// import dep_95650 from './Module_95650.js';

// Webpack module 13060
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B;

d = a(22970);
p = a(90745);
c = a(91176);
g = a(66164);
f = a(41456);
e = a(95650);
h = a(48170);
k = a(54366);
l = a(75462);
m = a(10940);
n = a(63026);
q = a(40345);
r = a(14103);
u = a(67288);
v = a(28143);
w = a(13303);
x = a(60575);
y = a(31300);
A = a(53787);
z = a(14430);
B = a(54953);
t = (function() {
    class C {
    constructor(D, E, G, F, H, J, M) {
        var L;
        function K(O) {
            return L.jE(O);
        }
        L = this;
        this.console = D;
        this.Lna = J;
        this.jg = new Map();
        this.vE = new WeakMap();
        this.faa = new WeakMap();
        this.mMa = true;
        D = (0,
        c.Nf)(g.platform, D, "ADS");
        this.rd = F;
        this.kC = H;
        this.av = new f.Kgb(F,this.jg,E,D);
        this.od = new q.D9a(E,D,G,F,this.av,K,M,this.jg);
        this.Wi = new r.P9a(D,G,F,this.od);
        this.sr = new u.yjb(this,G,D,this.jg);
        this.PS = new v.I9a(this.jg,this.sr,this.Wi,K,G,G.sd,D);
        this.cn = new y.B9a(H,F,F.Lj,E,D,this.PS.events);
        G.jf.Xc(new x.G9a(this.sr,this.od,this.PS));
        G.jf.Xc(new A.F9a(this.sr,this.od,this.cn));
        G.jf.Xc(new k.ko(this.av.tk));
        G.jf.Xc(new n.Bhb(this.av.Oea));
        this.Eh = new B.Q9a(E,this.PS.events);
        new z.x9a(E,D,G,this.od,this.cn,this.Eh,this.jg);
        G.H1.Xc(new l.sfb(G,this.jg,this.PS.events,this.Eh,this.Wi,D));
        this.ZHb = new m.tfb(G,this.cn.events);
        G.H1.Xc(this.ZHb);
        this.Kna = new w.E9a(G,this.od,K,this.jg,this.console);
        this.od.Gb(this.Eh, this.Wi, this.cn);
    }
    jE(D) {
        return this.faa.get(D);
    }
    OI(D) {
        var E, G, F;
        E = this;
        if (this.jg.get(D.J) === D || D.Dl)
            return false;
        this.sSa(D.J);
        F = new p.sf();
        this.vE.set(D, F);
        this.jg.set(D.J, D);
        F.addListener(D.events, "destructed", function(H) {
            h.u && E.console.debug(("AdManager: Viewable destructed ").concat(H.L.J));
            E.jg.get(D.J) === D && (E.sSa(D.J),
            E.od.nNc(D.J));
        });
        D.pda && (null === (G = D.wd) || undefined === G ? 0 : G.Uj) && !this.faa.has(D) && (h.u && this.console.debug("Constructing dai prefetcher for viewable", D.J),
        G = new e.tbb(D,this.rd.Lj,this.kC,this.sr,this.rd,this.console),
        G.enabled = this.mMa,
        this.faa.set(D, G),
        this.ZHb.sac(G.events));
        return true;
    }
    sSa(D) {
        var E, G, F;
        G = this.jg.get(D);
        if (G) {
            h.u && this.console.debug(("AdManager.deleteViewable: ").concat(D));
            F = this.vE.get(G);
            null === F || undefined === F ? undefined : F.clear();
            this.vE.delete(G);
            null === (E = this.faa.get(G)) || undefined === E ? undefined : E.La();
            this.faa.delete(G);
            this.jg.delete(D);
        }
    }
    La() {
        var D, E;
        this.av.La();
        E = Array.from(this.jg.keys());
        try {
            for (var G = d.__values(E), F = G.next(); !F.done; F = G.next())
                this.sSa(F.value);
        } catch (J) {
            var H;
            H = {
                error: J
            };
        } finally {
            try {
                F && !F.done && (D = G.return) && D.call(G);
            } finally {
                if (H)
                    throw H.error;
            }
        }
        this.jg.clear();
        this.cn.La();
    }
    vl(D) {
        return this.sr.vl(D);
    }
    hR() {
        return this.sr.hR();
    }
}
Object.defineProperties(C.prototype, {
        Pwb: {
            get: function() {
                return this.mMa;
            },
            set: function(D) {
                var E;
                E = this;
                this.mMa = D;
                this.jg.forEach(function(G) {
                    if (G = E.jE(G))
                        G.enabled = D;
                });
            },
            enumerable: false,
            configurable: true
        }
    });
    return C;
}
)();
export const J9a = t;

// Detected exports: J9a
