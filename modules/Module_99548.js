/**
 * Netflix Cadmium Playercore - Module 99548
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 99548
// Parameters: t (module), b (exports), a (require)


var c, g, f, e, h;
function d(k, l) {
    var C, D;
    for (var m = [], n = 0, q = k[n], r = null === q || void 0 === q ? void 0 : q[0], u = null === q || void 0 === q ? void 0 : q[1], v = l.Lc.index, w = l.track.uk, x = 0, y = l.Kc.qa, A = l.Kc.wa.G > q[0], z = A, B = l.Kc.index; B <= v; ++B) {
        C = !1;
        if (q) {
            D = w.get(B);
            A && (D.qa.G >= u ? (A = !1,
            ++n >= k.length ? u = r = q = void 0 : (q = k[n],
            r = null === q || void 0 === q ? void 0 : q[0],
            u = null === q || void 0 === q ? void 0 : q[1])) : z ? z = !1 : (m.push(new g.Mla(x,y,D.qa)),
            y = D.qa,
            C = !0));
            !A && q && D.wa.G > r && (A = !0,
            C = D.qa,
            (D = l.track.pB.Eu(B).nAb(r)) && 0 !== D.Jl && (C = c.I.Ca(D.yd)),
            m.push(new g.Mla(x,y,C)),
            y = C,
            C = !0);
        }
        C && ++x;
    }
    m.push(new g.Mla(x,y,l.Lc.wa));
    return m;
}
function p(k, l, m) {
    var n, q, r, u;
    (0,
    e.assert)(k.S && k.Rh, "Unexpected sanitizeLiveEndTimestamp.");
    q = k.S.Vi;
    r = null === q || void 0 === q ? void 0 : q.cS;
    q = "none";
    if (null === (n = k.Ic) || void 0 === n ? 0 : n.cS)
        if (r) {
            h && m.trace("PipelineNormalizer.sanitizeLiveEndTimestamp setting end timestamp:", "manifestEndTime:", r);
            q = "manifest";
            u = new Date(r).getTime();
        } else
            (n = k.Rh.endTime,
            (k = k.Rh.ML) ? (q = "oc",
            u = k,
            h && m.trace("PipelineNormalizer.sanitizeLiveEndTimestamp,", "eventEndTime:", n, "encoderShutdownTime: ", k, "endTimeMs:", u)) : n && (q = "oc",
            h && m.trace("PipelineNormalizer.sanitizeLiveEndTimestamp setting end timestamp:", "eventEndTime:", n),
            u = new Date(n).getTime() + l.dIb,
            h && m.trace("PipelineNormalizer.sanitizeLiveEndTimestamp,", "eventEndTime:", n, "endTimeMs:", u)));
    u || (u = Infinity);
    return {
        eb: u,
        source: q
    };
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.eQb = function(k, l, m) {
    var n, q;
    n = l.get(f.l.V);
    q = l.get(f.l.U);
    l = l.get(f.l.Ea);
    q = null === q || void 0 === q ? void 0 : q.track.RL(k, m, q.Xn);
    n = null === n || void 0 === n ? void 0 : n.track.RL(k, (null === q || void 0 === q ? void 0 : q.wa) || m, n.Xn);
    k = null === l || void 0 === l ? void 0 : l.track.RL(k, (null === q || void 0 === q ? void 0 : q.wa) || (null === n || void 0 === n ? void 0 : n.wa) || m, l.Xn);
    return [n, q, k];
}
;
b.YKc = function(k, l) {
    (0,
    e.assert)(l, "missing pipeline");
    return l.qa;
}
;
b.oIc = function(k, l, m) {
    var n;
    if (!l.km || 0 === l.km.length)
        return (h && k.trace("markExitZones, no exit zones"),
        []);
    n = l.km.map(function(q) {
        return [l.Va + q[0], l.Va + q[1]];
    });
    m = d(n, m.wr);
    h && k.trace("markExitZones found regions:", m);
    return m;
}
;
b.Cid = d;
b.zza = function(k, l, m, n) {
    var q;
    q = n;
    n = m.AM ? q : c.I.min(q, l);
    h && k.trace("PipelineNormalizer.sanitizeLiveStartTimestamp capping start timestamp to live:", q.ca(), "->", n.ca());
    return n;
}
;
b.Wfd = p;
b.Hga = function(k, l, m, n) {
    var q, r, u, v;
    (0,
    e.assert)(m.S && m.Rh, "Unexpected sanitizeLiveEndTimestamp.");
    (0,
    e.assert)(m.Ic, "Expected live viewable with live position service");
    q = m.S.Vi;
    r = p(m, l, k);
    u = r.eb;
    r = r.source;
    if (isFinite(u) && ("oc" === r || null === n || void 0 === n || !n.isFinite())) {
        r = m.Ic.HAa.G;
        v = u - r;
        0 > v && k.error("PipelineNormalizer.sanitizeLiveEndTimestamp negative pts. ", "liveMetadata:", JSON.stringify(q), "eventEndTime:", m.Rh.endTime);
        (0,
        e.assert)(0 <= v, "endPts is negative");
        n = (null === n || void 0 === n ? 0 : n.isFinite()) ? c.I.min(n, c.I.Ca(v)) : c.I.Ca(v);
        h && k.trace("PipelineNormalizer.sanitizeLiveEndTimestamp. ", "new contentEndTimestamp:", n.G, "startTimeMs:", r, "endTimeMs:", u);
    }
    return l.tV && (l = m.Ic.Al(!0),
    l = c.I.Ca(l + 1E4),
    null === n || void 0 === n ? 0 : n.greaterThan(l)) ? (k.trace("PipelineNormalizer.sanitizeLiveEndTimestamp. ", "performing simulated override:", n.G, "startTimeMs:", l, "endTimeMs:", u),
    c.I.uh) : n;
}
;
c = a(91176);
g = a(79048);
f = a(65161);
e = a(52571);
h = !1;


// Detected exports: eQb, YKc, oIc, Cid, zza, Wfd, Hga