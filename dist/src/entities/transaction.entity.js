"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
var typeorm_1 = require("typeorm");
var user_entity_1 = __importDefault(require("./user.entity"));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEBIT"] = "debit";
    TransactionType["CREDIT"] = "credit";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var Transaction = /** @class */ (function () {
    function Transaction() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Transaction.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'enum',
            enum: TransactionType,
        }),
        __metadata("design:type", String)
    ], Transaction.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Transaction.prototype, "meta_data", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'numeric',
            precision: 20,
            scale: 4,
            nullable: false
        }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "balance_before", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'numeric',
            precision: 20,
            scale: 4,
            nullable: false
        }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "balance_after", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: 'numeric',
            precision: 20,
            scale: 4,
            nullable: false
        }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "amount", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)(),
        (0, typeorm_1.OneToOne)(function () { return user_entity_1.default; }, function (user) { return user.account; }, {
            nullable: false
        }),
        __metadata("design:type", user_entity_1.default)
    ], Transaction.prototype, "user", void 0);
    Transaction = __decorate([
        (0, typeorm_1.Entity)()
    ], Transaction);
    return Transaction;
}());
exports.default = Transaction;
