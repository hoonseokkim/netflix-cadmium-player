/**
 * Netflix Cadmium Playercore - Module 86451
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 86451
// Parameters: t (module), b (exports), a (require)


var c, g;
function d(f, e) {
    var h, k;
    h = Object.keys(f);
    if (h.some(function(l) {
        var m, n, q, r;
        return (null === (m = f[l]) || void 0 === m ? void 0 : m.fe) !== (null === (n = e[l]) || void 0 === n ? void 0 : n.fe) || (null === (q = f[l]) || void 0 === q ? void 0 : q.weight) !== (null === (r = e[l]) || void 0 === r ? void 0 : r.weight);
    }))
        return !0;
    k = Object.keys(e);
    return 0 !== c.__spreadArray(c.__spreadArray([], c.__read((0,
    g.np)(h, k)), !1), c.__read((0,
    g.np)(k, h)), !1).length ? !0 : !1;
}
function p(f, e) {
    return f.some(function(h, k) {
        return 0 !== (0,
        g.np)(h, e[k] || []).length;
    }) || f.length !== e.length ? !0 : !1;
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Mfc = function(f, e) {
    var h, k, l, m, n, q;
    h = Object.keys(f.ba);
    k = Object.keys(e.ba);
    l = k.filter(function(r) {
        return -1 === h.indexOf(r);
    });
    m = h.filter(function(r) {
        return -1 === k.indexOf(r);
    });
    n = h.filter(function(r) {
        var u;
        if (-1 === k.indexOf(r))
            u = !1;
        else
            (u = f.ba[r],
            r = e.ba[r],
            u = u.Oc !== r.Oc || u.eb !== r.eb || u.Va !== r.Va || u.fe !== r.fe || u.J !== r.J || u.Xe !== r.Xe || p(u.km || [], r.km || []) || d(u.next || ({}), r.next || ({})) ? !0 : !1);
        return u;
    });
    q = (0,
    g.np)(h, c.__spreadArray(c.__spreadArray(c.__spreadArray([], c.__read(n), !1), c.__read(l), !1), c.__read(m), !1));
    return {
        NY: l,
        mz: m,
        Lq: n,
        k2c: q
    };
}
;
c = a(22970);
g = a(91176);


// Detected exports: Mfc