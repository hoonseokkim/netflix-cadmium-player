/**
 * Netflix Cadmium Playercore - Module 20424
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 20424
// Parameters: t (module), b (exports), a (require)


var p, c, g;
function d(f) {
    this.config = f;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.AGa = void 0;
t = a(22970);
p = a(4203);
c = a(22674);
g = a(91176);
d.prototype.process = function(f) {
    var e, h, k, l;
    e = this;
    if ((0,
    g.qB)(f.streamingType) && this.config().nT) {
        h = Object.assign(Object.assign({
            template: "$baseUrl/$packageId/$encoder/$feed/$mediaOutputGroup/$downloadableId"
        }, this.config().nT), this.config().nT.video);
        f.video_tracks.forEach(function(m) {
            m.streams.forEach(function(n) {
                var q;
                n.urls = [n.urls[0]];
                q = Object.assign(Object.assign({}, h), {
                    downloadableId: n.downloadable_id
                });
                n.urls[0].url = e.UWa(q.template, q);
            });
        });
        k = Object.assign(Object.assign({
            template: "$baseUrl/$packageId/$encoder/$feed/$mediaOutputGroup/$downloadableId"
        }, this.config().nT), this.config().nT.audio);
        f.audio_tracks.forEach(function(m) {
            m.streams.forEach(function(n) {
                var q;
                n.urls = [n.urls[0]];
                q = Object.assign(Object.assign({}, k), {
                    downloadableId: n.downloadable_id
                });
                n.urls[0].url = e.UWa(q.template, q);
            });
        });
        l = Object.assign(Object.assign({
            template: "$baseUrl/$packageId/$encoder/$feed/$mediaOutputGroup/$downloadableId"
        }, this.config().nT), this.config().nT.text);
        f.timedtexttracks.forEach(function(m) {
            Object.entries(m.ttDownloadables).forEach(function(n) {
                var q, r;
                q = Fa(n);
                n = q.next().value;
                q = q.next().value;
                q.urls && 0 < (null === (r = q.urls) || void 0 === r ? void 0 : r.length) && (q.urls = [q.urls[0]],
                r = Object.assign(Object.assign({}, l), {
                    downloadableId: m.downloadableIds[n]
                }),
                q.urls[0].url = e.UWa(r.template, r));
            });
        });
    }
}
;
d.prototype.UWa = function(f, e) {
    return f.split("/").map(function(h) {
        var k;
        if (h.startsWith("$")) {
            k = h.substring(1);
            if (e.hasOwnProperty(k))
                return e[k];
        }
        return h;
    }).join("/");
}
;
a = d;
b.AGa = a;
b.AGa = a = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(p.Pc))], a);


// Detected exports: AGa