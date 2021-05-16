"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxMappingSparkToTone = exports.FxMappingToneToSpark = void 0;
const utils_1 = require("./utils");
class FxMappingToneToSpark {
    mapFxCategory(type) {
        return type;
    }
    mapFxId(type) {
        return type;
    }
    mapFx(source) {
        let type = source.type.replace("pg.spark40.", "");
        if (type.indexOf("bias.reverb") > -1 && type != "bias.reverb") {
            let i = {
                active: source.enabled == true,
                params: source.params.map(p => { return { index: parseInt(p.paramId), value: typeof (p.value) == "string" ? parseFloat(p.value) : p.value }; }),
                dspId: null
            };
            let reverbTypeParam = 0.0;
            let reverbTypeParamStr = type.substr(type.length - 1, 1);
            if (reverbTypeParamStr != "0") {
                reverbTypeParam = parseFloat(reverbTypeParamStr) / 10;
            }
            i.params.push({ index: 6, value: reverbTypeParam }); // reverb model
            i.params.push({ index: 7, value: source.enabled ? 1 : 0 }); //on.off param
            i.dspId = "bias.reverb";
            return i;
        }
        else {
            return {
                active: source.enabled == true,
                params: source.params.map((p => { return { index: parseInt(p.paramId), value: typeof (p.value) == "string" ? parseFloat(p.value) : p.value }; })),
                // type: this.mapFxCategory(type),
                dspId: this.mapFxId(type),
            };
        }
    }
    /** map from soundshed tone to a spark preset */
    mapFrom(source) {
        var _a;
        let dest = {
            meta: { name: source.name, description: source.description, id: source.toneId.replace("pg.tc.", ""), version: source.version, icon: "icon.png" },
            sigpath: source.fx.map(fx => this.mapFx(fx)),
            type: "jamup_speaker",
            bpm: (_a = source.bpm) !== null && _a !== void 0 ? _a : 120
        };
        // remove unsupported FX types
        dest.sigpath = dest.sigpath.filter(f => f.dspId != "GraphicalEQ7");
        return dest;
    }
}
exports.FxMappingToneToSpark = FxMappingToneToSpark;
class FxMappingSparkToTone {
    static getReverbDspId(modeParam) {
        let reverbVariant = parseFloat((modeParam).toFixed(2));
        let dspId = "bias.reverb";
        switch (reverbVariant) {
            case 0.0:
                dspId = "bias.reverb.0"; //room studio a
                break;
            case 0.1:
                dspId = "bias.reverb.1"; // room studio b
                break;
            case 0.2:
                dspId = "bias.reverb.2"; // chamber
                break;
            case 0.3:
                dspId = "bias.reverb.3"; // hall natural
                break;
            case 0.4:
                dspId = "bias.reverb.4"; // hall medium
                break;
            case 0.5:
                dspId = "bias.reverb.5"; // hall ambient
                break;
            case 0.6:
                dspId = "bias.reverb.6"; // plate short
                break;
            case 0.7:
                dspId = "bias.reverb.7"; // plate rich
                break;
            case 0.8:
                dspId = "bias.reverb.8"; // plate long
                break;
            default:
                dspId = "bias.reverb.0";
                break;
        }
        return dspId;
    }
    mapFxReverb(source) {
        // reverbs are stored as bias.reverb with param 0-6, param6 is a float indicating reverb type variant
        let dspId = FxMappingSparkToTone.getReverbDspId(source.params[6].value);
        var val = {
            type: "pg.spark40." + dspId,
            name: source.name,
            enabled: source.active == true,
            params: source.params.map(p => ({ paramId: p.index.toString(), value: p.value, type: p.type, name: p.name, enabled: true }))
        };
        // trim last two params (reverb model and on/off)
        val.params.pop();
        val.params.pop();
        return val;
    }
    mapFx(source) {
        if (source.dspId == "bias.reverb") {
            return this.mapFxReverb(source);
        }
        else {
            return {
                type: "pg.spark40." + source.dspId,
                name: source.name,
                enabled: source.active == true,
                params: source.params.map(p => ({ paramId: p.index.toString(), value: p.value, type: p.type, name: p.name, enabled: true }))
            };
        }
    }
    mapFrom(source) {
        if (source.schemaVersion) {
            //already a tone format, return a copy
            return Object.assign({}, source);
        }
        let dest = {
            toneId: utils_1.Utils.generateUUID(),
            userId: null,
            deviceType: "pg.spark40",
            categories: [],
            artists: [],
            name: source.meta.name,
            description: source.meta.description,
            version: source.meta.version,
            bpm: source.bpm,
            schemaVersion: "1",
            fx: source.sigpath.map(s => this.mapFx(s)),
            timeSig: "4/4",
            datecreated: new Date
        };
        return dest;
    }
}
exports.FxMappingSparkToTone = FxMappingSparkToTone;
//# sourceMappingURL=fxMapping.js.map