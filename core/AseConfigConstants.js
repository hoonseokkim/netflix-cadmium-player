/**
 * Netflix Cadmium Player — AseConfigConstants
 *
 * Constants for ASE (Adaptive Streaming Engine) configuration including
 * browser identifiers, OS/platform names, device form-factor types,
 * and the IoC container symbol for the config service.
 *
 * Also re-exports AseConfigValues and AseConfigExtensions from the
 * extended config module.
 *
 * @module core/AseConfigConstants
 * @original Module_4203
 */

// import { P6c as AseConfigValues, O6c as AseConfigExtensions } from './AseConfigExtended'; // Module 45247

/**
 * Re-exported ASE config values.
 * @see Module 45247
 */
export { AseConfigValues, AseConfigExtensions };

/**
 * Known browser identifiers used in player configuration.
 * @enum {string}
 */
export const BrowserType = {
    CAST_TV: 'casttv',
    CHROME: 'chrome',
    CHROMECAST: 'chromecast',
    EDGE: 'edge',
    EDGE_OSS: 'edgeoss',
    FIREFOX: 'firefox',
    IE: 'ie',
    OPERA: 'opera',
    QUEST: 'quest',
    SAFARI: 'safari',
    TESLA: 'tesla',
};

/**
 * Known operating system / platform identifiers.
 * @enum {string}
 */
export const PlatformType = {
    ANDROID: 'android',
    IOS: 'ios',
    CHROME_OS: 'chromeos',
    LINUX: 'linux',
    MAC: 'mac',
    WINDOWS: 'windows',
};

/**
 * Device form-factor types.
 * @enum {string}
 */
export const DeviceFormFactor = {
    COMPUTER: 'computer',
    PHONE: 'phone',
    TABLET: 'tablet',
};

/**
 * IoC container symbol for the ASE configuration provider.
 * @type {string}
 */
export const ConfigToken = 'ConfigSymbol';
