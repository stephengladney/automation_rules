import { areAllConditionsMet } from "./condition"
import { callLogCallback, logOnSuccess } from "./logging"
import type { Condition, Rule, RuleJsonString, Trigger } from "../types"

type FunctionDictionary = { [key: string]: Function }

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
  const rule = {
    id,
    callback,
    callbackDescription,
    conditions,
    description,
    trigger,
  } as Rule

  if (!rule.id) {
    rule.id = ruleId
    ruleId += 1
  }

  rules.push(rule)
  return rule
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

export function setFunctionDictionary(dictionary: FunctionDictionary) {
  functionDictionary = dictionary
}

export function getFunctionDictionary(): FunctionDictionary {
  return functionDictionary
}

export function getJsonStringFromRule(rule: Rule) {
  return JSON.stringify({
    id: rule.id,
    trigger: rule.trigger,
    conditions: JSON.stringify(rule.conditions),
    callback: getKeyWhereValueIs(functionDictionary, rule.callback),
    callbackDescription: rule.callbackDescription,
    description: rule.description,
  })
}

export function getRuleFromJsonString(json: string) {
  const rule = JSON.parse(json)
  return {
    ...rule,
    conditions: JSON.parse(rule.conditions),
    callback:
      functionDictionary[rule.callback as keyof typeof functionDictionary],
  }
}

export function getRulesByTrigger(trigger: Trigger) {
  return rules.filter((rule) => rule.trigger === trigger)
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

function getKeyWhereValueIs<T extends object>(
  obj: T,
  value: any
): string | null {
  for (let key in obj) {
    if (obj[key] === value) return key
  }
  return null
}
