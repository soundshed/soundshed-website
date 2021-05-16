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
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const devicestate_1 = require("../../stores/devicestate");
const app_1 = require("../app");
const DeviceSelectorControl = () => {
    const connectionInProgress = devicestate_1.DeviceStateStore.useState((s) => s.isConnectionInProgress);
    const connected = devicestate_1.DeviceStateStore.useState((s) => s.isConnected);
    const devices = devicestate_1.DeviceStateStore.useState((s) => s.devices);
    const connectedDevice = devicestate_1.DeviceStateStore.useState((s) => s.connectedDevice);
    const attemptedDevice = devicestate_1.DeviceStateStore.useState((s) => s.lastAttemptedDevice);
    const deviceScanInProgress = devicestate_1.DeviceStateStore.useState((s) => s.isDeviceScanInProgress);
    const requestScanForDevices = () => {
        app_1.deviceViewModel.scanForDevices();
    };
    const requestConnectDevice = (targetDeviceAddress = null) => {
        if (devices == null || (devices === null || devices === void 0 ? void 0 : devices.length) == 0) {
            // nothing to connect to
            return;
        }
        // if connect to target device or first known device.
        let targetDeviceInfo = null;
        if (targetDeviceAddress != null) {
            targetDeviceInfo = devices.find((d) => d.address == targetDeviceAddress);
        }
        else {
            targetDeviceInfo = devices[0];
        }
        if (targetDeviceInfo != null) {
            console.log("Connecting device..");
            return app_1.deviceViewModel.connectDevice(targetDeviceInfo).then((ok) => {
                setTimeout(() => {
                    if (connected == true) {
                        console.log("Connected, refreshing preset..");
                    }
                }, 1000);
            });
        }
        else {
            console.log("Target device not found..");
        }
    };
    react_1.useEffect(() => { }, [
        connectionInProgress,
        connected,
        deviceScanInProgress,
        attemptedDevice,
    ]);
    react_1.useEffect(() => {
        if (!connected) {
            const lastConnectedDevice = app_1.deviceViewModel.getLastConnectedDevice();
            if (lastConnectedDevice) {
                console.log("Re-connecting last known device [" + lastConnectedDevice.name + "]");
                requestConnectDevice(lastConnectedDevice.address);
            }
        }
    }, []);
    const listItems = (l) => {
        let list = l.map((i) => attemptedDevice != null && attemptedDevice.address == i.address
            ? attemptedDevice
            : i);
        if (!list || (list === null || list === void 0 ? void 0 : list.length) == 0) {
            return React.createElement("div", null, "No devices found. Scan to check for devices.");
        }
        else {
            return list.map((d) => (React.createElement("div", { key: d.address.toString(), className: "row m-2" },
                React.createElement("div", { className: "col-md-6" },
                    React.createElement("span", { className: "badge rounded-pill bg-secondary" }, d.name),
                    " (",
                    d.address,
                    ")",
                    d.connectionFailed == true ? (React.createElement("p", { className: "text-warning" }, "Connection failed. Check device is on and paired with this computer.")) : ("")),
                React.createElement("div", { className: "col-md-2" }, d.description),
                React.createElement("div", { className: "col-md-2" },
                    React.createElement(react_bootstrap_1.Button, { className: "btn btn-sm", onClick: () => {
                            requestConnectDevice(d.address);
                        } }, "Connect")))));
        }
    };
    return (React.createElement("div", { className: "amp-intro" },
        React.createElement("h4", null, "Connect Your Amp"),
        React.createElement("p", null, "To get started, switch on your amp and select Scan to find your device. You should ensure that the amp is not already connected to a different device as the amp can only connect to one device at a time."),
        deviceScanInProgress ? (React.createElement("div", null,
            React.createElement("span", { className: "spinner-border spinner-border-sm", role: "status", "aria-hidden": "true" }),
            " ",
            "Searching for devices..")) : (React.createElement("button", { type: "button", className: "btn btn-sm btn-primary", onClick: requestScanForDevices }, "Scan")),
        React.createElement("p", null, "When found, click connect to complete:"),
        React.createElement("div", { className: "m-2" },
            React.createElement("h4", null, "Devices"),
            React.createElement("div", null, listItems(devices)))));
};
exports.default = DeviceSelectorControl;
//# sourceMappingURL=device-selector.js.map