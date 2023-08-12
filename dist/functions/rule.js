"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAllRules = exports.getAllRulesWithTrigger = exports.executeAutomationRule = exports.rule = void 0;
const condition_1 = require("./condition");
const settings_json_1 = __importDefault(require("../config/settings.json"));
const crud_1 = require("./crud");
function rule({ callback, conditions, description, trigger, }) {
    if (typeof callback != "function")
        throw "rule: callback must be a function";
    if (!conditions || conditions.length === 0)
        throw "rule: must supply at least one condition";
    return { callback, conditions, description, trigger };
}
exports.rule = rule;
function executeAutomationRule(data, rule) {
    if ((0, condition_1.areAllConditionsMet)(data, rule)) {
        rule.callback(data);
        if (settings_json_1.default.logging.logSuccess) {
            (0, crud_1.logCallbackCaller)({ rule, isSuccess: true, data });
        }
    }
}
exports.executeAutomationRule = executeAutomationRule;
function getAllRulesWithTrigger(rules, trigger) {
    return rules.filter((rule) => rule.trigger === trigger);
}
exports.getAllRulesWithTrigger = getAllRulesWithTrigger;
function executeAllRules(rules, data) {
    rules.forEach((rule) => executeAutomationRule(data, rule));
}
exports.executeAllRules = executeAllRules;
