/**
 * Netflix Cadmium Player - Ads Viewable Factory
 * Deobfuscated from Module_86681
 *
 * Creates ad viewable instances within the playgraph system.
 * Manages ad playback integration with the working playgraph,
 * including viewable creation and state tracking.
 */

import { __assign, __spreadArray, __read } from '../core/tslib';
import { defaultSchedulerFactory } from '../streaming/PlaygraphFactory';
import { createViewableRef } from '../streaming/ViewableEntry';
import { PlaygraphManager as playgraphManager } from '../streaming/PlaygraphManager';
import { AdViewable } from './AdViewable';

/**
 * Creates an ads viewable entry within a playgraph context.
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.schedulerFactory - Factory for creating schedulers (defaults to defaultSchedulerFactory)
 * @param {Object} context - The playgraph context
 * @param {Array} context.components - Array of player components (index 5 = media events)
 * @param {Array} context.viewableQueue - Current queue of viewable entries
 * @param {Function} createCallback - Callback invoked to create the downstream viewable
 * @returns {Object} The working playgraph result descriptor
 */
export function createAdsViewable(options, context, createCallback) {
    const schedulerFactory = __assign({
        schedulerFactory: defaultSchedulerFactory
    }, options).schedulerFactory;

    const mediaEvents = context.components[5];

    const viewableRef = createViewableRef(function () {
        return adViewable;
    });

    mediaEvents.registerMediaViewable(viewableRef.createViewable);

    const adsState = {
        scheduler: undefined,
        workingPlaygraphDescriptor: undefined,
        previousValue: undefined,
        label: "ads"
    };

    adsState.scheduler = new schedulerFactory(
        function () {
            return adsState.workingPlaygraphDescriptor.workingPlaygraph;
        },
        function () {
            return adsState.previousValue;
        },
        context.components[2],
        "Ads:"
    );

    const adViewable = new AdViewable(
        adsState,
        viewableRef.viewableAccessor,
        playgraphManager.adNodeType.defaultValue,
        mediaEvents
    );

    const previousQueue = context.viewableQueue;
    context.viewableQueue = __spreadArray(
        __spreadArray([], __read(previousQueue), false),
        [adViewable],
        false
    );

    adsState.previousValue = createCallback(context);

    adsState.workingPlaygraphDescriptor = playgraphManager.createWorkingPlaygraph(
        adsState.previousValue,
        adViewable,
        function () {
            return adsState;
        },
        previousQueue
    );

    adViewable.data();

    return adsState.workingPlaygraphDescriptor;
}
