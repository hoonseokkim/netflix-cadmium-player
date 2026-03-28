/**
 * Netflix Cadmium Playercore - Module 29688
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Kfb
 * Dependencies: 22970, 60028, 65161, 90745, 91176, 91967
 * Purpose: Audio handling, Video handling, Event handling, Configuration
 */

// import dep_22970 from './Module_22970.js';
// import dep_60028 from './Module_60028.js';
// import dep_65161 from './Module_65161.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';
// import dep_91967 from './Module_91967.js';

// Webpack module 29688
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;

d = a(22970);
p = a(90745);
c = a(91176);
g = a(65161);
f = a(60028);
e = a(91967);
t = (function() {
    class h {
    constructor(k) {
        this.Z = k;
        this.yw = "liveReport";
        this.FB = "livereport";
        this.GD = c.I.uh;
        this.events = new p.EventEmitter();
        this.F$ = f.Z7.gma;
        this.FG = false;
        this.trace = [];
        this.$Sa = [];
        this.qVb = 1;
        this.qqa = this.pqa = this.sqa = this.rqa = 0;
        0 < k.config.jIb && 0 < k.config.WZa && (this.GD = c.I.Ca(k.config.WZa),
        this.qVb = Math.max(Math.floor(k.config.jIb / k.config.WZa), 1),
        this.FG = true);
        k.events.on("downloadComplete", this.SSc.bind(this));
    }
    SSc(k) {
        var l, m;
        l = k.mediaType;
        m = k.bytes;
        k = k.durationMs;
        l === g.l.U ? (this.rqa += m,
        this.sqa += k) : l === g.l.V && (this.pqa += m,
        this.qqa += k);
    }
    hic() {
        var k, l, m, n;
        l = this.Z.player;
        if (l.Sd) {
            m = l.bC;
            n = m.L;
            if (n = n.Ab ? n : (null === (k = n.jk) || undefined === k ? 0 : k.Ab) ? n.jk : undefined) {
                if (((0,
                c.assert)(n.Ic, "Expected live viewable with presenting service"),
                k = n.Ic.Zba(true).G,
                l = this.Z.Pn(l.Rd)))
                    (l = this.Z.Rs(l).Ga,
                    n = n.Wf,
                    k += l.G,
                    l = this.Z.XL(),
                    this.trace.push([n, k, l.totalabuflmsecs, l.totalvbuflmsecs]),
                    this.gic(m));
            } else
                this.FG = false;
        }
    }
    gic(k) {
        var l, m, n, q, r;
        try {
            l = k.$d(g.l.U);
            if (l) {
                m = l.mVa();
                if (m) {
                    n = k.vj;
                    if (null !== n && undefined !== n && n.WSa) {
                        q = n.FH.Bl();
                        r = m.rI;
                        this.$Sa.push([q.toFixed(2), r.rF, r.RE, r.yN.toFixed(3), r.$I.toFixed(3)]);
                    }
                }
            }
        } catch (u) {}
    }
    ef(k) {
        var l, m, n;
        l = k.UFb;
        k = k.Ui;
        this.FG && (l || k === e.Sc.Gm) && this.hic();
        if (this.trace.length === this.qVb || 0 < this.trace.length && k === e.Sc.Wj) {
            l = this.trace;
            k = this.$Sa;
            m = d.__read(l[l.length - 1], 2);
            n = m[0];
            m = m[1];
            this.trace = [];
            this.$Sa = [];
            l = {
                type: "livereport",
                samplinginterval: this.GD.G,
                trace: l,
                ellastat: k,
                encodingpipelinetime: n,
                devicepts: m,
                videoDownloadedBytes: this.rqa,
                videoDownloadedMs: this.sqa,
                audioDownloadedBytes: this.pqa,
                audioDownloadedMs: this.qqa
            };
            this.qqa = this.pqa = this.sqa = this.rqa = 0;
            return {
                qO: true,
                event: l
            };
        }
        return {
            qO: false
        };
    }
}
return h;
}
)();
export const Kfb = t;

// Detected exports: Kfb
