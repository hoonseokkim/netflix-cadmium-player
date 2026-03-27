/**
 * @module events/StartEventImpl
 * @description Implementation of the player Start event, extending the base
 *              event class. Used to signal that playback is starting/has started.
 *              Decorated with InversifyJS @injectable for IoC container registration.
 *
 *              Event details:
 *              - Event name: START (from event constants)
 *              - Event scope: start (from event scope definitions)
 *              - Priority: 3
 *
 * @see Module_84860
 */

import * as tslib from '../utils/tslib.js';                                    // Module 22970
import { injectable, injectDecorator as inject } from '../ioc/Decorators.js';  // Module 22674
import { ea as EventNames } from '../events/EventConstants.js';                // Module 36129
import { parentClass as BaseEvent } from '../events/BaseEvent.js';             // Module 88496
import { $o as EventScopes } from '../events/EventScopes.js';                 // Module 87607
import { io as EventConfigToken } from '../config/EventConfigToken.js';        // Module 83998

/**
 * Start event implementation.
 * @extends BaseEvent
 */
class StartEventImpl extends BaseEvent {
  /**
   * @param {Object} config - Event configuration injected via IoC
   */
  constructor(config) {
    super(config, EventNames.START, EventScopes.start, 3);
  }
}

// Apply InversifyJS decorators for IoC registration
const DecoratedStartEventImpl = tslib.__decorate(
  [
    injectable(),
    tslib.__param(0, inject(EventConfigToken)),
  ],
  StartEventImpl
);

export { DecoratedStartEventImpl };
