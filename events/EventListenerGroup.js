/**
 * @module EventListenerGroup
 * @description A container for managing a group of child event listener objects.
 * Provides add, remove, and bulk clear operations. Used as a building block
 * for hierarchical event listener management in the player.
 * @see Module_56656
 */

/**
 * Manages a collection of event listener objects keyed by their IDs.
 * Supports adding, removing, and clearing all listeners recursively.
 */
export class EventListenerGroup {
    constructor() {
        /** @type {Map<string, Object>} Map of listener ID to listener object. */
        this.children = new Map();
    }

    /**
     * Adds a child listener to the group.
     * @param {Object} listener - Listener object with an `id` property.
     */
    addListener(listener) {
        this.children.set(listener.id, listener);
    }

    /**
     * Removes a child listener by ID.
     * @param {string} listenerId - The ID of the listener to remove.
     */
    removeListener(listenerId) {
        this.children.delete(listenerId);
    }

    /**
     * Recursively clears all child listeners.
     * Calls clearListeners() on each child before removing them.
     */
    clearListeners() {
        this.children.forEach(child => child.clearListeners());
        this.children.clear();
    }
}
