/**
 * Netflix Cadmium Playercore - Module 20880
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 20880
// Parameters: t (module), b (exports), N/A (require)

t = (function() {
    function a(d) {
        this.sC = [];
        this.sC.push(d);
    }
    Object.defineProperties(a.prototype, {
        O: {
            get: function() {
                return this.sC[0].O;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        length: {
            get: function() {
                return this.sC.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(a.prototype, {
        muc: {
            get: function() {
                var d;
                return null !== (d = this.t8b) && undefined !== d ? d : this.t8b = this.sC.reduce(function(p, c) {
                    return p + c.length;
                }, 0);
            },
            enumerable: false,
            configurable: true
        }
    });
    a.prototype.y0 = function(d) {
        return this.sC[d].og;
    }
    ;
    a.prototype.qca = function(d) {
        return this.sC[d].sizes;
    }
    ;
    a.prototype.add = function(d) {
        this.sC.push(d);
    }
    ;
    a.prototype.eyc = function(d) {
        var c;
        for (var p = 0; 0 <= d; ) {
            c = this.sC[p];
            if (d < c.length)
                break;
            p++;
            d -= c.length;
        }
        return [p, d];
    }
    ;
    return a;
}
)();
export const Glb = t;

// Detected exports: Glb