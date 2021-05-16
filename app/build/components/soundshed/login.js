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
const React = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const appstate_1 = require("../../stores/appstate");
const LoginControl = ({ signInRequired, onSignIn, onRegistration }) => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [pwd, setPwd] = React.useState("");
    const [isRegMode, setIsRegMode] = React.useState(false);
    const [signInFailed, setSignInFailed] = React.useState(false);
    const [registrationFailed, setRegistrationFailed] = React.useState(false);
    const handleSignIn = (event) => {
        event.preventDefault();
        onSignIn({ email: email, password: pwd }).then((loggedIn) => {
            if (!loggedIn) {
                setSignInFailed(true);
            }
            else {
                setSignInFailed(false);
            }
        });
    };
    const handleRegister = (event) => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        onRegistration({ email: email, password: pwd, name: name }).then((loggedIn) => {
            if (!loggedIn) {
                setRegistrationFailed(true);
            }
            else {
                setRegistrationFailed(false);
            }
        });
    };
    const handleCancel = () => {
        appstate_1.AppStateStore.update((s) => {
            s.isSignInRequired = false;
        });
    };
    return (React.createElement(react_bootstrap_1.Modal, { show: signInRequired },
        React.createElement(react_bootstrap_1.Modal.Body, null,
            React.createElement("div", null,
                React.createElement("p", null,
                    "Sign in to your Soundshed.com account to share content with the community:",
                    !isRegMode ? (React.createElement(react_bootstrap_1.Button, { className: "btn btn-sm btn-secondary ms-2", onClick: () => {
                            setIsRegMode(true);
                        } }, "New User")) : (React.createElement(react_bootstrap_1.Button, { className: "btn btn-sm btn-secondary ms-2", onClick: () => {
                            setIsRegMode(false);
                        } }, "Existing User"))),
                React.createElement(react_bootstrap_1.Form, null,
                    isRegMode ? (React.createElement(react_bootstrap_1.Form.Group, { controlId: "formBasicName" },
                        React.createElement(react_bootstrap_1.Form.Label, null, "Name (public)"),
                        React.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: "Enter a name or nickname", value: name, onChange: (event) => {
                                setName(event.target.value);
                            } }))) : (""),
                    React.createElement(react_bootstrap_1.Form.Group, { controlId: "formBasicEmail" },
                        React.createElement(react_bootstrap_1.Form.Label, null, "Email address"),
                        React.createElement(react_bootstrap_1.Form.Control, { type: "email", placeholder: "Enter email", value: email, onChange: (event) => {
                                setEmail(event.target.value);
                            } })),
                    React.createElement(react_bootstrap_1.Form.Group, { controlId: "formBasicPassword" },
                        React.createElement(react_bootstrap_1.Form.Label, null, "Password"),
                        React.createElement(react_bootstrap_1.Form.Control, { type: "password", placeholder: "Password", value: pwd, onChange: (event) => {
                                setPwd(event.target.value);
                            } })),
                    React.createElement("div", { className: "mt-2" },
                        signInFailed ? (React.createElement(react_bootstrap_1.Alert, { variant: "danger" }, "Sign In failed. Check email address and password are correct.")) : (""),
                        registrationFailed ? (React.createElement(react_bootstrap_1.Alert, { variant: "danger" }, "Registration failed. Check email address and password are set and you are not using an email that's already registered.")) : (""),
                        React.createElement(react_bootstrap_1.Button, { variant: "secondary", type: "button", onClick: handleCancel }, "Cancel"),
                        !isRegMode ? (React.createElement(react_bootstrap_1.Button, { variant: "primary", type: "button", onClick: handleSignIn, className: "float-end" }, "Sign In")) : (React.createElement(react_bootstrap_1.Button, { variant: "info", type: "button", className: "float-end", onClick: handleRegister }, "New User"))))))));
};
exports.default = LoginControl;
//# sourceMappingURL=login.js.map