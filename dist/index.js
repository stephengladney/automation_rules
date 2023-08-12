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
exports.setLogCallback = exports.rule = exports.op = exports.mappings = exports.getRules = exports.condition = exports.trigger = exports.addRule = exports.executeAllRulesWithTrigger = void 0;
const rule_1 = require("./functions/rule");
const condition_1 = require("./functions/condition");
const trigger_1 = __importDefault(require("./functions/trigger"));
const crud_js_1 = require("./functions/crud.js");
const mappings_1 = require("./config/mappings");
const _op = __importStar(require("./config/operators"));
const executeAllRulesWithTrigger = (trigger, { data }) => (0, rule_1.executeAllRules)((0, rule_1.getAllRulesWithTrigger)(crud_js_1.rules, trigger), data);
exports.executeAllRulesWithTrigger = executeAllRulesWithTrigger;
exports.addRule = crud_js_1.addRule;
exports.trigger = trigger_1.default;
exports.condition = condition_1.condition;
exports.getRules = crud_js_1.getRules;
exports.mappings = mappings_1.mappings;
exports.op = _op;
exports.rule = rule_1.rule;
exports.setLogCallback = crud_js_1.setLogCallback;
