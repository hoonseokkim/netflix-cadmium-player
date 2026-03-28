/**
 * Netflix Cadmium Playercore - Module 52961
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: zFa
 * Dependencies: 12187, 22674, 22970, 35128, 48617, 87386
 * Purpose: Manifest handling, Subtitles/Captions, Audio handling, Video handling
 */

// import dep_12187 from './Module_12187.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_35128 from './Module_35128.js';
// import dep_48617 from './Module_48617.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 52961
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
class d {
    constructor(k) {
    this.va = k.zb("HLSPlaylistTransformerImpl");
    this.r4c = f.jEa.LA();
    this.sdc = e.iEa.LA();
}
    transform(k, l) {
    var m, n, q, r, u, v, w, x, y;
    m = this;
    n = ["#EXTM3U", "#EXT-X-VERSION:8", "#EXT-X-INDEPENDENT-SEGMENTS"];
    q = k.text;
    r = k.audio;
    u = k.video;
    v = k.duration;
    w = k.$wb;
    x = k.Gnc;
    q.forEach(function(A) {
        h.forEach(function(z) {
            var B, C, D, E;
            B = 0 === z;
            C = A.stream;
            D = A.track;
            E = l.get(A.id);
            B = B ? E.m3 : E.Gza;
            C = m.Pzc({
                url: B.url,
                duration: v / 1E3,
                size: C.size,
                Nq: "Manifest for subtitles " + D.language + ' stream "' + D.JM + '", ' + D.ff + ", cdn " + B.Ug
            });
            m.va.trace("Text variant manifest", C.join("\n"));
            z = m.Qzc({
                groupId: z,
                name: D.JM,
                wYa: D.ff === x,
                Hp: D.mda,
                rDc: D.jj === g.Fv.cCa,
                language: D.language,
                uri: m.rva(C)
            });
            n.push(z);
        });
    });
    r.forEach(function(A) {
        h.forEach(function(z) {
            var B, C, D, E, G, F;
            B = 0 === z;
            C = A.stream;
            D = A.track;
            E = A.Ta;
            G = A.IV;
            F = l.get(C.sh);
            B = B ? F.m3 : F.Gza;
            C = m.DCb({
                url: B.url,
                Dca: C.Po.offset + C.Po.size,
                Ta: E,
                KUb: Math.floor(G / 1E3),
                Nq: "Manifest for audio " + D.language + ' stream "' + D.JM + '", ' + D.ff + ", cdn " + B.Ug
            });
            m.va.trace("Audio variant manifest", C.join("\n"));
            z = m.jvc({
                groupId: z,
                language: D.language,
                name: D.JM,
                wYa: D.ff === w,
                uri: m.rva(C)
            });
            n.push(z);
        });
    });
    y = this.sdc[r[0].track.profile];
    u.forEach(function(A) {
        h.forEach(function(z) {
            var B, C, D, E, G, F;
            B = 0 === z;
            C = A.stream;
            D = A.track;
            E = A.Ta;
            G = A.IV;
            F = l.get(C.sh);
            F = B ? F.m3 : F.Gza;
            B = 0 < q.length;
            D = m.DCb({
                url: F.url,
                Dca: C.Po ? C.Po.offset + C.Po.size : C.ATb,
                Ta: E,
                KUb: Math.floor(G / 1E3),
                Nq: "Manifest for video bitrate " + C.bitrate + ", stream " + D.ff + ", cdn " + F.Ug
            });
            m.va.trace("Video variant manifest", D.join("\n"));
            z = m.nAc({
                groupId: z,
                g$: 1E3 * C.bitrate,
                Hdc: 1E3 * C.bitrate,
                mEc: 0 <= C.Es.indexOf("-hdr-") || 0 <= C.Es.indexOf("-dv5-"),
                framerate: (C.FUa / C.EUa).toFixed(3),
                Oo: C.gza + "x" + C.u4a,
                h4c: m.r4c[C.Es],
                jdc: y,
                W0c: B
            });
            n.push(z);
            z = m.rva(D);
            n.push("" + z);
        });
    });
    this.va.trace("Primary manifest", n.join("\n"));
    return this.rva(n);
}
    jvc(k) {
    var l;
    l = k.wYa;
    return ["#EXT-X-MEDIA:TYPE=AUDIO", 'GROUP-ID="group_' + k.groupId + '"', 'CHANNELS="2"', 'LANGUAGE="' + k.language + '"', 'NAME="' + k.name + '"', "DEFAULT=" + (l ? "YES" : "NO"), "AUTOSELECT=" + (l ? "YES" : "NO"), 'URI="' + k.uri + '"'].join(", ");
}
    DCb(k) {
    var l, m;
    l = k.Ta;
    m = ["#EXTM3U", "# " + k.Nq, "#EXT-X-VERSION:8", "#EXT-X-TARGETDURATION:" + k.KUb, "#EXT-X-MEDIA-SEQUENCE:0", "#EXT-X-PLAYLIST-TYPE:VOD", '#EXT-X-DEFINE:NAME="U", VALUE="' + k.url + '"', '#EXT-X-MAP:URI="{$U}",BYTERANGE="' + l[0].byteOffset + '@0"', "#EXT-X-PROGRAM-DATE-TIME:2021-07-20T08:19:00.000-07:00"];
    l.forEach(function(n, q) {
        m.push("#EXTINF:" + n.duration.toFixed(3) + "," + n.Nb.toFixed(3));
        m.push("#EXT-X-BYTERANGE:" + n.afc + "@" + n.byteOffset);
        m.push("{$U}&fi=" + q);
    });
    m.push("#EXT-X-ENDLIST");
    return m;
}
    nAc(k) {
    var l, m;
    l = k.groupId;
    m = ["#EXT-X-STREAM-INF:BANDWIDTH=" + k.g$, "AVERAGE-BANDWIDTH=" + k.Hdc, "VIDEO-RANGE=" + (k.mEc ? "PQ" : "SDR"), "FRAME-RATE=" + k.framerate, 'AUDIO="group_' + l + '"', "RESOLUTION=" + k.Oo, 'CODECS="' + k.h4c + "," + k.jdc + '"'];
    k.W0c && m.push('SUBTITLES="subs_' + l + '"');
    return m.join(", ");
}
    Pzc(k) {
    var l;
    l = k.duration;
    return ["#EXTM3U", "# " + k.Nq, "#EXT-X-VERSION:8", "#EXT-X-TARGETDURATION:" + Math.floor(l), "#EXT-X-MEDIA-SEQUENCE:0", "#EXT-X-PLAYLIST-TYPE:VOD", '#EXT-X-DEFINE:NAME="U", VALUE="' + k.url + '"', '#EXT-X-MAP:URI="{$U}"', "#EXT-X-PROGRAM-DATE-TIME:2021-07-20T08:19:00.000-07:00", "#EXTINF:" + l.toFixed(3), "#EXT-X-BYTERANGE:" + k.size + "@0", "{$U}", "#EXT-X-ENDLIST"];
}
    Qzc(k) {
    var l, m, n;
    l = k.wYa;
    m = k.language;
    n = k.uri;
    l = ["#EXT-X-MEDIA:TYPE=SUBTITLES", 'GROUP-ID="subs_' + k.groupId + '"', 'NAME="' + k.name + '"', "DEFAULT=" + (l ? "YES" : "NO"), "AUTOSELECT=" + (l ? "YES" : "NO"), "FORCED=" + (k.Hp ? "YES" : "NO")];
    k.rDc && l.push('CHARACTERISTICS="public.accessibility.transcribes-spoken-dialog,public.accessibility.describes-music-and-sound"');
    l.push('LANGUAGE="' + m + '"');
    l.push('URI="' + n + '"');
    return l.join(", ");
}
    rva(k) {
    return "data:application/vnd.apple.mpegurl;charset=utf-8," + encodeURIComponent(k.join("\n"));
}
}
t = a(22970);
p = a(22674);
c = a(87386);
g = a(35128);
f = a(48617);
e = a(12187);
h = [0, 1];
a = d;
export const zFa = a;
export const zFa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb))], a);

// Detected exports: zFa
