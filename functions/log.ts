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

type LogCallback = (
  rule: Rule,
  isSuccess: boolean,
  data: any,
  failedCondition?: Condition
) => any

let logCallback: LogCallback = () => {}

export function callLogCallback(
  rule: Rule,
  isSuccess: boolean,
  data: unknown,
  failedCondition?: Condition
) {
  logCallback(rule, isSuccess, data, failedCondition)
}

export function setLogCallback(callback: LogCallback) {
  logCallback = callback
}

export function getLogCallback() {
  return logCallback
}
