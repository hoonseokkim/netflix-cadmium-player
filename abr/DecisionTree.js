/**
 * Netflix Cadmium Player - ABR Decision Tree Model
 * Webpack Module 94030 + 45578
 *
 * A gradient-boosted decision tree (XGBoost format) used for adaptive bitrate
 * predictions. The tree encodes user browsing behavior features (scroll counts,
 * row context sizes, session duration, etc.) and predicts prefetch priorities
 * for video content on the Netflix UI.
 *
 * The model uses a binary tree structure where internal nodes split on feature
 * values (numeric threshold or categorical presence) and leaf nodes return
 * prediction scores. A grid mask system partitions the UI into spatial cells
 * for location-aware predictions.
 *
 * Feature vector layout (145 features, indices 0-144):
 *   0-10   : Numeric session/scroll/page metrics
 *   11-26  : Categorical UI layout flags
 *   27-49  : Categorical region flags
 *   50-128 : Categorical grid mask cell flags
 *   129-144: Numeric row-context list sizes
 */

// @ts-check

import config from "../config";               // Module 21457 - config.declare
import getTimestamp from "../platform/getTimestamp"; // Module 79809

// ---------------------------------------------------------------------------
// Enums (originally in Webpack Module 45578)
// ---------------------------------------------------------------------------

/**
 * How long a prefetch payload persists in the cache.
 * @enum {number}
 */
export const VisibilityState = {
    TRANSIENT: 0,
    SEMI_TRANSIENT: 1,
    PERMANENT: 2,
    /** Human-readable names indexed by enum value */
    name: ["transient", "semiTransient", "permanent"],
};

/**
 * What user interaction triggered the prefetch.
 * @enum {number}
 */
export const TriggerType = {
    FIRST_LOAD: 0,
    SCROLL_HORIZONTAL: 1,
    SEARCH: 2,
    PLAY_FOCUS: 3,
    /** Sentinel for unknown / unmapped triggers */
    UNKNOWN: 100,
    name: ["firstLoad", "scrollHorizontal", "search", "playFocus"],
};

/**
 * The kind of video content being prefetched.
 * @enum {number}
 */
export const ContentType = {
    TRAILER: 0,
    MONTAGE: 1,
    CONTENT: 2,
    UNKNOWN: 100,
    name: ["trailer", "montage", "content"],
};

/**
 * Scroll / navigation direction.
 * @enum {number}
 */
export const ScrollDirection = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
    UNKNOWN: 100,
    name: ["left", "right", "up", "down"],
};

/**
 * The row context from which the title originates.
 * @enum {number}
 */
export const RowContext = {
    CONTINUE_WATCHING: 0,
    SEARCH: 1,
    GRID: 2,
    EPISODE: 3,
    BILLBOARD: 4,
    GENRE: 5,
    BIG_ROW: 6,
    UNKNOWN: 100,
    name: ["continueWatching", "search", "grid", "episode", "billboard", "genre", "bigRow"],
};

/**
 * How the user engaged with the title (focused vs. opened details).
 * @enum {number}
 */
export const EngagementType = {
    PLAY_FOCUSED: 0,
    DETAILS_OPENED: 1,
    UNKNOWN: 100,
    name: ["playFocused", "detailsOpened"],
};

// ---------------------------------------------------------------------------
// DecisionTreeNode
// ---------------------------------------------------------------------------

/**
 * A single node in the decision tree. Internal nodes split on a feature;
 * leaf nodes return a constant prediction value.
 */
export class DecisionTreeNode {
    /**
     * @param {string} leftChild      - Key of the left child node (feature value < split)
     * @param {string} rightChild     - Key of the right child node (feature value >= split)
     * @param {string} missingChild   - Key of the child to follow when the feature value is missing/null
     * @param {string} featureIndex   - Index into the feature vector for splitting
     * @param {string} split          - Split threshold (numeric features) or sentinel (categorical)
     * @param {number} isLeaf         - 0 = internal node, 1 = leaf node
     * @param {number} leafValue      - Prediction value returned by leaf nodes
     */
    constructor(leftChild, rightChild, missingChild, featureIndex, split, isLeaf, leafValue) {
        /** @type {string} */ this.featureIndex = featureIndex;
        /** @type {string} */ this.leftChild = leftChild;
        /** @type {string} */ this.rightChild = rightChild;
        /** @type {string} */ this.missingChild = missingChild;
        /** @type {number} */ this.isLeaf = isLeaf;
        /** @type {number} */ this.leafValue = leafValue;
        /** @type {string} */ this.split = split;
    }

    /**
     * Evaluate this node against a feature vector and return either:
     * - A child node key (string) if this is an internal node, or
     * - A numeric leaf value if this is a leaf node.
     *
     * For internal nodes the routing logic is:
     *   Categorical features: null -> rightChild, "missing" -> missingChild, else -> leftChild
     *   Numeric features:     null -> missingChild, value < split -> leftChild, else -> rightChild
     *
     * @param {{ features: Array<{ type: string, value: * }> }} input
     * @returns {string|number}
     */
    evaluate(input) {
        switch (this.isLeaf) {
            case 0: {
                const feature = input.features[this.featureIndex];
                switch (feature.type) {
                    case "cat":
                        if (feature.value === null) return this.rightChild;
                        if (feature.value == "missing") return this.missingChild;
                        return this.leftChild;
                    case "num":
                        if (feature.value === null) return this.missingChild;
                        return feature.value < this.split
                            ? this.leftChild
                            : this.rightChild;
                    default:
                        return this.missingChild;
                }
            }
            case 1:
                return this.leafValue;
            default:
                return this.leafValue;
        }
    }
}

// ---------------------------------------------------------------------------
// DecisionTree
// ---------------------------------------------------------------------------

/**
 * A complete decision tree built from pre-trained XGBoost model weights.
 * The tree is stored as a flat map of string node keys -> DecisionTreeNode.
 *
 * Tree depth: 7 levels, 228 nodes total (114 internal + 114 leaves).
 * Node keys follow a 1-indexed binary heap layout.
 */
