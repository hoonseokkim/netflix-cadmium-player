/**
 * Netflix Cadmium Playercore - Module 86268
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: IJb, dAc, eAc
 */

// Webpack module 86268
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function IJb(p) {
    var c, g, f, e, h, k, l, m;
    c = p.buffer;
    g = p.player;
    f = p.UH;
    e = p.Mca;
    h = p.kva;
    k = p.Bd;
    l = p.vBa;
    m = p.fBa;
    if (p = p.R2)
        return p.pyc({
            bR: c.yl - c.Ld,
            Dec: c.jq || 0,
            Bec: c.ru || 0,
            Ld: c.Ld,
            kva: h,
            Bd: k,
            vBa: l,
            fBa: m,
            Mh: g.state,
            playbackRate: g.playbackRate,
            Ve: g.Ve,
            UH: f,
            pr: e
        });
}
;
export function dAc(p, c) {
    return (0,
    d.kc)(p, function(g, f) {
        return p[f - 1] === c;
    }) || c;
}
;
export function eAc(p, c) {
    return ((0,
    d.kc)(p, function(g, f) {
        return p[f - 1] === c;
    }) || c).hf;
}
;
d = a(9117

// Detected exports: IJb, dAc, eAc
