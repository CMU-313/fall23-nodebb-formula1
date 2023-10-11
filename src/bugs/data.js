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
const database_1 = __importDefault(require("../database"));
module.exports = function (Bugs) {
    Bugs.list = function () {
        return __awaiter(this, void 0, void 0, function* () {
            /* eslint-disable max-len */
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const bid = yield database_1.default.getObjectField('global', 'nextBid');
            /* eslint-enable max-len */
            const bugs = [];
            const fields = ['title', 'description', 'resolved'];
            for (let i = 1; i < bid; i += 1) {
                bugs.push(`bug:${i}`);
            }
            /* eslint-disable max-len */
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
            const result = yield database_1.default.getObjects(bugs, fields);
            /* eslint-enable max-len */
            return result;
        });
    };
};
