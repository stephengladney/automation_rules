import { areAllConditionsMet } from "./condition"
import settings from "../config/settings.json"
import { callLogCallback } from "./logging"
import type { Condition, Rule, Trigger } from "../types"

export let rules: Rule[] = []
export let ruleId = 1

export function rule<DataType>(
  trigger: Trigger,
  conditions: [Condition, ...Condition[]],
  callback: (data: DataType) => unknown,
  description?: string
) {
  if (!conditions || conditions.length === 0) {
    throw "rule: must supply at least one condition"
  }
  return { callback, conditions, description, trigger } as Rule
}

export function executeAutomationRule<DataType>(
  rule: Rule,
  data: DataType & { previous?: DataType }
) {
  if (areAllConditionsMet<DataType>(data, rule)) {
    rule.callback(data)
    if (settings.logging.logSuccess) {
      callLogCallback({ rule, isSuccess: true, data })
    }
  }
}

export function getRules() {
  return rules
}

export function getRulesByTrigger(trigger: Trigger) {
  return rules.filter((rule) => rule.trigger === trigger)
}

export function executeRules(rules: Rule[], data: any) {
  rules.forEach((rule) => executeAutomationRule(rule, data))
}

export function addRules(...newRules: Rule[]) {
  newRules.forEach((newRule) => {
    rules.push({ ...newRule, id: newRule.id ?? ruleId })
    if (!newRule.id) ruleId += 1
  })
}

export function removeRuleById(id: number) {
  rules = rules.filter((rule) => rule.id !== id)
}

export function removeAllRules() {
  rules = []
}

export function setRuleId(n: number) {
  ruleId = n
}
