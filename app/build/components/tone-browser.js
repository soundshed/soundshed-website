"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const fxMapping_1 = require("../core/fxMapping");
const app_1 = require("./app");
const react_bootstrap_1 = require("react-bootstrap");
const tc_browser_1 = __importDefault(require("./external/tc-browser"));
const tone_list_1 = __importDefault(require("./tone-list"));
const utils_1 = require("../core/utils");
const uifeaturetoggles_1 = require("../stores/uifeaturetoggles");
const devicestate_1 = require("../stores/devicestate");
const tonestate_1 = require("../stores/tonestate");
const ToneBrowserControl = () => {
    const deviceViewModel = React.useContext(app_1.DeviceViewModelContext);
    const [viewSelection, setViewSelection] = React.useState("my");
    const enableMyTones = uifeaturetoggles_1.UIFeatureToggleStore.useState((s) => s.enableMyTones);
    const enableCommunityTones = uifeaturetoggles_1.UIFeatureToggleStore.useState((s) => s.enableCommunityTones);
    const enableToneCloud = uifeaturetoggles_1.UIFeatureToggleStore.useState((s) => s.enabledPGToneCloud);
    const enableToneEditor = uifeaturetoggles_1.UIFeatureToggleStore.useState((s) => s.enableToneEditor);
    const isDeviceConnected = devicestate_1.DeviceStateStore.useState((s) => s.isConnected);
    const favourites = tonestate_1.TonesStateStore.useState((s) => s.storedPresets);
    const tones = tonestate_1.TonesStateStore.useState((s) => s.toneResults);
    const tonecloud = tonestate_1.TonesStateStore.useState((s) => s.toneCloudResults);
    const onApplyTone = (tone) => __awaiter(void 0, void 0, void 0, function* () {
        let t = Object.assign({}, tone);
        /*if (!isDeviceConnected) {
          alert("The device is not yet connected, see the Amp tab");
          return;
        }
    */
        if (t.schemaVersion == "pg.preset.summary" && t.fx == null) {
            //need to fetch the preset details
            let result = yield app_1.appViewModel.loadToneCloudPreset(t.toneId.replace("pg.tc.", ""));
            if (result != null) {
                //convert xml to json
                let presetData = JSON.parse(result.preset_data);
                let toneData = new fxMapping_1.FxMappingSparkToTone().mapFrom(presetData);
                Object.assign(t, toneData);
                t.imageUrl = result.thumb_url;
            }
            else {
                // can't load this tone
                return;
            }
        }
        let p = new fxMapping_1.FxMappingToneToSpark().mapFrom(t);
        deviceViewModel.requestPresetChange(p);
    });
    const onEditTone = (t) => {
        if (enableToneEditor) {
            tonestate_1.ToneEditStore.update((s) => {
                s.editTone = utils_1.Utils.deepClone(t);
                s.isToneEditorOpen = true;
            });
        }
    };
    react_1.useEffect(() => { }, [tones, favourites, tonecloud]);
    const renderTonesView = () => {
        switch (viewSelection) {
            case "my":
                return (React.createElement("div", { className: "m-2" },
                    React.createElement(tone_list_1.default, { toneList: favourites, favourites: favourites, onApplyTone: onApplyTone, onEditTone: onEditTone, noneMsg: "No favourite tones saved yet.", enableToneEditor: enableToneEditor })));
            case "community":
                return (React.createElement("div", { className: "m-2" },
                    React.createElement("p", null, "Tones shared by the Soundshed Community:"),
                    React.createElement(tone_list_1.default, { toneList: tones, favourites: favourites, onApplyTone: onApplyTone, onEditTone: () => { }, noneMsg: "No community tones available.", enableToneEditor: false })));
            case "tonecloud":
                return (React.createElement("div", { className: "m-2" },
                    React.createElement("p", null, "Tones from the PG Tone Cloud:"),
                    React.createElement(tc_browser_1.default, null)));
        }
    };
    return (React.createElement("div", { className: "tones-intro" },
        React.createElement("h1", null, "Tones"),
        React.createElement("p", null, "Browse and manage favourite tones."),
        React.createElement("div", { className: "info" },
            React.createElement(react_bootstrap_1.Nav, { variant: "tabs", activeKey: viewSelection, onSelect: (selectedKey) => setViewSelection(selectedKey) },
                enableMyTones ? (React.createElement(react_bootstrap_1.Nav.Item, null,
                    React.createElement(react_bootstrap_1.Nav.Link, { eventKey: "my" }, "My Tones"))) : (""),
                enableCommunityTones ? (React.createElement(react_bootstrap_1.Nav.Item, null,
                    React.createElement(react_bootstrap_1.Nav.Link, { eventKey: "community" }, "Community"))) : (""),
                enableToneCloud ? (React.createElement(react_bootstrap_1.Nav.Item, null,
                    React.createElement(react_bootstrap_1.Nav.Link, { eventKey: "tonecloud" }, "ToneCloud"))) : ("")),
            renderTonesView())));
};
exports.default = ToneBrowserControl;
//# sourceMappingURL=tone-browser.js.map