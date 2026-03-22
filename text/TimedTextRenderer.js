/**
 * Netflix Cadmium Player - Timed Text Renderer
 *
 * Renders timed text (subtitles/captions) into DOM elements. Handles
 * text layout, positioning, font measurement, aspect ratio calculation,
 * writing mode support (horizontal-tb, vertical-rl), and style overrides
 * including window backgrounds, margins, and complex language adjustments.
 *
 * @module TimedTextRenderer
 * @original Module_97154
 */

// import { createElement, calculateAspectRatio, computeStyleString } from '../utils/DomUtils.js'; // webpack 52569
// import { resolveOverlaps } from '../text/TextLayoutResolver.js'; // webpack 33579
// import { renderTextBlock, getBlockStyle, renderWindowBackground, getBlockPosition } from '../text/TextBlockRenderer.js'; // webpack 15531
// import { config as globalConfig } from '../core/Config.js'; // webpack 29204
// import { document as doc } from '../core/Globals.js'; // webpack 22365
// import { forEachProperty } from '../utils/ObjectUtils.js'; // webpack 3887

/** @type {Object} CSS class attributes for text containers */
const TEXT_CONTAINER_ATTRS = { "class": "player-timedtext-text-container" };

/**
 * Renders timed text (subtitles/captions) to the DOM.
 * Supports complex text layout with alignment, margins, writing modes,
 * aspect ratio correction, and font size adjustments for complex languages.
 */
export class TimedTextRenderer {
    /**
     * @param {Object} sizeProvider - Provides character size information
     * @param {Object} fontStyles - Map of font family names to CSS style strings
     * @param {boolean|undefined} isLeftToRight - Text direction (true=LTR, false=RTL, undefined=inherit)
     * @param {string} [language] - BCP-47 language code
     */
    constructor(sizeProvider, fontStyles, isLeftToRight, language) {
        /** @type {Object} Character size provider */
        this._sizeProvider = sizeProvider;

        /** @type {Object} Font family CSS styles */
        this._fontStyles = fontStyles;

        /** @type {Object} Container CSS styles */
        this._containerStyle = {
            position: "absolute",
            left: "0",
            top: "0",
            right: "0",
            bottom: "0",
            display: "block"
        };

        /** @type {HTMLElement} Root text container element */
        this.element = createElement("DIV", undefined, undefined, {
            "class": "player-timedtext"
        });

        this.element.onselectstart = () => false;
        this._setDirection(isLeftToRight);

        /** @type {Object} Pre-measured font metrics */
        this._fontMetrics = this._measureAllFonts(fontStyles);

        /** @type {string|undefined} Language code */
        this._language = language;
    }

    /**
     * Gets the root DOM element
     * @returns {HTMLElement}
     */
    getElement() {
        return this.element;
    }

    /**
     * Sets the video aspect ratio for positioning calculations
     * @param {number} aspectRatio
     */
    setAspectRatio(aspectRatio) {
        this._aspectRatio = aspectRatio;
        this._render();
    }

    /**
     * Sets the current timed text entry to display
     * @param {Object} entry - Timed text entry with blocks/regions
     */
    setEntry(entry) {
        this._entry = entry;
        this._render();
    }

    /**
     * Updates text direction
     * @param {boolean|undefined} isLeftToRight
     */
    setTextDirection(isLeftToRight) {
        this._setDirection(isLeftToRight);
        this._render();
    }

    /**
     * Updates the language for complex language adjustments
     * @param {string} language - BCP-47 language code
     */
    setLanguage(language) {
        this._language = language;
        this._render();
    }