export class DecisionTree {
    constructor() {
        /** @type {Record<string, DecisionTreeNode>} */
        this.nodes = {};

        /** Shorthand to reduce verbosity in the weight table. */
        const N = (l, r, m, fi, sp, leaf, val) =>
            new DecisionTreeNode(l, r, m, fi, sp, leaf, val);

        // ── Root (feature 14 = kGc / uiLayout_3) ──────────────────────────
        this.nodes["0"]   = N("1","2","1","14","-0.0000100136",0,0);

        // ── Left subtree of root ───────────────────────────────────────────
        this.nodes["1"]   = N("3","4","3","20","-0.0000100136",0,0);
        this.nodes["3"]   = N("7","8","7","10","1.5",0,0);
        this.nodes["7"]   = N("15","16","15","9","4.5",0,0);
        this.nodes["15"]  = N("31","32","31","2","5.5",0,0);
        this.nodes["31"]  = N("63","64","63","29","-0.0000100136",0,0);
        this.nodes["63"]  = N("123","124","123","24","-0.0000100136",0,0);
        this.nodes["123"] = N("123","124","123","0","0",1,.207298);
        this.nodes["124"] = N("123","124","123","0","0",1,.49076);
        this.nodes["64"]  = N("125","126","125","4","40.5",0,0);
        this.nodes["125"] = N("125","126","125","0","0",1,-.00157835);
        this.nodes["126"] = N("125","126","125","0","0",1,.934205);
        this.nodes["32"]  = N("65","66","65","135","5.5",0,0);
        this.nodes["65"]  = N("127","128","128","4","1272.5",0,0);
        this.nodes["127"] = N("127","128","128","0","0",1,-.510333);
        this.nodes["128"] = N("127","128","128","0","0",1,.18363);
        this.nodes["66"]  = N("129","130","129","24","-0.0000100136",0,0);
        this.nodes["129"] = N("129","130","129","0","0",1,-.0464542);
        this.nodes["130"] = N("129","130","129","0","0",1,.458833);
        this.nodes["16"]  = N("33","34","34","10","2.00001",0,0);
        this.nodes["33"]  = N("67","68","67","0","29.5",0,0);
        this.nodes["67"]  = N("131","132","131","2","39.5",0,0);
        this.nodes["131"] = N("131","132","131","0","0",1,-.37577);
        this.nodes["132"] = N("131","132","131","0","0",1,.512087);
        this.nodes["68"]  = N("133","134","134","140","1.5",0,0);
        this.nodes["133"] = N("133","134","134","0","0",1,.321272);
        this.nodes["134"] = N("133","134","134","0","0",1,-.675396);
        this.nodes["34"]  = N("69","70","70","2","24.5",0,0);
        this.nodes["69"]  = N("135","136","136","9","28.5",0,0);
        this.nodes["135"] = N("135","136","136","0","0",1,-.0573845);
        this.nodes["136"] = N("135","136","136","0","0",1,-.507455);
        this.nodes["70"]  = N("137","138","137","45","-0.0000100136",0,0);
        this.nodes["137"] = N("137","138","137","0","0",1,-.503909);
        this.nodes["138"] = N("137","138","137","0","0",1,.450886);
        this.nodes["8"]   = N("17","18","17","4","44189.5",0,0);
        this.nodes["17"]  = N("35","36","35","2","21.5",0,0);
        this.nodes["35"]  = N("71","72","72","0","19.5",0,0);
        this.nodes["71"]  = N("139","140","140","9","2.5",0,0);
        this.nodes["139"] = N("139","140","140","0","0",1,.00403497);
        this.nodes["140"] = N("139","140","140","0","0",1,-.312656);
        this.nodes["72"]  = N("141","142","141","135","96",0,0);
        this.nodes["141"] = N("141","142","141","0","0",1,-.465786);
        this.nodes["142"] = N("141","142","141","0","0",1,.159633);
        this.nodes["36"]  = N("73","74","73","130","89.5",0,0);
        this.nodes["73"]  = N("143","144","144","10","4.5",0,0);
        this.nodes["143"] = N("143","144","144","0","0",1,-.76265);
        this.nodes["144"] = N("143","144","144","0","0",1,-.580804);
        this.nodes["74"]  = N("145","146","146","10","16.5",0,0);
        this.nodes["145"] = N("145","146","146","0","0",1,.296357);
        this.nodes["146"] = N("145","146","146","0","0",1,-.691659);
        this.nodes["18"]  = N("37","38","38","9","1.5",0,0);
        this.nodes["37"]  = N("37","38","38","0","0",1,.993951);
        this.nodes["38"]  = N("75","76","75","0","19",0,0);
        this.nodes["75"]  = N("147","148","147","39","-0.0000100136",0,0);
        this.nodes["147"] = N("147","148","147","0","0",1,-.346535);
        this.nodes["148"] = N("147","148","147","0","0",1,-.995745);
        this.nodes["76"]  = N("147","148","147","0","0",1,-.99978);
        this.nodes["4"]   = N("9","10","9","5","4.5",0,0);
        this.nodes["9"]   = N("19","20","19","2","4.5",0,0);
        this.nodes["19"]  = N("39","40","39","140","7.5",0,0);
        this.nodes["39"]  = N("77","78","78","134","6.5",0,0);
        this.nodes["77"]  = N("149","150","150","7","11.5",0,0);
        this.nodes["149"] = N("149","150","150","0","0",1,.729843);
        this.nodes["150"] = N("149","150","150","0","0",1,.383857);
        this.nodes["78"]  = N("151","152","151","133","4.5",0,0);
        this.nodes["151"] = N("151","152","151","0","0",1,.39017);
        this.nodes["152"] = N("151","152","151","0","0",1,.0434342);
        this.nodes["40"]  = N("79","80","79","133","3.5",0,0);
        this.nodes["79"]  = N("153","154","154","8","4.5",0,0);
        this.nodes["153"] = N("153","154","154","0","0",1,-.99536);
        this.nodes["154"] = N("153","154","154","0","0",1,-.00943396);
        this.nodes["80"]  = N("155","156","155","125","-0.0000100136",0,0);
        this.nodes["155"] = N("155","156","155","0","0",1,.266272);
        this.nodes["156"] = N("155","156","155","0","0",1,.959904);
        this.nodes["20"]  = N("41","42","42","10","65.5",0,0);
        this.nodes["41"]  = N("81","82","82","7","10.5",0,0);
        this.nodes["81"]  = N("157","158","158","2","37.5",0,0);
        this.nodes["157"] = N("157","158","158","0","0",1,-.701873);
        this.nodes["158"] = N("157","158","158","0","0",1,.224649);
        this.nodes["82"]  = N("159","160","159","133","9.5",0,0);
        this.nodes["159"] = N("159","160","159","0","0",1,.0955181);
        this.nodes["160"] = N("159","160","159","0","0",1,-.58962);
        this.nodes["42"]  = N("83","84","83","39","-0.0000100136",0,0);
        this.nodes["83"]  = N("161","162","161","135","31",0,0);
        this.nodes["161"] = N("161","162","161","0","0",1,-.229692);
        this.nodes["162"] = N("161","162","161","0","0",1,.88595);
        this.nodes["84"]  = N("163","164","164","1","13.5",0,0);
        this.nodes["163"] = N("163","164","164","0","0",1,-.992157);
        this.nodes["164"] = N("163","164","164","0","0",1,.922159);
        this.nodes["10"]  = N("21","22","22","4","486",0,0);
        this.nodes["21"]  = N("43","44","44","133","4.5",0,0);
        this.nodes["43"]  = N("85","86","86","10","4.5",0,0);
        this.nodes["85"]  = N("165","166","166","4","158.5",0,0);
        this.nodes["165"] = N("165","166","166","0","0",1,-.127778);
        this.nodes["166"] = N("165","166","166","0","0",1,.955189);
        this.nodes["86"]  = N("165","166","166","0","0",1,-.994012);
        this.nodes["44"]  = N("87","88","88","1","3.5",0,0);
        this.nodes["87"]  = N("167","168","168","135","7",0,0);
        this.nodes["167"] = N("167","168","168","0","0",1,-.997015);
        this.nodes["168"] = N("167","168","168","0","0",1,.400821);
        this.nodes["88"]  = N("169","170","169","130","36",0,0);
        this.nodes["169"] = N("169","170","169","0","0",1,-.898638);
        this.nodes["170"] = N("169","170","169","0","0",1,.56129);
        this.nodes["22"]  = N("45","46","45","9","2.5",0,0);
        this.nodes["45"]  = N("89","90","90","9","1.5",0,0);
        this.nodes["89"]  = N("171","172","171","10","10.5",0,0);
        this.nodes["171"] = N("171","172","171","0","0",1,.573986);
        this.nodes["172"] = N("171","172","171","0","0",1,-.627266);
        this.nodes["90"]  = N("173","174","173","31","-0.0000100136",0,0);
        this.nodes["173"] = N("173","174","173","0","0",1,.925273);
        this.nodes["174"] = N("173","174","173","0","0",1,-.994805);
        this.nodes["46"]  = N("91","92","91","136","5.5",0,0);
        this.nodes["91"]  = N("175","176","175","10","10.5",0,0);
        this.nodes["175"] = N("175","176","175","0","0",1,.548352);
        this.nodes["176"] = N("175","176","175","0","0",1,-.879195);
        this.nodes["92"]  = N("177","178","178","8","14.5",0,0);
        this.nodes["177"] = N("177","178","178","0","0",1,.457305);
        this.nodes["178"] = N("177","178","178","0","0",1,-.998992);

        // ── Right subtree of root ──────────────────────────────────────────
        this.nodes["2"]   = N("5","6","5","10","2.5",0,0);
        this.nodes["5"]   = N("11","12","11","9","4.5",0,0);
        this.nodes["11"]  = N("23","24","24","10","4.00001",0,0);
        this.nodes["23"]  = N("47","48","48","133","5.5",0,0);
        this.nodes["47"]  = N("93","94","93","3","13.5",0,0);
        this.nodes["93"]  = N("179","180","179","138","15.5",0,0);
        this.nodes["179"] = N("179","180","179","0","0",1,.658398);
        this.nodes["180"] = N("179","180","179","0","0",1,-.927007);
        this.nodes["94"]  = N("181","182","182","3","15.5",0,0);
        this.nodes["181"] = N("181","182","182","0","0",1,-.111351);
        this.nodes["182"] = N("181","182","182","0","0",1,-.99827);
        this.nodes["48"]  = N("95","96","95","7","167",0,0);
        this.nodes["95"]  = N("183","184","183","132","36.5",0,0);
        this.nodes["183"] = N("183","184","183","0","0",1,.895161);
        this.nodes["184"] = N("183","184","183","0","0",1,-.765217);
        this.nodes["96"]  = N("185","186","186","137","6.00001",0,0);
        this.nodes["185"] = N("185","186","186","0","0",1,-.851095);
        this.nodes["186"] = N("185","186","186","0","0",1,.674286);
        this.nodes["24"]  = N("49","50","49","137","5.5",0,0);
        this.nodes["49"]  = N("97","98","97","5","23.5",0,0);
        this.nodes["97"]  = N("187","188","187","3","28.5",0,0);
        this.nodes["187"] = N("187","188","187","0","0",1,.951654);
        this.nodes["188"] = N("187","188","187","0","0",1,-.993808);
        this.nodes["98"]  = N("187","188","187","0","0",1,-.99705);
        this.nodes["50"]  = N("187","188","187","0","0",1,-.997525);
        this.nodes["12"]  = N("25","26","25","8","8.5",0,0);
        this.nodes["25"]  = N("51","52","52","10","4.00001",0,0);
        this.nodes["51"]  = N("99","100","100","133","5.5",0,0);
        this.nodes["99"]  = N("189","190","190","7","40.5",0,0);
        this.nodes["189"] = N("189","190","190","0","0",1,.151839);
        this.nodes["190"] = N("189","190","190","0","0",1,-.855517);
        this.nodes["100"] = N("191","192","192","133","14.5",0,0);
        this.nodes["191"] = N("191","192","192","0","0",1,.86223);
        this.nodes["192"] = N("191","192","192","0","0",1,.544394);
        this.nodes["52"]  = N("101","102","101","135","47.5",0,0);
        this.nodes["101"] = N("193","194","194","4","24.5",0,0);
        this.nodes["193"] = N("193","194","194","0","0",1,.946185);
        this.nodes["194"] = N("193","194","194","0","0",1,.811859);
        this.nodes["102"] = N("193","194","194","0","0",1,-.991561);
        this.nodes["26"]  = N("53","54","54","132","6.5",0,0);
        this.nodes["53"]  = N("103","104","103","131","85",0,0);
        this.nodes["103"] = N("195","196","196","134","16.5",0,0);
        this.nodes["195"] = N("195","196","196","0","0",1,.0473538);
        this.nodes["196"] = N("195","196","196","0","0",1,-.999401);
        this.nodes["104"] = N("197","198","198","8","15.5",0,0);
        this.nodes["197"] = N("197","198","198","0","0",1,.816129);
        this.nodes["198"] = N("197","198","198","0","0",1,-.99322);
        this.nodes["54"]  = N("105","106","105","133","3.5",0,0);
        this.nodes["105"] = N("105","106","105","0","0",1,-.998783);
        this.nodes["106"] = N("199","200","199","39","-0.0000100136",0,0);
        this.nodes["199"] = N("199","200","199","0","0",1,.528588);
        this.nodes["200"] = N("199","200","199","0","0",1,-.998599);
        this.nodes["6"]   = N("13","14","14","10","7.5",0,0);
        this.nodes["13"]  = N("27","28","28","133","7.5",0,0);
        this.nodes["27"]  = N("55","56","56","10","4.5",0,0);
        this.nodes["55"]  = N("107","108","107","3","3.5",0,0);
        this.nodes["107"] = N("201","202","201","4","17.5",0,0);
        this.nodes["201"] = N("201","202","201","0","0",1,-.379512);
        this.nodes["202"] = N("201","202","201","0","0",1,.15165);
        this.nodes["108"] = N("203","204","203","57","-0.0000100136",0,0);
        this.nodes["203"] = N("203","204","203","0","0",1,-.884606);
        this.nodes["204"] = N("203","204","203","0","0",1,.265406);
        this.nodes["56"]  = N("109","110","109","136","6.5",0,0);
        this.nodes["109"] = N("205","206","205","4","157.5",0,0);
        this.nodes["205"] = N("205","206","205","0","0",1,-.0142737);
        this.nodes["206"] = N("205","206","205","0","0",1,.691279);
        this.nodes["110"] = N("205","206","205","0","0",1,-.998086);
        this.nodes["28"]  = N("57","58","58","138","11.5",0,0);
        this.nodes["57"]  = N("111","112","112","2","6.5",0,0);
        this.nodes["111"] = N("207","208","208","7","67.5",0,0);
        this.nodes["207"] = N("207","208","208","0","0",1,.763925);
        this.nodes["208"] = N("207","208","208","0","0",1,-.309645);
        this.nodes["112"] = N("209","210","209","40","-0.0000100136",0,0);
        this.nodes["209"] = N("209","210","209","0","0",1,-.306635);
        this.nodes["210"] = N("209","210","209","0","0",1,.556696);
        this.nodes["58"]  = N("113","114","113","138","50.5",0,0);
        this.nodes["113"] = N("211","212","212","8","25.5",0,0);
        this.nodes["211"] = N("211","212","212","0","0",1,.508234);
        this.nodes["212"] = N("211","212","212","0","0",1,.793551);
        this.nodes["114"] = N("211","212","212","0","0",1,-.998438);
        this.nodes["14"]  = N("29","30","29","134","27.5",0,0);
        this.nodes["29"]  = N("59","60","60","7","17.5",0,0);
        this.nodes["59"]  = N("115","116","115","135","5.5",0,0);
        this.nodes["115"] = N("213","214","214","137","5.5",0,0);
        this.nodes["213"] = N("213","214","214","0","0",1,.401747);
        this.nodes["214"] = N("213","214","214","0","0",1,.0367503);
        this.nodes["116"] = N("215","216","216","8","5.5",0,0);
        this.nodes["215"] = N("215","216","216","0","0",1,-.0241984);
        this.nodes["216"] = N("215","216","216","0","0",1,-.999046);
        this.nodes["60"]  = N("117","118","117","0","12.5",0,0);
        this.nodes["117"] = N("217","218","218","132","5.5",0,0);
        this.nodes["217"] = N("217","218","218","0","0",1,-.997294);
        this.nodes["218"] = N("217","218","218","0","0",1,.210398);
        this.nodes["118"] = N("219","220","219","137","1.5",0,0);
        this.nodes["219"] = N("219","220","219","0","0",1,-.55763);
        this.nodes["220"] = N("219","220","219","0","0",1,.074493);
        this.nodes["30"]  = N("61","62","62","133","42.5",0,0);
        this.nodes["61"]  = N("119","120","119","135","5.5",0,0);
        this.nodes["119"] = N("221","222","222","4","473.5",0,0);
        this.nodes["221"] = N("221","222","222","0","0",1,-.920213);
        this.nodes["222"] = N("221","222","222","0","0",1,-.17615);
        this.nodes["120"] = N("223","224","224","5","144",0,0);
        this.nodes["223"] = N("223","224","224","0","0",1,-.954295);
        this.nodes["224"] = N("223","224","224","0","0",1,-.382538);
        this.nodes["62"]  = N("121","122","121","133","50",0,0);
        this.nodes["121"] = N("225","226","226","10","18.5",0,0);
        this.nodes["225"] = N("225","226","226","0","0",1,-.0731343);
        this.nodes["226"] = N("225","226","226","0","0",1,.755454);
        this.nodes["122"] = N("227","228","228","0","30",0,0);
        this.nodes["227"] = N("227","228","228","0","0",1,.25);
        this.nodes["228"] = N("227","228","228","0","0",1,-.997101);
    }

