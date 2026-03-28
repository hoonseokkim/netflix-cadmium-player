/**
 * Netflix Cadmium Playercore - Module 58844
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Adaptive bitrate selection
 */

// Webpack module 58844
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.v$a = undefined;
t = (function() {
    function a(d) {
        this.config = d;
    }
    a.prototype.Oh = function(d) {
        var p;
        p = this.config;
        return d.filter(function(c) {
            return !(undefined !== c.Wb && (c.Wb < p.II || c.Wb > p.hJb) || (undefined === c.Wb || 0 >= p.II) && c.bitrate < p.IT || (undefined === c.Wb || Infinity === p.hJb) && c.bitrate > p.hea);
        });
    }
    ;
    return a;
}
)();
b.v$a = t;

