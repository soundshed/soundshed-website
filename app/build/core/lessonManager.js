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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonManager = void 0;
const lessonstate_1 = require("../stores/lessonstate");
const utils_1 = require("./utils");
const videoSearchApi_1 = __importDefault(require("./videoSearchApi"));
class LessonManager {
    constructor() {
        this.videoSearchApi = new videoSearchApi_1.default();
    }
    getVideoSearchResults(preferCached = true, keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (preferCached) {
                let results = localStorage.getItem("_videoSearchResults");
                if (results != null) {
                    let r = JSON.parse(results);
                    lessonstate_1.LessonStateStore.update(s => { s.searchResults = r; });
                    return r;
                }
            }
            let r = yield this.videoSearchApi.search(keyword);
            lessonstate_1.LessonStateStore.update(s => { s.searchResults = r; });
            localStorage.setItem("_videoSearchResults", JSON.stringify(r));
            return r;
        });
    }
    loadFavourites() {
        let favourites = [];
        let allPresets = localStorage.getItem("_videofavourites");
        if (allPresets != null) {
            favourites = JSON.parse(allPresets);
        }
        lessonstate_1.LessonStateStore.update(s => { s.favourites = favourites; });
        return favourites;
    }
    deleteFavourite(v) {
        return __awaiter(this, void 0, void 0, function* () {
            if (confirm("Are you sure you wish to delete this favourite [" + v.title + "]?")) {
                let favourites = [];
                let allPresets = localStorage.getItem("_videofavourites");
                if (allPresets != null) {
                    favourites = JSON.parse(allPresets);
                    favourites = favourites.filter(f => f.itemId != v.itemId);
                    localStorage.setItem("_videofavourites", JSON.stringify(favourites));
                    lessonstate_1.LessonStateStore.update(s => { s.favourites = favourites; });
                }
            }
        });
    }
    storeFavourite(v) {
        return __awaiter(this, void 0, void 0, function* () {
            v = utils_1.Utils.deepClone(v);
            if (v != null) {
                let favourites = [];
                let all = localStorage.getItem("_videofavourites");
                if (all != null) {
                    favourites = JSON.parse(all);
                }
                if (!favourites.find(f => f.itemId == v.itemId)) {
                    favourites.push(v);
                    localStorage.setItem("_videofavourites", JSON.stringify(favourites));
                    lessonstate_1.LessonStateStore.update(s => { s.favourites = favourites; });
                }
            }
            return true;
        });
    }
}
exports.LessonManager = LessonManager;
//# sourceMappingURL=lessonManager.js.map