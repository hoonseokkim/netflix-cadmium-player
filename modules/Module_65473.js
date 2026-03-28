/**
 * Netflix Cadmium Playercore - Module 65473
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Li, MP, Qn
 * Dependencies: 85001
 * Purpose: Encryption/Decryption, Error handling, Class definition
 */

// import dep_85001 from './Module_85001.js';

// Webpack module 65473
// Parameters: t (module), b (exports), a (require)

var p;
class d {
    constructor(c, g, f, e, h) {
    var k;
    k = this;
    this.rb = c;
    this.Im = g;
    this.ov = f;
    this.Xb = e;
    this.ur = h;
    this.jya = new Map();
    this.kYc();
    this.Xb.addListener(p.cb.loaded, function() {
        return k.rOb();
    });
}
    erb(c) {
    var g, f;
    g = this;
    f = Object.keys(this.rb.Qn.ba).find(function(e) {
        return g.rb.Qn.ba[e].J === c.R;
    });
    c.id || (c.id = null !== f && undefined !== f ? f : this.ur.xy(c.R));
    f || (this.rexport const Qn = this.ur.ccc(this.rb.Qn, c));
    f = this.DU(c.id);
    c.Cj && this.rb.KWb(c.id, c.Cj);
    return f;
}
    QVb() {
    return Promise.reject(Error("Error isn't recoverable"));
}
    eXa(c, g) {
    var f;
    f = this;
    g = undefined === g ? {} : g;
    return this.ov.transition(c, g).then(function() {
        f.rexport const Li = c;
    });
}
    close(c) {
    return this.ov.close(c);
}
    Ws() {
    return this.ov.Ryc();
}
    Vq() {
    return this.ov.Vq();
}
    bI() {
    return this.ov.bI();
}
    DU(c) {
    this.jya.has(c) || this.jya.set(c, this.ov.cf(this.Vec(c)));
    return this.jya.get(c);
}
    kYc() {
    var c;
    c = this;
    this.ov.addListener(p.JX.Rga, function(g) {
        return c.Xb.qd(p.JX.Rga, g);
    });
    Object.values(p.cb).forEach(function(g) {
        c.ov.addListener(g, function(f) {
            return c.Xb.qd(g, f);
        });
    });
}
    t1a(c) {
    this.ov.HWb({
        id: c,
        R: this.rb.Hu(c).J,
        Cj: this.rb.rzc(c)
    });
}
    ZT() {}
    rOb() {
    var c, g;
    if (this.Ws()) {
        c = this.rb.Li;
        g = this.rb.cca(c);
        g && !this.jya.has(g) && (this.t1a(c),
        this.DU(g));
    }
}
    Vec(c) {
    var g, f, e, h;
    f = this.rb.Hu(c);
    e = this.Im.KS(f.J);
    h = null === e || undefined === e ? undefined : e.Xa;
    e = null === e || undefined === e ? undefined : e.S;
    return {
        id: c,
        R: f.J,
        bg: f.Mp,
        Nb: f.Va,
        Cj: null !== (g = null === h || undefined === h ? undefined : h.Cj) && undefined !== g ? g : f.eb,
        Xa: h,
        S: e
    };
}
}
p = a(85001);
d.prototype.$E = function() {
    this.rOb();
}
;
export const MP = d;

// Detected exports: Li, MP, Qn
