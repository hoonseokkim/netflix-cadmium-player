/**
 * Netflix Cadmium Playercore - Module 23176
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: kHa
 * Dependencies: 5614, 12501, 22674, 22970, 64174, 72574, 83767
 * Purpose: Manifest handling, Audio handling, Configuration, Parsing/Serialization
 */

// import dep_5614 from './Module_5614.js';
// import dep_12501 from './Module_12501.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_64174 from './Module_64174.js';
// import dep_72574 from './Module_72574.js';
// import dep_83767 from './Module_83767.js';

// Webpack module 23176
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l) {
    k = c.Yf.call(this, k, "ManifestParserConfigImpl") || this;
    k.ke = l;
    return k;
}

t = a(22970);
p = a(22674);
c = a(64174);
g = a(83767);
f = a(12501);
e = a(5614);
h = a(72574);
Ia(d, c.Yf);
Ha.Object.defineProperties(d.prototype, {
    RAa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return [];
        }
    },
    pUa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return "";
        }
    },
    jQa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return [];
        }
    },
    iQa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return [];
        }
    },
    sUa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return "";
        }
    },
    NXa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return 0;
        }
    },
    S4: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.ke.S4.na(h.Rz);
        }
    },
    DC: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.ke.DC;
        }
    },
    zsb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return ["heaac-2-dash"];
        }
    },
    UOa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return false;
        }
    }
});
a = d;
export const kHa = a;
t.__decorate([f.config(f.y4, "supportedAudioTrackTypes")], a.prototype, "RAa", null);
t.__decorate([f.config(f.string, "forceAudioTrack")], a.prototype, "pUa", null);
t.__decorate([f.config(f.Y7a, "cdnIdWhiteList")], a.prototype, "jQa", null);
t.__decorate([f.config(f.Y7a, "cdnIdBlackList")], a.prototype, "iQa", null);
t.__decorate([f.config(f.string, "forceTimedTextTrack")], a.prototype, "sUa", null);
t.__decorate([f.config(f.Ez, "imageSubsResolution")], a.prototype, "NXa", null);
t.__decorate([f.config(f.Ez, "timedTextSimpleFallbackThreshold")], a.prototype, "S4", null);
t.__decorate([f.config(f.y4, "timedTextProfiles")], a.prototype, "DC", null);
t.__decorate([f.config(f.y4, "auxiliaryManifestAudioProfileNeedsBitrateMatching")], a.prototype, "zsb", null);
t.__decorate([f.config(f.zd, "alwaysIncludeOffTimedTextTrack")], a.prototype, "UOa", null);
export const kHa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.gp)), t.__param(1, (0,
p.v)(e.IX))], a);

// Detected exports: kHa
