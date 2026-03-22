/**
 * Netflix Cadmium Player — PBO Bind Command
 *
 * Implements the "bind" command for the PBO (Playback Operations) protocol.
 * Sends a bind request to the PBO backend to establish or refresh a
 * session binding. Extends the base PBO command class with inversify
 * dependency injection.
 *
 * @module network/PboBindCommand
 * @original Module_15153
 */

import { __decorate, __param } from '../modules/Module_22970.js'; // tslib decorators
import { injectable, injectDecorator } from '../modules/Module_22674.js'; // DI framework
import { ea as ErrorCodes } from '../modules/Module_36129.js'; // error code enums
import { oj as PboEndpoints } from '../modules/Module_19114.js'; // PBO endpoint names
import { lj as BasePboCommand } from '../modules/Module_51658.js'; // base PBO command class
import { io as PboServiceToken } from '../modules/Module_83998.js'; // DI token

/**
 * PBO Bind Command.
 *
 * Sends a "bind" call to Netflix's PBO backend. The bind operation
 * associates the current client session with the server-side playback
 * session, enabling bidirectional command flow.
 *
 * @extends BasePboCommand
 */
class PboBindCommand extends BasePboCommand {
  /**
   * @param {object} pboService - Injected PBO transport service.
   */
  constructor(pboService) {
    super(pboService, ErrorCodes.BIND);
  }

  /**
   * Execute the bind command.
   *
   * @param {object} params - Bind request parameters.
   * @param {object} [options] - Additional send options.
   * @returns {Promise<object>} The result payload from the bind response.
   * @throws {Error} Wrapped PBO error if the request fails.
   */
  execute(params, options) {
    return this.send(params, {
      url: '/' + PboEndpoints.bind,
      name: PboEndpoints.bind,
      callMode: PboEndpoints.bind,
      callModeFlag: 2,
    }, options)
      .then((response) => response.result)
      .catch((error) => {
        throw this.errorWrapper(error);
      });
  }
}

export { PboBindCommand as zIa };

// Apply DI decorators
const DecoratedPboBindCommand = __decorate(
  [
    injectable(),
    __param(0, injectDecorator(PboServiceToken)),
  ],
  PboBindCommand,
);

export { DecoratedPboBindCommand };
