/**
 * Netflix Cadmium Playercore - Module 57042
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Error handling
 * Exports: kOc
 */

// Webpack module 57042
// Parameters: t, b

var a, d, p, c;
export function kOc(g) {
    var f, e, h, k;
    f = g.read(5);
    e = g.read(4);
    if (15 === e) {
        h = g.read(24);
        e = a.indexOf(h);
    } else
        h = a[e];
    k = g.read(4);
    switch (f) {
    case d:
    case p:
    case c:
        if (g.read(1))
            throw Error("frameLengthFlag not supported");
        break;
    default:
        throw Error("AAC profile " + f + " not supported.");
    }
    return {
        dw: f,
        sampleRate: h,
        yza: e,
        Wcd: k,
        nuc: 1024
    };
}
;
a = [96E3, 88200, 64E3, 48E3, 44100, 32E3, 24E3, 22050, 16E3, 12E3, 11025, 8E3, 7350];
d = 1;
p = 2;
c = 4;

// Detected exports: kOc
