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
const DeviceControls = () => {
    const showMainControls = false;
    return (React.createElement("div", null,
        React.createElement("div", null,
            React.createElement("div", { className: "container" },
                React.createElement("h6", null,
                    "Device Controls",
                    " ",
                    React.createElement("span", { className: "badge rounded-pill bg-secondary" }, "Spark 40")),
                showMainControls ? (React.createElement("div", { className: "row control-strip" },
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-gain", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Gain")),
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-bass", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Bass")),
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-mid", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Mid")),
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-treble", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Treble")),
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-master", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Master")),
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-mod", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Modulation")),
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-delay", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Delay")),
                    React.createElement("div", { className: "col-sm" },
                        React.createElement("webaudio-knob", { id: "knob-reverb", src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", max: "100" }),
                        React.createElement("label", { className: "control-label" }, "Reverb")))) : ("")))));
};
exports.default = DeviceControls;
//# sourceMappingURL=device-controls.js.map