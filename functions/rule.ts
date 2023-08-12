import { areAllConditionsMet } from "./condition"
import settings from "../config/settings.json"
import { logCallbackCaller } from "./crud"
import type { Condition, Rule, Trigger } from "../types"

export function rule({
  callback,
  conditions,
  description,
  trigger,
}: {
  callback: Function
  conditions: Condition[]
  description: string
  trigger: Trigger
}) {
  if (typeof callback != "function") throw "rule: callback must be a function"
  if (!conditions || conditions.length === 0)
    throw "rule: must supply at least one condition"
  return { callback, conditions, description, trigger } as Rule
}

export function executeAutomationRule(data: any, rule: Rule) {
  if (areAllConditionsMet(data, rule)) {
    rule.callback(data)
    if (settings.logging.logSuccess) {
      logCallbackCaller({ rule, isSuccess: true, data })
    }
  }
}

export function getAllRulesWithTrigger(rules, trigger) {
  return rules.filter((rule) => rule.trigger === trigger)
}

export function executeAllRules(rules, data) {
  rules.forEach((rule) => executeAutomationRule(data, rule))
}
