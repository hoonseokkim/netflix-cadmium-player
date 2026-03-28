/**
 * Netflix Cadmium Playercore - Module 64059
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: qja
 * Dependencies: 58343
 * Purpose: Buffer/Segment management, Logging, Playback control, Class definition
 */

// import dep_58343 from './Module_58343.js';

// Webpack module 64059
// Parameters: t (module), b (exports), a (require)

var p;
function d(c, g, f) {
    var e;
    e = p.tma.call(this, c, g) || this;
    e.seek = function(h) {
        return e.Rb().seek(h);
    }
    ;
    e.addEpisode = function(h) {
        return e.NZa.vac(h);
    }
    ;
    e.playNextEpisode = function(h) {
        h = undefined === h ? {} : h;
        return e.NZa.rPc(h);
    }
    ;
    e.watchCredits = function(h) {
        return e.NZa.G4c(h);
    }
    ;
    e.playSegment = function(h) {
        return e.Rb().KNb(h);
    }
    ;
    e.queueSegment = function(h) {
        return e.Rb().aPb(h);
    }
    ;
    e.updateNextSegmentWeights = function(h, k) {
        return e.Rb().Pl(h, k);
    }
    ;
    e.setNextSegment = function(h) {
        for (var k = [], l = 0; l < arguments.length; ++l)
            k[l - 0] = arguments[l];
        k = k.map(function(m) {
            return {
                M: m.segmentId,
                s2: m.nextSegmentId
            };
        });
        e.Vh.Wn.apply(e.Vh, Ba(k));
    }
    ;
    e.clearNextSegment = function(h) {
        for (var k = [], l = 0; l < arguments.length; ++l)
            k[l - 0] = arguments[l];
        return e.Vh.Lhc.apply(e.Vh, Ba(k));
    }
    ;
    e.goToNextSegment = function(h, k) {
        return e.Vh.dXa(h, k);
    }
    ;
    e.getPlaying = function() {
        return e.isPlaying();
    }
    ;
    e.getPaused = function() {
        return e.isPaused();
    }
    ;
    e.getMuted = function() {
        return e.isMuted();
    }
    ;
    e.getEnded = function() {
        return e.isEnded();
    }
    ;
    e.getTimedTextVisibility = function() {
        return e.isTimedTextVisible();
    }
    ;
    e.isTimedTextVisible = function() {
        return !!e.Rb().sca().visibility;
    }
    ;
    e.setTimedTextVisibility = function(h) {
        return e.setTimedTextVisible(h);
    }
    ;
    e.setTimedTextSize = function(h) {
        return e.Rb().i4({
            size: h
        });
    }
    ;
    e.setTimedTextBounds = function(h) {
        return e.Rb().i4({
            bounds: h
        });
    }
    ;
    e.setTimedTextMargins = function(h) {
        return e.Rb().i4({
            margins: h
        });
    }
    ;
    e.setTimedTextVisible = function(h) {
        return e.Rb().i4({
            visibility: h
        });
    }
    ;
    e.getCongestionInfo = function(h) {
        h && h({
            success: false,
            name: null,
            isCongested: null
        });
    }
    ;
    e.NZa = f(c, g, e.log);
    return e;
}

p = a(58343);
Ia(d, p.tma);
export const qja = d;

// Detected exports: qja
