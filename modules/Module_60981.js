/**
 * Netflix Cadmium Playercore - Module 60981
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Xgb
 * Dependencies: 59219, 94886
 * Purpose: Buffer/Segment management, Event handling, Configuration, Playback control
 */

// import dep_59219 from './Module_59219.js';
// import dep_94886 from './Module_94886.js';

// Webpack module 60981
// Parameters: t (module), b (exports), a (require)

var p, c;
class d {
    constructor() {
    var g;
    g = this;
    this.Xb = new p.jl();
    this.fireEvent = this.Xb.qd;
    this.addEventListener = this.Xb.addListener;
    this.removeEventListener = this.Xb.removeListener;
    this.QMc = function(f) {
        var k;
        function e() {
            g.zB === k && g.k8a(undefined);
            k.removeEventListener("playingchanged", h);
            k.removeEventListener("closed", e);
        }
        function h() {
            g.k8a(k);
        }
        k = f.player;
        k.addEventListener("playingchanged", h);
        k.addEventListener("closed", e);
        k.isPlaying() && g.k8a(k);
    }
    ;
    this.rN = function() {
        return g.fireEvent("timeupdate");
    }
    ;
    this.Y0a = function() {
        return g.fireEvent("durationchange");
    }
    ;
    this.m1a = function() {
        var f;
        (null === (f = g.zB) || undefined === f ? 0 : f.isPlaying()) ? g.fireEvent("playing") : g.fireEvent("pause");
    }
    ;
    this.o1a = function() {
        return g.fireEvent("ratechange");
    }
    ;
    this.i1a = function() {
        return g.fireEvent("movieidchange");
    }
    ;
    c.fD.addEventListener("playerCreated", function(f) {
        return g.QMc(f);
    });
}
    k8a(g) {
    if (this.zB !== g && this.zB)
        this.w2c(this.zB);
    else if (this.zB === g)
        return;
    (this.zB = g) && this.Y_c(g);
    this.Dtc();
}
    Dtc() {
    this.i1a();
    this.m1a();
    this.o1a();
    this.rN();
    this.Y0a();
}
    Y_c(g) {
    g.addEventListener("currenttimechanged", this.rN);
    g.addEventListener("durationchanged", this.Y0a);
    g.addEventListener("playingchanged", this.m1a);
    g.addEventListener("ratechange", this.o1a);
    g.addEventListener("playgraphsegmenttransition", this.i1a);
}
    w2c(g) {
    g.removeEventListener("currenttimechanged", this.rN);
    g.removeEventListener("durationchanged", this.Y0a);
    g.removeEventListener("playingchanged", this.m1a);
    g.removeEventListener("ratechange", this.o1a);
    g.removeEventListener("playgraphsegmenttransition", this.i1a);
}
}
p = a(94886);
c = a(59219);
Ha.Object.defineProperties(d.prototype, {
    currentTime: {
        configurable: true,
        enumerable: true,
        get: function() {
            var g, f;
            f = null === (g = this.zB) || undefined === g ? undefined : g.getSegmentTime();
            return f ? f / 1E3 : undefined;
        }
    },
    playbackRate: {
        configurable: true,
        enumerable: true,
        get: function() {
            var g, f;
            return null !== (f = null === (g = this.zB) || undefined === g ? undefined : g.getPlaybackRate()) && undefined !== f ? f : undefined;
        }
    },
    duration: {
        configurable: true,
        enumerable: true,
        get: function() {
            var g, f;
            f = null === (g = this.zB) || undefined === g ? undefined : g.getDuration();
            return f ? f / 1E3 : undefined;
        }
    },
    playing: {
        configurable: true,
        enumerable: true,
        get: function() {
            var g, f;
            return null !== (f = null === (g = this.zB) || undefined === g ? undefined : g.isPlaying()) && undefined !== f ? f : undefined;
        }
    },
    movieId: {
        configurable: true,
        enumerable: true,
        get: function() {
            var g, f;
            return null !== (f = null === (g = this.zB) || undefined === g ? undefined : g.getMovieId()) && undefined !== f ? f : undefined;
        }
    }
});
export const Xgb = d;

// Detected exports: Xgb
