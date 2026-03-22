/**
 * Netflix Cadmium Player - Module 33633
 * In-browser debug log overlay with SVG toolbar icons and log file download.
 *
 * @module DebugLogConsole
 */

import { __decorate, __param } from '@nfx/22970'; // tslib decorators
import { injectable, injectDecorator } from '@nfx/22674'; // inversify DI
import { updateMap } from '@nfx/74870'; // element factory token
import { uK } from '@nfx/45842'; // log service token
import { internal_Uja } from '@nfx/34043'; // throttled scheduler token
import { valueList } from '@nfx/53085'; // scheduler token
import { PlayerCoreToken } from '@nfx/30869';
import { ri, ellaSendRateMultiplier, seekToSample, millisecondsUnit } from '@nfx/5021'; // time units
import { ClockToken } from '@nfx/81918';
import { QC } from '@nfx/33554'; // device registration token
import { ep as LogLevel } from '@nfx/87386'; // log levels (ERROR, WARN, INFO, TRACE, DEBUG)
import { oX } from '@nfx/36410'; // log sinks token
import { TGa } from '@nfx/34126'; // log event types
import { internal_Wfb } from '@nfx/52476'; // config token
import { PJ } from '@nfx/17892'; // init param token
import { kX as KeyCodes } from '@nfx/43193';
import { internal_Sab } from '@nfx/44133'; // ESN utilities

// ---------------------------------------------------------------------------
// SvgIconBuilder -- fluent builder for SVG toolbar icons
// ---------------------------------------------------------------------------

/**
 * Fluent builder for constructing SVG icons used in the debug console toolbar.
 * Maintains an element stack so that nested SVG groups/paths can be built
 * with chained calls and terminated with {@link end}.
 */
class SvgIconBuilder {
    /** @type {string} SVG XML namespace */
    static SVG_NS = 'http://www.w3.org/2000/svg';

    /** @returns {string} Transparent background colour */
    static get background() {
        return 'transparent';
    }

    /** @returns {string} Default foreground (stroke/fill) colour */
    static get foregroundColor() {
        return '#000000';
    }

    /**
     * @param {string} viewBox - The SVG viewBox attribute value (e.g. "0 0 24 24")
     */
    constructor(viewBox) {
        /** @type {SVGElement[]} */
        this.elements = [];
        const svg = document.createElementNS(SvgIconBuilder.SVG_NS, 'svg');
        svg.setAttribute('viewBox', viewBox);
        this.elements.push(svg);
    }

    /**
     * Begin a new `<g>` group element with default stroke/fill settings.
     * @returns {this}
     */
    beginGroup() {
        const g = document.createElementNS(SvgIconBuilder.SVG_NS, 'g');
        g.setAttribute('stroke', 'none');
        g.setAttribute('stroke-width', (1).toString());
        g.setAttribute('fill', 'none');
        g.setAttribute('fill-rule', 'evenodd');
        g.setAttribute('stroke-linecap', 'round');
        this.#pushElement(g);
        return this;
    }

    /**
     * Add a `<path>` element.
     * @param {string} d - The path data string
     * @param {string} [fill] - Fill colour
     * @param {string} [fillRule] - Fill rule (e.g. "nonzero")
     * @returns {this}
     */
    addPath(d, fill, fillRule) {
        const path = document.createElementNS(SvgIconBuilder.SVG_NS, 'path');
        path.setAttribute('d', d);
        if (fill) path.setAttribute('fill', fill);
        if (fillRule) path.setAttribute('fill-rule', fillRule);
        this.#pushElement(path);
        return this;
    }

