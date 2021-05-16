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
const react_bootstrap_1 = require("react-bootstrap");
const react_tagify_1 = __importDefault(require("@yaireo/tagify/dist/react.tagify")); // React-wrapper file
require("@yaireo/tagify/dist/tagify.css"); // Tagify CSS
const app_1 = require("../app");
const tonestate_1 = require("../../stores/tonestate");
const EditToneControl = () => {
    const openToneEdit = tonestate_1.ToneEditStore.useState((s) => s.isToneEditorOpen);
    const tone = tonestate_1.ToneEditStore.useState((s) => s.editTone);
    const saveFailed = false;
    const tagifySettings = { callbacks: null };
    const tagifyRef = {};
    const [updatedArtistTags, setUpdatedArtistsTags] = React.useState(null);
    const [updatedCategoryTags, setUpdatedCategoryTags] = React.useState(null);
    const handleSubmit = (event) => {
        event.preventDefault();
        //apply edits
        if (updatedArtistTags != null && updatedArtistTags.filter(t => t != null) != []) {
            tonestate_1.ToneEditStore.update((s) => {
                s.editTone.artists = updatedArtistTags.filter(t => t != null);
            });
        }
        if (updatedCategoryTags != null && updatedCategoryTags.filter(t => t != null) != []) {
            tonestate_1.ToneEditStore.update((s) => {
                s.editTone.categories = updatedCategoryTags.filter(t => t != null);
            });
        }
        // save tone. hack to ensure state updated before save
        setTimeout(() => {
            app_1.appViewModel.storeFavourite(tonestate_1.ToneEditStore.getRawState().editTone);
        }, 500);
        tonestate_1.ToneEditStore.update((s) => {
            s.isToneEditorOpen = false;
            s.tone = s.editTone;
        });
    };
    const handleCancel = () => {
        tonestate_1.ToneEditStore.update((s) => {
            s.isToneEditorOpen = false;
        });
    };
    const handleDelete = () => {
        app_1.appViewModel.deleteFavourite(tone);
        tonestate_1.ToneEditStore.update((s) => {
            s.isToneEditorOpen = false;
        });
    };
    React.useEffect(() => {
        /*tagifySettings.callbacks = {
          add: onTagifyAdd,
          remove: onTagifyRemove,
          input: onTagifyInput,
          invalid: onTagifyInvalid,
        };*/
    }, []);
    // callbacks for all of Tagify's events:
    const onTagifyAdd = (e) => {
        console.log("added:", e.detail);
    };
    const onTagifyRemove = (e) => {
        console.log("remove:", e.detail);
    };
    const onTagifyInput = (e) => {
        console.log("input:", e.detail);
    };
    const onTagifyInvalid = (e) => {
        console.log("invalid:", e.detail);
    };
    if (!openToneEdit)
        return React.createElement("div", null);
    else
        return (React.createElement(react_bootstrap_1.Modal, { show: openToneEdit, onHide: () => { } },
            React.createElement(react_bootstrap_1.Modal.Body, null,
                React.createElement("div", null,
                    React.createElement("p", null, "Edit Tone"),
                    React.createElement(react_bootstrap_1.Form, { onSubmit: handleSubmit },
                        React.createElement(react_bootstrap_1.Form.Group, { controlId: "formEditTone" },
                            React.createElement(react_bootstrap_1.Form.Label, null, "Title"),
                            React.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Enter a title for this tone", value: tone.name, onChange: (event) => {
                                    tonestate_1.ToneEditStore.update((s) => {
                                        s.editTone.name = event.target.value;
                                    });
                                } })),
                        React.createElement(react_bootstrap_1.Form.Group, { controlId: "formEditTone" },
                            React.createElement(react_bootstrap_1.Form.Label, null, "Description"),
                            React.createElement(react_bootstrap_1.Form.Control, { as: "textarea", rows: 2, placeholder: "Enter an optional description for this tone", value: tone.description, onChange: (event) => {
                                    tonestate_1.ToneEditStore.update((s) => {
                                        s.editTone.description = event.target.value;
                                    });
                                } })),
                        React.createElement(react_bootstrap_1.Form.Group, { controlId: "formArtists" },
                            React.createElement(react_bootstrap_1.Form.Label, null, "Artists"),
                            React.createElement(react_tagify_1.default, { value: tone.artists, onChange: (e) => {
                                    var _a;
                                    e.persist();
                                    if (((_a = e.target.value) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                        let list = JSON.parse(e.target.value).filter(t => t != null).map((t) => t.value);
                                        setUpdatedArtistsTags(list);
                                    }
                                    else {
                                        setUpdatedArtistsTags([]);
                                    }
                                } })),
                        React.createElement(react_bootstrap_1.Form.Group, { controlId: "formCategories" },
                            React.createElement(react_bootstrap_1.Form.Label, null, "Categories"),
                            React.createElement(react_tagify_1.default, { value: tone.categories, onChange: (e) => {
                                    var _a;
                                    e.persist();
                                    if (((_a = e.target.value) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                        let list = JSON.parse(e.target.value).filter(t => t != null).map((t) => t.value);
                                        setUpdatedCategoryTags(list);
                                    }
                                    else {
                                        setUpdatedCategoryTags([]);
                                    }
                                } })),
                        saveFailed ? (React.createElement(react_bootstrap_1.Alert, { variant: "danger" }, "Failed to save update.")) : (""),
                        React.createElement(react_bootstrap_1.Button, { variant: "secondary", type: "button", onClick: handleCancel }, "Cancel"),
                        React.createElement(react_bootstrap_1.Button, { variant: "danger", type: "button", className: "ms-4", onClick: handleDelete }, "Delete"),
                        React.createElement(react_bootstrap_1.Button, { variant: "primary", type: "submit", className: "float-end" }, "Save"))))));
};
exports.default = EditToneControl;
//# sourceMappingURL=edit-tone.js.map