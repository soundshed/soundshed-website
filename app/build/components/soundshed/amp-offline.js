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
const AmpOfflineControl = () => {
    return (React.createElement("div", { className: "amp-intro" },
        React.createElement("h2", null, "Control your Amp"),
        React.createElement("p", null, "Use the desktop version of the soundshed app to manage tones and control your compatible bluetooth amps."),
        React.createElement("p", null, "Supported Amps:"),
        React.createElement("ul", null,
            React.createElement("li", null, "Positive Grid Spark 40"))));
};
exports.default = AmpOfflineControl;
//# sourceMappingURL=amp-offline.js.map