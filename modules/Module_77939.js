/**
 * Netflix Cadmium Playercore - Module 77939
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 28518, 29670, 31149, 35128, 36129, 45266, 51344
 * Purpose: Audio handling, Logging, Configuration, Parsing/Serialization
 */

// import dep_28518 from './Module_28518.js';
// import dep_29670 from './Module_29670.js';
// import dep_31149 from './Module_31149.js';
// import dep_35128 from './Module_35128.js';
// import dep_36129 from './Module_36129.js';
// import dep_45266 from './Module_45266.js';
// import dep_51344 from './Module_51344.js';

// Webpack module 77939
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
class d extends c.E7 {
    constructor(l, m, n) {
    l = c.E7.call(this, l) || this;
    l.config = m;
    l.j = n;
    return l;
}
    OMb(l, m, n) {
    var q, r;
    q = this;
    r = this.config.RAa;
    m = m.filter(function(u) {
        var v, w;
        v = u.Jy || !u.De || u.streams && 0 < u.streams.length;
        v || q.log.warn("Audio track is missing streams", q.Qsa(u));
        w = 0 === r.length || 0 <= r.indexOf(u.jj);
        w || q.log.warn("Audio track is not supported", q.Qsa(u));
        return v && w;
    });
    if (!m.length)
        throw Error("no valid audio tracks");
    m = m.map(function(u) {
        return q.NMb(l, u, q.dvc(u, n));
    });
    this.log.trace("Parsed audio tracks", {
        Count: m.length
    });
    return m;
}
    sOc(l, m, n, q) {
    var r, u, v, w;
    r = this;
    u = Fa((0,
    g.zN)(function(x) {
        return x.Jy;
    }, m));
    m = u.next().value;
    u = u.next().value;
    u = Fa((0,
    g.zN)(function(x) {
        return x.streams && 0 < x.streams.length;
    }, u));
    v = u.next().value;
    u.next().value.forEach(function(x) {
        return r.log.warn("Audio track is missing streams", r.Qsa(x));
    });
    w = this.config.RAa;
    u = Fa((0,
    g.zN)(function(x) {
        return 0 === w.length || 0 <= w.indexOf(x.jj);
    }, v));
    v = u.next().value;
    u.next().value.forEach(function(x) {
        return r.log.warn("Audio track is not supported", r.Qsa(x));
    });
    m = [].concat(Ba(v), Ba(m)).map(function(x) {
        return r.NMb(l, x, r.oxc(x.ff, n, q));
    });
    if (!m.length)
        throw Error("no valid audio tracks");
    this.log.trace("Transformed audio tracks", {
        Count: m.length
    });
    return m;
}
    ydc(l) {
    var m, n;
    m = this;
    n = this.config.pUa;
    if (n) {
        if (l = Fa(l.filter(function(q) {
            return q.oh == n || q.trackId == n;
        })).next().value)
            return l;
    } else if (this.j.Kra && (l = Fa(l.filter(function(q) {
        return q.trackId == m.j.Kra;
    })).next().value))
        return l;
}
    NMb(l, m, n) {
    var q, r, u, v;
    v = m.jj;
    l = Object.assign(Object.assign({}, l), {
        type: f.mj.audio,
        EV: m.EV,
        variant: m.variant,
        trackId: m.ff,
        jj: e.nma[v.toLowerCase()] || e.Fv.FX,
        SN: v,
        oh: m.language,
        displayName: m.JM,
        Gc: null !== (q = m.Gc) && undefined !== q ? q : -1,
        De: null !== (r = m.De) && undefined !== r ? r : true,
        channels: m.channels,
        Xcd: m.channels,
        sk: n,
        Bj: {
            Bcp47: m.language,
            TrackId: m.ff
        },
        streams: [],
        isNative: m.isNative,
        dr: m.Jy,
        Gha: m.Gha
    });
    l.streams = this.DVb(m.streams, l);
    this.log.trace("Transformed audio track", l, {
        StreamCount: l.streams.length,
        AllowedTimedTextTracks: l.sk.length
    });
    l.E$ = p.cZb[null === (u = l.streams[0]) || undefined === u ? undefined : u.Zc];
    return l;
}
    Qsa(l) {
    return {
        language: l.JM,
        bcp47: l.language,
        type: l.jj
    };
}
    dvc(l, m) {
    var n;
    n = this;
    return m.filter(function(q) {
        var r;
        if (0 <= (null === (r = l.Ioc) || undefined === r ? undefined : r.indexOf(q.trackId)))
            return false;
        if (!n.config.UOa || !q.dr() || q.Hp())
            if (l.fxb) {
                if (l.fxb !== q.trackId && (q.dr() || q.Hp()))
                    return false;
            } else if (l.MLc) {
                if (q.dr() || q.Hp())
                    return false;
            } else if (q.Hp())
                return false;
        return true;
    });
}
    oxc(l, m, n) {
    var q;
    m = m.filter(function(r) {
        return r.oa.V === l;
    }).map(function(r) {
        return r.oa.Ea;
    }).map(function(r) {
        return n.find(function(u) {
            return u.trackId === r;
        });
    }).filter(Boolean);
    if (this.config.UOa && !m.find(function(r) {
        return r.dr() && !r.Hp();
    })) {
        q = n.find(function(r) {
            return r.dr() && !r.Hp();
        });
        q && m.push(q);
    }
    return m;
}
}
b.K$a = undefined;
p = a(29670);
c = a(28518);
g = a(45266);
f = a(51344);
e = a(35128);
h = a(36129);
k = a(31149);
d.prototype.$sc = function(l, m) {
    this.config.zsb.forEach(function(n) {
        var q, r, u;
        q = m.kn.filter(function(v) {
            return v.profile === n;
        }).reduce(function(v, w) {
            w.streams.map(function(x) {
                return x.bitrate;
            }).forEach(function(x) {
                v.add(x);
            });
            return v;
        }, new Set());
        r = false;
        u = l.Aa.kn.map(function(v) {
            var w;
            if (v.profile === n) {
                w = v.streams.filter(function(x) {
                    return q.has(x.bitrate);
                });
                if (w.length === v.streams.length)
                    return v;
                r = true;
                if (0 === w.length)
                    throw new k.we(h.ea.hgb,h.Y.RYb);
                return Object.assign(Object.assign({}, v), {
                    streams: w
                });
            }
            return v;
        });
        r && (l.Aa = Object.assign(Object.assign({}, l.Aa), {
            kn: u
        }));
    });
    return l;
}
;
b.K$a = d;

