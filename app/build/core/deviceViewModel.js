"use strict";
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
exports.DeviceViewModel = void 0;
const fxMapping_1 = require("./fxMapping");
const sparkFxCatalog_1 = require("../spork/src/devices/spark/sparkFxCatalog");
const utils_1 = require("./utils");
const devicestate_1 = require("../stores/devicestate");
const platformUtils_1 = require("./platformUtils");
const deviceContext_1 = require("./deviceContext");
const bleProvider_1 = require("../spork/src/devices/spark/bleProvider");
// web mode
const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
        const boundFunc = func.bind(this, ...args);
        clearTimeout(timerId);
        timerId = setTimeout(boundFunc, delay);
    };
};
class DeviceViewModel {
    constructor() {
        this.statusMessage = "";
        this.lastCommandType = "";
        this.deviceContext = new deviceContext_1.DeviceContext();
        this.onStateChangeHandler = this.defaultStateChangeHandler;
        this.setupEventListeners();
        devicestate_1.DeviceStateStore.update(s => { s.fxCatalog = this.getFxCatalog(); });
        this.deviceContext.init(new bleProvider_1.BleProvider(), (type, msg) => { this.hardwareEventReceiver(type, msg); });
    }
    defaultStateChangeHandler() {
        this.log("UI Device state change handler called but not set.");
    }
    hardwareEventReceiver(type, msg) {
        this.log("Device VM event received: " + type);
        platformUtils_1.platformEvents.invoke(type, msg);
        //this.deviceContext.performAction({ action: type, args: msg });
    }
    addStateChangeListener(onViewModelStateChange) {
        this.onStateChangeHandler = onViewModelStateChange;
    }
    removeStateChangeListener() {
        this.onStateChangeHandler = this.defaultStateChangeHandler;
    }
    setupEventListeners() {
        // setup event listeners for main electron app events (native bluetooth data state, device state responses, device list etc)
        platformUtils_1.platformEvents.on("perform-action", (event, args) => {
            // ... do hardware actions on behalf of the Renderer
            this.deviceContext.performAction(args);
        });
        platformUtils_1.platformEvents.on('device-state-changed', (event, args) => {
            this.log("got device state update from main.");
            // change to preset config update, ignore if is in response to fx change/toggle etc
            if (args.presetConfig && !this.lastCommandType.startsWith("requestFx")) {
                // got a preset, convert to Tone object model as required, 
                let t = args.presetConfig;
                if (args.presetConfig.meta) {
                    t = new fxMapping_1.FxMappingSparkToTone().mapFrom(args.presetConfig);
                }
                devicestate_1.DeviceStateStore.update(s => { s.presetTone = t; });
            }
            if (args.lastMessageReceived) {
                if (args.lastMessageReceived.presetNumber != null) {
                    if (devicestate_1.DeviceStateStore.getRawState().selectedChannel != args.lastMessageReceived.presetNumber) {
                        devicestate_1.DeviceStateStore.update(s => { s.selectedChannel = args.lastMessageReceived.presetNumber; });
                        // preset number has changed, refresh the details
                        this.requestPresetConfig();
                    }
                }
                else {
                    if (args.lastMessageReceived.dspId != null) {
                        //fx param change received from amp
                        // TODO: debounce this?
                        // find param to change and set it in our model before sending to amp
                        let presetState = utils_1.Utils.deepClone(devicestate_1.DeviceStateStore.getRawState().presetTone);
                        var fx = presetState.fx.find(f => f.type == this.expandedDspId(args.lastMessageReceived.dspId));
                        if (!fx) {
                            this.log("Updating device state for UI: " + args.lastMessageReceived.dspId + " not found in current preset state");
                            // we didn't know the preset had this fx selected,attempt to use default params from fx catalog
                            let newFx = devicestate_1.DeviceStateStore.getRawState().fxCatalog.catalog.find(f => f.dspId == this.expandedDspId(args.lastMessageReceived.dspId));
                            // get whatever we have in this category and update it
                            /*
                            var fx = presetState.fx.find(f => f.type == this.expandedDspId(args.lastMessageReceived.dspId));
                            fx.type = args.dspIdNew;
                            fx.name = newFx.name;
                    
                            // repopulate fx params with defaults from fx catalog: pedal could have different parameters
                            fx.params=newFx.params.map(p=><ToneFxParam>{paramId:p.index.toString(),value:p.value, name:p.name, enabled:true})
                            */
                        }
                        if (fx) {
                            fx.params.find(p => p.paramId == args.lastMessageReceived.index).value = args.lastMessageReceived.value;
                            devicestate_1.DeviceStateStore.update(s => { s.presetTone = presetState; });
                        }
                    }
                    else if (args.lastMessageReceived.dspIdOld != null) {
                        //fx type change received from amp
                        // TODO: debounce this? this doesn't work if you update faster than the UI state as the current preset state doesn't match
                        // find param to change and set it in our model before sending to amp
                        let presetState = utils_1.Utils.deepClone(devicestate_1.DeviceStateStore.getRawState().presetTone);
                        var fx = presetState.fx.find(f => f.type == this.expandedDspId(args.lastMessageReceived.dspIdOld));
                        if (!fx) {
                            this.log("Cannot update device state for UI: " + args.lastMessageReceived.dspId + " not found in current preset state");
                        }
                        else {
                            fx.type = this.expandedDspId(args.lastMessageReceived.dspIdNew);
                            let catalog = devicestate_1.DeviceStateStore.getRawState().fxCatalog.catalog;
                            fx.name = catalog.find(c => c.dspId == fx.type).name;
                            devicestate_1.DeviceStateStore.update(s => { s.presetTone = presetState; });
                        }
                    }
                }
            }
            this.onStateChangeHandler();
        });
        platformUtils_1.platformEvents.on('device-connection-changed', (event, args) => {
            this.log("got connection event from main:" + args);
            if (args == "connected") {
                devicestate_1.DeviceStateStore.update(s => { s.isConnected = true; });
            }
            if (args == "failed") {
                devicestate_1.DeviceStateStore.update(s => { s.isConnected = false, s.connectedDevice = null; });
            }
            this.onStateChangeHandler();
        });
        platformUtils_1.platformEvents.on('devices-discovered', (event, args) => {
            this.log("got refreshed list of devices:" + args);
            devicestate_1.DeviceStateStore.update(s => { s.devices = args, s.isDeviceScanInProgress = false; });
            if (args.length > 0) {
                localStorage.setItem("lastKnownDevices", JSON.stringify(args));
            }
            this.onStateChangeHandler();
        });
    }
    log(msg) {
        console.log(msg);
    }
    getLastKnownDevices() {
        let d = localStorage.getItem("lastKnownDevices");
        if (d) {
            return JSON.parse(d);
        }
        else {
            return [];
        }
    }
    scanForDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("BLE scanning");
            devicestate_1.DeviceStateStore.update(s => { s.isDeviceScanInProgress = true; });
            yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'scan' });
            return true;
        });
    }
    getLastConnectedDevice() {
        return null;
        /*
        let deviceJson = localStorage.getItem("lastConnectedDevice");
        if (deviceJson) {
            return <BluetoothDeviceInfo>JSON.parse(deviceJson);
        } else {
            return null;
        }*/
    }
    connectDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            if (device == null)
                return false;
            devicestate_1.DeviceStateStore.update(s => { s.isConnectionInProgress = true, s.lastAttemptedDevice = device; });
            try {
                return yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'connect', data: device }).then((ok) => {
                    devicestate_1.DeviceStateStore.update(s => { s.isConnectionInProgress = false; });
                    if (ok) {
                        // store last connected devices
                        devicestate_1.DeviceStateStore.update(s => { s.isConnected = true; });
                        devicestate_1.DeviceStateStore.update(s => { s.connectedDevice = device; });
                        devicestate_1.DeviceStateStore.update(s => { s.lastAttemptedDevice = null; });
                        localStorage.setItem("lastConnectedDevice", JSON.stringify(device));
                        return true;
                    }
                    else {
                        const attemptedDevice = Object.assign({}, devicestate_1.DeviceStateStore.getRawState().lastAttemptedDevice);
                        if (attemptedDevice) {
                            attemptedDevice.connectionFailed = true;
                            devicestate_1.DeviceStateStore.update(s => { s.lastAttemptedDevice = attemptedDevice; });
                        }
                        return false;
                    }
                });
            }
            catch (err) {
                devicestate_1.DeviceStateStore.update(s => { s.isConnectionInProgress = false; });
                return false;
            }
        });
    }
    requestCurrentChannelSelection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "requestCurrentChannelSelection";
            yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'getCurrentChannel', data: 0 }).then(() => {
                this.log("Completed channel selection query");
            });
            return true;
        });
    }
    requestPresetConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "requestPresetConfig";
            yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'getPreset', data: 0 }).then(() => {
                this.log("Completed preset query");
            });
            return true;
        });
    }
    requestPresetChange(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "requestPresetChange";
            return platformUtils_1.platformEvents.invoke('perform-action', { action: 'applyPreset', data: args }).then(() => {
            });
            return true;
        });
    }
    normalizeDspId(dspId) {
        var _a;
        var d = (_a = dspId === null || dspId === void 0 ? void 0 : dspId.replace("pg.spark40.", "")) !== null && _a !== void 0 ? _a : dspId;
        if (d.startsWith("bias.reverb")) {
            d = "bias.reverb";
        }
        return d;
    }
    expandedDspId(dspId) {
        return "pg.spark40." + dspId;
    }
    requestAmpChange(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "requestAmpChange";
            args.dspIdOld = this.normalizeDspId(args.dspIdOld);
            args.dspIdNew = this.normalizeDspId(args.dspIdNew);
            return platformUtils_1.platformEvents.invoke('perform-action', { action: 'changeAmp', data: args }).then(() => {
            });
            return true;
        });
    }
    requestFxChange(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "requestFxChange";
            // TODO: special case for reverb
            if (args.dspIdOld == "bias.reverb") {
                return this.requestFxParamChange({ "dspId": "bias.reverb", "index": 6, value: 0.4 });
            }
            var currentTone = utils_1.Utils.deepClone(devicestate_1.DeviceStateStore.getRawState().presetTone);
            let newFx = devicestate_1.DeviceStateStore.getRawState().fxCatalog.catalog.find(f => f.dspId == args.dspIdNew);
            var fx = currentTone.fx.find(f => f.type == args.dspIdOld);
            fx.type = args.dspIdNew;
            fx.name = newFx.name;
            // repopulate fx params with defaults from fx catalog: pedal could have different parameters
            fx.params = newFx.params.map(p => ({ paramId: p.index.toString(), value: p.value, name: p.name, enabled: true }));
            // TODO: also copy default params for new fx?
            devicestate_1.DeviceStateStore.update(s => { s.presetTone = currentTone; });
            args.dspIdOld = this.normalizeDspId(args.dspIdOld);
            args.dspIdNew = this.normalizeDspId(args.dspIdNew);
            return platformUtils_1.platformEvents.invoke('perform-action', { action: 'changeFx', data: args }).then(() => {
            });
            return true;
        });
    }
    requestFxParamChangeImmediate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "requestFxParamChange";
            let presetState = utils_1.Utils.deepClone(devicestate_1.DeviceStateStore.getRawState().presetTone);
            // find param to change and set it in our model before sending to amp
            var fx = presetState.fx.find(f => f.type == args.dspId);
            fx.params.find(p => p.paramId == args.index).value = args.value;
            devicestate_1.DeviceStateStore.update(s => { s.presetTone = presetState; });
            args.dspId = this.normalizeDspId(args.dspId);
            if (typeof (args.value) == "string") {
                args.value = parseInt(args.value);
            }
            if (typeof (args.index) == "string") {
                args.index = parseInt(args.index);
            }
            return platformUtils_1.platformEvents.invoke('perform-action', { action: 'setFxParam', data: args }).then(() => {
            });
            return true;
        });
    }
    requestFxParamChange(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debouncedFXUpdate == null) {
                this.debouncedFXUpdate = debounce((args) => this.requestFxParamChangeImmediate(args), 50);
            }
            this.debouncedFXUpdate(args);
            return true;
        });
    }
    requestFxToggle(args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "requestFxToggle";
            let presetState = utils_1.Utils.deepClone(devicestate_1.DeviceStateStore.getRawState().presetTone);
            // find param to change and set it in our model before sending to amp
            presetState.fx.find(f => f.type == args.dspId).enabled = (args.value == 1);
            devicestate_1.DeviceStateStore.update(s => { s.presetTone = presetState; });
            args.dspId = this.normalizeDspId(args.dspId);
            yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'setFxToggle', data: args }).then(() => {
                this.log("Sent fx toggle change");
            });
            return true;
        });
    }
    setChannel(channelNum) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastCommandType = "setChannel";
            yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'setChannel', data: channelNum }).then(() => {
                this.log("Completed setting channel");
                // DeviceStore.update(s => { s.selectedChannel == channelNum });
                this.requestPresetConfig();
            });
            return true;
        });
    }
    getDeviceName() {
        return __awaiter(this, void 0, void 0, function* () {
            yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'getDeviceName', data: {} }).then(() => {
            });
            return true;
        });
    }
    getDeviceSerial() {
        return __awaiter(this, void 0, void 0, function* () {
            yield platformUtils_1.platformEvents.invoke('perform-action', { action: 'getDeviceSerial', data: {} }).then(() => {
            });
            return true;
        });
    }
    getFxCatalog() {
        let db = sparkFxCatalog_1.FxCatalogProvider.db;
        for (var fx of db.catalog) {
            if (!fx.dspId.startsWith("pg.spark40."))
                fx.dspId = "pg.spark40." + fx.dspId;
        }
        return db;
    }
}
exports.DeviceViewModel = DeviceViewModel;
exports.default = DeviceViewModel;
//# sourceMappingURL=deviceViewModel.js.map