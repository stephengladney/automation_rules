import type { Rule, Trigger } from "../types"

export let rules: Rule[] = []
export let logCallback = (rule: Rule, isSuccess: boolean, data: any) => {}

export function logCallbackCaller(rule: Rule, isSuccess: boolean, data: any) {
  logCallback(rule, isSuccess, data)
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

export function setLogCallback(callback) {
  logCallback = callback
}
