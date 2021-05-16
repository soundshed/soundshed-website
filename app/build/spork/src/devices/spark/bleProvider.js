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
exports.BleProvider = void 0;
class BleProvider {
    constructor() {
        this.targetDeviceName = "Spark 40 Audio";
        this.serviceGenericUUID = '00001800-0000-1000-8000-00805f9b34fb'; // service 'generic_access'
        this.serviceCustomUUID = '0000ffc0-0000-1000-8000-00805f9b34fb'; // service 'FFC0'
        this.deviceCommandCharacteristicUUID = '0xffc1'; // device command messages
        this.deviceChangesCharacteristicUUID = '0xffc2'; // device change messages
    }
    scanForDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            let devices = [];
            const options = { acceptAllDevices: true, optionalServices: [this.serviceGenericUUID, this.serviceCustomUUID] };
            try {
                this.device = yield navigator.bluetooth.requestDevice(options);
                devices.push({ name: this.device.name, address: this.device.id, port: null });
            }
            catch (_a) {
                this.log("BLE device discovery cancelled or failed.");
            }
            return devices;
        });
    }
    connect(device) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected) {
                return true;
            }
            this.server = yield this.device.gatt.connect();
            this.isConnected = true;
            this.log("Getting Device Service..");
            const service = yield this.server.getPrimaryService(this.serviceCustomUUID);
            // generic access service:
            // 00002a00-0000-1000-8000-00805f9b34fb : device name
            // 00002a04-0000-1000-8000-00805f9b34fb : peripheral parameters
            // 65472 [0000ffc0-0000-1000-8000-00805f9b34fb] service
            // characteristic name: 65474 (0xFFC2), handle  7
            // characteristic name: 65473 (0xFFC1), handle  10
            this.log("Getting Device Characteristic..");
            this.commandCharacteristic = yield service.getCharacteristic(parseInt(this.deviceCommandCharacteristicUUID));
            this.changeCharacteristic = yield service.getCharacteristic(parseInt(this.deviceChangesCharacteristicUUID));
            return true;
        });
    }
    hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    }
    buf2hex(buffer) {
        // https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }
    log(msg, ...args) {
        console.log("[BLE Provider] : " + msg);
        if (args) {
            args.forEach(element => {
                console.log("[BLE Provider] : " + element);
            });
        }
    }
    sendCommand(targetCMD) {
        return __awaiter(this, void 0, void 0, function* () {
            let commandStream = this.hexToBytes(targetCMD);
            return yield this.sendCommandBytes(commandStream);
        });
    }
    sendCommandBytes(commandStream) {
        return __awaiter(this, void 0, void 0, function* () {
            const uint8Array = new Uint8Array(commandStream);
            if (!this.commandCharacteristic.writeValueWithoutResponse) {
                alert("This browser does not support the latest web bluetooth API. Use Chrome or Edge with Experimental Web Platform features flag enabled.");
            }
            this.log("Writing command changes..");
            yield (this.commandCharacteristic).writeValueWithResponse(uint8Array);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            /* this.btSerial.removeAllListeners();
         
             if (this.btSerial && this.btSerial.isOpen()) {
                 this.log("Disconnected");
                 this.btSerial.close();
             }*/
        });
    }
    listenForData(onListen) {
        this.device.gatt.connect();
        /* this.device.addEventListener('advertisementreceived', (event:any) => {
             this.log('Advertisement received.');
             this.log('  Device Name: ' + event.device.name);
             this.log('  Device ID: ' + event.device.id);
             this.log('  RSSI: ' + event.rssi);
             this.log('  TX Power: ' + event.txPower);
             this.log('  UUIDs: ' + event.uuids);
 
             event.manufacturerData.forEach((valueDataView, key) => {
               this.log('Manufacturer', key, valueDataView);
             });
 
             event.serviceData.forEach((valueDataView, key) => {
               this.log('Service', key, valueDataView);
             });
           });
       
           this.log('Watching advertisements from "' + this.device.name + '"...');
           return this.device.watchAdvertisements();
           */
        this.changeCharacteristic.startNotifications().then(_ => {
            this.log('> Notifications started');
            this.changeCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
                var datavalue = event.target.value.buffer;
                this.log("characteristicvaluechanged: " + this.buf2hex(datavalue));
                onListen(datavalue);
            });
        });
        /* this.commandCharacteristic.addEventListener('characteristicvaluechanged',
             (event) => {
 
                 var datavalue = (<any>event.target).value.buffer;
                 this.log("characteristicvaluechanged: "+this.buf2hex(datavalue));
                 onListen(datavalue);
             });
 */
        // setup serial read listeners
        /*  this.btSerial.on('data', (buffer) => {
               onListen(buffer);
          });*/
    }
    listenForDevices(onDeviceFound) {
        /* this.btSerial.on('found', (address: string, name: string) => {
             onDeviceFound(address,name);
         });*/
    }
    write(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sendCommandBytes(msg);
        });
    }
}
exports.BleProvider = BleProvider;
//# sourceMappingURL=bleProvider.js.map