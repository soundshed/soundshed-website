"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIFeatureToggleStore = void 0;
const pullstate_1 = require("pullstate");
exports.UIFeatureToggleStore = new pullstate_1.Store({
    enableCommunityTones: true,
    enabledPGToneCloud: true,
    enableMyTones: true,
    enableToneEditor: true,
    enableLessons: false,
});
//# sourceMappingURL=uifeaturetoggles.js.map