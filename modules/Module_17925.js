/**
 * Netflix Cadmium Playercore - Module 17925
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Manifest parsing / streaming protocol
 * Exports: xnb
 */

// Webpack module 17925
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k) {
    var l;
    l = g.fD.call(this, k) || this;
    l.createPlayer = function(m, n) {
        var q, r, u;
        n = undefined === n ? {} : n;
        n = "number" === typeof n ? {
            co: n
        } : n;
        q = p.Za.get(c.U7);
        r = p.Za.get(e.sX).create(n.manifest);
        u = p.Za.get(f.IJa);
        m = q.dmc(m);
        q = p.Za.get(h.BJa).create(m);
        m = q.isa();
        u = u.hwb(q);
        u.addEpisode({
            movieId: m.J,
            playbackParams: l.rsb(n, m),
            manifest: r
        });
        g.fD.fireEvent("playerCreated", {
            player: u
        });
        return u;
    }
    ;
    return l;
}
export const xnb = undefined;
p = a(31276);  // import from Module_31276
c = a(75864);  // import from Module_75864
g = a(59219);  // import from Module_59219
f = a(32050);  // import from Module_32050
e = a(17398);  // import from Module_17398
h = a(58252);  // import from Module_58252
Ia(d, g.fD);
b.xnb =

// Detected exports: xnb
