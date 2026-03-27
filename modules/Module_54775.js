/**
 * Netflix Cadmium Playercore - Module 54775
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 54775
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;

d = a(22970);
p = a(90745);
c = a(91176);
g = a(66164);
f = a(69575);
e = a(40666);
h = a(48170);
k = a(65161);
l = a(49870);
t = (function() {
    function m(n, q, r, u, v, w, x) {
        var y;
        y = this;
        this.tc = n;
        this.Lj = q;
        this.config = r;
        this.YLc = u;
        this.se = v;
        this.console = w;
        this.CTa = new p.sf();
        this.events = new p.EventEmitter();
        this.console = (0,
        f.Nf)(g.platform, w, "BranchDecisionMaker");
        this.sVb = [function(A, z) {
            var B;
            B = A.ma;
            return B.K.xO ? (h.u && y.console.trace(("").concat(B.K.id, " does not need tracking")),
            {
                result: false
            }) : z(A);
        }
        , function() {
            return {
                result: true
            };
        }
        ];
        this.MGc = new l.Bfb(x,w);
    }
    m.xvc = function(n) {
        return n.Sb || n.tU;
    }
    ;
    m.Lwc = function(n) {
        var q, r;
        q = n.Oc;
        r = n.t2;
        return q ? q : r.length ? r[0] : n.PB[0];
    }
    ;
    m.prototype.abc = function(n) {
        this.sVb.unshift(n);
    }
    ;
    m.prototype.YV = function(n, q, r) {
        var u, v, w;
        u = this;
        export const undefined = == r && (r = false);
        v = n.K;
        r = c.$F.vM({
            ma: n,
            Rd: q,
            force: r
        }, this.sVb);
        h.u && this.console.trace(("tracking ").concat(n.K.id), {
            Jld: r
        });
        if (false === r.result)
            this.xVb !== n && this.reset();
        else {
            this.reset();
            this.xVb = n;
            w = this.pfc(n);
            r = w.Cza;
            q = q.lessThan(w.OXa);
            h.u && this.console.trace(("tracking ").concat(n.K.id), {
                M: v.id,
                Kdd: q,
                ild: null === r || undefined === r ? undefined : r.G
            });
            this.UVc(v, q ? r : undefined);
            if (q)
                this.CTa.on(n.events, "branchEdited", function() {
                    u.YV(n, u.tc.Qa.currentTime, true);
                });
        }
    }
    ;
    m.prototype.oub = function() {
        var n;
        null === (n = this.Xwb) || undefined === n ? undefined : n.La();
        this.Xwb = undefined;
    }
    ;
    m.prototype.reset = function() {
        this.oub();
        this.CTa.clear();
        this.xVb = undefined;
    }
    ;
    m.prototype.pfc = function(n) {
        var q, r, u, v, w;
        v = 1 < n.K.PB.length || 0 < (null !== (r = null === (q = n.K.km) || undefined === q ? undefined : q.length) && undefined !== r ? r : 0);
        r = m.xvc(n);
        q = c.I.Ca(v ? this.config.Gea : this.config.UGb);
        w = c.I.Ca(this.config.NJc + this.config.Fea);
        q = r.da(q);
        r = (0,
        k.Ts)(this.se.value) ? r.da(w) : q;
        if (n = this.qfc(n, v))
            if ((h.u && this.console.log("Calculated live decision", {
                reason: n.reason,
                type: null === (u = n.ng) || undefined === u ? undefined : u.type
            }),
            n.ng)) {
                if ("immediate" === n.ng.type)
                    return {
                        OXa: c.I.ia
                    };
                u = n.ng.when;
                h.u && (0,
                c.assert)(u.type === e.VP.absolute, "we only support abs times");
                h.u && this.console.log("Calculated live decision for time", {
                    Fbd: u.timestamp
                });
                return {
                    OXa: r,
                    Cza: u.timestamp
                };
            }
        return {
            OXa: r,
            Cza: q
        };
    }
    ;
    m.prototype.qfc = function(n, q) {
        if (this.config.Qqc)
            return this.MGc.OHc(n, q);
    }
    ;
    m.prototype.UVc = function(n, q) {
        var r, u;
        this.oub();
        r = this;
        u = this.Lj;
        q && (u = this.tc);
        this.Xwb = u.Fs(function() {
            return d.__generator(this, function(v) {
                switch (v.label) {
                case 0:
                    return q ? [4, e.ie.Jm(q)] : [3, 2];
                case 1:
                    (v.T(),
                    v.label = 2);
                case 2:
                    return (r.events.emit("onDeciding", {
                        type: "onDeciding",
                        ng: r.MBb(n),
                        ga: n
                    }),
                    [4, e.ie.QBa]);
                case 3:
                    return (v.T(),
                    r.NHc(n),
                    [2]);
                }
            });
        }, "branch decision");
    }
    ;
    m.prototype.MBb = function(n) {
        return m.Lwc(n);
    }
    ;
    m.prototype.NHc = function(n) {
        var q;
        this.CTa.clear();
        q = this.MBb(n);
        h.u && this.console.trace(("BranchDecisionMaker making decision for ").concat(n.id, ", decision is ").concat(q));
        this.YLc(n.id, q, true);
    }
    ;
    return m;
}
)();
export const gab = t;

// Detected exports: gab