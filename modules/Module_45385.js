/**
 * Netflix Cadmium Playercore - Module 45385
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 45385
// Parameters: t (module), b (exports), a (require)

var p;
function d() {}

p = a(36129);
d.vEc = function(c) {
    var g, f;
    g = c && c.code;
    f = c && (c.Ya || c.subCode);
    c = c.extCode !== p.wka.Hib;
    f = !!f && f >= p.Y.g7 && f <= p.Y.c7 && c;
    return !("RETRY" !== g && "FAIL" !== g) || f;
}
;
d.Gxc = function(c, g) {
    g = null === g || undefined === g ? undefined : g.T1;
    return undefined !== g ? g : "FAIL" === (null === c || undefined === c ? undefined : c.code) ? 1 : undefined;
}
;
d.BOc = function(c, g) {
    var f;
    if (g) {
        try {
            f = c.parse(g);
        } catch (e) {
            throw {
                SI: true,
                code: "FAIL",
                message: "Unable to parse the response body",
                data: g
            };
        }
        if (f.error)
            throw f.error;
        if (f.result) {
            if (Array.isArray(f.result) && (c = f.result.find(function(e) {
                return e.error;
            })))
                throw c.error;
            return f;
        }
        throw {
            SI: true,
            code: "FAIL",
            message: "There is no result property on the response"
        };
    }
    throw {
        SI: true,
        code: "FAIL",
        message: "There is no body property on the response"
    };
}
;
export const ola = d;

// Detected exports: ola