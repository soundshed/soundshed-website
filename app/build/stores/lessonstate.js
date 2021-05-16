"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonStateStore = void 0;
const pullstate_1 = require("pullstate");
exports.LessonStateStore = new pullstate_1.Store({
    searchResults: [],
    favourites: [],
    playingVideoUrl: null
});
//# sourceMappingURL=lessonstate.js.map