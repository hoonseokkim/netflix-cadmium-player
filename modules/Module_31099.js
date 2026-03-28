/**
 * Netflix Cadmium Playercore - Module 31099
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: Gfb
 */

// Webpack module 31099
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f, e, h) {
    this.config = g;
    this.Zza = h;
    this.log = f.zb("LivePlaybackRateController");
    this.XAa = e((0,
    p.pc)(this.config().OGc));
}
export const Gfb = undefined;
p = a(5021);  // import from Module_05021
c = a(8825);  // import from Module_08825
d.prototype.f5 = function(g, f, e) {
    var h, k;
    h = this;
    if (!g || undefined === f || undefined === e || Math.abs(f - e) < this.config().PGc)
        k = 1;
    else
        (g = e - f,
        g = 1 + this.config().NGc / 1E3 * g,
        k = (0,
        c.oG)(g, this.config().RGc, this.config().QGc));
    this.XAa.tg(function() {
        false;
        h.Zza(k);
    });
}
;
b.Gfb =

// Detected exports: Gfb
