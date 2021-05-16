"use strict";
/*import { shell } from "electron";
import { ipcRenderer } from 'electron';

const openLink = (e, linkUrl) => {
    e.preventDefault();
    shell.openExternal(linkUrl, {});
  };
  
export {openLink, ipcRenderer as platformEvents};*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformEvents = exports.openLink = void 0;
const openLink = (e, linkUrl) => {
    e.preventDefault();
    // open link...
};
exports.openLink = openLink;
class PlatformEvents {
    constructor() {
        this.evtListeners = [];
    }
    invoke(type, data) {
        return new Promise(res => {
            var e = this.evtListeners.find(f => f.type == type);
            if (e != null) {
                console.log("invoking action type:" + type);
                e.action(type, data);
            }
            else {
                console.log("cannot invoke action type, no event listener:" + type);
            }
            res(true);
        });
    }
    on(type, action) {
        console.log("on type:" + type);
        evt.evtListeners.push({ type: type, action: action });
    }
}
;
const evt = new PlatformEvents();
exports.platformEvents = evt;
//# sourceMappingURL=platformUtils.js.map