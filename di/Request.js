/**
 * Netflix Cadmium Player - DI Request
 *
 * Represents a node in a request tree used for dependency injection
 * or service resolution. Each request has a service identifier,
 * constraint, optional parent, bindings, and a target.
 *
 * Part of the InversifyJS-inspired DI container system.
 *
 * @module di/Request
 */

/**
 * A DI/service-resolution request node forming a tree structure.
 * Root requests (parentRequest === null) maintain an activeBindings map
 * for tracking resolved bindings across the resolution tree.
 */
export class Request {
  /**
   * @param {*} serviceIdentifier - The service being requested.
   * @param {*} constraint - Resolution constraint.
   * @param {Request|null} parentRequest - Parent request in the resolution chain (null for root).
   * @param {*|*[]} bindings - Binding(s) for this request (normalized to array).
   * @param {*} target - The injection target.
   */
  constructor(serviceIdentifier, constraint, parentRequest, bindings, target) {
    /** @type {number} Unique request identifier */
    this.id = generateId();
    /** @type {*} The service identifier being resolved */
    this.serviceIdentifier = serviceIdentifier;
    /** @type {*} Resolution constraint */
    this.constraint = constraint;
    /** @type {Request|null} Parent request in the chain */
    this.parentRequest = parentRequest;
    /** @type {*} Injection target */
    this.target = target;
    /** @type {Request[]} Child requests spawned from this one */
    this.childRequests = [];
    /** @type {*[]} Bindings for this request (always an array) */
    this.bindings = Array.isArray(bindings) ? bindings : [bindings];
    /** @type {Map|null} Active bindings map, only for root requests */
    this.activeBindings = parentRequest === null ? new Map() : null;
  }

  /**
   * Creates a child request linked to this one.
   *
   * @param {*} serviceIdentifier - The child service being requested.
   * @param {*} constraint - Child resolution constraint.
   * @param {*} target - Child injection target.
   * @returns {Request} The newly created child request.
   */
  createChildRequest(serviceIdentifier, constraint, target) {
    const child = new Request(
      serviceIdentifier,
      this.constraint,
      this,
      constraint,
      target
    );
    this.childRequests.push(child);
    return child;
  }
}
