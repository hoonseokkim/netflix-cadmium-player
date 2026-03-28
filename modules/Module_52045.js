/**
 * Netflix Cadmium Playercore - Module 52045
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Uyc, TDc, ghd, ypc
 */

// Webpack module 52045
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Uyc(c, g) {
    if ((c = c.ma.K.kz) && 0 !== c.length)
        return (0,
        d.kc)(c, function(f) {
            return f.qa.G <= g && g < f.wa.G;
        });
}
;
export function TDc(c, g) {
    return g.index === c.Kc.index ? true : (c = c.ma.K.kz) && 0 !== c.length ? c.some(function(f) {
        f = f.qa;
        return g.qa.Hn(f) && f.lessThan(g.wa);
    }) : false;
}
;
export function ghd(c, g) {
    return g.index === c.Lc.index ? true : (c = c.ma.K.kz) && 0 !== c.length ? c.some(function(f) {
        f = f.wa;
        return g.qa.lessThan(f) && f.Hn(g.wa);
    }) : false;
}
;
export function ypc(c, g, f, e) {
    var h, k, l, m, n, q, r, u, v, w;
    p && c.trace("editFragmentForRegion, region:", f, "fragment:", g, "params:", e);
    r = null === (h = g.pa) || undefined === h ? undefined : h.start;
    h = null === (k = g.pa) || undefined === k ? undefined : k.end;
    v = k = false;
    if ((null === e || undefined === e ? 0 : e.jEc) || (null === e || undefined === e || !e.RDc) && g.qa.lessThan(f.qa)) {
        if (u = g.bUa(f.qa.G)) {
            w = (null !== (m = null === (l = g.pa) || undefined === l ? undefined : l.start) && undefined !== m ? m : 0) + u.Jl;
            p && c.trace("editFragmentForRegion found sap at start:", u, "adjusted sampleIndex:", w);
            r = Math.max(null !== r && undefined !== r ? r : 0, w);
        }
        u = f.qa.G;
        k = true;
    }
    if ((null === e || undefined === e || !e.cEc) && g.wa.greaterThan(f.wa)) {
        if (u = g.bUa(f.wa.G))
            (w = (null !== (q = null === (n = g.pa) || undefined === n ? undefined : n.start) && undefined !== q ? q : 0) + u.Jl,
            p && c.trace("editFragmentForRegion found sap at end:", u, "adjusted sampleIndex:", w),
            h = Math.min(null !== h && undefined !== h ? h : Infinity, w),
            g.r2 = g.index,
            p && c.trace("editFragmentForRegion editing end of region, reusing index:", g.index));
        u = f.wa.G;
        v = true;
    }
    if (undefined !== r || undefined !== h)
        (g.Nh({
            start: r,
            end: h
        }),
        p && c.trace("getFragmentForRequest setting edit window:", {
            start: r,
            end: h
        }));
    undefined !== u && (!g.sv || u > g.sv) && (g.h4(u),
    p && c.trace("getFragmentForRequest setting splice pts:", u));
    g.SXc(f.region, k, v);
}
;
d = a(91176);  // import from Module_91176
p =

// Detected exports: Uyc, TDc, ghd, ypc
