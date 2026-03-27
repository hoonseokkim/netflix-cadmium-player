/**
 * @module LiveStreamChecks
 * @description Utility predicates for determining whether a media session is a
 * live stream or an ad playgraph. Used to branch playback logic between
 * VOD, live, and ad-insertion flows.
 *
 * @see Module_8149
 */

/**
 * Checks if a session represents a live stream.
 * @param {object|null|undefined} session
 * @returns {boolean}
 */
export function isLive(session) {
  return !!(session?.isLive);
}

/**
 * Checks if a session represents an ad playgraph.
 * @param {object|null|undefined} session
 * @returns {boolean}
 */
export function isAdPlaygraph(session) {
  return !!(session?.isAdPlaygraph);
}

/**
 * Checks if the viewable session within a context is an ad playgraph.
 * @param {object} context - Object containing a viewableSession property
 * @returns {boolean}
 */
export function isAdPlaygraphFromContext(context) {
  return context.viewableSession.isAdPlaygraph;
}

export { isLive, isAdPlaygraph, isAdPlaygraphFromContext };
