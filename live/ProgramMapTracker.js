/**
 * Netflix Cadmium Player — ProgramMapTracker
 *
 * Tracks the program map for live / linear content. Listens for
 * `modelUpdated` events from the media events store and emits
 * `programsUpdated` when the list of programs (with their start/end
 * event timestamps) has changed.
 *
 * Also provides `checkAudioSupport()` which builds a working playgraph
 * node for a given audio profile, used to verify that the platform can
 * handle the audio codec before switching.
 *
 * @module live/ProgramMapTracker
 */

// import { fA as PlaygraphFactory, fmc as parseProgramMapEntry } from '../modules/Module_79048';
// import { EventEmitter } from '../modules/Module_90745';

export class ProgramMapTracker {
  /**
   * @param {Object} logger            - Console/debug logger.
   * @param {Object} viewableSession   - Current viewable session with media events store.
   * @param {Object} previousValue     - Previous playback state (for working playgraph ref).
   */
  constructor(logger, viewableSession, previousValue) {
    /** @private */
    this.console = logger;
    /** @private */
    this.viewableSession = viewableSession;
    /** @private */
    this.previousValue = previousValue;

    /** @type {Array} Current program map entries (simplified). */
    this.programMap = [];

    /** @type {EventEmitter} Emits `programsUpdated` events. */
    this.events = new EventEmitter();

    const self = this;
    this.viewableSession.mediaEventsStore.events.on('modelUpdated', function () {
      self._syncProgramMap();
    });
  }

  /**
   * Synchronise the internal program map with the media events store.
   * Emits `programsUpdated` if any program entry has changed.
   * @private
   */
  _syncProgramMap() {
    const latestMap = this.viewableSession.mediaEventsStore.store.programMap;

    if (this._hasChanged(this.programMap, latestMap)) {
      this.programMap = latestMap.map(function (entry) {
        return {
          id: entry.id,
          programStartEvent: entry.programStartEvent
            ? { timestamp: entry.programStartEvent.timeValue }
            : undefined,
          programEndEvent: entry.programEndEvent
            ? { timestamp: entry.programEndEvent.timeValue }
            : undefined,
        };
      });

      this.events.emit('programsUpdated', { type: 'programsUpdated' });
    }
  }

  /**
   * Compare two program maps for structural changes.
   * @private
   * @param {Array} previous
   * @param {Array} current
   * @returns {boolean} True if any entry differs.
   */
  _hasChanged(previous, current) {
    if (previous.length !== current.length) return true;

    for (let i = 0; i < previous.length; i++) {
      if (previous[i].id !== current[i].id) return true;

      const prevStart = previous[i].programStartEvent?.timeValue;
      const currStart = current[i].programStartEvent?.timeValue;
      if (prevStart !== currStart || (prevStart && currStart && prevStart.notEqual(currStart))) {
        return true;
      }

      const prevEnd = previous[i].programEndEvent?.timeValue;
      const currEnd = current[i].programEndEvent?.timeValue;
      if (prevEnd !== currEnd || (prevEnd && currEnd && prevEnd.notEqual(currEnd))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check audio codec support by building a playgraph node for the given
   * audio profile against the current program map.
   *
   * @param {Object} audioProfile - Audio profile descriptor to test.
   * @returns {Object} A working playgraph node that can be evaluated.
   */
  checkAudioSupport(audioProfile) {
    const programMapEntry = parseProgramMapEntry(
      parseInt(this.viewableSession.viewableId),
      this.viewableSession.mediaEventsStore.store.programMap
    );

    const playgraphNode = PlaygraphFactory
      .createGraph(audioProfile, PlaygraphFactory.create(programMapEntry))
      .rootNode;

    playgraphNode.attachToWorkingPlaygraph(this.previousValue.workingPlaygraph);

    return playgraphNode;
  }
}