    /**
     * Add a `<rect>` element.
     * @param {number} x
     * @param {number} y
     * @param {number} height
     * @param {number} width
     * @param {string} [fill="#000000"]
     * @returns {this}
     */
    addRect(x, y, height, width, fill = '#000000') {
        const rect = document.createElementNS(SvgIconBuilder.SVG_NS, 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('width', width.toString());
        if (fill) rect.setAttribute('fill', fill);
        this.#pushElement(rect);
        return this;
    }

    /**
     * Add a mirrored `<polygon>` element (used for refresh-style icons).
     * @returns {this}
     */
    addMirroredPolygon() {
        const polygon = document.createElementNS(SvgIconBuilder.SVG_NS, 'polygon');
        polygon.setAttribute('points', '0 0 24 0 24 24 0 24');
        polygon.setAttribute(
            'transform',
            'translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000)'
        );
        this.#pushElement(polygon);
        return this;
    }

    /**
     * Pop the current element off the builder stack (close the current group/shape).
     * @returns {this}
     */
    end() {
        this.elements.pop();
        return this;
    }

    /**
     * Finalize the builder and return the root SVG element.
     * @returns {SVGElement}
     * @throws {RangeError} If the element stack is malformed
     */
    build() {
        if (this.elements.length > 1) {
            throw new RangeError("Some item wasn't terminated correctly");
        }
        if (this.elements.length === 0) {
            throw new RangeError('Too many items were terminated');
        }
        return this.elements[0];
    }

    /**
     * Append a child element to the current top-of-stack and push it.
     * @param {SVGElement} element
     */
    #pushElement(element) {
        if (this.elements.length === 0) {
            throw new RangeError('Too many items were terminated');
        }
        this.elements[this.elements.length - 1].appendChild(element);
        this.elements.push(element);
    }
}

// ---------------------------------------------------------------------------
// LogFileDownloader -- static utility for downloading log entries to a file
// ---------------------------------------------------------------------------

/**
 * Static utility class that handles downloading debug log entries as a
 * timestamped `.log` text file via a temporary `<a>` element click.
 */
