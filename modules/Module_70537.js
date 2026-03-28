/**
 * Netflix Cadmium Playercore - Module 70537
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: QW
 * Dependencies: 3359, 19915, 37736, 81375
 * Purpose: Logging, Event handling, Configuration, Error handling
 */

// import dep_3359 from './Module_3359.js';
// import dep_19915 from './Module_19915.js';
// import dep_37736 from './Module_37736.js';
// import dep_81375 from './Module_81375.js';

// Webpack module 70537
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
d = this && this.__assign || (function() {
    d = Object.assign || (function(e) {
        for (var h, k = 1, l = arguments.length; k < l; k++) {
            h = arguments[k];
            for (var m in h)
                Object.prototype.hasOwnProperty.call(h, m) && (e[m] = h[m]);
        }
        return e;
    }
    );
    return d.apply(this, arguments);
}
);

a(91176);
p = a(81375);
c = a(37736);
g = a(3359);
f = a(19915);
t = (function() {
    class e {
    constructor(h) {
        this.Xa = h;
        this.yp = h.LZ || new c.OJa();
        this.Jea = h.HA || ({});
        this.console = (0,
        p.Pvb)(d({}, h));
        this.JA = h.context.JA;
        this.ky = h.context.ky;
        this.pp = h.pp;
        this.Lmc = h.tR;
        this.pSc = h.random;
    }
    Q3a(h, k) {
        var l;
        l = this.Jea[h];
        l || (l = [],
        this.Jea[h] = l);
        l.push(k);
    }
    random() {
        return this.pSc();
    }
    Bvb() {
        var h;
        undefined === h && (h = {});
        if (!this.Lmc.some(function(k) {
            return undefined === k;
        }))
            throw Error(('Component definition "').concat((undefined).name, '" not found in `creates` array of parent component ') + ("").concat(this.Xa.name, ". Did you pass a `creates` array to `defineComponent()`?"));
        h = (undefined).wE ? (0,
        f.uRa)({
            context: this.context,
            data: h.data,
            id: h.id,
            zxa: this.yp,
            pp: this.pp
        }, (undefined).name, (undefined).zpa) : (0,
        g.Evb)({
            context: this.context,
            data: h.data,
            id: h.id,
            pp: this.pp
        }, undefined);
        this.context.NU(h);
        return h;
    }
}
Object.defineProperties(e.prototype, {
        parent: {
            get: function() {
                return this.Xa.context.parent;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        Ni: {
            get: function() {
                return this.Xa.Ni;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        config: {
            get: function() {
                return this.Xa.hE();
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        data: {
            get: function() {
                return this.Xa.data;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        context: {
            get: function() {
                return d(d({}, this.Xa.context), {
                    parent: this
                });
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        events: {
            get: function() {
                return this.yp;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        N$: {
            get: function() {
                return this.Xa.N$;
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)();
export const QW = t;

// Detected exports: QW
