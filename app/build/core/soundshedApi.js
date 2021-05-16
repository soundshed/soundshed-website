"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundshedApi = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
class SoundshedApi {
    constructor() {
        this.baseUrl = "https://api.soundshed.com/app/v1/"; //"http://localhost:3000/api/v1/";
        let authToken = localStorage.getItem("_authtoken");
        if (authToken) {
            this.currentToken = authToken;
        }
    }
    getCurrentUserInfo() {
        if (this.currentToken) {
            let decoded = jwt_decode_1.default(this.currentToken);
            return {
                id: decoded.id,
                name: decoded.name
            };
        }
        else {
            return null;
        }
    }
    isUserSignedIn() {
        if (this.currentToken) {
            return true;
        }
        else {
            return false;
        }
    }
    signOut() {
        this.currentToken = null;
        localStorage.removeItem("_authtoken");
    }
    registerUser(registration) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.baseUrl + "user/register";
            let response = yield fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(registration) });
            let result = yield response.json();
            if (result.error == null) {
                return { completedOk: true, message: "OK", result: result };
            }
            else {
                return {
                    completedOk: false, message: result.error
                };
            }
        });
    }
    login(loginDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.baseUrl + "user/login";
            let response = yield fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginDetails) });
            let result = yield response.json();
            if (result.error == null) {
                this.currentToken = result.data.token;
                localStorage.setItem("_authtoken", this.currentToken);
                return { completedOk: true, message: "OK", result: result };
            }
            else {
                return {
                    completedOk: false, message: result.error
                };
            }
        });
    }
    updateTone(tone) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.baseUrl + "tones/upload";
            let response = yield fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.currentToken}` }, body: JSON.stringify(tone) });
            let result = yield response.json();
            if (result.error == null) {
                return { completedOk: true, message: "OK", result: result };
            }
            else {
                return {
                    completedOk: false, message: result.error
                };
            }
        });
    }
    getTones() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.baseUrl + "tones/";
            let response = yield fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            let result = yield response.json();
            if (result.error == null) {
                return { completedOk: true, message: "OK", result: result.data.tones };
            }
            else {
                return {
                    completedOk: false, message: result.error
                };
            }
        });
    }
}
exports.SoundshedApi = SoundshedApi;
//# sourceMappingURL=soundshedApi.js.map