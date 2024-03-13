import { areAllConditionsMet } from "./condition"
import { callLogCallback, logOnSuccess } from "./log"
import type { Condition, Rule, Trigger } from "../types"

export let rules: Rule[] = []
export let ruleId = 1
export let functionDictionary = {}

export function createRule<DataType>(
  trigger: Trigger,
  conditions: [Condition, ...Condition[]],
  callback: (data: DataType) => unknown,
  callbackDescription?: string,
  description?: string,
  id?: number | string
) {
  if (!conditions || conditions.length === 0) {
    throw "rule: must supply at least one condition"
  }
  const newRule = {
    id,
    callback,
    callbackDescription,
    conditions,
    description,
    trigger,
  } as Rule

  rules.push({ ...newRule, id: newRule.id ?? ruleId })

  if (!newRule.id) {
    newRule.id = ruleId
    ruleId += 1
  }

  return newRule
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

export function getAllRules() {
  return rules
}

export function getRulesByTrigger(trigger: Trigger) {
  return rules.filter((rule) => {
    return JSON.stringify(rule.trigger) === JSON.stringify(trigger)
  })
}

export function executeRules(rules: Rule[], data: any) {
  rules.forEach((rule) => executeAutomationRule(rule, data))
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
