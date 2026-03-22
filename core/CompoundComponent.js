/**
 * Compound Component
 *
 * A component composition system that assembles multiple child components
 * into a single compound component. Handles dependency resolution, member
 * collision detection, event delegation, and lifecycle management for the
 * Cadmium player's component architecture ("montage" system).
 *
 * @module CompoundComponent
 * @original Module_74045
 */

// import { objectValues } from './ObjectUtils';
// import { handleBufferUpdate, LOG_PREFIX } from './Logger';
// import { EventBus } from './EventBus';
// import { createComponentId } from './ComponentId';
// import { unwrapComponent } from './ComponentWrapper';
// import { createScopedId } from './ScopedId';
// import { getReservedPropertyNames } from './ReservedProperties';
// import { createSubComponent } from './SubComponentFactory';
// import { BaseComponent } from './BaseComponent';

/**
 * A compound component that composes multiple child components
 * into a unified interface, merging their properties and methods.
 *
 * Detects and handles member name collisions between constituent
 * components, and manages the lifecycle (init, destroy, events)
 * of all children.
 *
 * @extends BaseComponent
 */
export class CompoundComponent extends BaseComponent {
    /**
     * @param {Object} manifestSessionData - Session data including name, id, config, etc.
     */
    constructor(manifestSessionData) {
        super();
        /** @type {Object} */
        this.manifestSessionData = manifestSessionData;
        /** @type {Object<string, Object>} */
        this.childComponents = {};
        /** @type {Map<string, string>} */
        this.memberOwnerMap = new Map();
        /** @type {EventBus} */
        this.events = new EventBus(manifestSessionData.eventEmitter);
        /** @type {Object} */
        this.extensionHandlers = manifestSessionData.extensionHandlers || {};
        /** @type {Object} */
        this.logger = handleBufferUpdate({
            parentName: LOG_PREFIX,
            componentId: "",
            name: "montage",
            logLevel: manifestSessionData.logLevel,
        });
    }

    /** @returns {string} The component ID */
    get componentId() {
        return this.manifestSessionData.id;
    }

    /** @returns {EventBus} The event bus for this compound component */
    get eventBus() {
        return this.events;
    }

    /** @returns {Object} Extension handlers map */
    get extensions() {
        return this.extensionHandlers;
    }

    /**
     * Registers an extension handler.
     * @param {string} name - Extension name
     * @param {*} handler - Extension handler
     */
    registerExtension(name, handler) {
        let handlers = this.extensionHandlers[name];
        if (!handlers) {
            handlers = [];
            this.extensionHandlers[name] = handlers;
        }
        handlers.push(handler);
    }

    /**
     * Instantiates and composes all child components from definitions.
     *
     * @param {Object[]} componentDefinitions - Array of component definition objects
     * @param {Object} context - Component context for dependency injection
     * @returns {Object} Merged object containing all child component members
     */
    instantiateChildren(componentDefinitions, context) {
        const mergedMembers = {};
        const memberCountMap = new Map();

        for (const definition of componentDefinitions) {
            this._instantiateComponent(definition, context, mergedMembers, memberCountMap);
        }

        // Handle collisions: replace duplicated members with error-throwing accessors
        for (const [memberName, count] of memberCountMap) {
            if (count > 1) {
                delete mergedMembers[memberName];
                mergedMembers[memberName] = this._createCollisionAccessor(memberName);
                this.memberOwnerMap.delete(memberName);
            }
        }

        this.logger.debug(
            `Component instantiation complete for compound component "${this.manifestSessionData.name}"`
        );
        return mergedMembers;
    }

    /**
     * Registers a named child component.
     * @param {Object} component - Component with a name property
     */
    registerComponent(component) {
        super.registerComponent(component);
        this.childComponents[component.name] = component;
    }

    /**
     * Gets a named component, checking local children first then parent scope.
     * @param {string} name
     * @returns {Object|undefined}
     */
    getComponent(name) {
        return this.childComponents[name] || this.manifestSessionData.getParentComponent(name);
    }

    /**
     * Clears all listeners and destroys all child components.
     */
    clearListeners() {
        super.clearListeners();

        for (const component of objectValues(this.childComponents)) {
            const unwrapped = unwrapComponent(component);
            if (typeof unwrapped.clearListeners === "function") {
                unwrapped.clearListeners();
            }
            unwrapped.extensions = {};
        }

        this.events.removeAllListeners();
        this.childComponents = {};
    }

