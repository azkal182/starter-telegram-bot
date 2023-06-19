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
        while (_) try {
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
exports.__esModule = true;
var grammy_1 = require("grammy");
var dompul_js_1 = __importDefault(require("./dompul.js"));
var conversations_1 = require("@grammyjs/conversations");
var express_1 = __importDefault(require("express"));
var redis_js_1 = require("./redis.js");
// Create a bot using the Telegram token
var bot = new grammy_1.Bot(process.env.TELEGRAM_TOKEN || "5824625543:AAEslB26tupftKCDQTs0OULDa1uYWxv6XfM");
bot.use((0, grammy_1.session)({
    initial: function () {
        // return empty object for now
        return {};
    }
}));
bot.use((0, conversations_1.conversations)());
bot.use((0, conversations_1.createConversation)(addAccount, 'add-account'));
function addAccount(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var name, num;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //await ctx.deleteMessage()
                return [4 /*yield*/, ctx.reply("Masukan nama akun")];
                case 1:
                    //await ctx.deleteMessage()
                    _a.sent();
                    return [4 /*yield*/, conversation.wait()];
                case 2:
                    name = _a.sent();
                    //@ts-ignore
                    ctx.session.name = name.message.text;
                    return [4 /*yield*/, ctx.reply("Masukan nomor akun, ".concat(name.message.text, "!"))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, conversation.wait()];
                case 4:
                    num = _a.sent();
                    //@ts-ignore
                    ctx.session.num = num.message.text;
                    // Simpan name dan number ke dalam database berdasarkan ID user
                    return [4 /*yield*/, (0, redis_js_1.addData)(ctx.from.id, { name: name.message.text, phone: num.message.text.replace(/[^\d]/g, '') })];
                case 5:
                    // Simpan name dan number ke dalam database berdasarkan ID user
                    _a.sent();
                    // Menutup koneksi ke server MongoDB
                    return [4 /*yield*/, ctx.reply('akun berhasil disimpan ')
                        //await ctx.reply(`akun, ${name.message.text} - ${num.message.text}!`);
                    ];
                case 6:
                    // Menutup koneksi ke server MongoDB
                    _a.sent();
                    //await ctx.reply(`akun, ${name.message.text} - ${num.message.text}!`);
                    ctx.session = {};
                    return [4 /*yield*/, showMenu(ctx)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
bot.command("start", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, showMenu(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.callbackQuery("tambah", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            //@ts-ignore
            return [4 /*yield*/, ctx.conversation.enter("add-account")];
            case 1:
                //@ts-ignore
                _a.sent();
                return [4 /*yield*/, ctx.deleteMessage()];
            case 2:
                _a.sent();
                return [4 /*yield*/, ctx.answerCallbackQuery()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.callbackQuery("hapus", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.deleteMessage()];
            case 1:
                _a.sent();
                return [4 /*yield*/, showMenuDelete(ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.callbackQuery(/^\/remove_(.*)$/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var message, index, phone, inlineKeyboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.deleteMessage()];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.api.sendChatAction(ctx.chat.id, 'typing')];
            case 2:
                _a.sent();
                message = ctx.match[1].split('-');
                index = message[0];
                phone = message[1];
                inlineKeyboard = new grammy_1.InlineKeyboard().text('Hapus', "/confirm_".concat(index)).text('Batal', "/batal");
                return [4 /*yield*/, ctx.api.sendChatAction(ctx.chat.id, 'typing')];
            case 3:
                _a.sent();
                console.log('index = ', index);
                console.log('phone = ', phone);
                ctx.reply("Apakah anda yakin akan menghapus akun dengan nomor - ".concat(phone), { reply_markup: inlineKeyboard });
                return [2 /*return*/];
        }
    });
}); });
bot.callbackQuery(/^\/confirm_(.*)$/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var index, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                index = ctx.match[1];
                console.log(ctx.from.id);
                console.log(index);
                return [4 /*yield*/, ctx.deleteMessage()];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.api.sendChatAction(ctx.chat.id, 'typing')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 7, , 9]);
                return [4 /*yield*/, (0, redis_js_1.removeData)(ctx.from.id, index)];
            case 4:
                _a.sent();
                return [4 /*yield*/, ctx.reply('Akun berhasil dihapus')];
            case 5:
                _a.sent();
                return [4 /*yield*/, showMenu(ctx)];
            case 6:
                _a.sent();
                return [3 /*break*/, 9];
            case 7:
                err_1 = _a.sent();
                return [4 /*yield*/, ctx.reply('Gagal menghapus Akun!')];
            case 8:
                _a.sent();
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
bot.callbackQuery('/batal', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.deleteMessage()];
            case 1:
                _a.sent();
                return [4 /*yield*/, showMenu(ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.callbackQuery(/^\/number_(.*)$/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var number, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.api.sendChatAction(ctx.chat.id, 'typing')];
            case 1:
                _a.sent();
                number = ctx.match[1];
                return [4 /*yield*/, (0, dompul_js_1["default"])(number)];
            case 2:
                data = _a.sent();
                return [4 /*yield*/, ctx.deleteMessage()];
            case 3:
                _a.sent();
                if (!data.packageInfo) return [3 /*break*/, 5];
                console.log(data);
                return [4 /*yield*/, sendResultToUser(ctx, data.packageInfo)];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, ctx.reply(data)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
// Suggest commands in the menu
bot.api.setMyCommands([
    {
        command: "menu",
        description: "show menu"
    },
]);
// Handle all other messages and the /start command
var introductionMessage = "Hello! I'm a Telegram bot.\nI'm powered by Cyclic, the next-generation serverless computing platform.\n\n<b>Commands</b>\n/yo - Be greeted by me\n/effect [text] - Show a keyboard to apply text effects to [text]";
bot.command("menu", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, showMenu(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.command("setMenu", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bot.api.setMyCommands([
                    { command: "yo", description: "Be greeted by the bot" },
                    {
                        command: "effect",
                        description: "Apply text effects on the text. (usage: /effect [text])"
                    },
                    {
                        command: "menu",
                        description: "show menu"
                    },
                ])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function showMenuDelete(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var inlineKeyboard, numbers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inlineKeyboard = new grammy_1.InlineKeyboard();
                    return [4 /*yield*/, ctx.api.sendChatAction(ctx.chat.id, 'typing')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, redis_js_1.readData)(ctx.from.id)];
                case 2:
                    numbers = _a.sent();
                    numbers.forEach(function (option, index) {
                        inlineKeyboard.text(option.name.toUpperCase() + ' - ' + option.phone, "/remove_".concat(index, "-").concat(option.phone)).row();
                    });
                    return [4 /*yield*/, ctx.reply("Pilih akun yang akan dihapus", {
                            reply_markup: inlineKeyboard
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function showMenu(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var inlineKeyboard, numbers, list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inlineKeyboard = new grammy_1.InlineKeyboard();
                    return [4 /*yield*/, ctx.api.sendChatAction(ctx.chat.id, 'typing')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, redis_js_1.readData)(ctx.from.id)];
                case 2:
                    numbers = _a.sent();
                    numbers.forEach(function (option) {
                        inlineKeyboard.text(option.name.toUpperCase(), '/number_' + option.phone).row(); // Menambahkan tombol dengan teks dan nilai yang sama
                    });
                    inlineKeyboard.text('➕ Tambah ', 'tambah');
                    inlineKeyboard.text('❌  Hapus ', 'hapus');
                    list = '';
                    numbers.map(function (number, i) {
                        list += "".concat(i + 1, ". ").concat(number.name, " - ").concat(number.phone, "\n");
                    });
                    return [4 /*yield*/, ctx.reply("ID : ".concat(ctx.from.id, "\n\nDaftar Nomor Tersimpan: \n").concat(list), {
                            reply_markup: inlineKeyboard
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendResultToUser(ctx, data) {
    // Ubah format hasil menjadi pesan yang dapat dikirim ke pengguna
    var message = '';
    message += "ID : ".concat(ctx.from.id, "\n\n");
    message += 'info Paket Aktif\n';
    data.forEach(function (item, index, arr) {
        var name = item[0].packages.name;
        var expDate = item[0].packages.expDate.split(' ')[0];
        message += "\uD83D\uDCE6 Nama Paket: ".concat(name, "\n");
        message += "\uD83D\uDCC5 Expired: ".concat(expDate, "\n");
        message += "===========================\n";
        var bname = item[0].benefits;
        bname.forEach(function (benefit, index, arr) {
            message += "\u2B50\uFE0F Benefit: ".concat(benefit.bname, "\n");
            message += "\uD83D\uDC99 Quota: ".concat(benefit.quota, "\n");
            message += "\u2705 Sisa Quota: ".concat(benefit.remaining, "\n");
            if (index !== arr.length - 1) {
                message += "\n"; // Menambahkan jarak dengan \n
            }
        });
        if (index !== arr.length - 1) {
            message += "\n"; // Menambahkan jarak dengan \n
        }
        // message += `===========================\n\n`;
    });
    // Kirim pesan ke pengguna
    ctx.reply(message);
    //console.log(message)
}
// Start the server
if (process.env.NODE_ENV === "production") {
    // Use Webhooks for the production server
    var app = (0, express_1["default"])();
    app.use(express_1["default"].json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    var PORT_1 = process.env.PORT || 3000;
    app.listen(PORT_1, function () {
        console.log("Bot listening on port ".concat(PORT_1));
    });
}
else {
    // Use Long Polling for development
    console.log('run locally');
    bot.start();
}
