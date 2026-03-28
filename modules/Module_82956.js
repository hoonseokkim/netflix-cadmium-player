/**
 * Netflix Cadmium Playercore - Module 82956
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 * Exports: zyc, oDb, Sxc
 */

// Webpack module 82956
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g) {
    switch (g) {
    case p.Y.b7:
        return "http";
    case p.Y.e7:
        return "connectiontimeout";
    case p.Y.yP:
        return "readtimeout";
    case p.Y.Idb:
        return "corruptcontent";
    case p.Y.xP:
        return "abort";
    case p.Y.g7:
    case p.Y.EFa:
        return "unknown";
    }
}
export const Sxc = d;
export function zyc(g, f) {
    var e;
    g = {
        errorcode: g + (f.errorCode || p.ea.lo)
    };
    f.Ya && (g.errorsubcode = f.Ya);
    f.Yg && (g.errorextcode = f.Yg);
    f.Yaa && (g.erroredgecode = f.Yaa);
    f.Cf && (g.errordetails = f.Cf);
    f.Rq && (g.httperr = f.Rq);
    f.LI && (g.aseneterr = f.LI);
    f.Xaa && (g.errordata = f.Xaa);
    f.uea && (g.mediaerrormessage = f.uea);
    e = d(Number(f.Ya));
    e && (g.nwerr = e);
    f.de && (g.playbackcontextid = f.de);
    return g;
}
;
export function oDb() {
    return {
        screensize: c.kK.width + "x" + c.kK.height,
        screenavailsize: c.kK.availWidth + "x" + c.kK.availHeight,
        clientsize: Da.innerWidth + "x" + Da.innerHeight,
        devicePixelRatio: c.shb
    };
}
;
p = a(36129);  // import from Module_36129
c = a(2236

// Detected exports: zyc, oDb, Sxc
