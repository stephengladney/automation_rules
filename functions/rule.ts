import { areAllConditionsMet } from "./condition"
import settings from "../config/settings.json"
import { logCallbackCaller } from "./crud"
import type { Condition, Rule, Trigger } from "../types"
import { rules } from "./crud"

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
  if (!conditions || conditions.length === 0) {
    throw "rule: must supply at least one condition"
  }
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

export function getRules() {
  const result: { trigger: Trigger; rules: Rule[] }[] = []
  rules.forEach((rule) => {
    const foundIndex = result.findIndex((i) => i.trigger === rule.trigger)
    if (foundIndex != -1) {
      result[foundIndex].rules.push(rule)
    } else {
      result.push({ trigger: rule.trigger, rules: [rule] })
    }
  })
  return result
}

export function getRulesWithTrigger(rules: Rule[], trigger: Trigger) {
  return rules.filter((rule) => rule.trigger === trigger)
}

export function executeRules(rules: Rule[], data: any) {
  rules.forEach((rule) => executeAutomationRule(data, rule))
}