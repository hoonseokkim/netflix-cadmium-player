/**
 * Netflix Cadmium Playercore - Module 37564
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Yed, xmd, IUa, Bnd, Zed, wmd
 */

// Webpack module 37564
// Parameters: t (module), b (exports), a (require)

var c, g;
function d(f) {
    var e, h, k, l;
    return (0,
    g.QZ)({
        sj: f.sj,
        Fn: null !== (e = f.Fn) && undefined !== e ? e : false,
        Pu: f.Pu,
        ah: null !== (h = f.ah) && undefined !== h ? h : false,
        DM: f.DM,
        MB: null !== (k = f.MB) && undefined !== k ? k : false,
        L4: null !== (l = f.L4) && undefined !== l ? l : false
    });
}
function p(f, e) {
    return c.__assign(c.__assign({}, f), e);
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Yed(f) {
    return f;
}
;
export const Zed = d;
export const wmd = p;
export function xmd(f) {
    return {
        xa: f,
        state: d(f)
    };
}
;
export function IUa(f) {
    return p(f.xa, f.state);
}
;
export function Bnd(f, e) {
    return p(f, (0,
    g.QZ)(c.__assign({
        Fn: !!f.yb || !!f.yu,
        sj: !!f.Pj && !f.yu
    }, e)));
}
;
c = a(22970);  // import from Module_22970
g = a(7911

// Detected exports: Yed, xmd, IUa, Bnd, Zed, wmd
