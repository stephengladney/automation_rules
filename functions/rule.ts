import { areAllConditionsMet } from "./condition"
import { callLogCallback, logOnSuccess } from "./logging"
import type { Condition, Rule, Trigger } from "../types"

export let rules: Rule[] = []
export let ruleId = 1

export function rule<DataType>(
  trigger: Trigger,
  conditions: [Condition, ...Condition[]],
  callback: (data: DataType) => unknown,
  callbackDescription?: string,
  description?: string,
  id?: number
) {
  if (!conditions || conditions.length === 0) {
    throw "rule: must supply at least one condition"
  }
  return {
    id,
    callback,
    callbackDescription,
    conditions,
    description,
    trigger,
  } as Rule
}

export function executeAutomationRule<DataType>(
  rule: Rule,
  data: DataType & { previous?: DataType }
) {
  if (areAllConditionsMet<DataType>(data, rule)) {
    rule.callback(data)
    if (logOnSuccess) {
      callLogCallback(rule, true, data)
    }
  }
}

export function getRules() {
  return rules
}

export function setRules(newRules: Rule[]) {
  rules = newRules
}

export function getRulesByTrigger(trigger: Trigger) {
  return rules.filter((rule) => rule.trigger === trigger)
}

export function executeRules(rules: Rule[], data: any) {
  rules.forEach((rule) => executeAutomationRule(rule, data))
}

export function addRule(newRule: Rule) {
  rules.push({ ...newRule, id: newRule.id ?? ruleId })
  if (!newRule.id) ruleId += 1
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
