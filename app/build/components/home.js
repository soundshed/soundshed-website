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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const HomeControl = () => {
    return (React.createElement("div", { className: "home-intro" },
        React.createElement("h1", null, "Soundshed"),
        React.createElement("p", { className: "info" }, "Browse and manage favourite tones, preview or store on your amp, share tones with the community. Jam to backing tracks and browse video lessons."),
        React.createElement(react_router_dom_1.NavLink, { to: "/tones", exact: true },
            React.createElement("section", { className: "nav-section tones" },
                React.createElement("div", { className: "section-container" },
                    React.createElement("h2", null, "Tones \u25B6"),
                    React.createElement("p", null, "Browse community tones, manage your favourites.")))),
        React.createElement(react_router_dom_1.NavLink, { to: "/device", exact: true },
            React.createElement("section", { className: "nav-section amp" },
                React.createElement("div", { className: "section-container" },
                    React.createElement("h2", null, "Control Your Amp \u25B6"),
                    React.createElement("p", null, "Control and modify amp settings")))),
        React.createElement(react_router_dom_1.NavLink, { to: "/lessons", exact: true },
            React.createElement("section", { className: "nav-section jam" },
                React.createElement("div", { className: "section-container" },
                    React.createElement("h2", null, "Jam \u25B6"),
                    React.createElement("p", null, "Browse backing tracks and video lessons "))))));
};
exports.default = HomeControl;
//# sourceMappingURL=home.js.map