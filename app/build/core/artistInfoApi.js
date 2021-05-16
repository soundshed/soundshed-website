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
exports.ArtistInfoApi = void 0;
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
class ArtistInfoApi {
    constructor() {
        // credentials are optional
        this.spotifyApi = new spotify_web_api_node_1.default({
            clientId: '',
            clientSecret: '',
            redirectUri: 'https://api.soundshed.com//v1/spotifycallback'
        });
        this.apiToken = null;
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiToken) {
                // Get an access token and 'save' it using a setter
                yield new Promise((resolve, reject) => {
                    this.spotifyApi.clientCredentialsGrant().then((data) => {
                        console.log('The access token is ' + data.body['access_token']);
                        this.apiToken = data.body['access_token'];
                        this.spotifyApi.setAccessToken(data.body['access_token']);
                        resolve(this.apiToken);
                    }, (err) => {
                        console.log('Something went wrong!', err);
                        reject(err);
                    });
                });
            }
            return new Promise((resolve, reject) => {
                this.spotifyApi.searchArtists(query)
                    .then(function (data) {
                    console.log('Search artists by ' + query, data.body);
                    resolve(data.body);
                }, function (err) {
                    console.error(err);
                    resolve(err);
                });
            });
        });
    }
}
exports.ArtistInfoApi = ArtistInfoApi;
exports.default = ArtistInfoApi;
//# sourceMappingURL=artistInfoApi.js.map