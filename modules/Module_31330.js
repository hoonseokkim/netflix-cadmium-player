/**
 * Netflix Cadmium Playercore - Module 31330
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Nhb
 * Dependencies: 8149, 48170, 52571, 78647, 91176
 * Purpose: Logging, Error handling
 */

// import dep_8149 from './Module_8149.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_78647 from './Module_78647.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 31330
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h) {
    return ("").concat(h.ca(), " (nrdp: ").concat(h.cV, "ms)");
}

p = a(91176);
c = a(78647);
g = a(48170);
f = a(52571);
e = a(8149);
t = (function() {
    class h {
    constructor(k) {
        this.console = k;
        this.offset = this.Wk = this.ON = p.I.ia;
    }
    yt(k) {
        var l;
        (0,
        f.assert)(k.Ha, "NrdpRounding: stream.frameDuration must exist.");
        this.Ha = k.Ha;
        l = k.ci ? k.Ge || p.I.ia : p.I.ia;
        this.Ge && (this.ON = l.da(this.Ge));
        this.Ge = l;
        this.Wk = (0,
        e.dk)(k) ? k.Wk || p.I.ia : p.I.ia;
        g.u && this.console.trace(("NrdpRounding::setStream: live ").concat((0,
        e.dk)(k) ? "true" : "false", ", ") + ("profile offset: ").concat(this.Ge.ca(), ", ") + ("presentation offset: ").concat(this.Wk.ca()));
    }
    append(k) {
        var l, m, n, q, r;
        (0,
        f.assert)(this.Ge, "NrdpRounding: profileTimestampOffset must exist.");
        (0,
        f.assert)(this.Ha, "NrdpRounding: frameDuration must exist.");
        if (k.Ih)
            return k;
        l = k.Na;
        m = k.offset;
        n = k.qf;
        q = k.Sh;
        if (undefined !== this.tHb) {
            (0,
            f.assert)(undefined !== this.vZa);
            r = this.tHb.add(this.ON);
            l.qa.add(k.offset).equal(r) ? (k = this.Jfc(l, m.add(this.offset)).G - this.vZa,
            0 > k ? this.offset = this.offset.add(p.I.bz) : 0 === k ? this.offset.lessThan(p.I.ia) && (this.offset = this.offset.add(p.I.bz)) : 1 === k ? this.offset.greaterThan(p.I.ia) && (this.offset = this.offset.da(p.I.bz)) : this.offset = this.offset.da(p.I.bz)) : (g.u && this.console.trace("NrdpRounding: non-seamless: reverting to zero offset"),
            this.offset = p.I.ia);
        }
        this.vZa = this.Ifc(l, m.add(this.offset)).G;
        this.tHb = l.wa.add(m);
        this.ON = p.I.ia;
        return {
            Na: l,
            offset: m.add(this.offset),
            qf: n,
            Ih: false,
            Sh: q
        };
    }
    Jfc(k, l) {
        var m, n;
        k = this.lrb(k.qa);
        l = l.da(this.Wk);
        m = (0,
        c.SE)(k).add((0,
        c.SE)(l));
        n = k.add(l).da(m);
        g.u && this.console.trace("NrdpRounding: content start " + d(k) + ", adjusted offset: " + d(l) + ", start rounding error: " + (0,
        c.SE)(k).toString() + ", adjusted offset rounding error: " + (0,
        c.SE)(l).toString() + ", total error: " + m.toString() + ", expected nrdp value:" + n.ca() + ", (" + k.cV + l.cV + "ms), last fragment end nrdp: " + this.vZa);
        return n;
    }
    Ifc(k, l) {
        var m, n, q;
        m = this.Ha;
        k = this.lrb(k.wa);
        l = l.da(this.Wk);
        n = (0,
        c.SE)(k.da(m)).add((0,
        c.SE)(m)).add((0,
        c.SE)(l));
        q = k.add(l).da(n);
        g.u && this.console.trace("NrdpRounding: content end: start of last frame:" + d(k.da(m)) + ", frame duration: " + d(m) + ", adjusted offset: " + d(l) + ", timestamp rounding error: " + (0,
        c.SE)(k.da(m)).toString() + ", frame duration rouding error: " + (0,
        c.SE)(m).toString() + ", adjusted offset rounding error: " + (0,
        c.SE)(l).toString() + ", total rounding error: " + n.toString() + ", expected nrdp value: " + q.ca() + ", (" + k.da(m).cV + m.cV + l.cV + "ms)");
        return q;
    }
    lrb(k) {
        return k.add(this.Wk).da(this.Ge);
    }
}
return h;
}
)();
export const Nhb = t;

// Detected exports: Nhb