    /**
     * Instantiates a single component from its definition and merges members.
     * @private
     */
    _instantiateComponent(definition, context, mergedMembers, memberCountMap) {
        if (definition === undefined) {
            throw new Error(
                "An undefined component definition was provided. Did you attempt to create a compound component during `init()`? Consider deferring component creation to a later time in your component's lifecycle."
            );
        }

        if (definition.isCompound) {
            if (!this.childComponents[definition.name]) {
                const subCompound = createSubComponent({
                    data: this.manifestSessionData.data,
                    context,
                    console: this.manifestSessionData.logLevel,
                    eventEmitter: this.events,
                    extensionHandlers: this.extensionHandlers,
                    registry: this.manifestSessionData.registry,
                }, definition.name, definition.componentFactory, context.featureFlags);

                this.childComponents[subCompound.name] = subCompound;
                this._mergeCompoundMembers(subCompound, mergedMembers, memberCountMap);
            }
            return;
        }

        if (this.childComponents[definition.name]) return;

        const componentConfig = context.getConfig(definition.name);
        const condition = definition.when;

        if (condition && !condition({ config: componentConfig, data: this.manifestSessionData.data })) {
            this.logger.debug(
                `Component "${definition.name}" omitted from "${this.manifestSessionData.name}" compound component due to failing \`when\` condition.`
            );
            return;
        }

        // Resolve dependencies first
        for (let i = definition.dependencies.length - 1; i >= 0; i--) {
            const dep = definition.dependencies[i];
            if (!this.getComponent(dep.name)) {
                this._instantiateComponent(dep, context, mergedMembers, memberCountMap);
            }
        }

        const componentId = createComponentId(definition.name);
        const scopedId = createScopedId(componentId);

        this.manifestSessionData.registry.registerComponent(
            scopedId, this.manifestSessionData.id, this.manifestSessionData.configField, [definition.name]
        );

        const instance = new definition.componentClass({
            injector: context.getInjector(definition.name),
            context,
            getConfig: () => this.manifestSessionData.registry.getConfig(definition.name, scopedId),
            registry: this.manifestSessionData.registry,
            data: this.manifestSessionData.data,
            name: definition.name,
            parentName: this.manifestSessionData.name,
            componentId: this.manifestSessionData.id,
            events: this.events,
            extensionHandlers: this.extensionHandlers,
            logLevel: this.manifestSessionData.logLevel,
            traits: definition.traits || [],
            random: componentId,
        });

        // Call init if available
        if (typeof instance.data === "function") {
            instance.data();
        }

        // Merge instance members into compound component
        const ownProps = Object.getOwnPropertyNames(instance);
        const protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
        const allProps = [...ownProps, ...protoProps];
        const reservedNames = getReservedPropertyNames();

        for (const propName of allProps) {
            if (reservedNames.has(propName) || propName === "constructor") continue;

            const currentCount = memberCountMap.get(propName) || 0;
            memberCountMap.set(propName, currentCount + 1);

            if (currentCount === 0) {
                const value = instance[propName];
                this.memberOwnerMap.set(propName, definition.name);
                if (typeof value === "function") {
                    mergedMembers[propName] = value.bind(instance);
                } else {
                    delete mergedMembers[propName];
                    Object.defineProperty(mergedMembers, propName, {
                        get: () => instance[propName],
                        enumerable: true,
                        configurable: true,
                    });
                }
            }
        }

        this.childComponents[definition.name] = unwrapComponent(instance);
    }

    /**
     * Merges members from a compound sub-component.
     * @private
     */
    _mergeCompoundMembers(subComponent, mergedMembers, memberCountMap) {
        const componentName = unwrapComponent(subComponent).name;

        for (const propName of Object.keys(subComponent)) {
            if (propName === "destroy" || propName === "events" || propName === "name" || propName === "data") {
                continue;
            }

            const currentCount = memberCountMap.get(propName) || 0;
            memberCountMap.set(propName, currentCount + 1);

            if (currentCount === 0) {
                const value = subComponent[propName];
                this.memberOwnerMap.set(propName, componentName);
                if (typeof value === "function") {
                    mergedMembers[propName] = value;
                } else {
                    delete mergedMembers[propName];
                    Object.defineProperty(mergedMembers, propName, {
                        get: () => subComponent[propName],
                        enumerable: true,
                        configurable: true,
                    });
                }
            }
        }
    }

    /**
     * Creates an accessor function that throws on collision.
     * @private
     * @param {string} memberName
     * @returns {Function}
     */
    _createCollisionAccessor(memberName) {
        return () => {
            throw new Error(
                `Cannot access '${memberName}' on compound component '${this.manifestSessionData.name}': ` +
                "this member exists in multiple constituent components. To resolve this collision, " +
                "rename or remove the conflicting member(s) from the constituent components."
            );
        };
    }
}
