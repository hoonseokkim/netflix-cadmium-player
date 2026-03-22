/**
 * @module PanelRegistry
 * @description Registry for player data model panels. Manages registration of
 * named data panels, event-driven model change notifications, and provides
 * access to current time and viewable groups. Used for the player's
 * diagnostic/debug overlay panels.
 *
 * @original Module 11372
 */

import { MILLISECONDS } from '../timing/TimeUnit.js';

/**
 * Manages data model panels for the player's diagnostic interface.
 * Panels register model getters and receive change notifications via events.
 */
export class PanelRegistry {
    /**
     * @param {Object} mediaEvents - Event emitter for media-related events
     * @param {Object} debug - Debug/assertion utilities
     * @param {Object} lastVideoSync - Time synchronization source
     * @param {Object} playerState - Current player state accessor
     */
    constructor(mediaEvents, debug, lastVideoSync, playerState) {
        this.mediaEvents = mediaEvents;
        this.debug = debug;
        this.lastVideoSync = lastVideoSync;
        this.playerState = playerState;

        /** @type {string[]} Registered panel names */
        this._panelNames = [];

        /** @type {Object<string, Function>} Map of panel name to model getter */
        this._modelGetters = {};

        /** @type {Object<string, boolean>} Map of panel name to dirty flag */
        this._dirtyPanels = {};

        /** @type {boolean} Whether a flush is scheduled */
        this._flushScheduled = false;

        /** @type {number} Minimum update interval multiplier */
        this._updateIntervalMultiplier = 1;

        /** @type {number} Default refresh rate in Hz */
        this._refreshRate = 7.8125;
    }

    /**
     * Registers a new panel with its model getter function.
     *
     * @param {string} panelName - Unique name for the panel
     * @param {Function} modelGetter - Function that returns the panel's current model
     */
    register(panelName, modelGetter) {
        this.debug.assert(
            !(this._panelNames.indexOf(panelName) >= 0),
            "panel already registered"
        );
        this._modelGetters[panelName] = modelGetter;
        this._panelNames.push(panelName);
    }

    /**
     * Marks a panel as dirty and schedules a flush if not already pending.
     *
     * @param {string} panelName - The panel to mark as changed
     */
    markDirty(panelName) {
        this._dirtyPanels[panelName] = true;
        if (!this._flushScheduled) {
            this._flushScheduled = true;
            setTimeout(() => this._flushChanges(), 0);
        }
    }

    /**
     * Returns the current model for a given panel.
     *
     * @param {string} panelName - The panel name to get the model for
     * @returns {*} The panel's current model, or undefined if not registered
     */
    getModel(panelName) {
        const getter = this._modelGetters[panelName];
        return getter ? getter() : undefined;
    }

    /**
     * Returns the viewable context groups from the current player state.
     *
     * @returns {Array} The groups from the viewable context, or empty array
     */
    getGroups() {
        const context = this.playerState.viewableContext;
        return context ? context.getGroups() : [];
    }

    /**
     * Adds an event listener for panel change events.
     * If the panel has a model getter, it is immediately marked dirty.
     *
     * @param {string} panelName - The panel name to listen for changes on
     * @param {Function} callback - The callback for change events
     */
    addEventListener(panelName, callback) {
        this.mediaEvents.addListener(panelName, callback);
        if (this._modelGetters[panelName]) {
            this.markDirty(panelName);
        }
    }

    /**
     * Removes an event listener for panel change events.
     *
     * @param {string} panelName - The panel name to stop listening to
     * @param {Function} callback - The callback to remove
     */
    removeEventListener(panelName, callback) {
        this.mediaEvents.removeListener(panelName, callback);
    }

    /**
     * Returns the current playback time in milliseconds.
     *
     * @returns {number} Current time in milliseconds
     */
    getTime() {
        return this.lastVideoSync.getCurrentTime().toUnit(MILLISECONDS);
    }

    /**
     * @private
     * Flushes all dirty panel change notifications by emitting events.
     */
    _flushChanges() {
        this._flushScheduled = false;
        for (let i = this._panelNames.length; i--;) {
            const name = this._panelNames[i];
            if (this._dirtyPanels[name]) {
                this._dirtyPanels[name] = false;
                this.mediaEvents.emit(name + "changed", {
                    getModel: this._modelGetters[name]
                });
            }
        }
    }
}
