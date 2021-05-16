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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RfcommProvider = void 0;
const bluetoothSerial = __importStar(require("bluetooth-serial-port"));
class RfcommProvider {
    constructor() {
        this.targetDeviceName = "Spark 40 Audio";
        this.btSerial = new bluetoothSerial.BluetoothSerialPort();
    }
    scanForDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let resolutionTimeout;
                let devices = [];
                // find bluetooth devices, identify spark devices and capture the device address and name. 
                // On each discovery, clear the resolution timeout so that the last item is the one that completes.
                this.btSerial.on('found', (address, name) => {
                    this.log("addr:" + JSON.stringify(address) + " name:" + name);
                    if (name == this.targetDeviceName) {
                        address = address.replace(name, "").replace("(", "").replace(")", "");
                        if (!devices.find(d => d.address == address)) {
                            devices.push({ name: name, address: address, port: 2, connectionFailed: false });
                        }
                    }
                    if (resolutionTimeout) {
                        clearTimeout(resolutionTimeout);
                    }
                    resolutionTimeout = setTimeout(() => resolve(devices), 500);
                });
                try {
                    this.btSerial.inquire();
                }
                catch (_a) {
                    reject();
                }
            });
        });
    }
    connect(device) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.btSerial.connect(device.address, device.port, () => {
                    this.log('bluetooth device connected: ' + device.name);
                    resolve(true);
                }, () => {
                    this.log(`cannot connect to device [${device.address} ${device.name}]`);
                    /* if (this.onStateChanged) {
                         this.onStateChanged({ type: "connection", status: "failed" });
                     } else {
                         this.log("No onStateChange handler defined.")
                     }*/
                    reject(false);
                });
            });
        });
    }
    log(msg) {
        console.log("[Rfcomm Provider] : " + msg);
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.btSerial.removeAllListeners();
            if (this.btSerial && this.btSerial.isOpen()) {
                this.log("Disconnected");
                this.btSerial.close();
            }
        });
    }
    listenForData(onListen) {
        // setup serial read listeners
        this.btSerial.on('data', (buffer) => {
            onListen(buffer);
        });
    }
    listenForDevices(onDeviceFound) {
        this.btSerial.on('found', (address, name) => {
            onDeviceFound(address, name);
        });
    }
    write(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.btSerial.write(Buffer.from(msg), (err) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    this.log(err);
            }));
        });
    }
}
exports.RfcommProvider = RfcommProvider;
//# sourceMappingURL=rfcommProvider.js.map