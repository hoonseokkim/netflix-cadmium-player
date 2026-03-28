/**
 * Netflix Cadmium Playercore - Module 13005
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: rEa
 */

// Webpack module 13005
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e) {
    function h(k, l) {
        this.Eb = k;
        this.W7b = l;
        this.TTa = false;
        this.emit = f.prototype.emit;
        this.addListener = f.prototype.addListener;
        this.on = f.prototype.on;
        this.once = f.prototype.once;
        this.removeListener = f.prototype.removeListener;
        this.removeAllListeners = f.prototype.removeAllListeners;
        this.listeners = f.prototype.listeners;
        this.listenerCount = f.prototype.listenerCount;
        f.call(this);
        this.Cg = e.zb("DownloadTrack");
    }
    h.prototype.Hh = function() {
        false;
        this.p9 = undefined;
        this.emit("destroyed");
    }
    ;
    h.prototype.toString = function() {
        return "id:" + this.p9 + " config: " + JSON.stringify(this.Eb);
    }
    ;
    h.prototype.toJSON = function() {
        return "Download Track id:" + this.p9 + " config: " + JSON.stringify(this.Eb);
    }
    ;
    h.prototype.m1 = function() {
        return undefined === this.p9 ? false : true;
    }
    ;
    h.prototype.L3a = function(k) {
        this.Eb.connections !== k.connections && (this.Eb = k);
    }
    ;
    Ha.Object.defineProperties(h.prototype, {
        trackId: {
            configurable: true,
            enumerable: true,
            get: function() {
                return this.p9;
            }
        },
        pn: {
            configurable: true,
            enumerable: true,
            get: function() {
                return undefined === this.p9;
            }
        },
        config: {
            configurable: true,
            enumerable: true,
            get: function() {
                return this.Eb;
            }
        },
        Wxa: {
            configurable: true,
            enumerable: true,
            get: function() {
                return this.Cg;
            }
        },
        tea: {
            configurable: true,
            enumerable: true,
            get: function() {
                return this.W7b.tea;
            }
        },
        GUb: {
            configurable: true,
            enumerable: true,
            get: function() {
                return true;
            }
        }
    });
    this.k6 = Object.assign(h, new g.Pbb());
}
export const rEa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(87386);  // import from Module_87386
g = a(67263);  // import from Module_67263
f = a(17187).EventEmitter;
export const rEa = d;
b.rEa = d = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb))],

// Detected exports: rEa
