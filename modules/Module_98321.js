/**
 * Netflix Cadmium Playercore - Module 98321
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 98321
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w, x, y;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Zgb = void 0;
d = a(91176);
p = a(66164);
c = a(65161);
g = a(52571);
f = a(15341);
e = a(31330);
h = a(5483);
k = a(81600);
l = a(41329);
m = a(99125);
n = a(82924);
q = a(5753);
r = a(75811);
u = a(44237);
v = a(15625);
w = a(44646);
x = a(6500);
y = a(22074);
t = (function() {
    function A(z, B, C, D) {
        this.config = z;
        this.mediaType = B;
        this.Fg = C;
        this.console = D;
    }
    A.prototype.append = function(z, B) {
        var C, D, E, G, F, H;
        void 0 === this.track ? this.Mta(z.stream) : this.track !== z.stream.track && ((0,
        g.assert)(void 0 !== this.Vg),
        (0,
        g.assert)(this.mediaType !== c.l.V || this.track.Ha),
        (0,
        g.assert)(this.mediaType !== c.l.V || z.stream.track.Ha),
        this.track = z.stream.track,
        this.Vg.forEach(function(J) {
            return J.yt(z.stream);
        }));
        (0,
        g.assert)(void 0 !== this.Vg);
        E = this.Vg.reduce(function(J, M) {
            return M.append(J, B);
        }, {
            Na: z,
            offset: z.Eya || d.I.ia,
            qf: this.config.U3,
            Ih: !1
        });
        G = E.Na;
        F = E.offset;
        H = E.Ih;
        E = E.Sh;
        E = void 0 === E ? [] : E;
        G.pa && ((0,
        g.assert)(z.pa, "Fragments must be marked for edit at request time"),
        z.Nh(G.pa));
        if (H || null === (C = this.P_a) || void 0 === C || !C.dgc(z))
            return {
                offset: F,
                Ih: H
            };
        C = this.P_a.pa(z, !(null === (D = z.K) || void 0 === D || !D.Sq));
        D = C.success;
        G = C.Sh;
        C = C.kv;
        Array.prototype.push.apply(E, void 0 === G ? [] : G);
        return {
            offset: F,
            Ih: !D,
            Sh: E,
            kv: C
        };
    }
    ;
    A.prototype.reset = function() {
        this.Vg = this.track = void 0;
    }
    ;
    A.prototype.Mta = function(z) {
        var B, C, D;
        this.track = z.track;
        this.mediaType === c.l.V ? this.P_a = new r.H$a(this.console,this.config,z.profile) : this.mediaType === c.l.U && (this.P_a = new v.snb(this.console,this.config));
        this.Vg = [];
        this.mediaType === c.l.V && (this.Vg.push(new f.nkb(this.config,this.Fg,this.console)),
        this.config.U3 && this.Vg.push(new h.mlb(this.config,this.console)),
        this.Vg.push(new w.bmb(this.console)),
        z.ci && z.Ge && this.pYa(z.L.J) && this.Vg.push(new m.Heb(this.config)),
        this.config.vea || (this.console.log(("MediaSplicer: NegativePtsGuard:  ").concat(null === (B = z.Ge) || void 0 === B ? void 0 : B.ca())),
        this.Vg.push(new k.yhb(this.config,this.console))),
        this.nGb() ? (this.config.Xn || this.Vg.push(new n.G$a(this.config,this.Fg,this.console)),
        this.config.U3 && this.Vg.push(new u.TCa(this.console)),
        !1 !== (null === (C = p.platform.MediaSource.Fg) || void 0 === C ? void 0 : C.Ukd) && this.Vg.push(new e.Nhb(this.console)),
        this.config.U1c && ((0,
        g.assert)(z.Ha),
        this.Vg.push(new l.Umb(z.Ha,this.console)))) : (this.Vg.push(new q.I$a(this.console)),
        this.config.U3 && this.Vg.push(new u.TCa(this.console))));
        if (z.L.Ab || (null === (D = z.L.jk) || void 0 === D ? 0 : D.Ab))
            (this.Vg.push(new y.Ifb()),
            this.nGb() && this.Vg.push(new x.Ieb(this.console)));
        this.Vg.forEach(function(E) {
            return E.yt(z);
        });
    }
    ;
    A.prototype.pYa = function(z) {
        return this.config.pYa || this.config.CFb && -1 !== this.config.CFb.indexOf(z);
    }
    ;
    A.prototype.nGb = function() {
        return !this.config.YU;
    }
    ;
    return A;
}
)();
b.Zgb = t;


// Detected exports: Zgb