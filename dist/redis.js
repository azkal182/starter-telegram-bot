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
exports.removeData = exports.addData = exports.readData = void 0;
//const Redis = require('ioredis');
var ioredis_1 = __importDefault(require("ioredis"));
// Membuat koneksi Redis
// Fungsi untuk menambahkan data ke dalam array
function addData(userId, newData) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, key, currentData, parsedData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    redis = new ioredis_1.default("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    key = "data_".concat(userId);
                    return [4 /*yield*/, redis.get(key)];
                case 2:
                    currentData = _a.sent();
                    parsedData = [];
                    if (currentData) {
                        parsedData = JSON.parse(currentData);
                    }
                    parsedData.push(newData);
                    return [4 /*yield*/, redis.set(key, JSON.stringify(parsedData))];
                case 3:
                    _a.sent();
                    console.log('Data added successfully');
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Failed to add data:', error_1);
                    return [3 /*break*/, 6];
                case 5:
                    redis.quit(); // Menutup koneksi Redis
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.addData = addData;
// Fungsi untuk menghapus data dari array berdasarkan index
function removeData(userId, index) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, key, currentData, parsedData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    redis = new ioredis_1.default("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    key = "data_".concat(userId);
                    return [4 /*yield*/, redis.get(key)];
                case 2:
                    currentData = _a.sent();
                    parsedData = [];
                    if (currentData) {
                        parsedData = JSON.parse(currentData);
                    }
                    parsedData.splice(index, 1);
                    return [4 /*yield*/, redis.set(key, JSON.stringify(parsedData))];
                case 3:
                    _a.sent();
                    console.log('Data removed successfully');
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error('Failed to remove data:', error_2);
                    return [3 /*break*/, 6];
                case 5:
                    redis.quit(); // Menutup koneksi Redis
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.removeData = removeData;
function readData(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, key, currentData, parsedData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    redis = new ioredis_1.default("redis://default:5bUYu9Ekqu396XYeGjlaVPlPZn69DCSm@redis-13283.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13283");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    key = "data_".concat(userId);
                    return [4 /*yield*/, redis.get(key)];
                case 2:
                    currentData = _a.sent();
                    if (currentData) {
                        parsedData = JSON.parse(currentData);
                        console.log(parsedData);
                        return [2 /*return*/, parsedData];
                    }
                    else {
                        console.log('No data found');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error('Failed to read data:', error_3);
                    return [3 /*break*/, 5];
                case 4:
                    redis.quit(); // Menutup koneksi Redis
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.readData = readData;
