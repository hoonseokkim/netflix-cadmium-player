/**
 * Netflix Cadmium Playercore - Module 74267
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Leaf module (no dependencies)
 * Original signature: function(t, b)
 */

// Webpack module 74267
// Parameters: t (module), b (exports)
function a(d, p, c) {
    if (null != c) {
        if (0 < c(d, p))
            throw a.ewb(d, p);
    } else if (d.xl && 0 < d.xl(p))
        throw a.ewb(d, p);
    this.start = d;
    this.end = p;
}

a.ewb = function(d, p) {
    return new RangeError("end [" + p + "] must be >= start [" + d + "]");
}
;
export const YJa = a;
