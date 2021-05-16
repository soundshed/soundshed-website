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
const FxParam = ({ type = "knob", p, fx, onFxParamChange }) => {
    var _a, _b;
    let customElement;
    const setParamValue = (e) => {
        console.log(`setParamValue: Changed param ${e.target.value} ${JSON.stringify(e.target.tag)} ${fx.name} ${fx.type}`);
        onFxParamChange({
            dspId: fx.type,
            index: e.target.tag.paramId,
            value: e.target.value,
            type: type,
        });
    };
    React.useEffect(() => {
        //customElement?.addEventListener("input", setParamValue);
        customElement === null || customElement === void 0 ? void 0 : customElement.addEventListener("change", setParamValue);
        return () => {
            // customElement?.removeEventListener("input", setParamValue);
            customElement === null || customElement === void 0 ? void 0 : customElement.removeEventListener("change", setParamValue);
        };
    }, []);
    React.useEffect(() => {
        var _a;
        var newVal = (_a = p.value) !== null && _a !== void 0 ? _a : null;
        if (newVal != null) {
            newVal = newVal.toFixed(2);
        }
        if (customElement.value != newVal && newVal != null) {
            // an external input has changed a control value
            console.log("Control Strip UI updated. " + customElement.value + " :: " + newVal);
            customElement === null || customElement === void 0 ? void 0 : customElement.setValue(newVal);
        }
    }, [fx, p]);
    return (React.createElement("div", { key: (_b = (_a = p.paramId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : p.toString() }, type == "knob" ? (React.createElement("div", null,
        React.createElement("webaudio-knob", { ref: (elem) => {
                customElement = elem;
                if (customElement)
                    customElement.tag = p;
            }, src: "./lib/webaudio-controls/knobs/LittlePhatty.png", min: "0", value: p.value, max: "1", step: "0.01", diameter: "64", tooltip: p.name + " %s" }),
        React.createElement("label", null, p.name))) : (React.createElement("div", null,
        React.createElement("webaudio-switch", { ref: (elem) => {
                customElement = elem;
                if (customElement)
                    customElement.tag = p;
            }, src: "./lib/webaudio-controls/knobs/switch_toggle.png", value: fx.enabled == true ? "1" : "0" })))));
};
exports.default = FxParam;
//# sourceMappingURL=fx-param.js.map