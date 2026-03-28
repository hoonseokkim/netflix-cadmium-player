/**
 * Netflix Cadmium Playercore - Module 97485
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: DRM / content protection
 * Exports: RRc
 */

// Webpack module 97485
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
export function RRc(e) {
    g.z_.parent = e.Fb;
    return function() {
        f || (f = new Promise(function(h, k) {
            try {
                h(g.z_.get(c.Rbb));
            } catch (l) {
                k(new p.wk(d.ea.F1b,d.Y.Q1b,undefined,"Unable to extract the DRM services from the dependency injector",l));
            }
        }
        ));
        return f;
    }
    ;
}
;
d = a(36129);  // import from Module_36129
p = a(61731);  // import from Module_61731
c = a(47737);  // import from Module_47737
g = a(4959

// Detected exports: RRc