    /**
     * Run a prediction: start at the root and traverse the tree until a leaf
     * is reached, returning the leaf's numeric score.
     *
     * @param {{ features: Array<{ type: string, value: * }> }} input
     * @returns {number}
     */
    predict(input) {
        return this.#walkTree(this.nodes["0"].evaluate(input), input);
    }

    /**
     * Recursively follow child pointers until a leaf value (number) is reached.
     *
     * @param {string|number} nodeKeyOrValue - Node key (string) to continue, or leaf value (number)
     * @param {{ features: Array<{ type: string, value: * }> }} input
     * @returns {number}
     */
    #walkTree(nodeKeyOrValue, input) {
        if (typeof nodeKeyOrValue === "string") {
            return this.#walkTree(this.nodes[nodeKeyOrValue].evaluate(input), input);
        }
        return /** @type {number} */ (nodeKeyOrValue);
    }
}

// ---------------------------------------------------------------------------
// GridMaskParams
// ---------------------------------------------------------------------------

/**
 * Parameters describing a spatial grid cell for the UI mask system.
 * Each cell represents a rectangular region of the browsing grid
 * identified by its (rowBlock, colBlock) coordinates.
 */
export class GridMaskParams {
    /**
     * @param {string} _type   - Grid type identifier (always "grid")
     * @param {number} _size   - Grid size parameter (unused, always 10)
     * @param {number} _rows   - Row count parameter (unused, always 5)
     * @param {number} _cols   - Column count parameter (unused, always 5)
     * @param {number} rowBlock - Row block index: floor(row / rowStepSize)
     * @param {number} colBlock - Column block index: floor(col / colStepSize)
     */
    constructor(_type, _size, _rows, _cols, rowBlock, colBlock) {
        /** @type {number} */ this.rowBlock = rowBlock;
        /** @type {number} */ this.colBlock = colBlock;
    }
}

