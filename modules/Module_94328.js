/**
 * Netflix Cadmium Playercore - Module 94328
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 94328
// Parameters: t (module), b (exports), a (require)


var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.S3c = function(f, e) {
    f = f.ba[e.M];
    if (void 0 === f)
        return {
            m1: !1,
            reason: ("Segment ").concat(e.M, " was not found")
        };
    if (0 > e.offset.G)
        return {
            m1: !1,
            reason: ("Offset ").concat(e.offset.G, " was negative")
        };
    if (void 0 === f.eb || null === f.eb || Infinity === f.eb)
        return {
            m1: !0
        };
    f = f.eb - f.Va;
    return e.offset.G >= f ? {
        m1: !1,
        reason: ("Offset ").concat(e.offset.G, " was greater than segment duration ").concat(f)
    } : {
        m1: !0
    };
}
;
b.fXa = function(f, e) {
    if (f === e)
        return !0;
    if (f && e && f.M === e.M) {
        if (f.offset === e.offset)
            return !0;
        f = d.I.abs(f.offset.da(e.offset));
        if (g.greaterThan(f))
            return !0;
    }
    return !1;
}
;
b.Pn = function(f, e, h) {
    var k, l, n;
    k = e.ka;
    e = e.LCc;
    void 0 === h && (h = {});
    k = k.Ib;
    l = (null === e || void 0 === e ? 0 : e.id) ? k.get(null === e || void 0 === e ? void 0 : e.id) : k.initial;
    (0,
    p.assert)(l, "initialSegment must be found in workingPlaygraph");
    e = (null === e || void 0 === e ? void 0 : e.rWc) || (null === l || void 0 === l ? void 0 : l.nb);
    if (e.greaterThan(f))
        return h.qZc ? {
            offset: f.da(e),
            M: l.id
        } : void 0;
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
b.kub = function(f, e) {
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
b.hRb = function(f, e) {
    f = f.ba[e.M];
    if (void 0 !== f)
        return null === f.eb || void 0 === f.eb ? {
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