"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var config_1 = __importDefault(require("config"));
var path_1 = __importDefault(require("path"));
var entityPath = path_1.default.resolve(__dirname, '..', 'entities');
exports.default = (function () { return (0, typeorm_1.createConnection)({
    name: 'q-wallet',
    type: 'postgres',
    host: config_1.default.get('dbHost'),
    port: 5432,
    username: config_1.default.get('dbUsername'),
    password: config_1.default.get('dbPassword'),
    database: config_1.default.get('dbName'),
    entities: [
        "".concat(entityPath, "/*.js"),
        "".concat(entityPath, "/*.ts")
    ],
    synchronize: true,
    logging: false
})
    .then(function () {
    console.log('Sucessfully connected to db');
})
    .catch(function (err) {
    console.log('Could not connect to db', err);
    process.exit();
}); });
