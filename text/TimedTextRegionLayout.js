/**
 * @module TimedTextRegionLayout
 * @description Computes layout properties (margins, alignment, writing mode, direction)
 *              for TTML/DFXP timed text regions. Handles region positioning, extent,
 *              origin, writing modes (horizontal/vertical), text alignment, and
 *              aspect ratio correction for subtitle rendering.
 *              Original: Module_81668
 */

import coalesce from '../utils/Coalesce'; // Module 11946

/**
 * Maps display alignment values to vertical alignment strings.
 * @type {Object<string, string>}
 */
const VERTICAL_ALIGNMENT_MAP = {
    before: "top",
    start: "top",
    center: "center",
    after: "bottom",
    end: "bottom",
};

/**
 * Maps display alignment to horizontal alignment for left-to-right vertical text.
 * @type {Object<string, string>}
 */
const HORIZONTAL_ALIGNMENT_LR = {
    before: "left",
    center: "center",
    after: "right",
};

/**
 * Maps display alignment to horizontal alignment for right-to-left vertical text.
 * @type {Object<string, string>}
 */
const HORIZONTAL_ALIGNMENT_RL = {
    before: "right",
    center: "center",
    after: "left",
};

/**
 * Maps text alignment values to CSS text-align equivalents.
 * @type {Object<string, string>}
 */
const TEXT_ALIGNMENT_MAP = {
    left: "left",
    start: "start",
    center: "center",
    right: "right",
    end: "end",
};

/**
 * Maps TTML writing modes to CSS writing-mode values.
 * @type {Object<string, string>}
 */
const WRITING_MODE_MAP = {
    lrtb: "horizontal-tb",
    rltb: "horizontal-tb",
    tblr: "vertical-lr",
    tbrl: "vertical-rl",
};

/**
 * Valid CSS position keywords used for parsing region position strings.
 * @type {Object<string, string>}
 */
const POSITION_KEYWORDS = {
    top: "top",
    bottom: "bottom",
    left: "left",     // Note: original had "right" mapped to both "left" and "right" (likely a bug)
    right: "right",
};

/**
 * Maps writing modes and direction values to CSS direction.
 * @type {Object<string, string>}
 */
const DIRECTION_MAP = {
    ltr: "ltr",
    rtl: "rtl",
    lrtb: "ltr",
    rltb: "rtl",
};

/**
 * Looks up vertical alignment from display alignment value.
 * @param {string} value - Display alignment value
 * @returns {string|null} CSS vertical alignment or null
 */
function toVerticalAlignment(value) {
    return typeof value !== "string" ? null : VERTICAL_ALIGNMENT_MAP[value];
}

/**
 * Looks up text alignment from alignment value.
 * @param {string} value - Text alignment value
 * @returns {string|null} CSS text alignment or null
 */
function toTextAlignment(value) {
    return typeof value !== "string" ? null : TEXT_ALIGNMENT_MAP[value];
}

/**
 * Parses a size/position string into normalized [x, y] coordinates.
 * Handles both pixel (px) and percentage (%) values.
 * @param {string} sizeString - Space-separated pair like "50% 80%" or "100px 200px"
 * @param {Object} dimensions - Reference dimensions with width and height
 * @returns {number[]} Normalized [x, y] coordinates (0-1 range)
 */
function parseNormalizedCoordinates(sizeString, dimensions) {
    const parts = sizeString.split(" ");
    const xPart = parts[0];
    const yPart = parts[1];

    if (xPart.indexOf("px") > -1) {
        return [
            parseFloat(xPart) / dimensions.width,
            parseFloat(yPart) / dimensions.height,
        ];
    }

    return [
        0.01 * parseFloat(xPart),
        0.01 * parseFloat(yPart),
    ];
}

/**
 * Computes the complete layout for a timed text region.
 * @param {Object} document - The TTML document containing regions, styles, and aspect ratio
 * @param {Object} cue - The subtitle cue with region reference, extent, origin, and text nodes
 * @returns {Object} Layout object with margins, alignment, writing mode, and direction
 */
