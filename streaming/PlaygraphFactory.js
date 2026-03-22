/**
 * Netflix Cadmium Player — Playgraph Factory
 *
 * Creates playgraph instances from track data, composing optional layers
 * (combined playgraphs, live program playgraphs, duration-based playgraphs)
 * on top of the base OCa playgraph constructor.
 *
 * @module PlaygraphFactory
 */

// Dependencies
// import { __spreadArray, __read } from 'tslib';
// import { $F as PlaygraphComposer } from './modules/Module_91176';  // pipeline composer
// import { u as DEBUG } from './modules/Module_48170';               // debug flag
// import { OCa as BasePlaygraph } from './modules/Module_62819';     // base playgraph class
// import { getTrackIndex } from './modules/Module_28871';            // track index resolver

/**
 * Creates a playgraph from the given configuration and track list.
 *
 * Layers are composed as a pipeline of factory functions, each wrapping
 * the next.  The base layer always creates a `BasePlaygraph`; optional
 * layers for combined, live-program, or duration-based playgraphs are
 * prepended when enabled by config flags.
 *
 * @param {object} config - Playgraph configuration.
 * @param {boolean} config.enableCombinedPlaygraphs - Whether to enable combined playgraph merging.
 * @param {number|undefined} config.$D - Duration value; when truthy enables duration-based playgraphs.
 * @param {boolean} config.enableLiveProgramPlaygraphs - Whether to enable live-program playgraph support.
 * @param {Array} tracks - Array of track descriptors; tracks[0] is used for the index.
 * @param {object} traceContext - Trace/logging context object.
 * @returns {object} Composed playgraph instance.
 */
export function createPlaygraph(config, tracks, traceContext) {
  /** Base layer: instantiates the core playgraph from track arguments. */
  const layers = [
    (args) => new BasePlaygraph(...args),
  ];

  const trackIndex = getTrackIndex({ Z: tracks[0] });

  // Trace the playgraph creation when debug is enabled
  if (DEBUG) {
    traceContext.pauseTrace("Creating playgraph", {
      Akd: trackIndex,
      minimumHealth: config.enableCombinedPlaygraphs,
      duration: config.$D,
      Xhd: config.enableLiveProgramPlaygraphs,
    });
  }

  // Optional layer: combined playgraph merger
  if (config.enableCombinedPlaygraphs) {
    const combinedPlaygraph = require(/* Module_25750 */ 25750);
    layers.unshift((args, prev) => combinedPlaygraph.vL({}, args, prev));
  }

  // Optional layer: live program playgraph support
  if (config.enableLiveProgramPlaygraphs) {
    const livePlaygraph = require(/* Module_19921 */ 19921);
    layers.unshift((args, prev) => livePlaygraph.vL({}, args, prev));
  }

  // Optional layer: duration-based playgraph
  if (config.$D) {
    const durationPlaygraph = require(/* Module_86681 */ 86681);
    layers.unshift((args, prev) => durationPlaygraph.vL({}, args, prev));
  }

  return PlaygraphComposer.vM(
    { uU: tracks, UY: [] },
    layers,
  );
}
