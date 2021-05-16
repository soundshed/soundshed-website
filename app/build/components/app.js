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
exports.DeviceViewModelContext = exports.AppViewModelContext = exports.lessonManager = exports.deviceViewModel = exports.appViewModel = void 0;
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
require("bootstrap/dist/css/bootstrap.min.css");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const ReactDOM = __importStar(require("react-dom"));
const react_player_1 = __importDefault(require("react-player"));
const react_router_dom_1 = require("react-router-dom");
require("../../css/styles.css");
const appViewModel_1 = __importDefault(require("../core/appViewModel"));
const deviceViewModel_1 = __importDefault(require("../core/deviceViewModel"));
const lessonManager_1 = require("../core/lessonManager");
const appstate_1 = require("../stores/appstate");
const devicestate_1 = require("../stores/devicestate");
const lessonstate_1 = require("../stores/lessonstate");
const uifeaturetoggles_1 = require("../stores/uifeaturetoggles");
const about_1 = __importDefault(require("./about"));
const device_main_1 = __importDefault(require("./device/device-main"));
const device_selector_1 = __importDefault(require("./device/device-selector"));
const home_1 = __importDefault(require("./home"));
const lessons_1 = __importDefault(require("./lessons"));
const amp_offline_1 = __importDefault(require("./soundshed/amp-offline"));
const edit_tone_1 = __importDefault(require("./soundshed/edit-tone"));
const login_1 = __importDefault(require("./soundshed/login"));
const tone_browser_1 = __importDefault(require("./tone-browser"));
exports.appViewModel = new appViewModel_1.default();
exports.deviceViewModel = new deviceViewModel_1.default();
exports.lessonManager = new lessonManager_1.LessonManager();
// export context providers for view models
exports.AppViewModelContext = React.createContext(exports.appViewModel);
exports.DeviceViewModelContext = React.createContext(exports.deviceViewModel);
const App = () => {
    // const history = useHistory();
    /* useEffect(() => {
       return history?.listen((location) => {
         console.log(`Navigated the page to: ${location.pathname}`);
         appViewModel.logPageView(location.pathname);
       });
     }, [history]);*/
    const isNativeMode = appstate_1.AppStateStore.useState((s) => s.isNativeMode);
    const isUserSignedIn = appstate_1.AppStateStore.useState((s) => s.isUserSignedIn);
    const signInRequired = appstate_1.AppStateStore.useState((s) => s.isSignInRequired);
    const userInfo = appstate_1.AppStateStore.useState((s) => s.userInfo);
    const isConnected = devicestate_1.DeviceStateStore.useState((s) => s.isConnected);
    const playingVideoUrl = lessonstate_1.LessonStateStore.useState((s) => s.playingVideoUrl);
    const [isVideoExpanded, setIsVideoExpanded] = React.useState(true);
    const requireSignIn = () => __awaiter(void 0, void 0, void 0, function* () {
        appstate_1.AppStateStore.update((s) => {
            s.isSignInRequired = true;
        });
    });
    const performSignIn = (login) => {
        return exports.appViewModel.performSignIn(login).then((loggedInOk) => {
            if (loggedInOk == true) {
                appstate_1.AppStateStore.update((s) => {
                    s.isSignInRequired = false;
                });
            }
            return loggedInOk;
        });
    };
    const performRegistration = (reg) => {
        return exports.appViewModel.performRegistration(reg).then((loggedInOk) => {
            if (loggedInOk == true) {
                appstate_1.AppStateStore.update((s) => {
                    s.isSignInRequired = false;
                });
            }
            return loggedInOk;
        });
    };
    const performSignOut = () => {
        exports.appViewModel.signOut();
    };
    // perform startup
    react_1.useEffect(() => {
        console.log("App startup..");
        const lastKnownDevices = []; // deviceViewModel.getLastKnownDevices();
        if (lastKnownDevices.length > 0) {
            devicestate_1.DeviceStateStore.update((s) => {
                s.devices = lastKnownDevices;
            });
        }
        exports.appViewModel.init();
        // load locally stored favourites
        exports.appViewModel.loadFavourites();
        // get latest tones from soundshed api
        //appViewModel.loadLatestTones();
        if (uifeaturetoggles_1.UIFeatureToggleStore.getRawState().enabledPGToneCloud) {
            //appViewModel.loadLatestToneCloudTones();
        }
        //lessonManager.loadFavourites();
        // mock amp connection and current preset
        /* DeviceStore.update(s=>{
          s.isConnected=true;
          s.presetTone=TonesStateStore.getRawState().storedPresets[0];
          s.connectedDevice= {name:"Mock Amp", address:"A1:B2:C3:D4:E5"};
        });*/
    }, []);
    return (React.createElement("main", null,
        React.createElement("ul", { className: "nav nav-tabs" },
            React.createElement("li", { className: "nav-item" },
                React.createElement(react_router_dom_1.NavLink, { to: "/", exact: true, className: "nav-link", activeClassName: "nav-link active" }, "Home")),
            React.createElement("li", { className: "nav-item" },
                React.createElement(react_router_dom_1.NavLink, { to: "/tones", className: "nav-link", activeClassName: "nav-link active" }, "Tones")),
            React.createElement("li", { className: "nav-item" },
                React.createElement(react_router_dom_1.NavLink, { to: "/device", className: "nav-link", activeClassName: "nav-link active" }, "Amp")),
            React.createElement("li", { className: "nav-item" },
                React.createElement(react_router_dom_1.NavLink, { to: "/lessons", className: "nav-link", activeClassName: "nav-link active" }, "Jam")),
            React.createElement("li", { className: "nav-item" },
                React.createElement(react_router_dom_1.NavLink, { to: "/about", className: "nav-link", activeClassName: "nav-link active" }, "About")),
            React.createElement("li", { className: "my-2" }, isUserSignedIn ? (React.createElement("span", { className: "badge rounded-pill bg-primary", onClick: performSignOut },
                " ",
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faUser }),
                " ", userInfo === null || userInfo === void 0 ? void 0 :
                userInfo.name)) : (React.createElement(react_bootstrap_1.Button, { className: "btn btn-sm", onClick: () => {
                    requireSignIn();
                } },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faUser }))))),
        React.createElement(login_1.default, { signInRequired: signInRequired, onSignIn: performSignIn, onRegistration: performRegistration }),
        playingVideoUrl != null ? (React.createElement("div", { className: "pip-video-control" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col" },
                    React.createElement("button", { title: "Close", className: "btn btn-sm btn-dark", onClick: () => {
                            lessonstate_1.LessonStateStore.update((s) => {
                                s.playingVideoUrl = null;
                            });
                        } },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faWindowMinimize }))),
                React.createElement("div", { className: "col offset-md-8" }, isVideoExpanded == true ? (React.createElement("button", { title: "Small Video", className: "btn btn-sm btn-dark", onClick: () => {
                        setIsVideoExpanded(false);
                    } },
                    " ",
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faWindowRestore }))) : (React.createElement("button", { title: "Large Video", className: "btn btn-sm btn-dark", onClick: () => {
                        setIsVideoExpanded(true);
                    } },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faWindowMaximize }))))),
            React.createElement("div", null,
                React.createElement(react_player_1.default, { controls: true, url: playingVideoUrl, width: isVideoExpanded ? "640px" : "320px", height: isVideoExpanded ? "360px" : "180px" })))) : (""),
        React.createElement(edit_tone_1.default, null),
        React.createElement(exports.AppViewModelContext.Provider, { value: exports.appViewModel },
            React.createElement(exports.DeviceViewModelContext.Provider, { value: exports.deviceViewModel },
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { path: "/", exact: true, component: home_1.default }),
                    React.createElement(react_router_dom_1.Route, { path: "/device" }, isNativeMode ? (isConnected ? (React.createElement(device_main_1.default, null)) : (React.createElement(device_selector_1.default, null))) : (React.createElement(amp_offline_1.default, null))),
                    React.createElement(react_router_dom_1.Route, { path: "/tones" },
                        React.createElement(tone_browser_1.default, null)),
                    React.createElement(react_router_dom_1.Route, { path: "/lessons" },
                        React.createElement(lessons_1.default, null)),
                    React.createElement(react_router_dom_1.Route, { path: "/about", exact: true, component: about_1.default }))))));
};
ReactDOM.render(React.createElement(react_router_dom_1.HashRouter, null,
    React.createElement(App, null)), document.getElementById("app"));
//# sourceMappingURL=app.js.map