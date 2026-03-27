/**
 * Netflix Cadmium Playercore - Module 19234
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 19234
// Parameters: t (module), b (exports), a (require)

var d;
d = a(22970);
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.prototype.parse = function() {
        this.N.gC();
        this.N.gC();
        for (this.SQa = []; this.N.offset <= this.byteOffset + this.byteLength - 4; )
            this.SQa.push(this.N.gC());
        return true;
    }
    ;
    c.Ae = "ftyp";
    c.Fd = false;
    return c;
}
)(a(72905).Kf);
export default t;
