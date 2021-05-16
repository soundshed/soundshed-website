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
const MiscControls = ({ deviceScanInProgress, connected, onConnect, connectionInProgress, requestCurrentPreset, setChannel, onScanForDevices, devices, selectedChannel, onSetPreset, }) => {
    const enableStorePreset = false;
    React.useEffect(() => {
        // watch for changes
    }, [
        deviceScanInProgress,
        connected,
        connectionInProgress,
        devices,
        selectedChannel,
    ]);
    return (React.createElement("div", { className: "container " },
        React.createElement("div", { className: "row control-strip" },
            React.createElement("div", { className: "col-md-2" },
                React.createElement("button", { type: "button", className: "btn btn-sm btn-secondary", onClick: () => requestCurrentPreset(true) }, "Refresh")),
            enableStorePreset ? (React.createElement("div", { className: "col-md-2" },
                React.createElement("button", { type: "button", className: "btn btn-sm btn-secondary", id: "storePreset" }, "Store Preset"))) : (""),
            React.createElement("div", { className: "col-md-4" },
                React.createElement("label", null, "Channel "),
                React.createElement("div", { className: "btn-group ms-2", role: "group", "aria-label": "Channel Selection" },
                    React.createElement("button", { type: "button", className: selectedChannel == 0
                            ? "btn btn-sm btn-secondary active"
                            : "btn btn-sm btn-secondary", id: "ch1", onClick: () => {
                            setChannel(0);
                        } }, "1"),
                    React.createElement("button", { type: "button", className: selectedChannel == 1
                            ? "btn btn-sm btn-secondary active"
                            : "btn btn-sm btn-secondary", id: "ch2", onClick: () => {
                            setChannel(1);
                        } }, "2"),
                    React.createElement("button", { type: "button", className: selectedChannel == 2
                            ? "btn btn-sm btn-secondary active"
                            : "btn btn-sm btn-secondary", id: "ch3", onClick: () => {
                            setChannel(2);
                        } }, "3"),
                    React.createElement("button", { type: "button", className: selectedChannel == 3
                            ? "btn btn-sm btn-secondary active"
                            : "btn btn-sm btn-secondary", id: "ch4", onClick: () => {
                            setChannel(3);
                        } }, "4"))))));
};
exports.default = MiscControls;
//# sourceMappingURL=misc-controls.js.map