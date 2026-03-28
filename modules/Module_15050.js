/**
 * Netflix Cadmium Playercore - Module 15050
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: bid
 */

// Webpack module 15050
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function bid(p, c, g, f, e, h, k) {
    e ? (p.log(("> And the winner is... ").concat(e.Oa, " (").concat(e.DPa(), " Kbps) lowest buffer level ").concat(k, " ms, reason ").concat(h).concat(f ? " < INITIAL SELECTION" : "")),
    p.log("Stream selection state " + d.Yb[g.state] + ", desiredHeaders " + JSON.stringify(c.filter(function(l) {
        return l.qx;
    }).map(function(l) {
        return l.bitrate;
    })))) : p.info("Stream selection failed to find any stream, this could be due to incorrect bitrate ranges.");
}
;
d = a(6516

// Detected exports: bid
