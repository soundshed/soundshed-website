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
const fxMapping_1 = require("../../core/fxMapping");
const app_1 = require("../app");
const react_bootstrap_1 = require("react-bootstrap");
const tone_list_1 = __importDefault(require("../tone-list"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const tonestate_1 = require("../../stores/tonestate");
const devicestate_1 = require("../../stores/devicestate");
const TcBrowserControl = () => {
    const deviceViewModel = React.useContext(app_1.DeviceViewModelContext);
    const favourites = tonestate_1.TonesStateStore.useState((s) => s.storedPresets);
    const defaultPageIndex = 1;
    const [pageIndex, setPageIndex] = React.useState(defaultPageIndex);
    const [searchMode, setSearchMode] = React.useState("search");
    const [keyword, setKeyword] = React.useState("");
    const isSearchInProgress = tonestate_1.TonesStateStore.useState((s) => s.isSearchInProgress);
    const isDeviceConnected = devicestate_1.DeviceStateStore.useState((s) => s.isConnected);
    const tcResults = tonestate_1.TonesStateStore.useState((s) => s.toneCloudResults);
    react_1.useEffect(() => { }, [favourites]);
    const onRefresh = (pageIdx) => {
        let query = { page: pageIdx !== null && pageIdx !== void 0 ? pageIdx : pageIndex, keyword: keyword };
        app_1.appViewModel.loadLatestToneCloudTones(false, query);
    };
    const onSearch = () => {
        setSearchMode("search");
        setPageIndex(defaultPageIndex);
        onRefresh(defaultPageIndex);
    };
    const onKeySearch = (event) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };
    const next = () => {
        let idx = pageIndex + 1;
        setPageIndex(idx);
        if (searchMode == "search") {
            onRefresh(idx);
        }
        else if (searchMode == "user") {
            createdBy();
        }
    };
    const previous = () => {
        if (pageIndex == defaultPageIndex)
            return;
        let idx = pageIndex - 1;
        setPageIndex(idx);
        if (searchMode == "search") {
            onRefresh(idx);
        }
        else if (searchMode == "user") {
            createdBy();
        }
    };
    const createdBy = (userId = "4fa1ffb3727a300001000000") => {
        let idx = pageIndex;
        if (searchMode == "search") {
            // new user search, start at page 1
            idx = defaultPageIndex;
            setPageIndex(idx);
            setSearchMode("user");
        }
        app_1.appViewModel.loadToneCloudTonesByUser(userId, idx);
    };
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
    return (React.createElement("div", { className: "m2" },
        React.createElement(react_bootstrap_1.Form, null,
            React.createElement(react_bootstrap_1.Form.Group, { controlId: "formSearch" },
                React.createElement(react_bootstrap_1.Form.Label, null, "Keyword"),
                React.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Search by keyword", value: keyword, onChange: (event) => {
                        setKeyword(event.target.value);
                    }, onKeyPress: onKeySearch }))),
        React.createElement("button", { className: "btn btn-sm btn-success", onClick: onSearch }, "Search"),
        React.createElement("button", { className: "btn btn-sm btn-primary ms-2", onClick: previous },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faChevronLeft })),
        " ",
        React.createElement("button", { className: "btn btn-sm btn-primary", onClick: next },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faChevronRight })),
        isSearchInProgress ? (React.createElement("span", { className: "spinner-border spinner-border-sm ms-2", role: "status", "aria-hidden": "true" })) : (""),
        React.createElement("button", { className: "btn btn-sm btn-secondary float-end", onClick: () => {
                createdBy();
            } },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faSearch }),
            " PG Tones"),
        React.createElement(tone_list_1.default, { toneList: tcResults, favourites: favourites, onApplyTone: onApplyTone, onEditTone: () => { }, noneMsg: "No PG ToneCloud Results", enableToneEditor: false }),
        React.createElement("button", { className: "btn btn-sm btn-primary ms-2", onClick: previous },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faChevronLeft })),
        " ",
        React.createElement("button", { className: "btn btn-sm btn-primary", onClick: next },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faChevronRight }))));
};
exports.default = TcBrowserControl;
//# sourceMappingURL=tc-browser.js.map