// ---------------------------------------------------------------------------
// Feature Helpers
// ---------------------------------------------------------------------------

/**
 * Creates a simple categorical feature descriptor.
 * Categorical features have no value tracking; their presence/absence
 * is set externally when building the feature vector.
 *
 * @returns {{ type: "cat" }}
 */
function createCategoricalFeature() {
    return { type: "cat" };
}

/**
 * Creates a numeric row-context feature that tracks the maximum list length
 * observed for a given lolomo (list-of-list-of-movies) row context.
 *
 * @param {string} contextName - The lolomo row context to match (e.g. "continueWatching")
 * @returns {{ type: "num", eventCounter: number, update: (data: object) => void }}
 */
function createRowContextFeature(contextName) {
    return {
        type: "num",
        eventCounter: 0,
        /**
         * @param {{ xc: Array<{ context: string, list: Array }> }} data
         */
        update(data) {
            for (const key in data.xc) {
                if (data.xc[key].context === contextName) {
                    this.eventCounter = Math.max(data.xc[key].list.length, this.eventCounter);
                    break;
                }
            }
        },
    };
}

// ---------------------------------------------------------------------------
// Feature Definitions
// ---------------------------------------------------------------------------

/**
 * All 145 features used by the decision tree model.
 *
 * Index ranges:
 *   0   = maxColIndex (numeric)          — highest column index visited
 *   1   = avgColIndex (numeric)          — running mean column index
 *   2   = maxRowIndex (numeric)          — highest row index visited
 *   3   = avgRowIndex (numeric)          — running mean row index
 *   4   = sessionDuration (numeric, ms)  — time since session start
 *   5   = scrollUpCount (numeric)        — cumulative up-scroll events
 *   6   = scrollLeftCount (numeric)      — cumulative left-scroll events
 *   7   = scrollRightCount (numeric)     — cumulative right-scroll events
 *   8   = scrollDownCount (numeric)      — cumulative down-scroll events
 *   9   = pageColumnCount (numeric)      — columns visible on page
 *   10  = pageRowCount (numeric)         — rows visible on page
 *   11-26  = uiLayout_0 .. uiLayout_15 (categorical)
 *   27-49  = region_0  .. region_22 (categorical)
 *   50-128 = gridCell_0 .. gridCell_78 (categorical)
 *   129-144 = row context list sizes (numeric)
 *
 * @type {Record<string, { type: string, eventCounter?: number, update?: Function }>}
 */
