import { areAllConditionsMet } from "./condition"
import { callLogCallback, logOnSuccess } from "./logging"
import type { Condition, Rule, RuleJsonString, Trigger } from "../types"

type FunctionDictionary = { [key: string]: Function }

export let rules: Rule[] = []
export let ruleId = 1
export let functionDictionary = {}

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

export function setFunctionDictionary(dictionary: FunctionDictionary) {
  functionDictionary = dictionary
}

export function getFunctionDictionary(): FunctionDictionary {
  return functionDictionary
}

export function getJsonStringFromRules() {
  const result: object[] = []
  rules.forEach((rule) => {
    result.push({
      id: rule.id,
      trigger: rule.trigger,
      conditions: JSON.stringify(rule.conditions),
      callback: getKeyWhereValueIs(functionDictionary, rule.callback),
      callbackDescription: rule.callbackDescription,
      description: rule.description,
    })
  })
  return JSON.stringify(result)
}

export function getRulesFromJsonString(jsonString: string) {
  const rulesArray = JSON.parse(jsonString)
  const newRulesArray = rulesArray.map((rule: RuleJsonString) => {
    return {
      ...rule,
      conditions: JSON.parse(rule.conditions),
      callback:
        functionDictionary[rule.callback as keyof typeof functionDictionary],
    }
  })
  return newRulesArray as Rule[]
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

function getKeyWhereValueIs<T extends object>(
  obj: T,
  value: any
): string | null {
  for (let key in obj) {
    if (obj[key] === value) return key
  }
  return null
}
