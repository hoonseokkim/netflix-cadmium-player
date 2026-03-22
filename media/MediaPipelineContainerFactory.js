/**
 * Media Pipeline Container Factory
 *
 * Injectable factory that creates media pipeline container instances.
 * Holds references to all major player subsystems (media factory, event bus,
 * session, config, platform, DRM key system, etc.) and delegates creation
 * to x7 (the actual media pipeline container class).
 *
 * This is a dependency injection wrapper - all 19 constructor parameters
 * are injected via inversify decorators.
 *
 * @module MediaPipelineContainerFactory
 * @source Module_52025
 */
export default function MediaPipelineContainerFactory(module, exports, require) {
    var tslib, TUbToken, MediaFactoryToken, ResponseTypeToken, EventBusToken,
        inversify, ContainerScopeToken, MediaPipelineModule, InternalObbToken,
        HttpToken, ConfigToken, PlayerCoreToken, ClockToken, PlatformToken,
        SessionToken, SeekableCheckToken, EnumConstantsToken, FHaToken,
        MediaKeyServicesSymbol, NGaToken, HqaToken, VBToken, VHToken;

    function MediaPipelineContainerFactoryClass(
        TUb, mediaFactory, RTa, eventBus, internal_Hqa, responseType,
        config, session, playerCore, lastVideoSync, platform, VB, wI,
        seekableCheck, VH, FT, containerScope, keySystem, EE
    ) {
        this.TUb = TUb;
        this.mediaFactory = mediaFactory;
        this.RTa = RTa;
        this.eventBus = eventBus;
        this.internal_Hqa = internal_Hqa;
        this.responseType = responseType;
        this.config = config;
        this.session = session;
        this.playerCore = playerCore;
        this.lastVideoSync = lastVideoSync;
        this.platform = platform;
        this.VB = VB;
        this.wI = wI;
        this.seekableCheck = seekableCheck;
        this.VH = VH;
        this.FT = FT;
        this.containerScope = containerScope;
        this.keySystem = keySystem;
        this.EE = EE;
    }

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GP = void 0;

    tslib = require(22970);
    TUbToken = require(87549);
    MediaFactoryToken = require(45118);
    EventBusToken = require(74870);
    ResponseTypeToken = require(94800);
    inversify = require(22674);
    ContainerScopeToken = require(98326);
    MediaPipelineModule = require(74098);
    InternalObbToken = require(30895);
    HttpToken = require(32934);
    ConfigToken = require(4203);
    PlayerCoreToken = require(30869);
    ClockToken = require(81918);
    PlatformToken = require(91581);
    VBToken = require(31850);
    SessionToken = require(66476);
    SeekableCheckToken = require(52531);
    VHToken = require(63368);
    EnumConstantsToken = require(34231);
    FHaToken = require(2160);
    MediaKeyServicesSymbol = require(21103);
    NGaToken = require(18647);

    /**
     * Creates a new media pipeline container instance.
     *
     * @param {Object} param1 - First pipeline creation parameter
     * @param {Object} param2 - Second pipeline creation parameter
     * @returns {Object} New media pipeline container (x7 instance)
     */
    MediaPipelineContainerFactoryClass.prototype.create = function (param1, param2) {
        return new MediaPipelineModule.x7(
            param1, param2, this.TUb, this.mediaFactory, this.RTa,
            this.eventBus, this.internal_Hqa, this.responseType, this.config,
            this.session, this.playerCore, this.lastVideoSync, this.VB,
            this.wI, this.seekableCheck, this.VH, this.FT,
            this.containerScope, this.keySystem, this.EE
        );
    };

    var ExportedClass = MediaPipelineContainerFactoryClass;
    exports.GP = ExportedClass;
    exports.GP = ExportedClass = tslib.__decorate([
        (0, inversify.injectable)(),
        tslib.__param(0, (0, inversify.injectDecorator)(TUbToken.ymb)),
        tslib.__param(1, (0, inversify.injectDecorator)(MediaFactoryToken.oq)),
        tslib.__param(2, (0, inversify.injectDecorator)(ResponseTypeToken.aFa)),
        tslib.__param(3, (0, inversify.injectDecorator)(EventBusToken.updateMap)),
        tslib.__param(4, (0, inversify.injectDecorator)(InternalObbToken.internal_Obb)),
        tslib.__param(5, (0, inversify.injectDecorator)(HttpToken.HttpToken)),
        tslib.__param(6, (0, inversify.injectDecorator)(ConfigToken.ConfigToken)),
        tslib.__param(7, (0, inversify.injectDecorator)(SessionToken.SessionToken)),
        tslib.__param(8, (0, inversify.injectDecorator)(PlayerCoreToken.PlayerCoreToken)),
        tslib.__param(9, (0, inversify.injectDecorator)(ClockToken.ClockToken)),
        tslib.__param(10, (0, inversify.injectDecorator)(PlatformToken.PlatformToken)),
        tslib.__param(11, (0, inversify.injectDecorator)(VHToken.tla)),
        tslib.__param(12, (0, inversify.injectDecorator)(VBToken.hG)),
        tslib.__param(13, (0, inversify.injectDecorator)(SeekableCheckToken.RP)),
        tslib.__param(14, (0, inversify.injectDecorator)(EnumConstantsToken.enumConstants)),
        tslib.__param(15, (0, inversify.injectDecorator)(FHaToken.FHa)),
        tslib.__param(16, (0, inversify.injectDecorator)(ContainerScopeToken.QGa)),
        tslib.__param(17, (0, inversify.injectDecorator)(MediaKeyServicesSymbol.MediaKeyServicesSymbol)),
        tslib.__param(18, (0, inversify.injectDecorator)(NGaToken.nGa))
    ], ExportedClass);
}