    /**
     * Main render method - positions and sizes all text blocks
     * @private
     */
    _render() {
        const container = this.getElement();
        const parent = container.parentElement;
        let parentWidth = (parent?.clientWidth) || 0;
        let parentHeight = (parent?.clientHeight) || 0;
        let leftOffset = 0;
        let topOffset = 0;
        let complexScaleFactor = 0;
        let viewport = { width: parentWidth, height: parentHeight };

        // Determine font size adjustments for complex languages
        const charSize = this._sizeProvider.getCharacterSizeConfig().characterSize;

        if (this._language && globalConfig.complexLanguages?.includes(this._language) && charSize === "MEDIUM") {
            complexScaleFactor = 1.4;
        }
        if (this._language && globalConfig.fullComplexLanguages?.includes(this._language) && charSize === "SMALL") {
            complexScaleFactor = 1.6;
        }

        if (parentWidth > 0 && parentHeight > 0 && this._entry) {
            // Apply aspect ratio letterboxing
            if (this._aspectRatio) {
                viewport = calculateAspectRatio(parentWidth, parentHeight, this._aspectRatio);
                leftOffset = Math.round((parentWidth - viewport.width) / 2);
                topOffset = Math.round((parentHeight - viewport.height) / 2);
            }

            const marginAdjustedSize = this._getMarginAdjustedSize(viewport);
            const scaledViewport = calculateAspectRatio(marginAdjustedSize.width, marginAdjustedSize.height, this._aspectRatio);

            let sortedBlocks = this._sortBlocks(this._entry.blocks);
            if (sortedBlocks) {
                sortedBlocks = this._reverseVerticalBlocks(sortedBlocks);
            }

            // Render each text block
            var renderedElements = sortedBlocks?.map((block) => {
                const region = block?.region;

                // Convert "start"/"end" to "left"/"right" based on direction
                if (region.horizontalAlignment === "start") {
                    region.horizontalAlignment = this._containerStyle.direction === "rtl" ? "right" : "left";
                } else if (region.horizontalAlignment === "end") {
                    region.horizontalAlignment = this._containerStyle.direction === "rtl" ? "left" : "right";
                }

                const content = renderTextBlock(block, scaledViewport, this._fontStyles, this._fontMetrics, complexScaleFactor);
                const style = getBlockStyle(block) + ";position:absolute";
                return createElement("div", style, content, TEXT_CONTAINER_ATTRS);
            });
        }

        // Apply container offsets
        Object.assign(this._containerStyle, {
            left: leftOffset + "px",
            right: leftOffset + "px",
            top: topOffset + "px",
            bottom: topOffset + "px"
        });

        // Update DOM
        container.style.display = "none";
        container.style.direction = this._containerStyle.direction;
        container.innerHTML = "";

        if (renderedElements?.length) {
            const viewWidth = viewport.width;
            const viewHeight = viewport.height;
            let safeArea = viewport;

            if (this._safeAreaInsets) {
                safeArea = this._applySafeAreaInsets(viewport, this._safeAreaInsets, parentHeight, topOffset);
            }

            if (this._margins) {
                this._containerStyle.margin = [
                    this._getMarginPx(viewport, "top"),
                    this._getMarginPx(viewport, "right"),
                    this._getMarginPx(viewport, "bottom"),
                    this._getMarginPx(viewport, "left")
                ].map(v => v + "px").join(" ");
            }

            renderedElements.forEach(el => container.appendChild(el));

            const cssText = computeStyleString(this._containerStyle);
            container.style.cssText = cssText + ";visibility:hidden;z-index:-1";

            // Measure and adjust block sizes
            const measurements = [];
            for (let i = renderedElements.length - 1; i >= 0; i--) {
                const el = renderedElements[i];
                const block = sortedBlocks[i];
                let dims = this._measureBlock(el, block, viewWidth, viewHeight);
                let scale = complexScaleFactor > 0
                    ? viewWidth / dims.width * complexScaleFactor
                    : viewWidth / dims.width;

                if (dims.width > viewWidth) {
                    el.innerHTML = renderTextBlock(block, viewport, this._fontStyles, this._fontMetrics, scale);
                    dims = this._measureBlock(el, block, viewWidth, viewHeight);
                }
                measurements[i] = dims;
            }

            // Resolve overlapping blocks
            const resolved = resolveOverlaps(measurements, safeArea);

            // Apply window backgrounds if configured
            const firstStyle = sortedBlocks?.[0]?.textNodes?.[0]?.style;
            if (firstStyle) {
                const windowColor = firstStyle.windowColor;
                const windowOpacity = firstStyle.windowOpacity;
                if (windowColor && windowOpacity > 0) {
                    const padding = Math.round(viewHeight / 50);
                    const bgElements = renderWindowBackground(sortedBlocks, resolved, padding, windowColor, viewport);
                    const bgContainer = createElement("div",
                        `position:absolute;left:0;top:0;right:0;bottom:0;opacity:${windowOpacity}`,
                        bgElements, TEXT_CONTAINER_ATTRS
                    );
                    container.insertBefore(bgContainer, container.firstChild);
                }
            }

            // Position each block
            container.style.display = "none";
            for (let i = resolved.length - 1; i >= 0; i--) {
                const position = getBlockPosition(sortedBlocks[i].region, resolved[i], viewWidth, viewHeight, 0);
                Object.assign(renderedElements[i].style, position);
            }

            container.style.cssText = cssText;
        }
    }

    /**
     * Sets safe area insets for subtitle positioning
     * @param {Object} insets - {top, bottom, left, right}
     */
    setSafeAreaInsets(insets) {
        this._safeAreaInsets = insets;
        this._render();
    }

    getSafeAreaInsets() {
        return this._safeAreaInsets;
    }

    /**
     * Sets margins for text positioning
     * @param {Object} margins - {top, bottom, left, right} as fractions
     */
    setMargins(margins) {
        this._margins = margins;
        this._render();
    }

    getMargins() {
        return this._margins;
    }

    /** @returns {boolean} Whether the container is visible */
    isVisible() {
        return this._containerStyle.display === "block";
    }

    /**
     * Shows or hides the text container
     * @param {boolean} visible
     */
    setVisible(visible) {
        const display = visible ? "block" : "none";
        this.element.style.display = display;
        this._containerStyle.display = display;
        if (visible) this._render();
    }

