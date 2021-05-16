"use strict";
//const fetch = require('node-fetch');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparkAPI = void 0;
class SparkAPI {
    constructor() {
        this.access_token = "";
        this.userInfo = null;
        this.presetQueryParams = {
            "preset_for": "spark",
            "license_tier": null,
            "keyword": null,
            "category": null,
            "page": 1,
            "page_size": 20,
            "order": "latest",
            "tag": null
        };
        this.api_base = "https://api.positivegrid.com/v2";
    }
    log(msg) {
        console.log(msg);
    }
    login(user, pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            // perform login and get access token
            let url = this.api_base + "/auth";
            let payload = { "username": user, "password": pwd };
            //post to API as JSON
            let response = yield fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            let data = response.json();
            if (data.success == true) {
                this.access_token = data.token;
                this.log(`Got access token: ${this.access_token}`);
                return true;
            }
            else {
                this.log(`Login failed: ${JSON.stringify(data)}`);
                return false;
            }
            // example json response: 
            /*
            // OK
            {
                "success": true,
                "token": "token.stuff>"
            }
    
            // bad password
            {
                "errorMessage": "unauthorized",
                "code": "USER_UNAUTHORIZED",
                "status": 401
            }
            */
        });
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            // get user info
            let url = this.api_base + "/user";
            //post to API as JSON
            let response = yield fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.access_token },
                body: null, credentials: 'include'
            });
            let data = response.json();
            return data;
            // example json response: 
            /*
            {
                "success": true,
                "token": "token.stuff>"
            }
            */
            // edit profile: https://account.positivegrid.com/profile
        });
    }
    getToneCloudPresets(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryParams = Object.assign(this.presetQueryParams, query);
            this.presetQueryParams = queryParams;
            if (this.presetQueryParams.keyword == "")
                this.presetQueryParams.keyword = null;
            // get preset results
            let params = "?";
            for (const [key, value] of Object.entries(this.presetQueryParams)) {
                if (value != null) {
                    params += `${key}=${value}&`;
                }
            }
            params = params.substr(0, params.length - 1);
            let url = this.api_base + "/preset" + params;
            let response = yield fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            let data = response.json();
            return data;
        });
    }
    getToneCloudPresetsCreatedByUser(userId, page = 1, page_size = 32) {
        return __awaiter(this, void 0, void 0, function* () {
            //https://api.positivegrid.com/v2/user_create/4fa1ffb3727a300001000000?page=1&page_size=12&preset_for=fx2
            let url = `${this.api_base}/user_create/${userId}?page=${page}&page_size=${page_size}&preset_for=spark`;
            console.log(url);
            let response = yield fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            let data = response.json();
            return data;
        });
    }
    getToneCloudPreset(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // get preset info
            let url = this.api_base + "/preset/" + id;
            //post to API as JSON
            let response = yield fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                body: null, credentials: 'include'
            });
            let data = response.json();
            return data;
            // example json response: 
        });
    }
}
exports.SparkAPI = SparkAPI;
//# sourceMappingURL=sparkAPI.js.map