class LogFileDownloader {
    /**
     * Download log lines as a `.log` text file.
     * @param {string} suffix - Filename suffix (e.g. "all")
     * @param {string[]} lines - Array of formatted log lines
     * @returns {Promise<void>}
     */
    static download(suffix, lines) {
        return LogFileDownloader.#generateFilename(suffix).then((filename) =>
            LogFileDownloader.#createBlobUrl(filename, lines.join('\r\n')).then((result) =>
                LogFileDownloader.#triggerDownload(result.filename, result.blobUrl)
            )
        );
    }

    /**
     * Generate a timestamped filename like `20260322143025.all.log`.
     * @param {string} suffix
     * @returns {Promise<string>}
     */
    static #generateFilename(suffix) {
        return new Promise((resolve, reject) => {
            try {
                const now = new Date();
                let day = now.getDate().toString();
                let month = (now.getMonth() + 1).toString();
                const year = now.getFullYear().toString();
                let hours = now.getHours().toString();
                let minutes = now.getMinutes().toString();
                let seconds = now.getSeconds().toString();

                if (day.length === 1) day = '0' + day;
                if (month.length === 1) month = '0' + month;
                if (hours.length === 1) hours = '0' + hours;
                if (minutes.length === 1) minutes = '0' + minutes;
                if (seconds.length === 1) seconds = '0' + seconds;

                resolve(`${year}${month}${day}${hours}${minutes}${seconds}.${suffix}.log`);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Create a Blob URL from the given text content.
     * @param {string} filename
     * @param {string} text
     * @returns {Promise<{filename: string, blobUrl: string}>}
     */
    static #createBlobUrl(filename, text) {
        return new Promise((resolve, reject) => {
            try {
                resolve({
                    filename,
                    blobUrl: URL.createObjectURL(new Blob([text], { type: 'text/plain' })),
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Trigger a file download by creating a hidden anchor, clicking it, and removing it.
     * @param {string} filename
     * @param {string} blobUrl
     * @returns {Promise<void>}
     */
    static #triggerDownload(filename, blobUrl) {
        try {
            const anchor = document.createElement('a');
            anchor.setAttribute('href', blobUrl);
            anchor.setAttribute('download', filename);
            anchor.style.display = 'none';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

// ---------------------------------------------------------------------------
// DebugLogConsole -- main injectable debug log overlay
// ---------------------------------------------------------------------------

/** @type {string} Styles for the textarea in its default (blurred) state */
const TEXTAREA_STYLE_BLUR =
    'position:absolute;resize:none;box-sizing:border-box;width:100%;height:100%;margin:0;' +
    'color:#040;font-size:11px;font-family:monospace;overflow:scroll;background-color:rgba(255,255,255,0.6)';

/** @type {string} Styles for the textarea when focused */
const TEXTAREA_STYLE_FOCUS =
    'position:absolute;resize:none;box-sizing:border-box;width:100%;height:100%;margin:0;' +
    'color:#040;font-size:11px;font-family:monospace;overflow:scroll;background-color:rgba(255,255,255,0.86)';

/** @type {string} Full-height console positioning */
const CONSOLE_STYLE_FULL =
    'position:fixed;left:10px;top:30px;right:10px;z-index:10000;color:#000;bottom:10px;';

/** @type {string} Collapsed (30%-height) console positioning */
const CONSOLE_STYLE_COLLAPSED =
    'position:fixed;left:10px;top:30px;right:10px;z-index:10000;color:#000;height:30%;';

/** @type {number} Maximum number of formatted log lines to display */
const MAX_DISPLAY_LINES = 10_000;

/**
 * In-browser debug log console overlay for the Netflix Cadmium player.
 *
 * Provides:
 *  - A floating `<textarea>` that shows recent log entries
 *  - SVG toolbar with refresh, clear, expand/shrink, download, and close buttons
 *  - Category filtering, log-level filtering, regex text filter
 *  - Keyboard shortcut (Ctrl+Alt+Shift+D) to toggle visibility
 *  - One-click download of all log entries as a `.log` file
 *
 * Decorated with inversify `@injectable()` and parameter injection tokens.
 */
class DebugLogConsole {
    /** @type {string} Service identifier for DI registration */
    static serviceId = 'logDxDisplay';

    /**
     * @param {object} playerCore       - Player core instance (system clock access)
     * @param {object} clientContext     - Client session context (id, start time)
     * @param {object} elementFactory   - DOM element factory
     * @param {object} scheduler        - Scheduler for delayed tasks
     * @param {object} logSinks         - Log event bus / sink registry
     * @param {object} config           - Debug console configuration
     * @param {Function} deviceRegistration - Returns device info (ESN, etc.)
     * @param {Function} logService     - Factory for throttled log hydration schedulers
     * @param {Function} throttledSchedulerFactory - Factory for throttled input schedulers
     * @param {object} initParam        - Initialization parameters
     */
    constructor(
        playerCore,
        clientContext,
        elementFactory,
        scheduler,
        logSinks,
        config,
        deviceRegistration,
        logService,
        throttledSchedulerFactory,
        initParam
    ) {
        this.playerCore = playerCore;
        this.clientContext = clientContext;
        this.elementFactory = elementFactory;
        this.scheduler = scheduler;
        this.logSinks = logSinks;
        this.config = config;
        this.deviceRegistration = deviceRegistration;
        this.logService = logService;
        this.throttledSchedulerFactory = throttledSchedulerFactory;
        this.initParam = initParam;

        /** @type {HTMLTextAreaElement|undefined} */
        this.logTextarea = undefined;

        /** @type {HTMLButtonElement|undefined} Expand button (show when collapsed) */
        this.expandButton = undefined;

        /** @type {HTMLButtonElement|undefined} Shrink button (show when expanded) */
        this.shrinkButton = undefined;

        /** @type {HTMLElement|undefined} Root console DOM element */
        this.element = undefined;

        /** @type {boolean} Whether the DOM has been built at least once */
        this.domBuilt = false;

        /** @type {boolean} Whether the textarea currently has focus */
        this.isFocused = false;

        /** @type {Promise|undefined} Initialization promise (lazy) */
        this.initPromise = undefined;

        /**
         * Console UI state: visibility, size toggle, detail view, log level,
         * active category filters.
         */
        this.configState = {
            /** @type {boolean} Whether the overlay is currently appended to the DOM */
            isVisible: false,
            /** @type {boolean} true = collapsed (30%), false = full height */
            toggleFlag: true,
            /** @type {boolean} Whether to show detailed log output */
            showDetails: true,
            /** @type {number} Current minimum log level to display */
            logLevel: LogLevel.INFO,
            /** @type {Object<string, boolean>} Map of category name -> enabled flag */
            categoryFilters: {},
            /** @type {RegExp|undefined} Optional regex text filter */
            filter: undefined,
        };

        /** @type {object} Throttled scheduler for log hydration updates */
        this.hydrationScheduler = this.logService(ri(1));

        /** @type {object} Throttled scheduler for filter input debouncing */
        this.filterDebounceScheduler = this.throttledSchedulerFactory(
            ellaSendRateMultiplier(250)
        );

        /** @type {Array<object>} Buffer of log entry objects */
        this.entries = [];

        // -- Bound callbacks (arrow functions to preserve `this`) --

        /** Schedule a throttled visual update of the textarea */
        this.scheduleThrottledUpdate = () => {
            this.hydrationScheduler.scheduleHydration(() => {
                this.update();
            });
        };

        /** Clear all log entries and refresh the display */
        this.clear = () => {
            this.entries = [];
            this.update();
        };

        /** Toggle between collapsed and full-height console */
        this.toggleSize = () => {
            this.configState.toggleFlag = !this.configState.toggleFlag;
            if (this.expandButton && this.shrinkButton) {
                if (this.configState.toggleFlag) {
                    this.expandButton.style.display = 'inline-block';
                    this.shrinkButton.style.display = 'none';
                } else {
                    this.shrinkButton.style.display = 'inline-block';
                    this.expandButton.style.display = 'none';
                }
            }
            this.#notifyStateChanged(false);
        };

        /** Handle an incoming log entry from the log sink */
        this.onLogEntry = (entry) => {
            this.entries.push(entry);
            const maxEntries = this.config.defaultSegmentDurationMs;
            if (maxEntries >= 0 && this.entries.length > maxEntries) {
                this.entries.shift();
            }
            if (this.configState.categoryFilters[entry.debugCategory] === undefined) {
                this.configState.categoryFilters[entry.debugCategory] = true;
                this.#notifyStateChanged(false);
            }
            if (this.configState.isVisible && !this.isFocused) {
                this.scheduleThrottledUpdate();
            } else {
                this.hydrationScheduler.scheduleHydration();
            }
        };

        /** Download all current log entries as a file */
        this.downloadAllLogs = () => {
            LogFileDownloader.download(
                'all',
                this.entries.map((entry) => entry.eBa(false))
            ).catch((err) => {
                console.error('Unable to download all logs to the file', err);
            });
        };
    }

    // ── Lifecycle ──────────────────────────────────────────────────────

    /**
     * Lazy initialization: registers keyboard shortcut and log sink listener.
     * @returns {Promise<void>}
     */
    data() {
        if (!this.initPromise) {
            this.initPromise = new Promise((resolve) => {
                window.addEventListener('keydown', (event) => {
                    if (event.ctrlKey && event.altKey && event.shiftKey) {
                        if (event.keyCode === KeyCodes.d2b) {
                            this.toggle();
                        } else if (event.keyCode === KeyCodes.utils) {
                            internal_Sab.jjc(this.deviceRegistration().wj);
                        }
                    }
                });
                this.logSinks.internal_Qya(TGa.E_b, this.onLogEntry);
                resolve();
            });
        }
        return this.initPromise;
    }

    /**
     * Show the debug console overlay. Builds the DOM on first call.
     */
    show() {
        if (!document.body) return;
        if (!this.element) {
            this.buildConsoleDOM();
            this.domBuilt = true;
        }
        if (!this.configState.isVisible && this.element) {
            document.body.appendChild(this.element);
            this.configState.isVisible = true;
            this.update(true);
        }
    }

    /**
     * Hide the debug console overlay by removing it from the DOM.
     */
    hide() {
        if (this.domBuilt && this.configState.isVisible && this.element) {
            document.body.removeChild(this.element);
            this.configState.isVisible = false;
        }
    }

    /**
     * Toggle the debug console visibility.
     */
    toggle() {
        if (this.configState.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        this.#notifyStateChanged(false);
    }

    // ── DOM Construction ───────────────────────────────────────────────

    /**
     * Build the entire debug console DOM tree (container, textarea, toolbar, category picker).
     */
    buildConsoleDOM() {
        try {
            const container = this.createElement('div', CONSOLE_STYLE_FULL, undefined, {
                class: 'player-log',
            });
            const style = this.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode('button:focus { outline: none; }'));
            container.appendChild(style);
            container.appendChild((this.logTextarea = this.#buildTextarea()));
            container.appendChild(this.#buildToolbar());
            container.appendChild(this.#buildCategoryPicker());
            this.element = container;
        } catch (err) {
            console.error('Unable to create the log console', err);
        }
    }

    /**
     * Build the main log textarea element.
     * @returns {HTMLTextAreaElement}
     */
    #buildTextarea() {
        const textarea = this.createElement('textarea', TEXTAREA_STYLE_BLUR);
        textarea.setAttribute('wrap', 'off');
        textarea.setAttribute('readonly', 'readonly');

        textarea.addEventListener('focus', () => {
            this.isFocused = true;
            this.update();
            if (this.logTextarea) {
                this.logTextarea.style.cssText = TEXTAREA_STYLE_FOCUS;
            }
        });

        textarea.addEventListener('blur', () => {
            this.isFocused = false;
            this.update();
            if (this.logTextarea) {
                this.logTextarea.style.cssText = TEXTAREA_STYLE_BLUR;
            }
        });

        return textarea;
    }

    /**
     * Build the toolbar containing all action buttons.
     * @returns {HTMLElement}
     */
    #buildToolbar() {
        const toolbar = this.createElement(
            'div',
            'float:right;opacity:0.8;background-color:white;display:flex;align-items:center;font-size:small;font-family:sans-serif'
        );
        toolbar.appendChild(this.#buildLogLevelSelect());
        toolbar.appendChild(this.#buildFilterInput());
        toolbar.appendChild(this.#buildDetailsCheckbox());
        toolbar.appendChild(this.#buildRefreshButton());
        toolbar.appendChild(this.#buildClearButton());
        toolbar.appendChild(this.#buildShrinkButton());
        toolbar.appendChild(this.#buildExpandButton());
        toolbar.appendChild(this.#buildDownloadButton());
        toolbar.appendChild(this.#buildCloseButton());
        return toolbar;
    }

    /**
     * Build the category filter dropdown/picker.
     * @returns {HTMLElement}
     */
    #buildCategoryPicker() {
        const wrapper = this.createElement(
            'div',
            'float:right;opacity:0.8;background-color:white;font-size:small;font-family:sans-serif'
        );
        const header = this.createElement('div', 'padding:2px');
        const selectEl = this.createElement(
            'select',
            this.#toolbarItemStyle(22, 160, 1, 2),
            '<option>Select categories</option>'
        );
        const listContainer = this.createElement(
            'div',
            'height:500px;overflow-y:auto;display:none;border:1px #dadada solid'
        );

        wrapper.appendChild(header);
        wrapper.appendChild(listContainer);
        header.appendChild(selectEl);

        header.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        let isOpen = false;
        header.addEventListener('click', () => {
            if (isOpen) {
                listContainer.style.display = 'none';
            } else {
                listContainer.innerHTML = '';
                ['all', 'none']
                    .concat(Object.keys(this.configState.categoryFilters).sort())
                    .forEach((category) => {
                        listContainer.appendChild(
                            this.#buildCategoryCheckbox(category, header)
                        );
                    });
                listContainer.style.display = 'block';
            }
            isOpen = !isOpen;
        });

        return wrapper;
    }

    /**
     * Build a single category checkbox item.
     * @param {string} category
     * @param {HTMLElement} headerEl - The header element (clicked to re-render on all/none)
     * @returns {HTMLLabelElement}
     */
    #buildCategoryCheckbox(category, headerEl) {
        const label = this.createElement('label', 'display: block;margin:1px');
        label.htmlFor = category;

        const checkbox = this.createElement('input', 'margin:1px');
        checkbox.type = 'checkbox';
        checkbox.id = category;
        checkbox.checked = this.configState.categoryFilters[category];

        checkbox.addEventListener('click', () => {
            if (category === 'all' || category === 'none') {
                Object.keys(this.configState.categoryFilters).forEach((key) => {
                    this.configState.categoryFilters[key] = category === 'all';
                });
                headerEl.click();
            } else {
                this.configState.categoryFilters[category] =
                    !this.configState.categoryFilters[category];
            }
            this.#notifyStateChanged(true);
        });

        label.appendChild(checkbox);
        label.insertAdjacentText(
            'beforeend',
            category.length > 18 ? category.slice(0, 15) + '...' : category
        );
        return label;
    }

    /**
     * Build the log-level `<select>` dropdown.
     * @returns {HTMLSelectElement}
     */
    #buildLogLevelSelect() {
        const html =
            `<option value="${LogLevel.ERROR}">Error</option>` +
            `<option value="${LogLevel.WARN}">Warn</option>` +
            `<option value="${LogLevel.INFO}">Info</option>` +
            `<option value="${LogLevel.TRACE}">Trace</option>` +
            `<option value="${LogLevel.u}">Debug</option>`;

        const select = this.createElement('select', this.#toolbarItemStyle(22, NaN, 1, 2), html);
        select.value = this.configState.logLevel.toString();
        select.addEventListener(
            'change',
            (event) => {
                this.configState.logLevel = parseInt(event.target.value);
                this.#notifyStateChanged(true);
            },
            false
        );
        return select;
    }

    /**
     * Build the regex filter text input.
     * @returns {HTMLInputElement}
     */
    #buildFilterInput() {
        const onFilterChange = (event) => {
            return this.filterDebounceScheduler.scheduleHydration(() => {
                const value = event.target.value;
                this.configState.filter = value ? new RegExp(value) : undefined;
                this.#notifyStateChanged(true);
            });
        };

        const input = this.createElement('input', this.#toolbarItemStyle(14, 150, 1, 2));
        input.value = this.configState.filter ? this.configState.filter.source : '';
        input.title = 'Filter (RegEx)';
        input.placeholder = 'Filter (RegEx)';
        input.addEventListener('keydown', onFilterChange, false);
        input.addEventListener('change', onFilterChange, false);
        return input;
    }

    /**
     * Build the "View details" checkbox.
     * @returns {HTMLElement}
     */
    #buildDetailsCheckbox() {
        const wrapper = this.createElement('div', this.#toolbarItemStyle(NaN, NaN));
        const checkbox = this.createElement(
            'input',
            'vertical-align: middle;margin: 0px 2px 0px 0px;'
        );
        checkbox.id = 'details';
        checkbox.type = 'checkbox';
        checkbox.title = 'Details';
        checkbox.checked = this.configState.showDetails;
        checkbox.addEventListener(
            'change',
            (event) => {
                this.configState.showDetails = event.target.checked;
                this.#notifyStateChanged(true);
            },
            false
        );

        const label = this.createElement(
            'label',
            'vertical-align: middle;margin: 0px 0px 0px 2px;'
        );
        label.setAttribute('for', 'details');
        label.innerHTML = 'View details';

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        return wrapper;
    }

    /**
     * Build the refresh toolbar button.
     * @returns {HTMLButtonElement}
     */
    #buildRefreshButton() {
        const button = this.createElement('button', this.#toolbarItemStyle());
        const icon = new SvgIconBuilder('0 0 24 24')
            .beginGroup()
            .addMirroredPolygon()
            .end()
            .addPath(
                'M20,12.3279071 L21.9187618,10.9573629 L23.0812382,12.5848299 L19,15.5 L14.9187618,12.5848299 L16.0812382,10.9573629 L18,12.3279071 L18,12 C18,8.13 14.87,5 11,5 C7.13,5 4,8.13 4,12 C4,15.87 7.13,19 11,19 C12.93,19 14.68,18.21 15.94,16.94 L17.36,18.36 C15.73,19.99 13.49,21 11,21 C6.03,21 2,16.97 2,12 C2,7.03 6.03,3 11,3 C15.97,3 20,7.03 20,12 L20,12.3279071 Z',
                SvgIconBuilder.foregroundColor,
                'nonzero'
            )
            .end()
            .end()
            .build();

        button.appendChild(icon);
        button.addEventListener('click', () => this.update(), false);
        button.setAttribute('title', 'Refresh the log console');
        return button;
    }

    /**
     * Build the clear (trash) toolbar button.
     * @returns {HTMLButtonElement}
     */
    #buildClearButton() {
        const button = this.createElement('button', this.#toolbarItemStyle());
        const icon = new SvgIconBuilder('0 0 24 24')
            .beginGroup()
            .addRect(0, 0, 24, 24, SvgIconBuilder.background)
            .end()
            .addPath(
                'M19,4 L15.5,4 L14.5,3 L9.5,3 L8.5,4 L5,4 L5,6 L19,6 L19,4 Z M6,19 C6,20.1 6.9,21 8,21 L16,21 C17.1,21 18,20.1 18,19 L18,7 L6,7 L6,19 Z',
                SvgIconBuilder.foregroundColor
            )
            .end()
            .end()
            .build();

        button.appendChild(icon);
        button.addEventListener('click', this.clear, false);
        button.setAttribute('title', 'Remove all log messages');
        return button;
    }

    /**
     * Build the shrink toolbar button (visible when console is expanded to full height).
     * @returns {HTMLButtonElement}
     */
    #buildShrinkButton() {
        this.shrinkButton = this.createElement('button', this.#toolbarItemStyle());
        this.shrinkButton.style.display = this.configState.toggleFlag ? 'none' : 'inline-block';

        const icon = new SvgIconBuilder('0 0 24 24')
            .beginGroup()
            .addRect(0, 0, 24, 24, SvgIconBuilder.background)
            .end()
            .addPath(
                'M3,3 L21,3 L21,21 L3,21 L3,3 Z M5,5 L5,19 L19,19 L19,5 L5,5 Z M6,6 L18,6 L18,12 L6,12 L6,6 Z',
                SvgIconBuilder.foregroundColor,
                'nonzero'
            )
            .end()
            .end()
            .build();

        this.shrinkButton.addEventListener('click', this.toggleSize, false);
        this.shrinkButton.appendChild(icon);
        this.shrinkButton.setAttribute('title', 'Shrink the log console');
        return this.shrinkButton;
    }

    /**
     * Build the expand toolbar button (visible when console is collapsed).
     * @returns {HTMLButtonElement}
     */
    #buildExpandButton() {
        this.expandButton = this.createElement('button', this.#toolbarItemStyle());
        this.expandButton.style.display = this.configState.toggleFlag
            ? 'inline-block'
            : 'none';

        const icon = new SvgIconBuilder('0 0 24 24')
            .beginGroup()
            .addRect(4, 4, 16, 16, SvgIconBuilder.background)
            .end()
            .addPath(
                'M5,5 L5,19 L19,19 L19,5 L5,5 Z M3,3 L21,3 L21,21 L3,21 L3,3 Z',
                SvgIconBuilder.foregroundColor,
                'nonzero'
            )
            .end()
            .end()
            .build();

        this.expandButton.addEventListener('click', this.toggleSize, false);
        this.expandButton.appendChild(icon);
        this.expandButton.setAttribute('title', 'Expand the log console');
        return this.expandButton;
    }

    /**
     * Build the download toolbar button.
     * @returns {HTMLButtonElement}
     */
    #buildDownloadButton() {
        const button = this.createElement('button', this.#toolbarItemStyle());
        const icon = new SvgIconBuilder('0 0 26 26')
            .beginGroup()
            .addRect(0, 0, 24, 24, SvgIconBuilder.background)
            .end()
            .addPath(
                'M20,20 L20,22 L4,22 L4,20 L20,20 Z M7.8,12.85 L12,16 L16.2,12.85 L17.4,14.45 L12,18.5 L6.6,14.45 L7.8,12.85 Z M7.8,7.85 L12,11 L16.2,7.85 L17.4,9.45 L12,13.5 L6.6,9.45 L7.8,7.85 Z M7.8,2.85 L12,6 L16.2,2.85 L17.4,4.45 L12,8.5 L6.6,4.45 L7.8,2.85 Z',
                SvgIconBuilder.foregroundColor,
                'nonzero'
            )
            .end()
            .end()
            .build();

        button.appendChild(icon);
        button.addEventListener('click', this.downloadAllLogs, false);
        button.setAttribute('title', 'Download all log messages');
        return button;
    }

    /**
     * Build the close (X) toolbar button.
     * @returns {HTMLButtonElement}
     */
    #buildCloseButton() {
        const button = this.createElement('button', this.#toolbarItemStyle());
        const icon = new SvgIconBuilder('0 0 24 24')
            .beginGroup()
            .addRect(0, 0, 24, 24, SvgIconBuilder.background)
            .end()
            .addPath(
                'M12,10.5857864 L19.2928932,3.29289322 L20.7071068,4.70710678 L13.4142136,12 L20.7071068,19.2928932 L19.2928932,20.7071068 L12,13.4142136 L4.70710678,20.7071068 L3.29289322,19.2928932 L10.5857864,12 L3.29289322,4.70710678 L4.70710678,3.29289322 L12,10.5857864 Z',
                SvgIconBuilder.foregroundColor,
                'nonzero'
            )
            .end()
            .end()
            .build();

        button.appendChild(icon);
        button.addEventListener('click', () => this.toggle(), false);
        button.setAttribute('title', 'Close the log console');
        return button;
    }

    // ── Update / Render ────────────────────────────────────────────────

    /**
     * Notify that the config state has changed, optionally triggering a full re-render.
     * @param {boolean} [forceUpdate=false]
     */
    #notifyStateChanged(forceUpdate = false) {
        if (forceUpdate) {
            this.update(false);
        }
    }

    /**
     * Re-render the textarea content with filtered and formatted log entries.
     * @param {boolean} [scrollToBottom=false] - Whether to scroll the textarea to the bottom
     */
    update(scrollToBottom = false) {
        if (!this.element || !this.config.gga) return;

        Promise.resolve(this.#buildHeaderText() + this.#getFilteredLogLines().join('\r\n'))
            .then((text) => {
                if (!this.element || !this.logTextarea) return;
                this.logTextarea.value = text;
                this.element.style.cssText = this.configState.toggleFlag
                    ? CONSOLE_STYLE_COLLAPSED
                    : CONSOLE_STYLE_FULL;
                if (scrollToBottom) {
                    this.scheduler.scheduleDelay(seekToSample, () => {
                        this.logTextarea.scrollTop = this.logTextarea.scrollHeight;
                    });
                }
            })
            .catch((err) => {
                console.error('Unable to update the log console', err);
            });
    }

    /**
     * Filter log entries by level, category, and optional regex, returning
     * formatted strings (most recent last), capped at {@link MAX_DISPLAY_LINES}.
     * @returns {string[]}
     */
    #getFilteredLogLines() {
        const lines = [];
        for (let i = this.entries.length - 1; i >= 0 && lines.length < MAX_DISPLAY_LINES; i--) {
            const entry = this.entries[i];
            if (
                (entry.level || entry.level) <= this.configState.logLevel &&
                this.configState.categoryFilters[entry.debugCategory]
            ) {
                const formatted = entry.eBa(!this.configState.showDetails);
                if (!this.configState.filter || this.configState.filter.test(formatted)) {
                    lines.push(formatted);
                }
            }
        }
        return lines.reverse();
    }

    /**
     * Build the header text block shown at the top of the log textarea
     * (version, ESN, session id, epoch, user agent, etc.).
     * @returns {string}
     */
    #buildHeaderText() {
        const deviceInfo = this.deviceRegistration();
        return (
            'Version: 6.0055.939.911 \n' +
            (deviceInfo ? 'Esn: ' + deviceInfo.wj : '') +
            '\nJsSid: ' +
            this.clientContext.id +
            ', Epoch: ' +
            this.playerCore.systemClock.toUnit(millisecondsUnit) +
            ', Start: ' +
            this.clientContext.sI.toUnit(millisecondsUnit) +
            ', TimeZone: ' +
            new Date().getTimezoneOffset() +
            '\nHref: ' +
            location.toString +
            '\nUserAgent: ' +
            navigator.userAgent +
            '\n--------------------------------------------------------------------------------\n'
        );
    }

    // ── Helpers ────────────────────────────────────────────────────────

    /**
     * Delegate to the injected element factory.
     * @param {string} tag
     * @param {string} [style]
     * @param {string} [innerHTML]
     * @param {Object} [attributes]
     * @returns {HTMLElement}
     */
    createElement(tag, style, innerHTML, attributes) {
        return this.elementFactory.createElement(tag, style, innerHTML, attributes);
    }

    /**
     * Generate inline CSS for a toolbar item (button, select, input).
     * @param {number} [height=26]
     * @param {number} [width=26]
     * @param {number} [borderWidth=0]
     * @param {number} [borderRadius]
     * @returns {string}
     */
    #toolbarItemStyle(height = 26, width = 26, borderWidth = 0, borderRadius) {
        return (
            'display:inline-block;border:' +
            borderWidth +
            'px solid ' +
            SvgIconBuilder.foregroundColor +
            ';padding:3px;' +
            (isNaN(height) ? '' : 'height:' + height + 'px') +
            ';' +
            (isNaN(width) ? '' : 'width:' + width + 'px') +
            ';margin:0px 3px;background-color:transparent;' +
            (borderRadius ? 'border-radius:' + borderRadius + 'px;' : '')
        );
    }
}

// -- Apply inversify decorators --
const DecoratedDebugLogConsole = __decorate(
    [
        injectable(),
        __param(0, injectDecorator(PlayerCoreToken)),
        __param(1, injectDecorator(ClockToken)),
        __param(2, injectDecorator(updateMap)),
        __param(3, injectDecorator(valueList)),
        __param(4, injectDecorator(oX)),
        __param(5, injectDecorator(internal_Wfb)),
        __param(6, injectDecorator(QC)),
        __param(7, injectDecorator(uK)),
        __param(8, injectDecorator(internal_Uja)),
        __param(9, injectDecorator(PJ)),
    ],
    DebugLogConsole
);

export {
    DecoratedDebugLogConsole as IGa,
    DecoratedDebugLogConsole as DebugLogConsole,
    SvgIconBuilder,
    LogFileDownloader,
};
