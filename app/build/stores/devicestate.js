"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceStateStore = void 0;
const pullstate_1 = require("pullstate");
exports.DeviceStateStore = new pullstate_1.Store({
    isConnected: false,
    isConnectionInProgress: false,
    selectedChannel: -1,
    devices: [],
    connectedDevice: null,
    lastAttemptedDevice: null,
    isDeviceScanInProgress: false,
    presetTone: null,
    fxCatalog: null
});
//# sourceMappingURL=devicestate.js.map