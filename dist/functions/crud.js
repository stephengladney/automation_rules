"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogCallback = exports.getRules = exports.addRule = exports.logCallbackCaller = exports.logCallback = exports.rules = void 0;
exports.rules = [];
function logCallbackCaller({ rule, isSuccess, failedCondition, data, }) {
    (0, exports.logCallback)({ rule, isSuccess, failedCondition, data });
}
exports.logCallbackCaller = logCallbackCaller;
function addRule(rule) {
    exports.rules.push(rule);
}
exports.addRule = addRule;
function getRules({ withTrigger }) {
    const result = [];
    exports.rules.forEach((rule) => {
        if (withTrigger && rule.trigger !== withTrigger)
            return;
        const foundIndex = result.findIndex((i) => i.trigger === rule.trigger);
        if (foundIndex != -1) {
            result[foundIndex].rules.push(rule);
        }
        else {
            result.push({ trigger: rule.trigger, rules: [rule] });
        }
    });
    return result;
}
exports.getRules = getRules;
function setLogCallback(callback) {
    exports.logCallback = callback;
}
exports.setLogCallback = setLogCallback;
