/**
 * Netflix Cadmium Playercore - Module 6795
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Logging / telemetry
 * Exports: Rmb
 */

// Webpack module 6795
// Parameters: t, b

function a(d, p, c) {
    this.log = d;
    this.j = p;
    this.P7a = c;
}
export const Rmb = undefined;
a.prototype.LOc = function(d) {
    var p;
    p = this;
    d = (d || []).filter(function(c) {
        return c.urls && 0 < c.urls.length;
    }).map(function(c) {
        return p.P7a(p.j, c.id, c.height, c.width, c.jPc, c.kPc, c.size, c.iB, {
            unknown: c.urls[0]
        });
    });
    0 === d.length && this.log.warn("There are no trickplay tracks");
    d.sort(function(c, g) {
        return c.size - g.size;
    });
    this.log.trace("Transformed trick play tracks", {
        Count: d.length
    });
    return d;
}
;
export const Rmb = a;

// Detected exports: Rmb