const features = {};

// ── 0: maxColIndex ─────────────────────────────────────────────────────
features.maxColIndex = {
    type: "num",
    eventCounter: 0,
    /** @param {{ internal_Kub: number }} event */
    update(event) {
        this.eventCounter = Math.max(this.eventCounter, event.internal_Kub);
    },
};

// ── 1: avgColIndex ─────────────────────────────────────────────────────
features.avgColIndex = {
    type: "num",
    sampleCount: 0,
    eventCounter: 0,
    /** @param {{ internal_Kub: number }} event */
    update(event) {
        this.sampleCount++;
        return (this.eventCounter =
            (1 * (this.eventCounter + event.internal_Kub)) / this.sampleCount);
    },
};

// ── 2: maxRowIndex ─────────────────────────────────────────────────────
features.maxRowIndex = {
    type: "num",
    eventCounter: 0,
    /** @param {{ rowIndex: number }} event */
    update(event) {
        this.eventCounter = Math.max(this.eventCounter, event.rowIndex);
    },
};

// ── 3: avgRowIndex ─────────────────────────────────────────────────────
features.avgRowIndex = {
    type: "num",
    sampleCount: 0,
    eventCounter: 0,
    /** @param {{ rowIndex: number }} event */
    update(event) {
        this.sampleCount++;
        this.eventCounter =
            (1 * (this.eventCounter + event.rowIndex)) / this.sampleCount;
    },
};

// ── 4: sessionDuration (ms since session start) ────────────────────────
features.sessionDuration = (() => {
    const startTime = getTimestamp();
    return {
        type: "num",
        eventCounter: 0,
        update() {
            this.eventCounter = getTimestamp() - startTime;
        },
    };
})();

// ── 5: scrollUpCount ───────────────────────────────────────────────────
features.scrollUpCount = {
    type: "num",
    eventCounter: 0,
    /** @param {{ direction: string }} event */
    update(event) {
        if (event.direction === "up") this.eventCounter++;
    },
};

// ── 6: scrollLeftCount ─────────────────────────────────────────────────
features.scrollLeftCount = {
    type: "num",
    eventCounter: 0,
    /** @param {{ direction: string }} event */
    update(event) {
        if (event.direction === "left") this.eventCounter++;
    },
};

// ── 7: scrollRightCount ────────────────────────────────────────────────
features.scrollRightCount = {
    type: "num",
    eventCounter: 0,
    /** @param {{ direction: string }} event */
    update(event) {
        if (event.direction === "right") this.eventCounter++;
    },
};

// ── 8: scrollDownCount ─────────────────────────────────────────────────
features.scrollDownCount = {
    type: "num",
    eventCounter: 0,
    /** @param {{ direction: string }} event */
    update(event) {
        if (event.direction === "down") this.eventCounter++;
    },
};

// ── 9: pageColumnCount (externally set) ────────────────────────────────
features.pageColumnCount = { type: "num" };

// ── 10: pageRowCount (externally set) ──────────────────────────────────
features.pageRowCount = { type: "num" };

// ── 11-26: UI layout / genre categorical flags ─────────────────────────
features.uiLayout_0  = createCategoricalFeature(); // 11 (gGc)
features.uiLayout_1  = createCategoricalFeature(); // 12 (hGc)
features.uiLayout_2  = createCategoricalFeature(); // 13 (jGc)
features.uiLayout_3  = createCategoricalFeature(); // 14 (kGc) -- root split feature
features.uiLayout_4  = createCategoricalFeature(); // 15 (iGc)
features.uiLayout_5  = createCategoricalFeature(); // 16 (lGc)
features.uiLayout_6  = createCategoricalFeature(); // 17 (mGc)
features.uiLayout_7  = createCategoricalFeature(); // 18 (nGc)
features.uiLayout_8  = createCategoricalFeature(); // 19 (oGc)
features.uiLayout_9  = createCategoricalFeature(); // 20 (pGc)
features.uiLayout_10 = createCategoricalFeature(); // 21 (qGc)
features.uiLayout_11 = createCategoricalFeature(); // 22 (rGc)
features.uiLayout_12 = createCategoricalFeature(); // 23 (sGc)
features.uiLayout_13 = createCategoricalFeature(); // 24 (tGc)
features.uiLayout_14 = createCategoricalFeature(); // 25 (uGc)
features.uiLayout_15 = createCategoricalFeature(); // 26 (vGc)

