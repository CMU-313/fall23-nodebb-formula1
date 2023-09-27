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
const lodash_1 = __importDefault(require("lodash"));
const database_1 = __importDefault(require("../database"));
const plugins_1 = __importDefault(require("../plugins"));
module.exports = function (Bugs) {
    Bugs.create = function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = data.timestamp || Date.now();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            yield database_1.default.incrObjectField('global', 'nextBid');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            yield plugins_1.default.hooks.fire('filter:bug.create', { bug: data, data: data });
            /* eslint-disable max-len */
            // eslint-disable-next-line max-len, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions
            yield database_1.default.setObject(`bug:${data.bid}`, data);
            /* eslint-enable max-len */
            const timestampedSortedSetKeys = ['bugs:bid'];
            yield Promise.all([
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                database_1.default.sortedSetsAdd(timestampedSortedSetKeys, timestamp, data.bid),
            ]);
            yield plugins_1.default.hooks.fire('action:bug.save', { bug: lodash_1.default.clone(data), data: data });
            return data.bid;
        });
    };
    Bugs.post = function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Bugs.create(data);
            const bugData = data;
            yield plugins_1.default.hooks.fire('action:bug.post', { bug: bugData, data: data });
            return {
                bugData: bugData,
            };
        });
    };
};