    /**
     * Updates font styles at runtime
     * @param {Object} fontStyles - New font style map
     */
    updateFontStyles(fontStyles) {
        this._fontStyles = fontStyles;
        this._fontMetrics = this._measureAllFonts(fontStyles);
    }

    /**
     * Pre-measures all font families for layout calculation
     * @param {Object} fontStyles - Font style map
     * @returns {Object} Font metrics keyed by family name
     * @private
     */
    _measureAllFonts(fontStyles) {
        const self = this;
        const metrics = {};
        forEachProperty(fontStyles, (name, css) => {
            metrics[name] = self._measureFont(css);
        });
        return metrics;
    }

    /**
     * Sets text direction from boolean/undefined
     * @private
     */
    _setDirection(isLeftToRight) {
        this._containerStyle.direction = typeof isLeftToRight === "boolean"
            ? (isLeftToRight ? "ltr" : "rtl")
            : "inherit";
    }

    /**
     * Computes margin in pixels for a given side
     * @private
     */
    _getMarginPx(viewport, side) {
        if (!this._margins) return 0;
        if (side === "left" || side === "right") return viewport.width * (this._margins[side] || 0);
        if (side === "top" || side === "bottom") return viewport.height * (this._margins[side] || 0);
        return 0;
    }

    /**
     * Computes size after subtracting margins
     * @private
     */
    _getMarginAdjustedSize(viewport) {
        if (!this._margins) return viewport;
        return {
            height: viewport.height * (1 - (this._margins.top || 0) - (this._margins.bottom || 0)),
            width: viewport.width * (1 - (this._margins.right || 0) - (this._margins.right || 0))
        };
    }

    /**
     * Measures a font by rendering a test string
     * @param {string} css - Font CSS string
     * @returns {Object} Font metrics {fontSize, height, width, lineHeight}
     * @private
     */
    _measureFont(css) {
        const style = `display:block;position:fixed;z-index:-1;visibility:hidden;font-size:1000px;${css};`;
        const testEl = createElement("DIV", style,
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            TEXT_CONTAINER_ATTRS
        );
        document.body.appendChild(testEl);
        const metrics = {
            fontSize: 1000,
            height: testEl.clientHeight,
            width: testEl.clientWidth / 52,
            lineHeight: testEl.clientHeight / 1000
        };
        document.body.removeChild(testEl);
        return metrics;
    }

    /**
     * Measures a rendered text block element
     * @private
     */
    _measureBlock(element, block, maxWidth, maxHeight) {
        const region = block.region;
        const marginTop = (region.marginTop || 0) * maxHeight;
        const marginBottom = (region.marginBottom || 0) * maxHeight;
        const marginLeft = (region.marginLeft || 0) * maxWidth;
        const marginRight = (region.marginRight || 0) * maxWidth;

        const width = element.clientWidth || 1;
        const height = element.clientHeight || 1;

        let top, left;

        switch (region.verticalAlignment) {
            case "top": top = marginTop; break;
            case "center": top = (marginTop + maxHeight - marginBottom - height) / 2; break;
            default: top = maxHeight - marginBottom - height;
        }

        switch (region.horizontalAlignment) {
            case "left": left = marginLeft; break;
            case "right": left = maxWidth - marginRight - width; break;
            default: left = (marginLeft + maxWidth - marginRight - width) / 2;
        }

        return { top, left, width, height };
    }

    /** @private */
    _applySafeAreaInsets(viewport, insets, parentHeight, topOffset) {
        return {
            height: parentHeight - Math.max(topOffset, insets.bottom || 0) - Math.max(topOffset, insets.top || 0),
            width: viewport.width
        };
    }

    /**
     * Reverses vertical-rl blocks for correct rendering order
     * @private
     */
    _reverseVerticalBlocks(blocks) {
        const verticalIndices = blocks
            .map((block, i) => block?.region?.writingMode === "vertical-rl" ? i : -1)
            .filter(i => i !== -1);

        if (verticalIndices?.length > 0) {
            for (let start = 0, end = verticalIndices.length - 1; start < end; start++, end--) {
                const si = verticalIndices[start];
                const ei = verticalIndices[end];
                [blocks[si], blocks[ei]] = [blocks[ei], blocks[si]];
            }
        }
        return blocks;
    }

    /**
     * Sorts horizontal-tb blocks by marginTop for correct stacking
     * @private
     */
    _sortBlocks(blocks) {
        if (!blocks || blocks.length === 0) return blocks;

        const horizontalBlocks = blocks
            .filter(b => b.region?.writingMode === "horizontal-tb")
            .sort((a, b) => a.region.marginTop - b.region.marginTop);

        if (!horizontalBlocks?.length) return blocks;

        let sortIndex = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].region?.writingMode === "horizontal-tb") {
                blocks[i] = horizontalBlocks[sortIndex++];
            }
        }
        return blocks;
    }
}
