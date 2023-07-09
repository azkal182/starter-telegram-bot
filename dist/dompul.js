"use strict";
//const fetch = require('node-fetch');
//const fs = require('fs');
//const Redis = require('ioredis');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
var ioredis_1 = __importDefault(require("ioredis"));
var login_email = 'mohazkalarif96@gmail.com';
var file_output = './xl.json';
function login() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, statusCode, statusDescription;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Login ".concat(login_email, "..."));
                    return [4 /*yield*/, fetch('https://srg-txl-login-controller-service.ext.dp.xl.co.id/v2/auth/email/' + login_email, {
                            method: 'POST',
                            headers: {
                                'x-dynatrace': 'MT_3_2_763403741_15-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_30_456_73',
                                'accept': 'application/json',
                                'authorization': 'Basic ZGVtb2NsaWVudDpkZW1vY2xpZW50c2VjcmV0',
                                'language': 'en',
                                'version': '4.1.2',
                                'user-agent': 'okhttp/3.12.1'
                            },
                            body: ''
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    statusCode = data.statusCode;
                    if (statusCode === 200) {
                        console.log('OTP Sent...');
                    }
                    else {
                        statusDescription = data.statusDescription;
                        console.log("[".concat(statusCode, "] ").concat(statusDescription));
                        process.exit(100);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function send_otp() {
    return __awaiter(this, void 0, void 0, function () {
        var otp, response, data, statusCode, accessToken, refreshToken, tokenData, statusDescription;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getInput('Insert OTP: ')];
                case 1:
                    otp = _a.sent();
                    return [4 /*yield*/, fetch("https://srg-txl-login-controller-service.ext.dp.xl.co.id/v2/auth/email/".concat(login_email, "/").concat(otp, "/000000000000000"), {
                            method: 'GET',
                            headers: {
                                'x-dynatrace': 'MT_3_2_763403741_15-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_30_456_73',
                                'accept': 'application/json',
                                'authorization': 'Basic ZGVtb2NsaWVudDpkZW1vY2xpZW50c2VjcmV0',
                                'language': 'en',
                                'version': '4.1.2',
                                'user-agent': 'okhttp/3.12.1'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    statusCode = data.statusCode;
                    if (!(statusCode === 200)) return [3 /*break*/, 5];
                    accessToken = data.result.data.accessToken;
                    refreshToken = data.result.data.refreshToken;
                    tokenData = {
                        emailToken: login_email,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    };
                    //fs.writeFileSync('./xl.token', JSON.stringify(tokenData));
                    return [4 /*yield*/, saveSession(tokenData)];
                case 4:
                    //fs.writeFileSync('./xl.token', JSON.stringify(tokenData));
                    _a.sent();
                    console.log('OTP Verified...');
                    console.log("Access Token: ".concat(accessToken));
                    console.log("Refresh Token: ".concat(refreshToken));
                    return [3 /*break*/, 6];
                case 5:
                    statusDescription = data.statusDescription;
                    console.log("[".concat(statusCode, "] ").concat(statusDescription));
                    process.exit(100);
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getInput(question) {
    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(function (resolve) {
        rl.question(question, function (answer) {
            rl.close();
            resolve(answer);
        });
    });
}
function refresh_token() {
    return __awaiter(this, void 0, void 0, function () {
        var token, emailToken, refreshToken, response, data, statusCode, accessToken, refreshToken_1, newTokenData, statusDescription;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readSession()];
                case 1:
                    token = _a.sent();
                    if (!token) return [3 /*break*/, 13];
                    emailToken = token.emailToken;
                    if (!(login_email === emailToken)) return [3 /*break*/, 9];
                    console.log('Refreshing token...');
                    refreshToken = token.refreshToken;
                    return [4 /*yield*/, fetch('https://srg-txl-login-controller-service.ext.dp.xl.co.id/v1/login/token/refresh', {
                            method: 'POST',
                            headers: {
                                'x-dynatrace': 'MT_3_3_763403741_21-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_0_209_44',
                                'accept': 'application/json',
                                'authorization': 'Basic ZGVtb2NsaWVudDpkZW1vY2xpZW50c2VjcmV0',
                                'language': 'en',
                                'version': '4.1.2',
                                'content-type': 'application/x-www-form-urlencoded',
                                'user-agent': 'okhttp/3.12.1'
                            },
                            body: "grant_type=refresh_token&refresh_token=".concat(refreshToken, "&imei=000000000000000")
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    statusCode = data.statusCode;
                    if (!(statusCode === 200)) return [3 /*break*/, 5];
                    accessToken = data.result.accessToken;
                    refreshToken_1 = data.result.refreshToken;
                    newTokenData = {
                        emailToken: login_email,
                        accessToken: accessToken,
                        refreshToken: refreshToken_1
                    };
                    return [4 /*yield*/, saveSession(newTokenData)
                        //fs.writeFileSync('./xl.token', JSON.stringify(newTokenData));
                    ];
                case 4:
                    _a.sent();
                    //fs.writeFileSync('./xl.token', JSON.stringify(newTokenData));
                    console.log('Token refreshed');
                    return [3 /*break*/, 8];
                case 5:
                    console.log('Failed to refresh the token');
                    statusDescription = data.statusDescription;
                    console.log("[".concat(statusCode, "] ").concat(statusDescription));
                    return [4 /*yield*/, login()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, send_otp()];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [3 /*break*/, 12];
                case 9: return [4 /*yield*/, login()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, send_otp()];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12: return [3 /*break*/, 16];
                case 13: return [4 /*yield*/, login()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, send_otp()];
                case 15:
                    _a.sent();
                    _a.label = 16;
                case 16: return [2 /*return*/];
            }
        });
    });
}
function cek_kuota_data(nomer) {
    return __awaiter(this, void 0, void 0, function () {
        var nomer_hp, tokenData, accessToken, response, data, statusCode, packageData, statusDescription, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nomer_hp = nomer;
                    if (nomer.startsWith("62")) {
                        // Nomor telepon sudah dalam format internasional, tidak perlu diubah
                        nomer_hp = nomer;
                    }
                    else if (nomer.startsWith("08")) {
                        // Ubah nomor telepon dari format lokal ke format internasional
                        nomer_hp = nomer.replace(/^08/, "62");
                    }
                    else {
                        console.log('nomor hp tidak valid');
                        nomer_hp = nomer;
                    }
                    console.log("Cek kuota ".concat(nomer_hp, "..."));
                    return [4 /*yield*/, readSession()];
                case 1:
                    tokenData = _a.sent();
                    accessToken = tokenData.accessToken;
                    return [4 /*yield*/, fetch("https://srg-txl-utility-service.ext.dp.xl.co.id/v2/package/check/".concat(nomer_hp), {
                            method: 'GET',
                            headers: {
                                'x-dynatrace': 'MT_3_1_763403741_16-0_a5734da2-0ecb-4c8d-8d21-b008aeec4733_0_396_167',
                                'accept': 'application/json',
                                'authorization': "Bearer ".concat(accessToken),
                                'language': 'en',
                                'version': '4.1.2',
                                'user-agent': 'okhttp/3.12.1'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    statusCode = data.statusCode;
                    if (statusCode === 200) {
                        console.log(JSON.stringify(data, null, 2));
                        packageData = data.result.data;
                        //const formattedData = packageData.map(item => `${item.NAME}: ${item.VALUE}`).join('\n').replace(/NAME/g, '\nNAME') + '\n\n=====PRESS "q" TO EXIT=====';
                        //  console.log(JSON.stringify(packageData));
                        return [2 /*return*/, packageData];
                    }
                    else {
                        statusDescription = data.statusDescription;
                        errorMessage = data.result.errorMessage;
                        console.log("[".concat(statusCode, "] ").concat(statusDescription));
                        console.log(errorMessage);
                        return [2 /*return*/, errorMessage
                            //process.exit(100);
                        ];
                        //process.exit(100);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getData(number) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, refresh_token()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cek_kuota_data(number)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    err_1 = _a.sent();
                    console.log('error cek kuota : ' + err_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    console.log('error refresh token : ' + err_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.getData = getData;
function saveSession(data) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, key, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    redis = new ioredis_1.default("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    key = "sessions";
                    return [4 /*yield*/, redis.set(key, JSON.stringify(data))];
                case 2:
                    _a.sent();
                    console.log('Session saved successfully');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to save session:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    redis.quit(); // Menutup koneksi Redis
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function readSession() {
    return __awaiter(this, void 0, void 0, function () {
        var redis, key, currentData, parsedData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    redis = new ioredis_1.default("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    key = "sessions";
                    return [4 /*yield*/, redis.get(key)];
                case 2:
                    currentData = _a.sent();
                    if (currentData) {
                        parsedData = JSON.parse(currentData);
                        console.log(parsedData);
                        return [2 /*return*/, parsedData];
                    }
                    else {
                        console.log('No session found');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Failed to read session:', error_2);
                    return [3 /*break*/, 5];
                case 4:
                    redis.quit(); // Menutup koneksi Redis
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
//const test = getData('6287891276651')
//console.log(test)
/*

login()
  .then(() => send_otp())
  .catch

*/
