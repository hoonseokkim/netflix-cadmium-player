/**
 * Netflix Cadmium Playercore - Module 5653
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 5653
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(22970);
p = a(48170);
c = a(91967);
t = (function() {
    function g(f) {
        this.Mb = f;
    }
    Object.defineProperties(g.prototype, {
        ic: {
            get: function() {
                return g.ic;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        um: {
            get: function() {
                return "qaudit";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        enabled: {
            get: function() {
                return p.u;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.Ph = function(f) {
        var e, h, k, n;
        h = f.Ui;
        k = f.Xs;
        f = h === c.Sc.Mr;
        if (h === c.Sc.Wj || f || "transition" === k)
            if (h = this.Mb.VUa()) {
                k = {};
                try {
                    for (var l = d.__values(h.zPc), m = l.next(); !m.done; m = l.next()) {
                        n = m.value;
                        k[n.mediaType] = this.eIc(n);
                    }
                } catch (r) {
                    var q;
                    q = {
                        error: r
                    };
                } finally {
                    try {
                        m && !m.done && (e = l.return) && e.call(l);
                    } finally {
                        if (q)
                            throw q.error;
                    }
                }
                return {
                    branchQueue: (0,
                    uBb)(h.nSc, f),
                    playerIterator: k,
                    driftStats: this.Mb.Y8a
                };
            }
    }
    ;
    g.prototype.eIc = function(f) {
        return null === f || undefined === f ? undefined : f.iCb();
    }
    ;
    g.ic = "queue-audit";
    return g;
}
)();
export const Ikb = t;
export function $Ua(g, f) {
    var e, h;
    if (g) {
        e = g.K;
        h = {};
        g.$A().forEach(function(k) {
            h[k.mediaType] = (0,
            RCb)(k, f);
        });
        return {
            sId: null === e || undefined === e ? undefined : e.id,
            cancelled: g.fd,
            RM: h
        };
    }
    return g;
}
;
export function RCb(g, f) {
    var e, h, k, l;
    if (g && g.pe)
        return (f = f ? g.pe.Pvc() : {},
        d.__assign(d.__assign(d.__assign({}, g.pe.iDb()), {
            unsentRequests: g.pe.JO,
            lastFragmentContentEndPts: null === (e = g.Lc) || undefined === e ? undefined : e.wa.G,
            trackAttributes: null === (h = g.track) || undefined === h ? undefined : h.Ps(),
            bitrate: null === (k = g.Lc) || undefined === k ? undefined : k.bitrate,
            lastAppendedTimestamp: null === (l = g.kHb) || undefined === l ? undefined : l.G
        }), f));
}
;
export function uBb(g, f) {
    return g.map(function(e) {
        return (0,
        $Ua)(e, f);
    });
}
;

// Detected exports: uBb, RCb, Ikb