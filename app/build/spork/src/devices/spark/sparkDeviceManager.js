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
exports.SparkDeviceManager = void 0;
const sparkCommandMessage_1 = require("./sparkCommandMessage");
const sparkFxCatalog_1 = require("./sparkFxCatalog");
const sparkMessageReader_1 = require("./sparkMessageReader");
const fxMapping_1 = require("../../../../core/fxMapping");
class SparkDeviceManager {
    constructor(connection) {
        this.connection = connection;
        this.latestStateReceived = [];
        this.lastStateTime = new Date().getTime();
        this.deviceAddress = "";
        this.reader = new sparkMessageReader_1.SparkMessageReader();
    }
    scanForDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.scanForDevices();
        });
    }
    connect(device) {
        return __awaiter(this, void 0, void 0, function* () {
            // disconnect if already connected
            yield this.disconnect();
            var connected = yield this.connection.connect(device);
            if (connected) {
                // setup serial read listeners
                this.connection.listenForData((buffer) => {
                    let currentTime = new Date().getTime();
                    this.lastStateTime = currentTime;
                    let byteArray = new Uint8Array(buffer);
                    this.latestStateReceived.push(byteArray);
                    if (byteArray[byteArray.length - 1] == 0xf7) {
                        // end message 
                        this.log('Received last message in batch, processing message ' + this.latestStateReceived.length);
                        this.readStateMessage().then(() => {
                            this.latestStateReceived = [];
                        });
                    }
                });
            }
            return connected;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.disconnect();
            }
            catch (_a) { }
        });
    }
    buf2hex(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }
    readStateMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("Reading state message"); //+ this.buf2hex(this.latestStateReceived));
            let reader = this.reader;
            reader.set_message(this.latestStateReceived);
            let b = reader.read_message();
            this.stateInfo = reader.text;
            this.hydrateDeviceStateInfo(reader.deviceState);
            if (this.onStateChanged) {
                this.onStateChanged(reader.deviceState);
            }
            else {
                this.log("No onStateChange handler defined.");
            }
        });
    }
    hydrateDeviceStateInfo(deviceState) {
        let fxCatalog = sparkFxCatalog_1.FxCatalogProvider.db;
        // populate metadata about fx etc
        if (deviceState.presetConfig) {
            for (let fx of deviceState.presetConfig.sigpath) {
                let dspId = fx.dspId;
                if (dspId == "bias.reverb") {
                    //map mode variant to our config dspId
                    dspId = fxMapping_1.FxMappingSparkToTone.getReverbDspId(fx.params[6].value);
                }
                let dsp = fxCatalog.catalog.find(f => f.dspId == dspId);
                if (dsp != null) {
                    fx.type = dsp.type;
                    fx.name = dsp.name;
                    fx.description = dsp.description;
                    for (let p of fx.params) {
                        let paramInfo = dsp.params.find(pa => pa.index == p.index);
                        if (paramInfo) {
                            p.name = paramInfo.name;
                        }
                    }
                }
                else {
                    fx.name = fx.dspId;
                    fx.description = "(No description)";
                    for (let p of fx.params) {
                        if (p != null) {
                            p.name = "Param " + p.index.toString();
                        }
                    }
                }
            }
        }
    }
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    sendCommand(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("sending command");
            let msg = new sparkCommandMessage_1.SparkCommandMessage();
            let msgArray = [];
            if (type == "set_preset") {
                this.log("Setting preset " + JSON.stringify(data));
                msgArray = msg.create_preset(data);
            }
            if (type == "set_preset_from_model") {
                this.log("Setting preset" + JSON.stringify(data));
                msgArray = msg.create_preset_from_model(data);
            }
            if (type == "store_current_preset") {
                this.log("Storing preset" + JSON.stringify(data));
                msgArray = msg.store_current_preset(data);
            }
            if (type == "set_channel") {
                this.log("Setting hardware channel " + JSON.stringify(data));
                msgArray = msg.change_hardware_preset(data);
            }
            if (type == "change_amp") {
                this.log("Changing Amp " + JSON.stringify(data));
                msgArray = msg.change_amp(data.dspIdOld, data.dspIdNew);
            }
            if (type == "set_amp_param") {
                this.log("Changing Amp Param " + JSON.stringify(data));
                msgArray = msg.change_amp_parameter(data.dspId, data.index, data.value);
            }
            if (type == "change_fx") {
                this.log("Changing Effect " + JSON.stringify(data));
                msgArray = msg.change_effect(data.dspIdOld, data.dspIdNew);
            }
            if (type == "set_fx_onoff") {
                this.log("Toggling Effect " + JSON.stringify(data));
                msgArray = msg.turn_effect_onoff(data.dspId, data.value == 1 ? "On" : "Off");
            }
            if (type == "set_fx_param") {
                this.log("Changing Effect Param " + JSON.stringify(data));
                msgArray = msg.change_effect_parameter(data.dspId, data.index, data.value);
            }
            if (type == "get_preset") {
                this.log("Getting preset");
                msgArray = msg.request_preset_state();
            }
            if (type == "get_selected_channel") {
                this.log("Getting device current channel selection");
                msgArray = msg.request_info(0x10);
            }
            if (type == "get_device_name") {
                this.log("Getting device name");
                msgArray = msg.request_info(0x11);
            }
            if (type == "get_device_serial") {
                this.log("Getting device serial");
                msgArray = msg.request_info(0x23);
            }
            for (let msg of msgArray) {
                this.log("Sending: " + this.buf2hex(msg));
                if (typeof (Buffer) != "undefined") {
                    this.connection.write(Buffer.from(msg));
                }
                else {
                    this.connection.write(msg);
                }
            }
            this.log("Sent.: ");
        });
    }
    log(msg) {
        console.log("[Spark Device Manager] : " + msg);
    }
}
exports.SparkDeviceManager = SparkDeviceManager;
//# sourceMappingURL=sparkDeviceManager.js.map