// ── 27-49: Region categorical flags ────────────────────────────────────
features.region_0  = createCategoricalFeature(); // 27 (ZSc)
features.region_1  = createCategoricalFeature(); // 28 ($Sc)
features.region_2  = createCategoricalFeature(); // 29 (aTc)
features.region_3  = createCategoricalFeature(); // 30 (bTc)
features.region_4  = createCategoricalFeature(); // 31 (cTc)
features.region_5  = createCategoricalFeature(); // 32 (dTc)
features.region_6  = createCategoricalFeature(); // 33 (eTc)
features.region_7  = createCategoricalFeature(); // 34 (fTc)
features.region_8  = createCategoricalFeature(); // 35 (gTc)
features.region_9  = createCategoricalFeature(); // 36 (hTc)
features.region_10 = createCategoricalFeature(); // 37 (iTc)
features.region_11 = createCategoricalFeature(); // 38 (jTc)
features.region_12 = createCategoricalFeature(); // 39 (kTc)
features.region_13 = createCategoricalFeature(); // 40 (lTc)
features.region_14 = createCategoricalFeature(); // 41 (mTc)
features.region_15 = createCategoricalFeature(); // 42 (nTc)
features.region_16 = createCategoricalFeature(); // 43 (oTc)
features.region_17 = createCategoricalFeature(); // 44 (pTc)
features.region_18 = createCategoricalFeature(); // 45 (qTc)
features.region_19 = createCategoricalFeature(); // 46 (rTc)
features.region_20 = createCategoricalFeature(); // 47 (sTc)
features.region_21 = createCategoricalFeature(); // 48 (tTc)
features.region_22 = createCategoricalFeature(); // 49 (uTc)

// ── 50-128: Grid mask cell categorical flags ───────────────────────────
// Each represents a spatial cell in the UI grid (79 cells from a 5x5 block
// partitioning of the 100-row x 75-col page, plus padding cells).
features.gridCell_0  = createCategoricalFeature(); // 50  (mjc)
features.gridCell_1  = createCategoricalFeature(); // 51  (njc)
features.gridCell_2  = createCategoricalFeature(); // 52  (ojc)
features.gridCell_3  = createCategoricalFeature(); // 53  (pjc)
features.gridCell_4  = createCategoricalFeature(); // 54  (qjc)
features.gridCell_5  = createCategoricalFeature(); // 55  (rjc)
features.gridCell_6  = createCategoricalFeature(); // 56  (sjc)
features.gridCell_7  = createCategoricalFeature(); // 57  (tjc)
features.gridCell_8  = createCategoricalFeature(); // 58  (ujc)
features.gridCell_9  = createCategoricalFeature(); // 59  (vjc)
features.gridCell_10 = createCategoricalFeature(); // 60  (wjc)
features.gridCell_11 = createCategoricalFeature(); // 61  (xjc)
features.gridCell_12 = createCategoricalFeature(); // 62  (yjc)
features.gridCell_13 = createCategoricalFeature(); // 63  (zjc)
features.gridCell_14 = createCategoricalFeature(); // 64  (internal_Ajc)
features.gridCell_15 = createCategoricalFeature(); // 65  (internal_Bjc)
features.gridCell_16 = createCategoricalFeature(); // 66  (internal_Cjc)
features.gridCell_17 = createCategoricalFeature(); // 67  (internal_Djc)
features.gridCell_18 = createCategoricalFeature(); // 68  (internal_Ejc)
features.gridCell_19 = createCategoricalFeature(); // 69  (internal_Fjc)
features.gridCell_20 = createCategoricalFeature(); // 70  (internal_Gjc)
features.gridCell_21 = createCategoricalFeature(); // 71  (internal_Hjc)
features.gridCell_22 = createCategoricalFeature(); // 72  (internal_Ijc)
features.gridCell_23 = createCategoricalFeature(); // 73  (internal_Jjc)
features.gridCell_24 = createCategoricalFeature(); // 74  (internal_Kjc)
features.gridCell_25 = createCategoricalFeature(); // 75  (internal_Ljc)
features.gridCell_26 = createCategoricalFeature(); // 76  (internal_Mjc)
features.gridCell_27 = createCategoricalFeature(); // 77  (internal_Njc)
features.gridCell_28 = createCategoricalFeature(); // 78  (internal_Ojc)
features.gridCell_29 = createCategoricalFeature(); // 79  (internal_Pjc)
features.gridCell_30 = createCategoricalFeature(); // 80  (internal_Qjc)
features.gridCell_31 = createCategoricalFeature(); // 81  (internal_Rjc)
features.gridCell_32 = createCategoricalFeature(); // 82  (internal_Sjc)
features.gridCell_33 = createCategoricalFeature(); // 83  (internal_Tjc)
features.gridCell_34 = createCategoricalFeature(); // 84  (internal_Ujc)
features.gridCell_35 = createCategoricalFeature(); // 85  (internal_Vjc)
features.gridCell_36 = createCategoricalFeature(); // 86  (internal_Wjc)
features.gridCell_37 = createCategoricalFeature(); // 87  (internal_Xjc)
features.gridCell_38 = createCategoricalFeature(); // 88  (internal_Yjc)
features.gridCell_39 = createCategoricalFeature(); // 89  (internal_Zjc)
features.gridCell_40 = createCategoricalFeature(); // 90  ($jc)
features.gridCell_41 = createCategoricalFeature(); // 91  (akc)
features.gridCell_42 = createCategoricalFeature(); // 92  (bkc)
features.gridCell_43 = createCategoricalFeature(); // 93  (ckc)
features.gridCell_44 = createCategoricalFeature(); // 94  (dkc)
features.gridCell_45 = createCategoricalFeature(); // 95  (ekc)
features.gridCell_46 = createCategoricalFeature(); // 96  (fkc)
features.gridCell_47 = createCategoricalFeature(); // 97  (gkc)
features.gridCell_48 = createCategoricalFeature(); // 98  (hkc)
features.gridCell_49 = createCategoricalFeature(); // 99  (ikc)
features.gridCell_50 = createCategoricalFeature(); // 100 (jkc)
features.gridCell_51 = createCategoricalFeature(); // 101 (kkc)
features.gridCell_52 = createCategoricalFeature(); // 102 (lkc)
features.gridCell_53 = createCategoricalFeature(); // 103 (mkc)
features.gridCell_54 = createCategoricalFeature(); // 104 (nkc)
features.gridCell_55 = createCategoricalFeature(); // 105 (okc)
features.gridCell_56 = createCategoricalFeature(); // 106 (pkc)
features.gridCell_57 = createCategoricalFeature(); // 107 (qkc)
features.gridCell_58 = createCategoricalFeature(); // 108 (rkc)
features.gridCell_59 = createCategoricalFeature(); // 109 (skc)
features.gridCell_60 = createCategoricalFeature(); // 110 (tkc)
features.gridCell_61 = createCategoricalFeature(); // 111 (ukc)
features.gridCell_62 = createCategoricalFeature(); // 112 (vkc)
features.gridCell_63 = createCategoricalFeature(); // 113 (wkc)
features.gridCell_64 = createCategoricalFeature(); // 114 (xkc)
features.gridCell_65 = createCategoricalFeature(); // 115 (ykc)
features.gridCell_66 = createCategoricalFeature(); // 116 (zkc)
features.gridCell_67 = createCategoricalFeature(); // 117 (internal_Akc)
features.gridCell_68 = createCategoricalFeature(); // 118 (internal_Bkc)
features.gridCell_69 = createCategoricalFeature(); // 119 (internal_Ckc)
features.gridCell_70 = createCategoricalFeature(); // 120 (internal_Dkc)
features.gridCell_71 = createCategoricalFeature(); // 121 (internal_Ekc)
features.gridCell_72 = createCategoricalFeature(); // 122 (internal_Fkc)
features.gridCell_73 = createCategoricalFeature(); // 123 (internal_Gkc)
features.gridCell_74 = createCategoricalFeature(); // 124 (internal_Hkc)
features.gridCell_75 = createCategoricalFeature(); // 125 (internal_Ikc)
features.gridCell_76 = createCategoricalFeature(); // 126 (internal_Jkc)
features.gridCell_77 = createCategoricalFeature(); // 127 (internal_Kkc)
features.gridCell_78 = createCategoricalFeature(); // 128 (internal_Lkc)

