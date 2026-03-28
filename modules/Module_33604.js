/**
 * Netflix Cadmium Playercore - Module 33604
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: olb
 * Dependencies: 22970, 48170, 58049, 79048
 * Purpose: Media Source Extensions, Logging, Configuration, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_58049 from './Module_58049.js';
// import dep_79048 from './Module_79048.js';

// Webpack module 33604
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(79048);
c = a(48170);
g = a(58049);
t = (function() {
    class f {
    constructor(e, h, k) {
        this.oC = e;
        this.mediaType = h;
        this.console = k;
        this.egc = this.lda = true;
    }
    process(e) {
        return d.__awaiter(this, undefined, undefined, function() {
            var h, k, l;
            return d.__generator(this, function(m) {
                switch (m.label) {
                case 0:
                    if (e.done)
                        return [3, 6];
                    h = e.value.value;
                    if (!(0,
                    g.JYa)(h))
                        return [3, 3];
                    if (!this.nt || h.ma.L === this.nt.L || h.ma.L.J === p.Xr)
                        return [3, 2];
                    c.u && this.console.trace("Seamless Throttler: waiting for other transitions to be ready", {
                        request: h
                    });
                    return [4, this.oC.QXb({
                        mediaType: this.mediaType,
                        lba: this.lda,
                        to: {
                            stream: undefined,
                            M: h.K.id
                        },
                        from: {
                            stream: undefined,
                            M: this.nt.M
                        },
                        timestamp: h.ma.Vb,
                        Ffa: null === (k = this.nt) || undefined === k ? undefined : k.Vb
                    })];
                case 1:
                    (m.T(),
                    m.label = 2);
                case 2:
                    return (this.nt = {
                        zUc: 0,
                        stream: undefined,
                        L: h.ma.L,
                        Vb: h.ma.Vb,
                        M: h.K.id
                    },
                    [3, 6]);
                case 3:
                    if (!this.nt || !h.xn || h.stream.L === this.nt.L || h.stream.L.J === p.Xr)
                        return [3, 5];
                    c.u && this.console.trace(("Seamless Throttler: Waiting on request [").concat(h.mediaType, "]"), h.index, "in", h.K.id);
                    return [4, this.oC.QXb({
                        mediaType: h.mediaType,
                        lba: this.lda,
                        to: {
                            stream: h.stream,
                            M: h.K.id
                        },
                        from: {
                            stream: this.nt.stream,
                            M: this.nt.M
                        },
                        timestamp: h.Vb,
                        Ffa: null === (l = this.nt) || undefined === l ? undefined : l.Vb
                    })];
                case 4:
                    (m.T(),
                    m.label = 5);
                case 5:
                    (this.lda = false,
                    this.nt = {
                        zUc: h.index,
                        stream: h.stream,
                        Vb: h.Vb,
                        M: h.K.id,
                        L: h.stream.L
                    },
                    m.label = 6);
                case 6:
                    return [2, e];
                }
            });
        });
    }
    f1a(e, h) {
        undefined === e && (e = []);
        undefined === h && (h = []);
        c.u && this.console.trace(("Seamless Throttler: onMediaSourceReset() ").concat(h));
        this.lda || (this.lda = -1 !== h.indexOf(this.mediaType));
        (null === e || undefined === e ? 0 : e.length) && e.length !== h.length && (this.nt = undefined);
    }
    reset() {}
}
Object.defineProperties(f.prototype, {
        name: {
            get: function() {
                return "Transition";
            },
            enumerable: false,
            configurable: true
        }
    });
    return f;
}
)();
export const olb = t;

// Detected exports: olb
