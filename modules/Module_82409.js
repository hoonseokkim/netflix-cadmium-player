/**
 * Netflix Cadmium Playercore - Module 82409
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: Kab
 */

// Webpack module 82409
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f) {
    this.log = g;
    this.config = f;
}
export const Kab = undefined;
p = a(45266);  // import from Module_45266
c = a(64274);  // import from Module_64274
d.prototype.PMb = function(g, f) {
    var e, h, k, l;
    e = this;
    h = this.config.jQa;
    k = this.config.iQa;
    g = Fa((0,
    p.zN)(function(m) {
        return (!h.length || 0 <= h.indexOf(m.id)) && 0 > k.indexOf(m.id);
    }, g || []));
    l = g.next().value;
    g.next().value.forEach(function(m) {
        return e.log.warn("Cdn is not allowed", {
            Id: m.id
        });
    });
    g = l.map(function(m) {
        var n;
        n = (f ? f.find(function(q) {
            return q.key === m.key;
        }) : undefined) || ({});
        return {
            id: m.id,
            name: m.name,
            Gc: m.Gc,
            type: m.type,
            sIb: m.key,
            fEc: m.DIb,
            location: {
                id: n.key,
                Gc: n.Gc,
                level: n.level,
                weight: n.weight
            }
        };
    });
    g.sort(function(m, n) {
        return m.Gc - n.Gc;
    });
    this.log.trace("Transformed cdns", {
        Count: g.length
    });
    if (!g.length)
        throw Error("no valid cdns");
    return g;
}
;
d.prototype.VBc = function(g, f, e, h) {
    var k;
    k = g.filter(function(l) {
        return -1 === e.findIndex(function(m) {
            return m.id === l.id;
        });
    }).map(function(l) {
        return {
            sMb: true,
            Hb: l
        };
    }).concat(e.map(function(l) {
        return {
            sMb: false,
            Hb: l
        };
    })).sort(function(l, m) {
        return l.Hb.Gc === m.Hb.Gc ? l.sMb ? -1 : 1 : l.Hb.Gc - m.Hb.Gc;
    }).map(function(l, m) {
        (0,
        c.bea)(l.Hb).Gc = m + 1;
        return l.Hb;
    });
    g = f.filter(function(l) {
        return -1 === h.findIndex(function(m) {
            return m.key === l.key;
        });
    }).concat(h).map(function(l) {
        var m;
        m = k.findIndex(function(n) {
            return n.key === l.key;
        });
        if (-1 !== m)
            return (m = k[m],
            (0,
            c.bea)(l).Gc = m.Gc,
            l);
    }).filter(function(l) {
        return undefined !== l;
    });
    return {
        RWc: k,
        sHc: g
    };
}
;
b.Kab =

// Detected exports: Kab
