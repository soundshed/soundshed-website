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
exports.AppViewModel = void 0;
const fxMapping_1 = require("./fxMapping");
const soundshedApi_1 = require("./soundshedApi");
const artistInfoApi_1 = require("./artistInfoApi");
//import { remote } from 'electron';
const utils_1 = require("./utils");
const sparkAPI_1 = require("../spork/src/devices/spark/sparkAPI");
const appstate_1 = require("../stores/appstate");
const tonestate_1 = require("../stores/tonestate");
class AppViewModel {
    // private analytics = new Analytics(envSettings.AnalyticsId);
    constructor() {
        this.soundshedApi = new soundshedApi_1.SoundshedApi();
        this.toneCloudApi = new sparkAPI_1.SparkAPI();
        this.artistInfoApi = new artistInfoApi_1.ArtistInfoApi();
    }
    init() {
        if (this.soundshedApi.isUserSignedIn()) {
            appstate_1.AppStateStore.update(s => { s.isUserSignedIn = true; s.userInfo = this.soundshedApi.getCurrentUserInfo(); });
        }
        else {
            appstate_1.AppStateStore.update(s => { s.isUserSignedIn = false; s.userInfo = null; });
        }
    }
    log(msg) {
        console.log(msg);
    }
    logPageView(category) {
        const appInfo = appstate_1.AppStateStore.getRawState().appInfo;
        //this.analytics.screen('soundshed-app', appInfo?.version, 'com.soundshed.tones', 'com.soundshed.app', category).then(() => { });
    }
    performSignIn(login) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginResult = yield this.soundshedApi.login(login);
                if (loginResult.completedOk) {
                    appstate_1.AppStateStore.update(s => { s.isUserSignedIn = true; s.userInfo = this.soundshedApi.getCurrentUserInfo(); });
                }
                return loginResult.completedOk;
            }
            catch (err) {
                return false;
            }
        });
    }
    performRegistration(reg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let regResult = yield this.soundshedApi.registerUser(reg);
                if (regResult.completedOk) {
                    // now login
                    return yield this.performSignIn({ email: reg.email, password: reg.password });
                }
                return regResult.completedOk;
            }
            catch (err) {
                return false;
            }
        });
    }
    loadFavourites() {
        let favourites = [];
        let allPresets = localStorage.getItem("favourites");
        if (allPresets != null) {
            favourites = JSON.parse(allPresets);
        }
        tonestate_1.TonesStateStore.update(s => { s.storedPresets = favourites; });
        return favourites;
    }
    deleteFavourite(tone) {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm("Are you sure you wish to delete this tone [" + tone.name + "]?")) {
                let favourites = [];
                let allPresets = localStorage.getItem("favourites");
                if (allPresets != null) {
                    favourites = JSON.parse(allPresets);
                    favourites = favourites.filter(f => f.toneId != tone.toneId);
                    localStorage.setItem("favourites", JSON.stringify(favourites));
                    tonestate_1.TonesStateStore.update(s => { s.storedPresets = favourites; });
                    // todo: offer to delete from tone community?
                }
            }
        });
    }
    storeFavourite(preset, includeUpload = false) {
        return __awaiter(this, void 0, void 0, function* () {
            preset = utils_1.Utils.deepClone(preset);
            let autoOverwrite = true;
            // if tone is already favourite, overwrite
            // if tone is also a community tone, fgl as modified and offer to update
            // if tone is a community tone decide whether to also save new version to API
            if (includeUpload && !this.soundshedApi.isUserSignedIn()) {
                // force sign in before uploading
                appstate_1.AppStateStore.update(s => { s.isSignInRequired = true; });
                return;
            }
            if (preset != null) {
                let convertedTone = new fxMapping_1.FxMappingSparkToTone().mapFrom(preset);
                if (convertedTone.schemaVersion == "pg.preset.summary" && convertedTone.fx == null) {
                    // still need to fetch the preset details
                    let result = yield this.loadToneCloudPreset(convertedTone.externalId);
                    if (result != null) {
                        let presetData = JSON.parse(result.preset_data);
                        let toneData = new fxMapping_1.FxMappingSparkToTone().mapFrom(presetData);
                        Object.assign(convertedTone, toneData);
                        convertedTone.imageUrl = result.thumb_url;
                    }
                    else {
                        // can't load this tone
                        return;
                    }
                }
                let favourites = [];
                let allPresets = localStorage.getItem("favourites");
                if (allPresets != null) {
                    favourites = JSON.parse(allPresets);
                }
                let presetStored = false;
                if (favourites.find(t => t.name.toLowerCase() == convertedTone.name.toLowerCase())) {
                    if (autoOverwrite || confirm("You already have a preset stored with the same name. Do you wish to overwrite it with this one?")) {
                        // update existing
                        favourites = favourites.filter(f => f.name.toLowerCase() != convertedTone.name.toLowerCase());
                        favourites.push(convertedTone);
                        presetStored = true;
                    }
                    else {
                        //save new
                        convertedTone.toneId = utils_1.Utils.generateUUID();
                        favourites.push(convertedTone);
                        presetStored = true;
                    }
                }
                if (favourites.find(t => t.name.toLowerCase() != convertedTone.name.toLowerCase() && t.toneId.toLowerCase() == convertedTone.toneId.toLowerCase())) {
                    // update existing
                    favourites = favourites.filter(f => f.toneId.toLowerCase() != convertedTone.toneId.toLowerCase());
                    favourites.push(convertedTone);
                    presetStored = true;
                    /*
                   if (!autoOverwrite || confirm("You have changed the name of this preset. Do you wish to save this as a new preset (keep the original)?")) {
                       // add new
                       convertedTone.toneId = Utils.generateUUID();
                       favourites.push(convertedTone);
                       presetStored = true;
                   } else {
                      
                   }*/
                }
                if (!presetStored) {
                    //add new
                    convertedTone.toneId = utils_1.Utils.generateUUID();
                    favourites.push(convertedTone);
                }
                localStorage.setItem("favourites", JSON.stringify(favourites));
                tonestate_1.TonesStateStore.update(s => { s.storedPresets = favourites; });
                //attempt upload
                if (includeUpload == true) {
                    try {
                        this.soundshedApi.updateTone(convertedTone).then(() => {
                            //tone updated
                            this.log("Tone uploaded to Soundshed");
                            alert("Tone uploaded to Soundshed");
                        });
                    }
                    catch (err) {
                        this.log("Error: " + err);
                        alert("Sorry, this tone could not be uploaded to Soundshed at this time.");
                    }
                }
                return true;
            }
            else {
                return false;
            }
        });
    }
    loadLatestTones() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = true; });
                const result = yield this.soundshedApi.getTones();
                tonestate_1.TonesStateStore.update(s => { var _a; s.toneResults = (_a = result.result) !== null && _a !== void 0 ? _a : []; });
                tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = false; });
                return (_a = result.result) !== null && _a !== void 0 ? _a : [];
            }
            catch (err) {
                tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = false; });
                return [];
            }
        });
    }
    loadToneCloudPreset(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.toneCloudApi.getToneCloudPreset(id);
                // update our cached info and state info
                if (result != null) {
                    //  TonesStateStore.update(s => { s.toneResults = result ?? [] });
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (err) {
                return null;
            }
        });
    }
    loadLatestToneCloudTones(preferCached = true, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (preferCached) {
                    let cached = localStorage.getItem("_tcResults");
                    if (cached != null) {
                        let cachedTones = JSON.parse(cached);
                        tonestate_1.TonesStateStore.update(s => { s.toneCloudResults = cachedTones; });
                        return cachedTones;
                    }
                }
                tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = true; });
                const result = yield this.toneCloudApi.getToneCloudPresets(query);
                // convert results to tone
                let tones = result.map(p => {
                    var _a;
                    return ({
                        toneId: "pg.tc." + p.id,
                        name: p.name,
                        categories: [p.category],
                        artists: (_a = p.tags) !== null && _a !== void 0 ? _a : [],
                        description: p.description,
                        userId: null,
                        deviceType: "pg.spark40",
                        fx: null,
                        bpm: null,
                        version: p.version,
                        timeSig: null,
                        schemaVersion: "pg.preset.summary",
                        imageUrl: p.thumb_url,
                        externalId: p.id
                    });
                });
                tonestate_1.TonesStateStore.update(s => { s.toneCloudResults = tones; });
                localStorage.setItem("_tcResults", JSON.stringify(tones));
                tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = false; });
                return tones;
            }
            catch (err) {
                tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = false; });
                return [];
            }
        });
    }
    loadToneCloudTonesByUser(userId, pageIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = true; });
            const result = yield this.toneCloudApi.getToneCloudPresetsCreatedByUser(userId, pageIndex, 32);
            let tones = result.map(p => {
                var _a;
                return ({
                    toneId: "pg.tc." + p.id,
                    name: p.name,
                    categories: [p.category],
                    artists: (_a = p.tags) !== null && _a !== void 0 ? _a : [],
                    description: p.description,
                    userId: null,
                    deviceType: "pg.spark40",
                    fx: null,
                    bpm: null,
                    version: p.version,
                    timeSig: null,
                    schemaVersion: "pg.preset.summary",
                    imageUrl: p.thumb_url,
                    externalId: p.id
                });
            });
            tonestate_1.TonesStateStore.update(s => { s.toneCloudResults = tones; });
            localStorage.setItem("_tcResults", JSON.stringify(tones));
            tonestate_1.TonesStateStore.update(s => { s.isSearchInProgress = false; });
            return tones;
        });
    }
    performArtistSearch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.artistInfoApi.search(query);
        });
    }
    refreshAppInfo() {
        try {
            // const info = { version: remote.app.getVersion(), name: remote.app.getName() };
            // AppStateStore.update(s => { s.appInfo = info });
        }
        catch (err) {
            this.log("Failed to get app version info: " + err);
        }
    }
    checkForUpdates() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // fetch latest download links from github
            try {
                let url = "https://api.github.com/repos/soundshed/soundshed-app/releases/latest";
                const response = yield fetch(url, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                let data = yield response.json();
                let currentVersion = "1.0.0"; // remote.app.getVersion()?.replace("v","");
                let updateInfo = {
                    name: data.name,
                    version: data.tag_name,
                    currentVersion: currentVersion,
                    isUpdateAvailable: currentVersion != ((_a = data.tag_name) === null || _a === void 0 ? void 0 : _a.replace("v", "")),
                    releaseDate: data.published_at,
                    downloadUrl: "https://soundshed.com"
                };
                if (updateInfo.isUpdateAvailable) {
                    appstate_1.AppStateStore.update(s => { s.isUpdateAvailable = true; });
                }
                else {
                    appstate_1.AppStateStore.update(s => { s.isUpdateAvailable = false; });
                }
                console.log(JSON.stringify(updateInfo));
                return updateInfo;
            }
            catch (_b) {
                return null;
            }
        });
    }
    signOut() {
        if (confirm("Sign out of your profile?")) {
            this.soundshedApi.signOut();
            appstate_1.AppStateStore.update(s => { s.isUserSignedIn = false; s.userInfo = null; });
        }
    }
}
exports.AppViewModel = AppViewModel;
exports.default = AppViewModel;
//# sourceMappingURL=appViewModel.js.map