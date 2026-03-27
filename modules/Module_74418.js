/**
 * Netflix Cadmium Playercore - Module 74418
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 74418
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u, v, w;

d = a(22970);
t = a(90745);
p = a(91176);
c = a(91176);
g = a(66164);
f = a(48170);
e = a(29358);
h = a(29092);
k = a(55024);
l = a(63002);
m = a(53693);
n = a(33604);
q = a(52571);
r = a(54540);
u = a(69575);
v = a(54923);
w = a(58049);
a = (function(x) {
    function y() {
        var A;
        A = x.apply(this, d.__spreadArray([], d.__read(arguments), false)) || this;
        A.Gpb = 0;
        A.BNa = 0;
        A.Gma = 0;
        A.hMa = 0;
        return A;
    }
    d.__extends(y, x);
    y.prototype.m4a = function(A) {
        var z, B, C, D;
        x.prototype.m4a.call(this, A);
        this.Gpb++;
        this.BNa++;
        this.$pb = g.platform.time.fa();
        this.kY || (this.kY = {
            Vic: null === (z = A.wa) || undefined === z ? undefined : z.G,
            Ipa: null === (B = A.qa) || undefined === B ? undefined : B.G,
            index: A.index
        },
        this.Vma || (this.Vma = this.kY));
        z = this.jna;
        B = false;
        z && 100 > Math.abs(z.Sb.G - (null === (C = A.Vb) || undefined === C ? NaN : C.G)) && (this.Gma += A.Sb.G - z.Sb.G,
        this.hMa++,
        B = true);
        B || (this.Gma = null === (D = A.Ob) || undefined === D ? undefined : D.G,
        this.hMa = 1);
        this.jna = A;
    }
    ;
    y.prototype.stop = function() {
        x.prototype.stop.call(this);
        this.BNa = 0;
        this.kY = undefined;
    }
    ;
    y.prototype.iCb = function() {
        var A, z, B, C, D;
        z = this.nz;
        B = z.Upa;
        if (B) {
            D = B.$d(this.LG);
            D && D.pe && (C = D.pe.iDb());
            return {
                RM: C,
                currentBranch: {
                    sId: B.K && B.K.id,
                    cancelled: B.fd
                },
                currentReceivedCount: z && z.Pmc,
                totalReceivedCount: this.Gpb,
                currentState: z && z.Gwb || "Uninitialized",
                lastRequestPushed: this.jna && ({
                    contentEndPts: null === (A = this.jna.wa) || undefined === A ? undefined : A.G,
                    fragmentIndex: this.jna.index
                }),
                tslp: this.$pb && g.platform.time.fa() - this.$pb,
                cpts: this.Gma,
                crq: this.hMa,
                rslp: this.BNa,
                firstRequestSSPushed: this.kY && ({
                    contentStartPts: this.kY.Ipa,
                    fragmentIndex: this.kY.index
                }),
                firstRequestPushed: this.Vma && ({
                    contentStartPts: this.Vma.Ipa,
                    fragmentIndex: this.Vma.index
                })
            };
        }
    }
    ;
    return y;
}
)((function(x) {
    function y(A, z, B, C, D, E, G, F, H, J, M) {
        var K;
        K = x.call(this) || this;
        K.fy = A;
        K.LG = z;
        K.config = C;
        K.console = D;
        K.player = E;
        K.ax = G;
        K.sd = F;
        K.lq = H;
        K.tQ = new c.Ut(false);
        K.oQ = new c.Ut(p.I.Ca(-Infinity));
        K.console = (0,
        u.Nf)(g.platform, K.console, ("AsePlayerBuffer [").concat(z, "]:"));
        K.nz = new e.hab(K.console,B,z);
        K.resume();
        E && G && F && (M ? (K.fF = M,
        M.zA(E, F, K.fy)) : K.Svb(),
        A = new l.Jcb(null === E || undefined === E ? undefined : E.sd,p.I.Ca(K.config.Fea),D),
        K.nz.H9(A),
        0 < K.config.Qsb && (K.Psb = new v.Z$a(p.I.Ca(K.config.aec),K.config.Qsb,K.console),
        K.nz.H9(K.Psb)),
        K.config.Lrb && (E = new m.Bib(null === E || undefined === E ? undefined : E.sd,K.config.Lrb,p.I.Ca(K.config.bcc),D),
        K.nz.H9(E)),
        J && (K.rRb = new n.olb(J,K.mediaType,D),
        K.nz.H9(K.rRb)),
        f.u && K.config.Pqc && (D = new r.Mfb(D),
        K.nz.H9(D)));
        K.fy.on("requestAppended", function(L) {
            K.tQ.set(true);
            L.request.Sb && K.oQ.set(L.request.Sb);
            K.emit("requestAppended");
        });
        return K;
    }
    d.__extends(y, x);
    Object.defineProperties(y.prototype, {
        Np: {
            get: function() {
                return this.tQ;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(y.prototype, {
        eT: {
            get: function() {
                return this.oQ;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(y.prototype, {
        NFb: {
            get: function() {
                return this.nz.zj;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(y.prototype, {
        sV: {
            get: function() {
                return this.fy.endOfStream;
            },
            enumerable: false,
            configurable: true
        }
    });
    y.prototype.Svb = function() {
        var A;
        (0,
        q.assert)(this.player && this.ax && this.sd, "Player should be defined");
        A = this.fF;
        this.fF && this.fF.x1a();
        this.fF = new k.fkb(this.LG,this.console,this.player,this.fy,this.player.events,this.ax,this.sd,this.lq);
        this.fF.K7a(A);
    }
    ;
    Object.defineProperties(y.prototype, {
        mediaType: {
            get: function() {
                return this.LG;
            },
            enumerable: false,
            configurable: true
        }
    });
    y.prototype.iCb = function() {}
    ;
    y.prototype.resume = function() {
        f.u && this.console.trace("resume");
        this.DTb();
    }
    ;
    Object.defineProperties(y.prototype, {
        ddc: {
            get: function() {
                return this.dY;
            },
            enumerable: false,
            configurable: true
        }
    });
    y.prototype.lha = function() {
        this.fy.Fwa(true);
    }
    ;
    y.prototype.reset = function(A, z) {
        var B, C, D, E;
        export const undefined = == A && (A = false);
        f.u && this.console.trace("AsePlayerBuffer.reset mediaTypes:", z);
        this.stop();
        this.fy.reset(A);
        this.tQ.set(false);
        this.oQ.set(p.I.Ca(-Infinity));
        A || (this.dY = undefined,
        null === (B = this.fF) || undefined === B ? undefined : B.reset(),
        A = null === (C = this.player) || undefined === C ? undefined : C.Uh,
        null === (D = this.rRb) || undefined === D ? undefined : D.f1a(A, z || A),
        null === (E = this.Psb) || undefined === E ? undefined : E.f1a());
    }
    ;
    y.prototype.kd = function(A) {
        export const undefined = == A && (A = false);
        f.u && this.console.trace("restart");
        this.reset(A);
        this.DTb(true);
    }
    ;
    y.prototype.stop = function() {
        f.u && this.console.trace("stop");
        this.nz.VTb();
    }
    ;
    y.prototype.close = function() {
        var A;
        f.u && this.console.trace("close");
        null === (A = this.fF) || undefined === A ? undefined : A.close();
    }
    ;
    y.prototype.La = function() {
        this.stop();
        this.close();
    }
    ;
    y.prototype.z2 = function() {
        this.config.Jra && this.fy.Vtc();
        this.fy.Faa();
    }
    ;
    y.prototype.pO = function(A) {
        this.fy.pO(A);
    }
    ;
    y.prototype.Ltc = function(A) {
        this.fy.cLc(A);
    }
    ;
    y.prototype.vl = function(A) {
        var z;
        return !(null === (z = this.fF) || undefined === z || !z.vl(A));
    }
    ;
    y.prototype.DTb = function(A) {
        if (!this.nz.zj || A)
            (this.nz.gVc(),
            h.AsyncIterator.tua(this.nz, this.iFc.bind(this)));
    }
    ;
    y.prototype.iFc = function(A) {
        if (!A.done)
            if ((A = A.value,
            (0,
            w.JYa)(A)))
                (this.oQ.set(A.ma.Sb),
                this.tQ.set(true));
            else
                try {
                    this.m4a(A);
                } catch (z) {
                    this.console.error("Error in requestReceived", z);
                }
    }
    ;
    y.prototype.m4a = function(A) {
        var z, B, C, D, E, G, F, H;
        f.u && this.console.trace(("requestReceived: ").concat(null === (z = this.nz.Upa) || undefined === z ? undefined : z.K.id) + (" ").concat(A.toString(), ", edit: ").concat(JSON.stringify(A.pa)));
        this.fy.endOfStream ? f.u && this.console.error("Buffer manager has declared EOS, ignoring request", A.toString()) : (this.dY ? (this.dY.BFc = null === (G = A.wa) || undefined === G ? undefined : G.G,
        this.dY.FFc = null === (F = A.Sb) || undefined === F ? undefined : F.G,
        this.dY.wHb = A.Sb) : this.dY = {
            hfd: null === (B = A.qa) || undefined === B ? undefined : B.G,
            jfd: null === (C = A.Vb) || undefined === C ? undefined : C.G,
            BFc: null === (D = A.wa) || undefined === D ? undefined : D.G,
            FFc: null === (E = A.Sb) || undefined === E ? undefined : E.G,
            wHb: A.Sb
        },
        A.xn && A.stream.track.Cp && (null === (H = this.player) || undefined === H || !H.gda(A.L.J)) && this.emit("drmNeeded", {
            J: A.L.J,
            No: A.Vb
        }),
        this.fy.bdc(A));
    }
    ;
    return y;
}
)(t.EventEmitter));
export const p$a = a;
