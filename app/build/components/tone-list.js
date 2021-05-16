"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const app_1 = require("./app");
const ToneListControl = ({ toneList, favourites, onApplyTone, onEditTone, noneMsg, enableToneEditor, }) => {
    let noResultsMessage = noneMsg !== null && noneMsg !== void 0 ? noneMsg : "No results";
    react_1.useEffect(() => { }, [toneList, favourites]);
    const isFavouriteTone = (t) => {
        if (favourites.find((f) => f.toneId == t.toneId ||
            (t.toneId != null && f.externalId == t.externalId))) {
            return true;
        }
        else {
            return false;
        }
    };
    const saveFavourite = (t) => {
        app_1.appViewModel.storeFavourite(t, false);
    };
    const deleteFavourite = (t) => {
        app_1.appViewModel.deleteFavourite(t);
    };
    const mapDeviceType = (t) => {
        if (t == "pg.spark40") {
            return "Spark 40";
        }
        else {
            return "Unknown Device Type";
        }
    };
    const formatCategoryTags = (items, variant = "secondary") => {
        return items.map((i, idx) => (react_1.default.createElement("span", { key: idx, className: "badge rounded-pill bg-" + variant }, i)));
    };
    const renderToneList = () => {
        return toneList.map((tone) => (react_1.default.createElement("div", { key: tone.toneId, className: "tone" },
            react_1.default.createElement("div", { className: "row" },
                tone.imageUrl ? (react_1.default.createElement("div", { className: "col-md-1" },
                    react_1.default.createElement("button", { className: "btn btn-sm btn-secondary", onClick: () => {
                            onApplyTone(tone);
                        } }, "\u25B6"),
                    react_1.default.createElement("img", { src: tone.imageUrl, width: "64px" }))) : (react_1.default.createElement("div", { className: "col-md-1" },
                    react_1.default.createElement("button", { className: "btn btn-sm btn-secondary", onClick: () => {
                            onApplyTone(tone);
                        } }, "\u25B6"))),
                enableToneEditor ? (react_1.default.createElement("div", { className: "col-md-1 ms-2" },
                    react_1.default.createElement("button", { className: "btn btn-sm btn-secondary", onClick: () => {
                            onEditTone(tone);
                        } }, "\uD83D\uDCDD"))) : (""),
                react_1.default.createElement("div", { className: "col-md-4" },
                    react_1.default.createElement("label", null, tone.name),
                    react_1.default.createElement("p", null, tone.description)),
                react_1.default.createElement("div", { className: "col-md-4" },
                    react_1.default.createElement("span", { className: "badge rounded-pill bg-primary" }, mapDeviceType(tone.deviceType)),
                    formatCategoryTags(tone.artists, "dark"),
                    formatCategoryTags(tone.categories, "success")),
                react_1.default.createElement("div", { className: "col-md-1" }, (() => {
                    if (isFavouriteTone(tone) == true) {
                        return (react_1.default.createElement("button", { className: "btn btn-sm btn-danger", onClick: () => {
                                deleteFavourite(tone);
                            } }, "\uD83D\uDDD1"));
                    }
                    else {
                        return (react_1.default.createElement("button", { className: "btn btn-sm btn-primary", onClick: () => {
                                saveFavourite(tone);
                            } },
                            " ",
                            "\u2B50"));
                    }
                })())))));
    };
    return (react_1.default.createElement("div", null, !toneList || toneList.length == 0 ? (react_1.default.createElement("div", null, noResultsMessage)) : (react_1.default.createElement("div", null, renderToneList()))));
};
exports.default = ToneListControl;
//# sourceMappingURL=tone-list.js.map