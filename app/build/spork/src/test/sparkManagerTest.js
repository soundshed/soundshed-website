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
const rfcommProvider_1 = require("../devices/spark/rfcommProvider");
const sparkDeviceManager_1 = require("../devices/spark/sparkDeviceManager");
let sm = new sparkDeviceManager_1.SparkDeviceManager(new rfcommProvider_1.RfcommProvider());
sm.connect({ address: "08:EB:ED:8F:84:0B", name: "Spark 40 Audio", port: 2, connectionFailed: false }).then((connectedOk) => __awaiter(void 0, void 0, void 0, function* () {
    if (connectedOk) {
        yield sm.sendCommand("get_preset", 1);
    }
})).then(() => {
});
//# sourceMappingURL=sparkManagerTest.js.map