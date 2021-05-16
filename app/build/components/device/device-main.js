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
const devicestate_1 = require("../../stores/devicestate");
const app_1 = require("../app");
const device_controls_1 = __importDefault(require("./device-controls"));
const misc_controls_1 = __importDefault(require("./misc-controls"));
const signal_path_1 = __importDefault(require("./signal-path"));
const DeviceMainControl = () => {
    const appViewModel = React.useContext(app_1.AppViewModelContext);
    const deviceViewModel = app_1.deviceViewModel;
    const onViewModelStateChange = () => {
        //setDevices(deviceViewModel.devices);
    };
    const connectionInProgress = devicestate_1.DeviceStateStore.useState((s) => s.isConnectionInProgress);
    const connected = devicestate_1.DeviceStateStore.useState((s) => s.isConnected);
    const devices = devicestate_1.DeviceStateStore.useState((s) => s.devices);
    const connectedDevice = devicestate_1.DeviceStateStore.useState((s) => s.connectedDevice);
    const selectedChannel = devicestate_1.DeviceStateStore.useState((s) => s.selectedChannel);
    const currentPreset = devicestate_1.DeviceStateStore.useState((s) => s.presetTone);
    const deviceScanInProgress = devicestate_1.DeviceStateStore.useState((s) => s.isDeviceScanInProgress);
    const requestScanForDevices = () => {
        deviceViewModel.scanForDevices();
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
            return deviceViewModel.connectDevice(targetDeviceInfo).then((ok) => {
                setTimeout(() => {
                    if (connected == true) {
                        console.log("Connected, refreshing preset..");
                        requestCurrentPreset();
                    }
                }, 1000);
            });
        }
        else {
            console.log("Target device not found..");
        }
    };
    const requestCurrentPreset = (reconnect = false) => __awaiter(void 0, void 0, void 0, function* () {
        if (reconnect) {
            //
            console.log("Reconnecting..");
            yield deviceViewModel.connectDevice(connectedDevice);
        }
        deviceViewModel.requestCurrentChannelSelection().then(() => {
            console.log("Got update channel selection info");
        });
        deviceViewModel.requestPresetConfig().then((ok) => {
            setTimeout(() => {
                console.log("updating preset config in UI " +
                    JSON.stringify(devicestate_1.DeviceStateStore.getRawState().presetTone));
            }, 500);
        });
    });
    const requestSetChannel = (channelNum) => {
        deviceViewModel.setChannel(channelNum);
    };
    const requestStoreFavourite = (includeUpload = false) => {
        //save current preset
        appViewModel.storeFavourite(currentPreset, includeUpload);
    };
    const requestStoreHardwarePreset = () => {
        console.log("Would apply current preset to hardware channel");
    };
    const fxParamChange = (args) => {
        deviceViewModel.requestFxParamChange(args).then(() => { });
    };
    const fxToggle = (args) => {
        deviceViewModel.requestFxToggle(args).then(() => { });
    };
    // configure which state changes should cause component updates
    react_1.useEffect(() => { }, [
        connectionInProgress,
        connected,
        deviceScanInProgress,
        selectedChannel,
    ]);
    react_1.useEffect(() => {
        console.log("Device main - component created");
        if (deviceViewModel) {
            deviceViewModel.addStateChangeListener(onViewModelStateChange);
            // init state
            onViewModelStateChange();
        }
        if (!connected) {
            const lastConnectedDevice = deviceViewModel.getLastConnectedDevice();
            if (lastConnectedDevice) {
                console.log("Re-connecting last known device [" + lastConnectedDevice.name + "]");
                requestConnectDevice(lastConnectedDevice.address);
            }
        }
        return () => {
            if (deviceViewModel) {
                deviceViewModel.removeStateChangeListener();
            }
        };
    }, []);
    return (React.createElement("div", { className: "amp-intro" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement(device_controls_1.default, null))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement(misc_controls_1.default, { deviceScanInProgress: deviceScanInProgress, onScanForDevices: requestScanForDevices, connected: connected, onConnect: requestConnectDevice, connectionInProgress: connectionInProgress, requestCurrentPreset: requestCurrentPreset, setChannel: requestSetChannel, devices: devices, selectedChannel: selectedChannel, onSetPreset: requestStoreHardwarePreset }))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement(signal_path_1.default, { signalPathState: currentPreset, onFxParamChange: fxParamChange, onFxToggle: fxToggle, selectedChannel: selectedChannel, onStoreFavourite: requestStoreFavourite })))));
};
exports.default = DeviceMainControl;
//# sourceMappingURL=device-main.js.map