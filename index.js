export const mappings = require("./config/mappings")
export const Op = require("./config/operators")

import { executeAllAutomationRules, Rule } from "./class/Rule"
import { rulesWithTrigger, Trigger } from "./class/Trigger"

export const Rule = Rule
export const Trigger = Trigger
export const Condition = require("./class/Condition").Condition

let rules
export const setRules = (arr) => (rules = arr)
export const addRule = (rule) => rules.push(rule)

export const execute = (trigger, data) => {
  executeAllAutomationRules(data, rulesWithTrigger(rules, trigger))
}