function computeRegionLayout(document, cue) {
    const firstTextNode = cue.textNodes[0] || {};
    const regions = document.regions;
    const styles = document.styles;
    const aspectRatio = document.aspectRatio;
    const initialStyle = document.initialStyle || {};

    const region = (regions && regions[cue.region]) ? regions[cue.region] : {};
    const style = (styles && styles[firstTextNode.style]) ? styles[firstTextNode.style] : {};
    const lang = firstTextNode.lang;

    // Calculate extent (region dimensions)
    const extent = parseNormalizedCoordinates(
        coalesce(cue.extent, region.extent, "80% 80%"),
        document
    );

    // Calculate origin (region position)
    let origin;
    if (region.position) {
        const positionParts = region.position.split(" ");
        const values = [0.5, 0.5];
        const axes = ["left", "top"];
        let valueIndex = 0;

        for (let i = 0; i < positionParts.length; i++) {
            const part = positionParts[i];
            if (part in POSITION_KEYWORDS) {
                axes[valueIndex] = part;
                if (i + 1 >= positionParts.length) {
                    values[valueIndex++] = 0;
                }
            } else if (part === "center") {
                values[valueIndex++] = 0.5;
            } else {
                values[valueIndex++] = 0.01 * parseFloat(part);
            }
        }

        let normalizedX, normalizedY;
        if (["top", "bottom"].indexOf(axes[0]) > -1 || ["left", "right"].indexOf(axes[1]) > -1) {
            normalizedY = axes[0] === "bottom" ? 1 - values[0] : values[0];
            normalizedX = axes[1] === "right" ? 1 - values[1] : values[1];
        } else {
            normalizedX = axes[0] === "right" ? 1 - values[0] : values[0];
            normalizedY = axes[1] === "bottom" ? 1 - values[1] : values[1];
        }

        origin = [
            (1 - extent[0]) * normalizedX,
            (1 - extent[1]) * normalizedY,
        ];
    } else {
        origin = null;
    }

    const finalOrigin = origin
        ? origin
        : parseNormalizedCoordinates(coalesce(origin, cue.origin, region.origin, "10% 10%"), document);

    // Apply aspect ratio correction (normalize to 720p equivalent)
    const correctedAspectRatio = aspectRatio / (1280 / 720);
    const pillarbox = (1 - correctedAspectRatio) / 2;
    const originX = finalOrigin[0];
    const originY = finalOrigin[1];

    const layout = Object.create({
        marginLeft: originX * correctedAspectRatio + pillarbox,
        marginTop: originY,
        marginRight: (1 - (originX + extent[0])) * correctedAspectRatio + pillarbox,
        marginBottom: 1 - (originY + extent[1]),
    });

    // Writing mode
    const writingModeValue = region.writingMode ? region.writingMode : "lrtb";
    layout.writingMode = typeof writingModeValue !== "string" ? null : WRITING_MODE_MAP[writingModeValue];

    // Alignment
    if (Object.keys(region).length > 1) {
        const displayAlign = coalesce(style.displayAlign, region.displayAlign, "before");

        if (region.writingMode === "tblr" || region.writingMode === "tbrl") {
            // Vertical text: displayAlign maps to horizontal alignment
            const alignMap = region.writingMode === "tblr" ? HORIZONTAL_ALIGNMENT_LR : HORIZONTAL_ALIGNMENT_RL;
            layout.horizontalAlignment = typeof displayAlign !== "string" ? null : alignMap[displayAlign];
            layout.verticalAlignment = toVerticalAlignment(coalesce(style.textAlign, region.textAlign, "start"));
        } else {
            layout.verticalAlignment = toVerticalAlignment(displayAlign);
        }
    } else {
        layout.verticalAlignment = toVerticalAlignment(coalesce(style.displayAlign, "after"));
    }

    // Horizontal alignment for horizontal text
    if (layout.writingMode === "horizontal-tb") {
        layout.horizontalAlignment = toTextAlignment(
            coalesce(style.textAlign, region.textAlign, initialStyle.textAlign, "center")
        );
    }

    // Multi-row alignment (defaults to "center", except Japanese which defaults to "start")
    layout.multiRowAlignment = toTextAlignment(
        coalesce(
            style.multiRowAlign, region.multiRowAlign,
            style.textAlign, region.textAlign,
            initialStyle.textAlign,
            lang && lang.slice(0, 2) === "ja" ? "start" : "center"
        )
    );

    // Text direction
    const directionValue = coalesce(region.direction, region.writingMode);
    layout.direction = typeof directionValue !== "string" ? null : DIRECTION_MAP[directionValue];

    return layout;
}

export { computeRegionLayout };
export default { computeRegionLayout };
