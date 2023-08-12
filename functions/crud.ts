import type { Condition, Rule, Trigger } from "../types"

export let rules: Rule[] = []

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

export let logCallback: Callback

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

export function addRule(rule: Rule) {
  rules.push(rule)
}

export function getRules({ withTrigger }: { withTrigger?: any }) {
  const result: { trigger: Trigger; rules: Rule[] }[] = []
  rules.forEach((rule) => {
    if (withTrigger && rule.trigger !== withTrigger) return

    const foundIndex = result.findIndex((i) => i.trigger === rule.trigger)
    if (foundIndex != -1) {
      result[foundIndex].rules.push(rule)
    } else {
      result.push({ trigger: rule.trigger, rules: [rule] })
    }
  })
  return result
}

export function setLogCallback(callback: Callback) {
  logCallback = callback
}
