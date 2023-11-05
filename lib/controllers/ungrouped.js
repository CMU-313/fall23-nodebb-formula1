"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = void 0;
const helpers_1 = __importDefault(require("./helpers"));
const topics_1 = __importDefault(require("../topics"));
const user_1 = __importDefault(require("../user"));
const groups_1 = __importDefault(require("../groups"));
// eslint-disable-next-line import/prefer-default-export
const get = function (req, res, next) {
  return __awaiter(this, void 0, void 0, function* () {
    const {
      uid
    } = req;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const ungroupedTopicsData = yield topics_1.default.getUngroupedTopics(uid); // Ungrouped topics
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const userGroups = (yield groups_1.default.getUserGroups([uid]))[0];
    if (!ungroupedTopicsData || !userGroups) {
      return next();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const [canPost] = yield user_1.default.exists([uid]);
    const breadcrumbs = [{
      text: 'Ungrouped'
    }];
    const data = Object.assign(Object.assign({}, ungroupedTopicsData), {
      groups: userGroups,
      uid: uid,
      canPost,
      title: 'Ungrouped Topics',
      breadcrumbs: helpers_1.default.buildBreadcrumbs(breadcrumbs)
    });
    res.render('ungrouped', data);
  });
};
exports.get = get;