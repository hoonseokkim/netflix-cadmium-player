/**
 * Netflix Cadmium Playercore - Module 8707
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: PY
 * Purpose: Utility module
 */

// Webpack module 8707
// Parameters: t (module), b (exports)

export function PY(a, d) {
    var p, c, e;
    if (!(a && d || a === d))
        return {
            Lq: true,
            reason: "one of the ads is undefined"
        };
    if (a && d) {
        if (a.length !== d.length)
            return {
                Lq: true,
                reason: "ad break count mismatch"
            };
        for (var g = function(h) {
            var k, l;
            k = a[h];
            l = d[h];
            if (!k.xa.Ga.equal(l.xa.Ga))
                return {
                    value: {
                        Lq: true,
                        reason: "ad break content timestamp mismatch"
                    }
                };
            if (k.xa.source !== l.xa.source)
                return {
                    value: {
                        Lq: true,
                        reason: "ad break source mismatch"
                    }
                };
            if ("embedded" === k.xa.type && "embedded" === l.xa.type && !k.xa.duration.equal(l.xa.duration))
                return {
                    value: {
                        Lq: true,
                        reason: "ad break duration mismatch"
                    }
                };
            if (undefined !== k.xa.Zk && undefined !== l.xa.Zk && !k.xa.Zk.equal(l.xa.Zk))
                return {
                    value: {
                        Lq: true,
                        reason: "ad break replaced duration mismatch"
                    }
                };
            if ((null === (p = k.xa.yb) || undefined === p ? undefined : p.length) !== (null === (c = l.xa.yb) || undefined === c ? undefined : c.length))
                return {
                    value: {
                        Lq: true,
                        reason: "ad break ads length mismatch"
                    }
                };
            if (k.xa.yb && l.xa.yb && k.xa.yb.some(function(m, n) {
                if (m.id !== l.xa.yb[n].id)
                    return true;
            }))
                return {
                    value: {
                        Lq: true,
                        reason: "ad break ads mismatch"
                    }
                };
            if ((k.state.Pu || l.state.Pu) && k.state.Pu !== l.state.Pu)
                return {
                    value: {
                        Lq: true,
                        reason: "ad break hydration sequence id mismatch"
                    }
                };
            if (k.state.Fn !== l.state.Fn)
                return {
                    value: {
                        Lq: true,
                        reason: "is hydrated state mismatch"
                    }
                };
            if (k.state.sj !== l.state.sj)
                return {
                    value: {
                        Lq: true,
                        reason: "can hydrate state mismatch"
                    }
                };
        }, f = 0; f < a.length; f++) {
            e = g(f);
            if ("object" === typeof e)
                return e.value;
        }
    }
    return {
        Lq: false,
        reason: ""
    };
}
;

// Detected exports: PY
