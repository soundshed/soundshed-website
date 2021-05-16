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
const fx_param_1 = __importDefault(require("./fx-param"));
const app_1 = require("../app");
const devicestate_1 = require("../../stores/devicestate");
const FxControl = ({ fx, onFxParamChange, onFxToggle }) => {
    const fxCatalog = devicestate_1.DeviceStateStore.useState((s) => s.fxCatalog);
    const [fxList, setFxList] = React.useState([]);
    const [isExperimentalFxSelected, setIsExperimentalFxSelected,] = React.useState(false);
    const fxTypeId = React.useMemo(() => {
        return fx.type;
    }, [fx]);
    React.useEffect(() => {
        const fxDefinition = fxCatalog.catalog.find((t) => t.dspId == fx.type);
        if (fxDefinition) {
            const listOfSameTypeFx = fxCatalog.catalog.filter((t) => t.type == fxDefinition.type);
            setFxList(listOfSameTypeFx);
            setIsExperimentalFxSelected(fxDefinition.isExperimental == true);
        }
    }, [fx, fxCatalog]);
    const paramControls = fx.params.map((p) => (React.createElement(fx_param_1.default, { key: p.paramId.toString(), p: p, fx: fx, onFxParamChange: onFxParamChange })));
    const handleFxChange = (e) => {
        //this.setState({value: event.target.value});
        app_1.deviceViewModel
            .requestFxChange({ dspIdOld: fx.type, dspIdNew: e.target.value })
            .then(() => {
            // deviceViewModel.requestPresetConfig();
        });
    };
    const mapFxTypeIdToName = (t) => {
        var _a, _b;
        if (fxCatalog) {
            var fxItem = fxCatalog.catalog.find((f) => f.dspId == t);
            if (fxItem) {
                return ((_b = (_a = fxCatalog.types.find((i) => i.id == fxItem.type)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : t.replace("pg.spark40.", ""));
            }
            else {
                return t.replace("pg.spark40.", "");
            }
        }
        else {
            return t;
        }
    };
    const fxToggle = () => {
        onFxToggle({
            dspId: fx.type,
            value: fx.enabled == true ? "0" : "1",
            type: "toggle",
        });
    };
    return (React.createElement("div", { className: "fx" },
        React.createElement("label", { className: "fx-type" }, mapFxTypeIdToName(fxTypeId)),
        React.createElement("div", null,
            React.createElement("h4", { className: "preset-name" }, fx.name),
            React.createElement("select", { value: fxTypeId, onChange: handleFxChange }, fxList.map((e, key) => {
                return (React.createElement("option", { key: key, value: e.dspId }, e.name));
            })),
            isExperimentalFxSelected ? (React.createElement("span", { className: "badge rounded-pill bg-danger m-1", title: "Experimental FX - may not work at all." }, "Experimental FX")) : (""),
            React.createElement("div", { className: "fx-controls" },
                React.createElement(fx_param_1.default, { type: "switch", p: "toggle", fx: fx, onFxParamChange: onFxToggle }),
                fx.enabled ? (React.createElement("span", { className: "badge rounded-pill bg-success", onClick: fxToggle }, "On")) : (React.createElement("span", { className: "badge rounded-pill bg-danger", onClick: fxToggle }, "Off")),
                React.createElement("div", { className: "mt-2" }, paramControls)))));
};
exports.default = FxControl;
//# sourceMappingURL=fx-control.js.map