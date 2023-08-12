"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.areAllConditionsMet = exports.stringifyCondition = exports.isConditionMet = exports.condition = void 0;
const mappings_1 = require("../config/mappings");
const operators = __importStar(require("../config/operators"));
const settings_json_1 = __importDefault(require("../config/settings.json"));
const crud_1 = require("./crud");
function condition(param, operator, value) {
    return {
        operator,
        param,
        value,
    };
}
exports.condition = condition;
function isConditionMet(condition, data) {
    const { operator, value } = condition;
    const mappedParam = mappings_1.mappings[condition.param];
    const param = data[mappedParam];
    const previousParam1 = data.previous ? data.previous[mappedParam] : null;
    let result;
    switch (operator) {
        case operators.equals:
            result = param == value;
            break;
        case operators.doesNotEqual:
            result = param != value;
            break;
        case operators.didEqual:
            result = previousParam1 == value;
            break;
        case operators.didNotEqual:
            result = previousParam1 != value;
            break;
        case operators.doesInclude:
            result = param.includes(value);
            break;
        case operators.doesNotInclude:
            result = !param.includes(value);
            break;
        case operators.isGreatherThan:
            result = param > value;
            break;
        case operators.isGreatherThanOrEqualTo:
            result = param >= value;
            break;
        case operators.isLessThan:
            result = param < value;
            break;
        case operators.isGreatherThanOrEqualTo:
            result = param <= value;
            break;
        case operators.isFalsy:
            result = !param;
            break;
        case operators.isTruthy:
            result = !!param;
            break;
        case operators.hasChanged:
            result = param !== previousParam1;
            break;
        case operators.hasNotChanged:
            result = param === previousParam1;
            break;
        default:
            throw `isConditionMet: Unrecognized operator ${operator}`;
    }
    return result;
}
exports.isConditionMet = isConditionMet;
function stringifyCondition(condition) {
    return `${condition.param} ${condition.operator} ${condition.value}`;
}
exports.stringifyCondition = stringifyCondition;
function areAllConditionsMet(data, rule) {
    let result = true;
    for (let condition of rule.conditions) {
        if (!isConditionMet(condition, data)) {
            if (settings_json_1.default.logging.logFailure) {
                (0, crud_1.logCallbackCaller)({
                    rule,
                    isSuccess: false,
                    failedCondition: condition,
                    data,
                });
            }
            result = false;
            break;
        }
    }
    return result;
}
exports.areAllConditionsMet = areAllConditionsMet;
