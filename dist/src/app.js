"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_routes_1 = __importDefault(require("./controllers/routes/user.routes"));
require("reflect-metadata");
var db_1 = __importDefault(require("./loaders/db"));
(0, db_1.default)();
var app = (0, express_1.default)();
app.use('/users', user_routes_1.default);
exports.default = app;
