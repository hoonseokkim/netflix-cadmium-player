/**
 * Netflix Cadmium Playercore - Module 14494
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Beb
 * Dependencies: 31149, 36129
 * Purpose: Caching/Storage, Error handling, Class definition
 */

// import dep_31149 from './Module_31149.js';
// import dep_36129 from './Module_36129.js';

// Webpack module 14494
// Parameters: t (module), b (exports), a (require)

var p, c;
class d {
    constructor(g, f, e, h, k) {
    this.version = g;
    this.mU = f;
    this.C6a = e;
    this.Ht = h;
    this.dia = k;
}
    load(g) {
    return this.gHc(g);
}
    set(g) {
    this.As = g;
    return this.$Oc();
}
    gHc(g) {
    var f;
    f = this;
    this.oIb || (this.oIb = new Promise(function(e, h) {
        function k(l) {
            f.Xnc().then(function() {
                h(l);
            }).catch(function() {
                h(l);
            });
        }
        f.EWa().then(function(l) {
            f.storage = l;
            return f.storage.load(f.mU);
        }).then(function(l) {
            var m;
            l = l.value;
            try {
                m = g(l);
                f.version = m.version;
                f.As = m.data;
                e();
            } catch (n) {
                k(n);
            }
        }).catch(function(l) {
            l.Ya !== p.Y.tG ? h(l) : e();
        });
    }
    ));
    return this.oIb;
}
    Xnc() {
    var g;
    g = this;
    return this.C6a ? new Promise(function(f, e) {
        g.EWa().then(function(h) {
            return h.remove(g.mU);
        }).then(function() {
            f();
        }).catch(function(h) {
            e(h);
        });
    }
    ) : Promise.resolve();
}
    EWa() {
    return this.storage ? Promise.resolve(this.storage) : this.Ht.create();
}
}
p = a(36129);
c = a(31149);
d.prototype.$Oc = function() {
    var g, f, e, h, k;
    g = this;
    if (!this.C6a)
        return Promise.resolve();
    if (this.CAa) {
        h = new Promise(function(l, m) {
            f = l;
            e = m;
        }
        );
        k = function() {
            g.CAa = h;
            g.$Tb().then(function() {
                f();
            }).catch(function(l) {
                e(l);
            });
        }
        ;
        this.CAa.then(k).catch(k);
        return h;
    }
    return this.CAa = this.$Tb();
}
;
d.prototype.$Tb = function() {
    var g, f;
    g = this;
    f = this.dia();
    return new Promise(function(e, h) {
        g.EWa().then(function(k) {
            return k.save(g.mU, f, false);
        }).then(function() {
            e();
        }).catch(function(k) {
            h(d.u1c(p.ea.B4b, k));
        });
    }
    );
}
;
d.u1c = function(g, f) {
    var e;
    if (f.Ya && f.Jc)
        return new c.we(g,f.Ya,undefined,undefined,undefined,undefined,undefined,f.Jc);
    if (undefined !== f.subCode) {
        e = f.message ? f.message + " " : "";
        f.code = g;
        f.message = "" === e ? undefined : e;
        return f;
    }
    return f instanceof Error ? new c.we(g,p.Y.Sr,undefined,undefined,undefined,undefined,f.stack,f) : new c.we(g,p.Y.lo,undefined,undefined,undefined,undefined,undefined,f);
}
;
export const Beb = d;

// Detected exports: Beb
