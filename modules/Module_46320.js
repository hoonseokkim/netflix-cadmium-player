/**
 * Netflix Cadmium Playercore - Module 46320
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 46320
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l, m, n) {
    this.platform = k;
    this.config = l;
    this.A$ = m;
    this.OA = n;
}

t = a(22970);
p = a(22674);
c = a(4203);
g = a(91581);
f = a(2492);
e = a(56800);
h = a(24735);
d.prototype.transform = function(k) {
    var l, m, n;
    l = this;
    m = k.qb;
    n = {
        Ye: undefined
    };
    return Promise.all([this.OA.ADb(n), this.OA.CDb(n), this.A$.zWa(h.Tr.$r)]).then(function(q) {
        var r, u;
        r = Fa(q);
        q = r.next().value;
        u = r.next().value;
        r = r.next().value;
        return [{
            viewableId: k.J,
            packageId: m.jt,
            assetId: m.T9,
            challenge: r.lQa,
            audioProfiles: q.Osa(),
            textProfiles: l.config().DC,
            trickplayProfiles: ["BIF240", "BIF320"],
            videoProfiles: u.Osa(),
            audioLanguages: m.kdc,
            textLanguages: m.V0c,
            videoLanguages: m.xXb ? [m.xXb] : undefined,
            videoAspectRatios: m.uXb ? [m.uXb] : undefined,
            requestReference: m.n4a,
            additionalAudioAssets: m.jbc,
            additionalTextAssets: m.mbc,
            useBetterTextUrls: true
        }, {
            DH: null === r || undefined === r ? undefined : r.Ml,
            so: "studioManifest",
            X9: q,
            Nia: u
        }];
    });
}
;
a = d;
export const $Ia = a;
export const $Ia = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.Vt)), t.__param(1, (0,
p.v)(c.Pc)), t.__param(2, (0,
p.v)(f.Hja)), t.__param(3, (0,
p.v)(e.UW))], a);
