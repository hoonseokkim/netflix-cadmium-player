/**
 * Netflix Cadmium Playercore - Module 86048
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 86048
// Parameters: t (module), b (exports), a (require)


var p, c;
function d(g, f) {
    return f === p.l.yk ? 0 : Object.keys(g.GN).map(function(e) {
        return g.GN[e];
    }).filter(function(e) {
        return void 0 === e.dB || 1 === e.dB;
    }).reduce(function(e, h) {
        return e + h.lw[f];
    }, 0);
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.$lb = void 0;
p = a(65161);
c = a(48170);
t = (function() {
    function g(f, e, h) {
        this.Z = f;
        this.console = e;
        this.xVa = h;
    }
    g.prototype.lH = function(f, e, h) {
        var k, l, m, n;
        k = h && this.Z.config.H3c;
        l = this.Z.config.MJ || k;
        m = this.xVa();
        if (k) {
            k = f.global;
            k = (n = {},
            n[p.l.V] = k[p.l.V] - d(f, p.l.V),
            n[p.l.U] = k[p.l.U] - d(f, p.l.U),
            n[p.l.Ea] = k[p.l.Ea] - d(f, p.l.Ea),
            n);
        }
        n = k;
        m = this.tQa(e) || this.chc(f) || this.ahc(f, m, n) || this.bhc(f, m, n, e);
        n = (0,
        p.qPb)(m);
        if (m && (!n || l))
            return (c.u && this.console.log(("canIssueRequest ").concat(this.Z.id, " [").concat(e, "] static limit: ") + ("").concat(h, ", usage: ").concat(JSON.stringify(f), ", failed ").concat(m)),
            {
                lU: !1,
                reason: m
            });
        c.u && this.console.log(("canIssueRequest ").concat(this.Z.id, " [").concat(e, "] static limit: ") + ("").concat(h, ", usage: ").concat(JSON.stringify(f), ", success ").concat(m));
        return {
            lU: !0,
            reason: m
        };
    }
    ;
    g.prototype.tQa = function(f) {
        var e;
        e = this.Z.config.BI;
        if (this.Z.owc(f) >= (e || Infinity))
            return "mediaDurationLimit";
    }
    ;
    g.prototype.chc = function(f) {
        return f.GN[this.Z.id].total.total > (this.Z.zsa() || Infinity) ? "playgraphMemoryLimit" : void 0;
    }
    ;
    g.prototype.ahc = function(f, e, h) {
        f = f.global;
        return h ? h[p.l.V] + h[p.l.U] > (e.z6a.total || Infinity) ? "staticMemoryLimit" : void 0 : f.total > (e.total.total || Infinity) ? "globalMemoryLimit" : void 0;
    }
    ;
    g.prototype.bhc = function(f, e, h, k) {
        var l;
        l = f.global;
        if (k !== p.l.yk)
            return h ? (c.u && this.console.log(("checkRequestByMediaTypeMemory [").concat(k, "]:") + (" using static limit ").concat(e.z6a[k], ", usage: ").concat(h) + (" (global: ").concat(l[k], " ") + (" - certain contiguous: ").concat(d(f, k), ")")),
            h[k] > (e.z6a[k] || Infinity) ? k === p.l.U ? "staticVideoMemoryLimit" : "staticAudioMemoryLimit" : void 0) : l[k] > (e.total[k] || Infinity) ? k === p.l.U ? "globalVideoMemoryLimit" : "globalAudioMemoryLimit" : void 0;
    }
    ;
    return g;
}
)();
b.$lb = t;
