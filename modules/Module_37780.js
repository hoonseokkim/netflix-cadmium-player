/**
 * Netflix Cadmium Playercore - Module 37780
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: dJa
 * Dependencies: 22674, 22970, 42207, 87386
 * Purpose: Manifest handling, Buffer/Segment management, Parsing/Serialization, Error handling
 */

// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_42207 from './Module_42207.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 37780
// Parameters: t (module), b (exports), a (require)

var p, c, g;
class d {
    constructor(f, e) {
    this.oc = e;
    this.va = f.zb("PlayPredictionDeserializer");
}
    noc(f) {
    var e;
    e = this;
    try {
        return {
            direction: f.direction,
            Phd: f.layoutHasChanged,
            ald: f.rowInteractionIndex,
            xc: f.lolomos.map(function(h) {
                return e.ioc(h);
            })
        };
    } catch (h) {
        this.va.error("Failed to deserialize update Payload: ", {
            payload: JSON.stringify(f)
        });
    }
}
    ioc(f) {
    var e;
    e = this;
    return {
        context: f.context,
        list: f.list.map(function(h) {
            return e.hoc(h);
        }),
        requestId: f.requestId,
        rowIndex: f.rowIndex,
        bld: f.rowSegment
    };
}
    hoc(f) {
    var e, h;
    e = {
        yd: f.pts,
        property: f.property,
        J: f.viewableId,
        index: f.index
    };
    h = f.preplay;
    this.oc.Mi(h) && (e.lya = this.moc(h));
    f = f.params;
    this.oc.Mi(f) && (e.Xa = this.txb(f));
    return e;
}
    moc(f) {
    var e;
    e = {
        yd: f.pts,
        J: f.viewableId,
        c3: f.pipelineNum,
        index: f.index
    };
    f = f.params;
    this.oc.Mi(f) && (e.Xa = this.txb(f));
    return e;
}
    txb(f) {
    return {
        Ye: f.uiLabel,
        co: f.trackingId,
        Dr: f.sessionParams
    };
}
    loc(f) {
    var e;
    e = this;
    try {
        return f.map(function(h) {
            return e.joc(h);
        });
    } catch (h) {
        this.va.error("Failed to deserialize uprepareList", {
            prepareList: JSON.stringify(f)
        });
    }
}
    joc(f) {
    var e, h;
    h = f.params;
    this.oc.Mi(h) && (e = this.koc(h));
    return {
        R: f.movieId,
        priority: f.priority,
        force: f.force,
        Xa: e,
        Ye: f.uiLabel,
        h1: f.isLivePostplay,
        Rmd: f.uiExpectedStartTime,
        Qmd: f.uiExpectedEndTime,
        zp: f.firstTimeAdded
    };
}
    koc(f) {
    var e, h;
    e = undefined;
    h = f.sessionParams;
    this.oc.Mi(h) && (e = h);
    return {
        Goa: this.goc(f.authParams),
        Dr: e,
        co: f.trackingId,
        Nb: f.startPts,
        S: f.manifest,
        bh: f.isBranching
    };
}
    goc(f) {
    return {
        dPc: null === f || undefined === f ? undefined : f.pinCapableClient
    };
}
}
t = a(22970);
p = a(22674);
c = a(87386);
a = a(42207);
g = d;
export const dJa = g;
export const dJa = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb)), t.__param(1, (0,
p.v)(a.Zi))], g);

// Detected exports: dJa
