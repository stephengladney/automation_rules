import type { Condition, Rule } from "../types"

export let logOnSuccess = false
export let logOnFailure = false

export function setLogging({
  onSuccess,
  onFailure,
}: {
  onSuccess?: boolean
  onFailure?: boolean
}) {
  if (onFailure) logOnFailure = onFailure
  if (onSuccess) logOnSuccess = onSuccess
}

type Callback = (
  rule: Rule,
  isSuccess: boolean,
  data: any,
  failedCondition?: Condition
) => any

export let logCallback: Callback = (params) => {}

export function callLogCallback(
  rule: Rule,
  isSuccess: boolean,
  data: any,
  failedCondition?: Condition
) {
  logCallback(rule, isSuccess, data, failedCondition)
}

export function setLogCallback(callback: Callback) {
  logCallback = callback
}
