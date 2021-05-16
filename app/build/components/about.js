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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const app_1 = require("./app");
const react_bootstrap_1 = require("react-bootstrap");
const appstate_1 = require("../stores/appstate");
const platformUtils_1 = require("../core/platformUtils");
const AboutControl = () => {
    React.useEffect(() => {
        app_1.appViewModel.refreshAppInfo();
        checkForUpdates();
    }, []);
    const appInfo = appstate_1.AppStateStore.useState((s) => s.appInfo);
    const appUpdateAvailable = appstate_1.AppStateStore.useState((s) => s.isUpdateAvailable);
    React.useEffect(() => { }, [appUpdateAvailable, appInfo]);
    const checkForUpdates = (showInfo = false) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield app_1.appViewModel.checkForUpdates();
        if (showInfo) {
            if (result == null || result.isUpdateAvailable == false) {
                alert("You are using the latest available app version. You should also regularly check soundshed.com for updates and news.");
            }
            else {
                alert("There is a new app version available.");
            }
        }
    });
    return (React.createElement("div", { className: "about-intro" },
        React.createElement("h1", null, "About"),
        React.createElement("p", null,
            React.createElement("a", { href: "#", onClick: (e) => {
                    platformUtils_1.openLink(e, "https://soundshed.com");
                } }, "soundshed.com")),
        React.createElement("p", null, "Browse and manage favourite tones, preview or store on your amp."),
        React.createElement("p", null,
            "Join the",
            " ",
            React.createElement("a", { href: "#", onClick: (e) => {
                    platformUtils_1.openLink(e, "https://github.com/soundshed/soundshed-app/discussions");
                } }, "community discussions")),
        appUpdateAvailable == true ? (React.createElement("p", { className: "alter alert-info m-2 p-2" },
            "There is a new app version available. Updating is recommended.",
            React.createElement(react_bootstrap_1.Button, { className: "btn btn-sm ms-2", onClick: (e) => {
                    platformUtils_1.openLink(e, "https://soundshed.com");
                } }, "Download Update"))) : (React.createElement("p", null,
            React.createElement("span", { className: "badge rounded-pill bg-secondary" }, appInfo === null || appInfo === void 0 ? void 0 :
                appInfo.name,
                " ", appInfo === null || appInfo === void 0 ? void 0 :
                appInfo.version),
            React.createElement(react_bootstrap_1.Button, { className: "btn btn-sm ms-2", onClick: () => { checkForUpdates(true); } }, "Check For Updates"))),
        React.createElement("h3", null, "Credits"),
        React.createElement("p", null, "Spark communications code based on https://github.com/paulhamsh/Spark-Parser"),
        React.createElement("p", null, "Some preset information adapted from https://github.com/richtamblyn/PGSparkLite"),
        React.createElement("p", null, "Burning Guitar Photo by Dark Rider on Unsplash"),
        React.createElement("p", null, "Pedal Board + Red Shoe Photo by Jarrod Reed on Unsplash"),
        React.createElement("p", null, "Wooden Pedal Board Photo by Luana Azevedo on Unsplash"),
        React.createElement("p", null, "Soundshed app by Christopher Cook")));
};
exports.default = AboutControl;
//# sourceMappingURL=about.js.map