/**
 * @file SegmentRequestDescriptor.js
 * @description Describes a pending segment download request for a viewable session.
 *              Holds metadata about the segment (media type, bitrate, timing, etc.)
 *              and manages the lifecycle of issuing and completing the request.
 * @module streaming/SegmentRequestDescriptor
 * @original Module_66133
 */

/**
 * Describes a segment request within a viewable session.
 * Tracks request state ("available"), timing info, and provides
 * methods for completing or retrying the request.
 */
export class SegmentRequestDescriptor {
  /**
   * @param {Object} viewableSession - The owning viewable session
   * @param {Object} requestContext - Contains stream and internal_Hzc properties
   */
  constructor(viewableSession, requestContext) {
    /** @type {Object} The viewable session this request belongs to */
    this.viewableSession = viewableSession;

    /** @type {Object} The request context containing stream and factory info */
    this._requestContext = requestContext;

    /** @type {number} Transaction modulo counter, starts at -Infinity */
    this.transactionModulo = -Infinity;

    /** @type {string} Current request state */
    this.AA = 'available';

    const stream = requestContext.stream;
    const params = requestContext.internal_Hzc();

    /** @type {string} Unique identifier combining stream ID, media type, and bitrate */
    this.identifier = `${stream.J}-${stream.mediaType}-${stream.bitrate}`;

    /** @type {string} Media type (audio/video) */
    this.mediaType = stream.mediaType;

    /** @type {*} Request hash */
    this.xh = params.xh;

    /** @type {*} Playgraph state reference */
    this.playgraphState = params.playgraphState;

    /** @type {*} gv parameter */
    this.gv = params.gv;

    /** @type {*} Streaming player millisecond timestamp */
    this.streamingPlayerMs = params.streamingPlayerMs;

    /** @type {*} vp parameter */
    this.vp = params.vp;

    /** @type {number} Start position (initially 0) */
    this.GU = 0;

    /** @type {number} End position (initially Infinity) */
    this.FU = Infinity;

    /** @type {number} Weight/priority factors */
    this.nx = 1;
    this.WI = 1;

    /** @type {number} Generation counter */
    this.g0 = 0;

    /** @type {string} Group identifier from the viewable session */
    this.groupId = `${viewableSession.J}`;

    /** @type {boolean} Whether this is the last segment */
    this.isLastSegmentFlag = false;

    /** @type {boolean} Whether we have a pointer */
    this.getPointer = false;
  }

  /**
   * Handles an error condition.
   * @returns {{ lU: boolean }} Always returns { lU: true }
   */
  handleError() {
    return { lU: true };
  }

  /**
   * Attempts to complete the current segment request.
   * If the segment is already cached, removes all stream requests.
   * Otherwise, removes just this individual request.
   * @returns {{ Ff: boolean, reason: string }}
   */
  currentPosition() {
    const context = this._requestContext;
    const stream = context.stream;

    if (stream.IC(context.currentSegment)) {
      this.viewableSession.removeStreamRequests(stream);
      return { Ff: true, reason: 'success' };
    }

    this.viewableSession.removeRequest(this._requestContext);
    return { Ff: false, reason: 'viewableTryIssueHeaderRequest' };
  }

  /**
   * Serializes this descriptor to a JSON-compatible object.
   * @returns {Object}
   */
  toJSON() {
    return {
      mediaType: this.mediaType,
      dB: this.dB,
      xh: this.xh,
      playgraphState: this.playgraphState,
      gv: this.gv,
      streamingPlayerMs: this.streamingPlayerMs,
      vp: this.vp,
      g0: this.g0,
      GU: this.GU,
      WI: this.WI,
      FU: this.FU,
      nx: this.nx,
      segmentDuration: this.segmentDuration,
      x4: this.x4,
      groupId: this.groupId,
      isLastSegmentFlag: this.isLastSegmentFlag,
      getPointer: this.getPointer,
      identifier: this.identifier,
    };
  }
}
