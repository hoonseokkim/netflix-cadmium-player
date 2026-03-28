/**
 * Netflix Cadmium Playercore - Module 89540
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: L9a
 * Dependencies: 37509, 80966, 81734, 85001, 94293, 94886
 * Purpose: Buffer/Segment management, Logging, Event handling, Configuration
 */

// import dep_37509 from './Module_37509.js';
// import dep_80966 from './Module_80966.js';
// import dep_81734 from './Module_81734.js';
// import dep_85001 from './Module_85001.js';
// import dep_94293 from './Module_94293.js';
// import dep_94886 from './Module_94886.js';

// Webpack module 89540
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
class d {
    constructor(k, l, m, n, q, r, u, v, w, x) {
    var y;
    y = this;
    this.fb = k;
    this.j = l;
    this.log = m;
    this.config = n;
    this.mWc = q;
    this.ybc = r;
    this.PUb = u;
    this.Cq = new p.Ac(false);
    this.Xb = new e.jl();
    this.Loa = false;
    this.Zea = function() {
        y.Loa = true;
        y.Xv.Ptc();
        h.Ce.removeListener(h.Dn, y.Zea);
    }
    ;
    this.VR = w(this);
    k = k.lm();
    this.Xv = v({
        Ia: l.Ia.toString()
    });
    v = null === k || undefined === k ? undefined : k.sr.events;
    null === v || undefined === v ? undefined : v.addListener("adPresenting", function() {
        false;
        y.Gzb();
    });
    null === v || undefined === v ? undefined : v.addListener("adBreakPresenting", function(A) {
        false;
        false;
        y.ina = A.presentingInfo.Sa.type;
        "embedded" === y.ina || y.j.HYa() || x.m2(l);
        y.Cq.set(true);
    });
    null === v || undefined === v ? undefined : v.addListener("adBreakEnded", function() {
        false;
        y.Cq.set(false);
    });
    null === v || undefined === v ? undefined : v.addListener("adPlaygraphUpdated", function() {
        false;
    });
    null === v || undefined === v ? undefined : v.addListener("segmentDropped", function(A) {
        var z;
        false;
        z = y.j.mm(A.segmentId);
        y.mWc.ERc(A, z);
    });
    null === v || undefined === v ? undefined : v.addListener("advertsMismatch", function(A) {
        false;
        y.ybc.rRc(A, y.j.ga);
    });
    this.$w = new g.Bla();
    this.j.addEventListener("playbackStart", function() {
        y.$w.resolve();
    });
    v = null === k || undefined === k ? undefined : k.PS.events;
    null === v || undefined === v ? undefined : v.addListener("adEvent", function(A) {
        y.$w.promise.then(function() {
            var z, B;
            A.event === c.pCa.pac && y.PUb.forEach(function(C) {
                return C.start(y.j);
            });
            z = y.Rzc(A);
            if (A.event === c.pCa.qac && z) {
                B = y.Loa ? c.vCa.gWb : l.$j ? c.vCa.error : c.vCa.hsc;
                z = Object.assign(Object.assign({}, z), {
                    reason: B
                });
            }
            y.Xv.EWc(A, l, z, y.Loa);
        });
    });
    null === v || undefined === v ? undefined : v.addListener("adBreakEvent", function(A) {
        A.event === c.z9a.Jna && y.Xb.qd(f.rCa.Jna);
        y.$w.promise.then(function() {
            y.Xv.DWc(A, l, y.Loa);
        });
    });
    h.Ce.addListener(h.Dn, this.Zea);
}
    addEventListener(k, l, m) {
    this.Xb.addListener(k, l, m);
}
    removeEventListener(k, l) {
    this.Xb.removeListener(k, l);
}
    aB() {
    var k, l;
    if (this.dTa && false !== this.Cq.value)
        return null === (l = null === (k = this.fb) || undefined === k ? undefined : k.lm()) || undefined === l ? undefined : l.Wi.KN;
}
    hR() {
    var k, l, m;
    return null !== (m = null === (l = null === (k = this.fb) || undefined === k ? undefined : k.lm()) || undefined === l ? undefined : l.hR()) && undefined !== m ? m : true;
}
    ica() {
    var k, l;
    return (null === (l = null === (k = this.fb) || undefined === k ? undefined : k.lm()) || undefined === l ? undefined : l.sr.ica()) || ({
        pz: undefined,
        UI: undefined,
        pI: undefined
    });
}
    sCb() {
    var k, l, m, n;
    m = this.aB();
    if (m) {
        n = {
            position: null === m || undefined === m ? undefined : m.position.offset.G,
            adDuration: null === (k = null === m || undefined === m ? undefined : m.XK) || undefined === k ? undefined : k.vc.endTime.G,
            adIndex: null === (l = m.XK) || undefined === l ? undefined : l.index,
            adBreakIndex: m.index,
            adBreakDuration: null === m || undefined === m ? undefined : m.Sa.duration.G
        };
        (k = m.U1a) && (n.padding = {
            type: k.wxa,
            duration: k.txa.G
        });
        return n;
    }
}
    WH() {
    var k, l, m, n, q;
    if (!this.dTa)
        return [];
    n = this.j.ga.R.toString();
    q = null === (l = null === (k = this.fb) || undefined === k ? undefined : k.lm()) || undefined === l ? undefined : l.sr.WH({
        Kz: [n]
    });
    return null !== (m = null === q || undefined === q ? undefined : q.result[n]) && undefined !== m ? m : [];
}
    Gw() {
    var k, l, m, n, q;
    n = this.j.ga.R.toString();
    q = null === (l = null === (k = this.fb) || undefined === k ? undefined : k.lm()) || undefined === l ? undefined : l.sr.Gw({
        Kz: [n]
    });
    return null !== (m = null === q || undefined === q ? undefined : q.result[n]) && undefined !== m ? m : false;
}
    Gzb() {}
    Rzc(k) {
    var l;
    l = this.PUb.reduce(function(m, n) {
        return Object.assign(Object.assign({}, m), n.Rsa(k));
    }, {});
    return Object.assign(Object.assign({}, l), {
        thirdPartyVerificationToken: k.N4
    });
}
}
p = a(81734);
c = a(80966);
g = a(94293);
f = a(85001);
e = a(94886);
h = a(37509);
Ha.Object.defineProperties(d.prototype, {
    dTa: {
        configurable: true,
        enumerable: true,
        get: function() {
            var k;
            return this.ina ? this.config().Gyb || "embedded" !== this.ina : (null === (k = this.j.Hc) || undefined === k ? 0 : k.Da) ? this.config().Gyb : true;
        }
    },
    xHb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.ina;
        }
    }
});
export const L9a = d;

// Detected exports: L9a
