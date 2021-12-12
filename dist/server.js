"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var app_1 = __importDefault(require("./app"));
var PORT = config_1.default.get('port');
app_1.default.listen(PORT, function () {
    console.log('server is running at port', PORT);
});
