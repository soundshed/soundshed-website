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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_player_1 = __importDefault(require("react-player"));
//import { shell } from "electron";
const app_1 = require("./app");
const react_bootstrap_1 = require("react-bootstrap");
const lessonstate_1 = require("../stores/lessonstate");
const uifeaturetoggles_1 = require("../stores/uifeaturetoggles");
const LessonsControl = () => {
    const enableLessons = uifeaturetoggles_1.UIFeatureToggleStore.useState((s) => s.enableLessons);
    const videoSearchResults = lessonstate_1.LessonStateStore.useState((s) => s.searchResults);
    const favourites = lessonstate_1.LessonStateStore.useState((s) => s.favourites);
    const [view, setView] = React.useState("backingtracks");
    const [playVideoId, setPlayVideoId] = React.useState("");
    const [keyword, setKeyword] = React.useState("");
    const isFavourite = (v) => {
        if (favourites.find((f) => f.itemId == v.itemId)) {
            return true;
        }
        else {
            return false;
        }
    };
    const saveFavourite = (t) => {
        app_1.lessonManager.storeFavourite(t);
    };
    const deleteFavourite = (t) => {
        app_1.lessonManager.deleteFavourite(t);
    };
    React.useEffect(() => {
        if (videoSearchResults == null || videoSearchResults.length == 0) {
            app_1.lessonManager.getVideoSearchResults(true, "backing track");
            console.log("Lessons updating.");
        }
    }, []);
    React.useEffect(() => { }, [videoSearchResults]);
    const playVideo = (v) => {
        setPlayVideoId(v.itemId);
        lessonstate_1.LessonStateStore.update(s => { s.playingVideoUrl = v.url; });
    };
    const onSearch = () => {
        app_1.lessonManager.getVideoSearchResults(false, "backing track " + keyword);
    };
    const onKeySearch = (event) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };
    const renderView = () => {
        switch (view) {
            case "backingtracks":
                return (React.createElement("div", { className: "m-2" },
                    React.createElement(react_bootstrap_1.Form, null,
                        React.createElement(react_bootstrap_1.Form.Group, { controlId: "formSearch" },
                            React.createElement(react_bootstrap_1.Form.Label, null, "Keyword"),
                            React.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Search by keyword", value: keyword, onChange: (event) => {
                                    setKeyword(event.target.value);
                                }, onKeyPress: onKeySearch }))),
                    React.createElement("button", { className: "btn btn-sm btn-success", onClick: onSearch }, "Search"),
                    listVideoItems(videoSearchResults)));
            case "favourites":
                return React.createElement("div", { className: "m-2" }, listVideoItems(favourites));
        }
    };
    const listVideoItems = (results) => {
        if (!results) {
            return React.createElement("div", null, "No Results");
        }
        else {
            return results.map((v) => (React.createElement("div", { className: "video-search-result row", key: v.itemId, onClick: () => {
                    playVideo(v);
                } },
                React.createElement("div", { className: "col-md-10" },
                    React.createElement("h5", null, v.title),
                    React.createElement("img", { src: v.thumbnailUrl, className: playVideoId == v.itemId ? "now-playing" : "" }),
                    React.createElement("span", { className: "badge rounded-pill bg-primary" }, v.channelTitle)),
                React.createElement("div", { className: "col-md-2" }, (() => {
                    if (isFavourite(v) == true) {
                        return (React.createElement("button", { className: "btn btn-sm btn-danger", onClick: () => {
                                deleteFavourite(v);
                            } }, "\uD83D\uDDD1"));
                    }
                    else {
                        return (React.createElement("button", { className: "btn btn-sm btn-primary", onClick: () => {
                                saveFavourite(v);
                            } },
                            " ",
                            "\u2B50"));
                    }
                })()))));
        }
    };
    return (React.createElement("div", { className: "about-intro" },
        React.createElement("h1", null, "Jam"),
        enableLessons == false ? (React.createElement("div", null,
            React.createElement("p", null, "Lessons and Jam Tracks."),
            React.createElement(react_bootstrap_1.Nav, { variant: "tabs", activeKey: view, onSelect: (selectedKey) => setView(selectedKey) },
                React.createElement(react_bootstrap_1.Nav.Item, null,
                    React.createElement(react_bootstrap_1.Nav.Link, { eventKey: "backingtracks" }, "Backing Tracks")),
                React.createElement(react_bootstrap_1.Nav.Item, null,
                    React.createElement(react_bootstrap_1.Nav.Link, { eventKey: "favourites" }, "Favourites"))),
            renderView())) : (React.createElement("div", null,
            React.createElement("p", null, " Browse lessons curated by the community."),
            React.createElement("div", { className: "lesson-summary" },
                React.createElement("h2", null, "Steve Stine : Fretboard Mastery Lesson Series"),
                React.createElement("p", null, "This course walks through common challenges for fully learning the guitar.")),
            React.createElement(react_player_1.default, { controls: true, url: "https://www.youtube.com/watch?v=Piu3BF-bUHA&list=PLn8Cg_n-kuKCd6O9kDsTS2kLR2SvhFlHz" })))));
};
exports.default = LessonsControl;
//# sourceMappingURL=lessons.js.map