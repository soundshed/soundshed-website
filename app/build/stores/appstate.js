"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStateStore = void 0;
const pullstate_1 = require("pullstate");
exports.AppStateStore = new pullstate_1.Store({
    isUserSignedIn: false,
    isSignInRequired: false,
    isNativeMode: true,
    isUpdateAvailable: false,
    userInfo: null,
    appInfo: null
});
//# sourceMappingURL=appstate.js.map