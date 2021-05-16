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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const fx_control_1 = __importDefault(require("./fx-control"));
const SignalPathControl = ({ signalPathState, onFxParamChange, onFxToggle, selectedChannel, onStoreFavourite, }) => {
    React.useEffect(() => {
        console.log("Signal Path UI updated.");
    }, [signalPathState, selectedChannel]);
    const listItems = (t) => {
        if (!t) {
            return React.createElement("div", null, "Not Connected");
        }
        else {
            return t.fx.map((fx) => (React.createElement("td", { key: fx.type.toString() },
                React.createElement(fx_control_1.default, { fx: fx, onFxParamChange: onFxParamChange, onFxToggle: onFxToggle }))));
        }
    };
    return (React.createElement("div", null, !signalPathState ||
        !signalPathState.fx ||
        signalPathState.fx.length == 0 ? (React.createElement("div", { className: "container" },
        React.createElement("label", null,
            "No preset selected (or amp not connected). Connect and refresh to get current amp settings. You may need to select a preset button on the amp to start.",
            JSON.stringify(signalPathState)))) : (React.createElement("div", { className: "container" },
        React.createElement("h6", null, "Tone Signal Chain"),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-md-8" },
                React.createElement("h4", { className: "preset-name" }, signalPathState.name)),
            React.createElement("div", { className: "col-md-2" },
                React.createElement("button", { className: "btn btn-sm btn-primary", onClick: () => {
                        onStoreFavourite(false);
                    } }, "\u2B50")),
            React.createElement("div", { className: "col-md-2" },
                React.createElement("button", { className: "btn btn-sm btn-primary", onClick: () => {
                        onStoreFavourite(true);
                    } }, "\uD83D\uDD17 Share"))),
        React.createElement("table", null,
            React.createElement("tr", null, listItems(signalPathState)))))));
};
exports.default = SignalPathControl;
//# sourceMappingURL=signal-path.js.map