// ── 129-144: Row context list sizes (numeric) ──────────────────────────
features.watchAgainCount      = createRowContextFeature("watchAgain");       // 129
features.recentlyAddedCount   = createRowContextFeature("recentlyAdded");    // 130
features.similarsCount        = createRowContextFeature("similars");          // 131
features.queueCount           = createRowContextFeature("queue");             // 132
features.continueWatchingCount = createRowContextFeature("continueWatching"); // 133
features.genreCount           = createRowContextFeature("genre");             // 134
features.trendingNowCount     = createRowContextFeature("trendingNow");      // 135
features.topTenCount          = createRowContextFeature("topTen");           // 136
features.billboardCount       = createRowContextFeature("billboard");         // 137
features.newReleaseCount      = createRowContextFeature("newRelease");       // 138
features.ultraHDCount         = createRowContextFeature("ultraHD");          // 139
features.popularTitlesCount   = createRowContextFeature("popularTitles");    // 140
features.becauseYouAddedCount = createRowContextFeature("becauseYouAdded");  // 141
features.bigRowCount          = createRowContextFeature("bigRow");            // 142
features.becauseYouLikedCount = createRowContextFeature("becauseYouLiked");  // 143
features.netflixOriginalsCount = createRowContextFeature("netflixOriginals"); // 144

// ---------------------------------------------------------------------------
// Feature Index Mapping
// ---------------------------------------------------------------------------

/**
 * Maps internal feature property keys to their numeric indices in the feature
 * vector. These indices correspond to `featureIndex` values stored in tree
 * nodes. The keys here are the original obfuscated property names so that
 * callers that still reference the old API continue to work.
 *
 * @type {Record<string, string>}
 */
const featureMapping = {
    // ── Numeric session / scroll / page metrics (0-10) ──
    maxColIndex:      "0",   // TIc
    avgColIndex:      "1",   // $Ic
    maxRowIndex:      "2",   // SIc
    avgRowIndex:      "3",   // ZIc
    sessionDuration:  "4",   // gdc
    scrollUpCount:    "5",   // k0c
    scrollLeftCount:  "6",   // i0c
    scrollRightCount: "7",   // j0c
    scrollDownCount:  "8",   // h0c
    pageColumnCount:  "9",   // MQc
    pageRowCount:     "10",  // LQc

    // ── Categorical: UI layout flags (11-26) ──
    uiLayout_0:  "11",  uiLayout_1:  "12",  uiLayout_2:  "13",  uiLayout_3:  "14",
    uiLayout_4:  "15",  uiLayout_5:  "16",  uiLayout_6:  "17",  uiLayout_7:  "18",
    uiLayout_8:  "19",  uiLayout_9:  "20",  uiLayout_10: "21",  uiLayout_11: "22",
    uiLayout_12: "23",  uiLayout_13: "24",  uiLayout_14: "25",  uiLayout_15: "26",

    // ── Categorical: region flags (27-49) ──
    region_0:  "27",  region_1:  "28",  region_2:  "29",  region_3:  "30",
    region_4:  "31",  region_5:  "32",  region_6:  "33",  region_7:  "34",
    region_8:  "35",  region_9:  "36",  region_10: "37",  region_11: "38",
    region_12: "39",  region_13: "40",  region_14: "41",  region_15: "42",
    region_16: "43",  region_17: "44",  region_18: "45",  region_19: "46",
    region_20: "47",  region_21: "48",  region_22: "49",

    // ── Categorical: grid mask cells (50-128) ──
    gridCell_0:  "50",  gridCell_1:  "51",  gridCell_2:  "52",  gridCell_3:  "53",
    gridCell_4:  "54",  gridCell_5:  "55",  gridCell_6:  "56",  gridCell_7:  "57",
    gridCell_8:  "58",  gridCell_9:  "59",  gridCell_10: "60",  gridCell_11: "61",
    gridCell_12: "62",  gridCell_13: "63",  gridCell_14: "64",  gridCell_15: "65",
    gridCell_16: "66",  gridCell_17: "67",  gridCell_18: "68",  gridCell_19: "69",
    gridCell_20: "70",  gridCell_21: "71",  gridCell_22: "72",  gridCell_23: "73",
    gridCell_24: "74",  gridCell_25: "75",  gridCell_26: "76",  gridCell_27: "77",
    gridCell_28: "78",  gridCell_29: "79",  gridCell_30: "80",  gridCell_31: "81",
    gridCell_32: "82",  gridCell_33: "83",  gridCell_34: "84",  gridCell_35: "85",
    gridCell_36: "86",  gridCell_37: "87",  gridCell_38: "88",  gridCell_39: "89",
    gridCell_40: "90",  gridCell_41: "91",  gridCell_42: "92",  gridCell_43: "93",
    gridCell_44: "94",  gridCell_45: "95",  gridCell_46: "96",  gridCell_47: "97",
    gridCell_48: "98",  gridCell_49: "99",  gridCell_50: "100", gridCell_51: "101",
    gridCell_52: "102", gridCell_53: "103", gridCell_54: "104", gridCell_55: "105",
    gridCell_56: "106", gridCell_57: "107", gridCell_58: "108", gridCell_59: "109",
    gridCell_60: "110", gridCell_61: "111", gridCell_62: "112", gridCell_63: "113",
    gridCell_64: "114", gridCell_65: "115", gridCell_66: "116", gridCell_67: "117",
    gridCell_68: "118", gridCell_69: "119", gridCell_70: "120", gridCell_71: "121",
    gridCell_72: "122", gridCell_73: "123", gridCell_74: "124", gridCell_75: "125",
    gridCell_76: "126", gridCell_77: "127", gridCell_78: "128",

    // ── Numeric: row context list sizes (129-144) ──
    watchAgainCount:       "129",
    recentlyAddedCount:    "130",
    similarsCount:         "131",
    queueCount:            "132",
    continueWatchingCount: "133",
    genreCount:            "134",
    trendingNowCount:      "135",
    topTenCount:           "136",
    billboardCount:        "137",
    newReleaseCount:       "138",
    ultraHDCount:          "139",
    popularTitlesCount:    "140",
    becauseYouAddedCount:  "141",
    bigRowCount:           "142",
    becauseYouLikedCount:  "143",
    netflixOriginalsCount: "144",
};

