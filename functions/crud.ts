import type { Condition, Rule, Trigger } from "../types"

type RuleWithId = Rule & { id: number }
export let rules: RuleWithId[] = []

type Callback = ({
  rule,
  isSuccess,
  failedCondition,
  data,
}: {
  rule: Rule
  isSuccess: boolean
  failedCondition?: Condition
  data: any
}) => any

export let logCallback: Callback = (params) => {}

export function logCallbackCaller({
  rule,
  isSuccess,
  failedCondition,
  data,
}: {
  rule: Rule
  isSuccess: boolean
  failedCondition?: Condition
  data: any
}) {
  logCallback({ rule, isSuccess, failedCondition, data })
}

export function addRules(...newRules: Rule[]) {
  newRules.forEach((newRule) => {
    rules.push({ ...newRule, id: rules.length + 1 })
  })
}

export function removeRuleById(id: number) {
  rules = rules.filter((rule) => rule.id !== id)
}

export function removeAllRules() {
  rules = []
}

export function setLogCallback(callback: Callback) {
  logCallback = callback
}
