/**
 * Netflix Cadmium Playercore - Module 94328
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 94328
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
export function S3c(f, e) {
    f = f.ba[e.M];
    if (undefined === f)
        return {
            m1: false,
            reason: ("Segment ").concat(e.M, " was not found")
        };
    if (0 > e.offset.G)
        return {
            m1: false,
            reason: ("Offset ").concat(e.offset.G, " was negative")
        };
    if (undefined === f.eb || null === f.eb || Infinity === f.eb)
        return {
            m1: true
        };
    f = f.eb - f.Va;
    return e.offset.G >= f ? {
        m1: false,
        reason: ("Offset ").concat(e.offset.G, " was greater than segment duration ").concat(f)
    } : {
        m1: true
    };
}
;
export function fXa(f, e) {
    if (f === e)
        return true;
    if (f && e && f.M === e.M) {
        if (f.offset === e.offset)
            return true;
        f = d.I.abs(f.offset.da(e.offset));
        if (g.greaterThan(f))
            return true;
    }
    return false;
}
;
export function Pn(f, e, h) {
    var k, l, n;
    k = e.ka;
    e = e.LCc;
    export const undefined = == h && (h = {});
    k = k.Ib;
    l = (null === e || undefined === e ? 0 : e.id) ? k.get(null === e || undefined === e ? undefined : e.id) : k.initial;
    (0,
    p.assert)(l, "initialSegment must be found in workingPlaygraph");
    e = (null === e || undefined === e ? undefined : e.rWc) || (null === l || undefined === l ? undefined : l.nb);
    if (e.greaterThan(f))
        return h.qZc ? {
            offset: f.da(e),
            M: l.id
        } : undefined;
    l = k.CE.SH(l.id);
    for (var m = l.next(); !m.done; ) {
        k = m.value;
        n = e;
        e = n.add(k.Ob);
        if (e.greaterThan(f))
            return (f = f.da(n),
            c.u && (0,
            p.assert)(f.$f(d.I.ia) && f.lessThan(k.Ob)),
            {
                M: k.id,
                offset: f
            });
        m = l.next();
        if (m.done && h.rZc)
            return {
                M: k.id,
                offset: f.da(n)
            };
    }
}
;
export function kub(f, e) {
    e = e.get(f.M);
    (0,
    p.assert)(e, "workingSegment must exist in workingPlaygraph for the position to clamp");
    e = e.jub(f.offset);
    return {
        lub: e,
        xu: f.offset.da(e)
    };
}
;
export function hRb(f, e) {
    f = f.ba[e.M];
    if (undefined !== f)
        return null === f.eb || undefined === f.eb ? {
            M: e.M,
            offset: d.I.max(d.I.ia, e.offset)
        } : {
            M: e.M,
            offset: d.I.max(d.I.ia, d.I.min(e.offset, d.I.Ca(f.eb - f.Va)))
        };
}
;
d = a(91176);
p = a(52571);
c = a(48170);
g = d.I.Ca(100);

// Detected exports: S3c, fXa, Pn, kub, hRb