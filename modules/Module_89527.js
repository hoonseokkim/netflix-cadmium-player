/**
 * Netflix Cadmium Playercore - Module 89527
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 89527
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.OW = void 0;
d = a(22970);
p = a(90745);
c = a(52571);
g = a(48170);
f = 0;
t = (function(e) {
    function h(k, l, m, n, q, r, u, v) {
        l = e.call(this, ("cdnList").concat(f++), l, m, n, q, r, u, "cdnList", v) || this;
        l.di = k;
        l.Gb();
        return l;
    }
    d.__extends(h, e);
    h.prototype.Gb = function() {
        var k;
        k = this;
        this.zfa = new p.sf();
        this.zfa.on(this.Mb.player, "skipped", function(l) {
            k.gF && ((null === l || void 0 === l ? 0 : l.yOb) && k.I$(l.yOb),
            k.gF = void 0);
        });
        this.zfa.on(this.Mb.player, "paused", function() {
            k.gF && k.Mb.Sd && k.I$(k.Mb.Rd);
        });
        this.zfa.on(this.Mb.player, "underflow", function() {
            k.gF && k.Mb.Sd && k.I$(k.Mb.Rd);
        });
    }
    ;
    h.prototype.zA = function(k, l, m) {
        this.zfa.clear();
        e.prototype.zA.call(this, k, l, m);
        this.Gb();
    }
    ;
    h.prototype.close = function() {
        g.u && this.console.trace("close");
        e.prototype.close.call(this);
        this.zfa.clear();
    }
    ;
    h.prototype.sZc = function(k, l) {
        var m;
        m = this;
        this.gF && this.I$(k);
        return this.fAb(l).map(function(n) {
            return m.di[n];
        });
    }
    ;
    h.prototype.NPb = function(k) {
        var l;
        l = this;
        this.fAb(k).forEach(function(m) {
            delete l.di[m];
        });
    }
    ;
    h.prototype.fAb = function(k) {
        var l;
        l = this;
        return Object.keys(this.di).filter(function(m) {
            return l.di[m].R === ("").concat(k);
        });
    }
    ;
    h.prototype.Np = function(k) {
        var l, m, n;
        l = k.stream;
        m = k.md;
        n = k.Vb;
        k = k.Sb;
        (0,
        c.assert)(void 0 !== n);
        (0,
        c.assert)(void 0 !== k);
        g.u && this.console.trace(("Media appended ").concat(n.ca(), "-").concat(k.ca()));
        this.BOa({
            stream: l,
            md: m
        }, n, k);
    }
    ;
    h.prototype.rua = function(k, l) {
        return k.stream === l.stream && k.md === l.md;
    }
    ;
    h.prototype.Pwc = function(k) {
        var l, m;
        m = k.Mt;
        k = m.md;
        m = null === (l = m.stream.L.S.FA) || void 0 === l ? void 0 : l.Sf;
        return ("").concat(k, "::").concat(m);
    }
    ;
    h.prototype.cTa = function(k, l) {
        g.u && this.console.trace(("Presenting event for ( ").concat(k.Mt.stream.id, ", ").concat(k.Mt.md, " )") + (" at ").concat(l.ca()));
        this.gF ? this.I$(l) : this.J$ = l;
        this.gF = k;
    }
    ;
    h.prototype.I$ = function(k) {
        var l, m, n, q, r, u, v, w, x;
        (0,
        c.assert)(this.gF);
        if (null === (l = this.VRa) || void 0 === l ? 0 : l.lessThan(k))
            k = this.VRa;
        r = this.gF;
        l = this.di;
        u = r.Mt;
        v = u.stream;
        u = u.md;
        w = null === (m = v.vT) || void 0 === m ? void 0 : m.sh;
        m = k.da(this.J$ || r.timestamp).G;
        if (void 0 !== u && void 0 !== w) {
            x = null === (n = v.L.S.FA) || void 0 === n ? void 0 : n.Sf;
            n = v.track.R;
            r = this.Pwc(r);
            l = (q = (l[r] || (l[r] = {
                Gk: u,
                Sf: x,
                R: n,
                yo: {}
            })).yo)[w] || (q[w] = {
                bitrate: v.bitrate,
                ob: w,
                mediaType: v.mediaType,
                totalTime: 0,
                Wb: v.Wb
            });
            l.totalTime = Math.max(l.totalTime + m, 0);
        }
        this.J$ = k;
    }
    ;
    h.prototype.clone = function(k, l) {
        l = void 0 === l ? {} : l;
        k = new (l.$ld || h)(k,this.yNc,this.Mb,this.loa,this.events,this.ax,this.tc,l.priority);
        this.Whc(k);
        k.gF = this.gF;
        k.J$ = this.J$;
        g.u && k.console.trace("Cloning", {
            Vbd: k.hk.length
        });
        return k;
    }
    ;
    h.prototype.reset = function() {
        e.prototype.reset.call(this);
        this.J$ = void 0;
    }
    ;
    h.prototype.GM = function(k) {
        return ("(").concat(k.stream.Oa, ", ").concat(k.md, ")");
    }
    ;
    return h;
}
)(a(546).yla);
b.OW = t;


// Detected exports: OW