// ---------------------------------------------------------------------------
// Grid Mask List Generation
// ---------------------------------------------------------------------------

/**
 * Generates the default grid mask parameter list by partitioning a
 * (pageRows x pageColumns) page into cells of size (rowStepSize x colStepSize).
 * Each unique cell gets one GridMaskParams entry.
 *
 * With the defaults (100 rows, 75 cols, step 20x15) this produces a 5x5 = 25
 * cell grid.
 *
 * @param {number} pageRows     - Total page rows (default 100)
 * @param {number} pageColumns  - Total page columns (default 75)
 * @param {number} rowStepSize  - Rows per block (default 20)
 * @param {number} colStepSize  - Columns per block (default 15)
 * @returns {GridMaskParams[]}
 */
function generateMaskParamsList(pageRows, pageColumns, rowStepSize, colStepSize) {
    const paramsList = [];
    /** @type {Record<string, number>} */
    const seen = {};

    for (let row = 0; row < pageRows; row++) {
        for (let col = 0; col < pageColumns; col++) {
            const rowBlock = Math.floor(row / rowStepSize);
            const colBlock = Math.floor(col / colStepSize);
            const cellKey = rowBlock + "_" + colBlock;
            if (!(cellKey in seen)) {
                seen[cellKey] = 1;
                paramsList.push(
                    new GridMaskParams("grid", 10, 5, 5, rowBlock, colBlock)
                );
            }
        }
    }

    return paramsList;
}

/** Pre-computed default grid mask list (25 cells for a 100x75 page). */
const defaultMaskParamsList = generateMaskParamsList(100, 75, 20, 15);

// ---------------------------------------------------------------------------
// Configuration Declaration
// ---------------------------------------------------------------------------

config.declare({
    /** Model selector identifier */
    Iea: ["modelSelector", "modelone"],

    /** Number of columns in the episode list view */
    colEpisodeList: ["colEpisodeList", 5],

    /** Duration (ms) before a hold interaction triggers prefetch */
    holdDuration: ["holdDuration", 15_000],

    /** Rows to prefetch on first load */
    rowFirst: ["rowFirst", 2],

    /** Columns to prefetch on first load */
    colFirst: ["colFirst", 5],

    /** Rows to prefetch on vertical scroll */
    rowScroll: ["rowScroll", 2],

    /** Columns to prefetch on vertical scroll */
    colScroll: ["colScroll", 6],

    /** Rows to prefetch on horizontal scroll */
    rowScrollHorizontal: ["rowScrollHorizontal", 6],

    /** Top rows for search results prefetch */
    searchTop: ["searchTop", 3],

    /** Continue-watching row prefetch count */
    cwFirst: ["cwFirst", 2],

    /** Items shown in focused horizontal mode */
    horizontalItemsFocusedMode: ["horizontalItemsFocusedMode", 3],

    /** Items per rank in the grid */
    itemsPerRank: ["itemsPerRank", 1],

    /** Max payload snapshots kept in memory */
    maxNumberPayloadsStored: ["maxNumberPayloadsStored", 10],

    /** Max titles scheduled for prefetch */
    maxNumberTitlesScheduled: ["maxNumberTitlesScheduled", 5],

    /** Whether detailed ABR logging is enabled */
    enableDetailedLogging: ["enableDetailedLogging", true],

    /** Row step size for grid partitioning */
    rowStep: ["rowStep", 20],

    /** Column step size for grid partitioning */
    colStep: ["colStep", 15],

    /** Total number of page rows in the browsing grid */
    pageRows: ["pageRows", 100],

    /** Total number of page columns in the browsing grid */
    pageColumns: ["pageColumns", 75],

    /** Pre-computed grid mask cell parameters */
    maskParamsList: ["maskParamsList", defaultMaskParamsList],

    /** The full tree node map (legacy key "W") */
    W: ["nodes", new DecisionTree().nodes],

    /** Feature-name-to-index mapping */
    mapping: ["mapping", featureMapping],

    /** All feature definitions */
    features: ["features", features],

    /** Model name identifier */
    _modelName: ["_modelName", "tree"],

    /** Model serialization format */
    _format: ["_format", "xgboost"],

    /** Number of top-ranked items to keep from predictions */
    _itemsToKeep: ["_itemsToKeep", 5],

    /** Score threshold for item inclusion (null = disabled) */
    _itemsThreshold: ["_itemsThreshold", null],

    /** Max entries in the prediction cache */
    cacheLimit: ["cacheLimit", 20],
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
    config,
    features,
    featureMapping,
    generateMaskParamsList,
    defaultMaskParamsList,
    createCategoricalFeature,
    createRowContextFeature,
};

export default {
    config,
    DecisionTreeNode,
    DecisionTree,
    GridMaskParams,
    features,
    featureMapping,
    VisibilityState,
    TriggerType,
    ContentType,
    ScrollDirection,
    RowContext,
    EngagementType,
};
