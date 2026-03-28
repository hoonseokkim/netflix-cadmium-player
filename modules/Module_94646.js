/**
 * Netflix Cadmium Playercore - Module 94646
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: YW
 * Dependencies: 22970, 66164
 * Purpose: Configuration
 */

// import dep_22970 from './Module_22970.js';
// import dep_66164 from './Module_66164.js';

// Webpack module 94646
// Parameters: t (module), b (exports), a (require)

var d, p, c;

t = a(22970);
d = a(66164);
p = t.__importDefault(a(14282));
c = d.platform.Bi.Rr;
new d.platform.Console("ASEJS_ERROR_MAP","asejs");
a = (function() {
    class g {
    constructor(f) {
        var e, h;
        this.config = f;
        this.JH = (e = {},
        e[c.K5c] = g.ug,
        e[c.UNKNOWN_ERROR] = g.ug,
        e[c.Q9c] = g.ug,
        e[c.O_b] = g.ug,
        e[c.VDa] = g.ug,
        e[c.$_b] = g.ug,
        e[c.S_b] = g.lJ,
        e[c.c_b] = g.lJ,
        e[c.tDa] = g.xt,
        e[c.Bab] = g.xt,
        e[c.d_b] = g.uta,
        e[c.e_b] = g.xt,
        e[c.f_b] = g.xt,
        e[c.$Zb] = g.ug,
        e[c.b_b] = g.ug,
        e[c.Cab] = g.PKb,
        e[c.a_b] = g.ug,
        e[c.ZZb] = g.xt,
        e[c.K6c] = g.lJ,
        e[c.h1b] = g.xt,
        e[c.BFa] = g.xt,
        e[c.Gdb] = g.xt,
        e[c.f1b] = this.config.NBc ? g.lJ : g.xt,
        e[c.uka] = g.xt,
        e[c.g1b] = g.w8a,
        e[c.CFa] = g.lJ,
        e[c.vka] = g.w8a,
        e[c.DFa] = g.OKb,
        e[c.Jdb] = g.OKb,
        e[c.d7] = g.lJ,
        e[c.j1b] = g.w8a,
        e[c.f7] = g.xt,
        e[c.Hdb] = g.lJ,
        e[c.i1b] = g.lJ,
        e[c.V_b] = g.lJ,
        e[c.P_b] = g.ug,
        e[c.i6b] = g.ug,
        e[c.F_b] = g.ug,
        e[c.G_b] = g.ug,
        e[c.H_b] = g.ug,
        e[c.I_b] = g.ug,
        e[c.J_b] = g.ug,
        e[c.K_b] = g.ug,
        e[c.L_b] = g.ug,
        e[c.M_b] = g.ug,
        e[c.N_b] = g.ug,
        e[c.Q_b] = g.ug,
        e[c.R_b] = g.ug,
        e[c.T_b] = g.ug,
        e[c.U_b] = g.ug,
        e[c.W_b] = g.ug,
        e[c.X_b] = g.ug,
        e[c.Y_b] = g.ug,
        e[c.Z_b] = g.ug,
        e[c.a0b] = g.ug,
        e[c.b0b] = g.ug,
        e[c.h6b] = g.xt,
        e[c.TIMEOUT] = g.PKb,
        e);
        this.Nmc = (h = {},
        h[c.tDa] = true,
        h[c.BFa] = true,
        h[c.Gdb] = true,
        h[c.uka] = true,
        h[c.VDa] = true,
        h);
        this.YAa = {};
        this.q5a = {};
    }
    qVa(f) {
        return this.JH[f];
    }
    EDc(f) {
        return !!this.Nmc[f];
    }
    WN(f, e) {
        var h, k;
        h = this.config;
        k = this.qVa(f) || g.ug;
        this.q5a[e] = k;
        return h.YI && f !== c.d7 ? k === g.ug || k === g.xt ? p.default.WW.pK : p.default.WW.ha : k !== g.xt || this.lUc(e) ? p.default.WW.ha : p.default.WW.LX;
    }
    LO(f) {
        delete this.YAa[f];
        delete this.q5a[f];
    }
    H3() {
        this.YAa = {};
        this.q5a = {};
    }
    lUc(f) {
        var e, h, k;
        e = d.platform.time.fa();
        h = this.config;
        k = this.YAa[f];
        if (k) {
            if (!(k.Ud >= e - h.Rha || k.eJ || (k.Ud = e,
            ++k.count,
            k.count < h.oea)))
                return k.eJ = true;
        } else
            this.YAa[f] = {
                Ud: e,
                count: 1
            };
    }
}
g.PKb = [p.default.xk.iK, false];
    g.OKb = [p.default.xk.iK, true];
    g.ug = [p.default.xk.UP, false];
    g.lJ = [p.default.xk.UP, true];
    g.w8a = [p.default.xk.URL, true];
    g.uta = [-1, false];
    g.xt = [p.default.xk.UP, false];
    return g;
}
)();
export const YW = a;

// Detected exports: YW
