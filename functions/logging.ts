import type { Condition, Rule } from "../types"

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

export function callLogCallback({
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

export function setLogCallback(callback: Callback) {
  logCallback = callback
}
