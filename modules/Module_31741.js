/**
 * Netflix Cadmium Playercore - Module 31741
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Wja
 */

// Webpack module 31741
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l, m) {
    m = c.jP.call(this, k, l, p.l.Audio, m) || this;
    m.config = k;
    m.li = l;
    m.type = p.XF.aG;
    return m;
}
export const Wja = undefined;
p = a(56800);  // import from Module_56800
c = a(65264);  // import from Module_65264
g = a(73796);  // import from Module_73796
t = a(57180);  // import from Module_57180
f = a(12187);  // import from Module_12187
e = a(7802);  // import from Module_07802
h = new t.VX().format;
Ia(d, c.jP);
d.prototype.SAa = function() {
    var k;
    k = h(d.lBa, g.zc.X5);
    return Promise.resolve(this.config().Naa && this.li.isTypeSupported(k));
}
;
d.prototype.Dha = function() {
    var k;
    k = h(d.lBa, g.zc.X5);
    return Promise.resolve(this.config().Vqa && this.li.isTypeSupported(k));
}
;
d.prototype.LA = function() {
    return f.iEa.LA();
}
;
d.prototype.gDb = function() {
    return this.config().iL;
}
;
d.prototype.hba = function(k) {
    return this.config().ONc ? Promise.resolve(new e.Ala(k,k.map(function() {
        return {
            supported: true
        };
    }))) : c.jP.prototype.hba.call(this, k);
}
;
export const Wja = d;
d.lBa = "audio/mp4;codecs={0}

// Detected exports: Wja
