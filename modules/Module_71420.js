/**
 * Netflix Cadmium Playercore - Module 71420
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: tmb
 * Dependencies: 14423, 22365, 35128, 75568
 * Purpose: Logging, Configuration, Error handling
 */

// import dep_14423 from './Module_14423.js';
// import dep_22365 from './Module_22365.js';
// import dep_35128 from './Module_35128.js';
// import dep_75568 from './Module_75568.js';

// Webpack module 71420
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
class d {
    constructor(e, h, k, l) {
    this.log = e;
    this.config = h;
    this.j = k;
    this.E2a = l;
}
    fNb(e, h) {
    var k;
    k = this;
    h = h.map(function(l) {
        var m, n, q, r;
        q = k.H1c(l);
        l.Jy || !l.De || q && 0 < q.length || k.log.error("track without downloadables", k.wxc(l));
        r = {};
        0 < q.length && (r = q[0],
        r.profile == p.gs.xX && (r = k.BWc(q),
        false));
        l = k.E2a(k.j, l.ff, null !== (m = l.Gc) && undefined !== m ? m : -1, null !== (n = l.De) && undefined !== n ? n : true, e, r.ob, r.urls || [], l.language, l.JM, g.nma[l.jj.toLowerCase()] || g.Fv.FX, l.EV, l.variant, l.SN.toUpperCase(), r.profile, k.Lxc(r) || ({}), l.Jy, l.mda, l.hua, l.iB);
        k.log.trace("Transformed timed text track", l);
        return l;
    });
    this.log.trace("Transformed timed text tracks", {
        Count: h.length
    });
    return h;
}
    m1c(e) {
    var h, k;
    h = this;
    k = this.config.sUa;
    if (k) {
        if (e = Fa(e.filter(function(l) {
            return l.oh == k || l.trackId == k;
        })).next().value)
            return e;
    } else if (this.j.Lra && (e = Fa(e.filter(function(l) {
        return l.trackId == h.j.Lra;
    })).next().value))
        return e;
}
    H1c(e) {
    var h, k;
    h = this;
    k = e.byb;
    e = Object.entries(e.FJ || ({})).map(function(l) {
        var m;
        m = Fa(l);
        l = m.next().value;
        m = m.next().value;
        return {
            ob: k[l],
            profile: l,
            size: m.size || 0,
            priority: h.lwc(l, m),
            offset: m.Z_a || 0,
            gPc: m.width,
            DNb: m.height,
            urls: m.urls
        };
    });
    e.sort(function(l, m) {
        return l.priority - m.priority;
    });
    return e;
}
    lwc(e, h) {
    var k, l;
    k = this.config.DC.indexOf(e);
    h = h.size;
    l = this.config.S4;
    return e === p.gs.UDa && 0 < l && h > l ? this.config.DC.length + 1 : 0 <= k ? k : this.config.DC.length;
}
    Lxc(e) {
    if (e.profile === p.gs.xX)
        return {
            offset: e.offset,
            length: e.size,
            Oo: {
                width: e.gPc,
                height: e.DNb
            }
        };
}
    BWc(e) {
    var h, k;
    h = this.config.NXa || f.ZKa.dDb();
    k = Fa(e.filter(function(l) {
        return l.profile === p.gs.xX;
    }).filter(function(l) {
        return l.DNb === h;
    })).next().value;
    if (k)
        return k;
    this.log.warn("none of the downloadables match the intended resolution", {
        screenHeight: c.kK.height,
        intendedResolution: h
    });
    return e[0];
}
    wxc(e) {
    return {
        isNone: e.Jy,
        isForced: e.mda,
        bcp47: e.language,
        id: e.ff
    };
}
}
p = a(75568);
c = a(22365);
g = a(35128);
f = a(14423);
export const tmb = d;

// Detected exports: tmb
