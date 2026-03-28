/**
 * Netflix Cadmium Playercore - Module 82585
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Manifest parsing / streaming protocol
 * Exports: nfb
 */

// Webpack module 82585
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f, e, h, k) {
    this.lk = g;
    this.Vh = f;
    this.log = e;
    this.Hl = h;
    this.ur = k;
    this.Xxa = new p.pJa();
}
export const nfb = undefined;
p = a(81889);  // import from Module_81889
c = a(75864);  // import from Module_75864
d.prototype.vac = function(g) {
    var f, e, h, k, l, m, n;
    this.log.info("Next episode added", g);
    m = this.Xxa.y_a(g.playbackParams);
    n = Math.max(0, null !== (h = null !== (e = null !== (f = g.startPts) && undefined !== f ? f : g.nextStartPts) && undefined !== e ? e : m.Nb) && undefined !== h ? h : 0);
    f = null !== (l = null !== (k = g.endPts) && undefined !== k ? k : g.currentEndPts) && undefined !== l ? l : m.Cj;
    return this.Vh.hbc({
        R: g.movieId,
        Nb: n,
        Cj: f,
        Xa: m,
        S: g.manifest,
        lk: this.lk
    });
}
;
d.prototype.rPc = function(g) {
    var f, e, h, k, l, m;
    g = this.Xxa.y_a(g);
    this.log.info("Playing the next episode", g);
    h = this.Vh.KBb();
    k = this.Vh.CS();
    l = k.ba[h];
    m = Object.keys(null !== (f = l.next) && undefined !== f ? f : {}).find(function(n) {
        return l.J !== k.ba[n].J;
    });
    f = !this.Hl.gya || !(null === (e = g.Dr) || undefined === e ? 0 : e.isUIAutoPlay);
    return m ? this.Vh.dXa(h, m, g, f) : Promise.reject(Error("Next episode not found"));
}
;
d.prototype.G4c = function(g) {
    var f, e;
    f = this.ur.xy(g, c.V7.ZGa);
    g = this.ur.xy(g, c.V7.Eab);
    e = this.Vh.rb;
    this.Hl.gya && e.Li !== g && e.hO(g) && e.cca(f) !== g && this.Vh.Wn({
        M: f,
        s2: g
    });
}
;
b.nfb =

// Detected exports: nfb
