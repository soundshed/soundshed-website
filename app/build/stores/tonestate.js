"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToneEditStore = exports.TonesStateStore = void 0;
const pullstate_1 = require("pullstate");
exports.TonesStateStore = new pullstate_1.Store({
    toneResults: [],
    toneCloudResults: [],
    storedPresets: [],
    isSearchInProgress: false
});
exports.ToneEditStore = new pullstate_1.Store({
    isToneEditorOpen: false,
    tone: null,
    editTone: null
});
//# sourceMappingURL=tonestate.js.map