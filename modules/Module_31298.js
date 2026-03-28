/**
 * Netflix Cadmium Playercore - Module 31298
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Bjb
 * Dependencies: 32687, 33096, 36129
 * Purpose: Audio handling, Logging, Configuration, Timing/Scheduling
 */

// import dep_32687 from './Module_32687.js';
// import dep_33096 from './Module_33096.js';
// import dep_36129 from './Module_36129.js';

// Webpack module 31298
// Parameters: t (module), b (exports), a (require)

var p, c, g;
class d {
    constructor(f, e, h, k, l, m) {
    this.debug = f;
    this.config = e;
    this.platform = h;
    this.debug.assert(k && k != c.ea.lo, "There should always be a specific error code");
    this.errorCode = k || c.ea.lo;
    l && "object" === typeof l ? (this.Ya = l.Ya || l.subCode,
    this.Yg = l.Yg || l.extCode,
    this.Yaa = l.Yaa || l.lyb,
    this.Cf = l.Cf || l.details,
    this.Daa = l.wTa,
    this.hra = l.hra || l.xjd || l.JI,
    this.Xaa = l.Xaa || l.data,
    l.uea && (this.uea = l.uea),
    this.mfa = l.mfa,
    this.Rq = l.Rq,
    this.method = l.method,
    this.LI = l.LI,
    this.alert = l.alert,
    this.QOa = l.QOa,
    this.T0 = l.T0,
    !this.Cf && this.T0 && (this.Cf = JSON.stringify(this.T0)),
    this.de = l.de,
    this.debug.assert(!this.Rq || this.Rq == this.Yg)) : (this.Ya = l,
    this.Yg = m);
    this.stack = [this.errorCode];
    this.Ya ? this.stack.push(this.Ya) : this.Yg && this.stack.push(c.Y.lo);
    this.Yg && this.stack.push(this.Yg);
    this.Eqa = this.kua ? this.mfa : this.platform.sy + this.stack.join("-");
}
    vSb(f) {
    this.DPc = f;
}
    toString() {
    var f;
    f = "[PlayerError #" + this.Eqa + "]";
    this.Cf && (f += " " + this.Cf);
    this.Daa && (f += " (CustomMessage: " + this.Daa + ")");
    return f;
}
    kE() {
    return (/widevine/i).test(this.config().yB) ? p.xEa : (/fps/i).test(this.config().yB) ? "fairplay" : p.bka;
}
    cia() {
    var f, e, h, k;
    this.Daa && (h = ["streaming_error"]);
    h || this.kE() !== p.bka || ("80080017" == this.Yg && (h = ["admin_mode_not_supported", "platform_error"] /* admin_mode_not_supported */),
    "8004CD12" === this.Yg && (h = ["pause_timeout"]));
    h || this.kE() !== p.xEa || this.errorCode !== c.ea.bcb && this.errorCode !== c.ea.AEa || (h = ["no_cdm", "platform_error", "plugin_error"] /* no_cdm */);
    h || this.errorCode !== c.ea.DEa || this.Ya !== c.Y.BEa || (h = ["pause_timeout"]);
    this.hra === c.Yka.ud && (this.pQa("2018") || this.pQa("2020") ? h = ["received_soad"] : this.pQa("5000") && (h = ["should_reset_device"]));
    k = this.Dvc();
    k && (h = [k],
    this.Daa = undefined);
    if (!h)
        switch (this.errorCode) {
        case c.ea.mla:
        case c.ea.yka:
        case c.ea.OYb:
        case c.ea.oIa:
            this.DPc && (h = ["pause_timeout"]);
            break;
        case c.ea.veb:
        case c.ea.web:
            h = this.Ya ? ["platform_error"] : ["multiple_tabs"];
            break;
        case c.ea.OFa:
        case c.ea.rib:
        case c.ea.qIa:
        case c.ea.H4b:
            h = ["platform_error", "plugin_error"] /* platform_error */;
            break;
        case c.ea.Q4b:
            h = ["no_cdm", "platform_error", "plugin_error"] /* no_cdm */;
            break;
        case c.ea.hcb:
        case c.ea.nla:
        case c.ea.tib:
            switch (this.Yg) {
            case "FFFFD000":
                h = ["device_needs_service", "platform_error"] /* device_needs_service */;
                break;
            case "48444350":
                h = ["unsupported_output", "platform_error"] /* unsupported_output */;
                break;
            case "00000024":
                h = ["private_mode"];
            }
            break;
        case c.ea.pib:
        case c.ea.pIa:
            h = ["unsupported_output"];
        }
    !h && (0,
    c.Fcb)(this.Ya) && (h = this.Ya == c.Y.c7 ? ["geo"] : ["internet_connection_problem"]);
    h || this.errorCode !== c.ea.AEa || this.Ya !== c.Y.Sr || "S" !== this.platform.sy || (h = ["private_mode"]);
    if (!h)
        switch (this.N6a(this.Ya)) {
        case c.Y.LLa:
            h = ["should_upgrade"];
            break;
        case c.Y.kib:
            h = ["should_reset_device"];
            break;
        case c.Y.jib:
            h = ["should_reload_device"];
            break;
        case c.Y.iib:
            h = ["should_exit_device"];
            break;
        case c.Y.o3b:
        case c.Y.ogb:
            h = ["should_signout_and_signin"];
            break;
        case c.Y.p3b:
            h = ["internet_connection_problem"];
            break;
        case c.Y.obb:
            h = ["platform_error", "plugin_error"] /* platform_error */;
            break;
        case c.Y.C_b:
        case c.Y.deb:
        case c.Y.eeb:
            h = ["private_mode"];
            break;
        case c.Y.ggb:
            h = ["should_reload_with_preferred_locales"];
        }
    h = h || [];
    if (this.kua)
        (h.push(this.mfa, this.Yaa),
        this.N6a(this.Ya) === c.Y.lIa && h.push("incorrect_pin"));
    else if ((h.push(this.platform.sy + this.errorCode),
    this.Ya))
        switch (this.N6a(this.Ya)) {
        case c.Y.lIa:
            h.push("incorrect_pin");
            break;
        default:
            h.push("" + this.Ya);
        }
    h = {
        display: {
            code: this.Eqa,
            text: this.Daa
        },
        messageIdList: h,
        alert: this.alert,
        alertTag: this.QOa,
        preferredAudioLocale: null === (f = this.T0) || undefined === f ? undefined : f.ZBc,
        preferredTextLocale: null === (e = this.T0) || undefined === e ? undefined : e.$Bc
    };
    this.config().osc && (h.debugData = this.Xaa);
    return h;
}
    N6a(f) {
    var e;
    e = parseInt(f, 10);
    return isNaN(e) ? f : e;
}
    pQa(f) {
    return ((0,
    g.wc)(this.Yg) ? this.Yg.toString() : (0,
    g.Ri)(this.Yg) ? this.Yg : "").endsWith(f);
}
    Dvc() {
    if (this.errorCode === c.ea.jfb && (this.Ya === c.Y.kIa || this.Ya === c.Y.hib))
        return this.Evc(this.Ya === c.Y.kIa);
}
    Evc(f) {
    var e, h, k, l;
    k = this.config().browserInfo || ({});
    l = null === (e = k.os) || undefined === e ? undefined : e.name;
    e = ((null === (h = k.os) || undefined === h ? undefined : h.version) || "").split(".");
    h = parseInt(e && e[0]);
    e = parseInt(e && e[1]);
    switch (l) {
    case "windows":
        return 6 > h || 6 === h && 1 > e ? f ? "cdm_not_supported_warning_switch_windows" : "cdm_not_supported_switch_windows" : f ? "cdm_not_supported_warning_update" : "cdm_not_supported_update";
    case "mac":
        return 10 > h || 10 === h && 10 > e ? f ? "cdm_not_supported_warning_switch_mac" : "cdm_not_supported_switch_mac" : f ? "cdm_not_supported_warning_update" : "cdm_not_supported_update";
    default:
        return f ? "cdm_not_supported_warning_other" : "cdm_not_supported_other";
    }
}
}
p = a(33096);
c = a(36129);
g = a(32687);
a(3887);
Ha.Object.defineProperties(d.prototype, {
    kua: {
        configurable: true,
        enumerable: true,
        get: function() {
            return !!this.mfa && !!this.Yaa;
        }
    }
});
export const Bjb = d;

// Detected exports: Bjb
