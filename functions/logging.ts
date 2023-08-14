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
  result: { isSuccess: boolean; failedCondition?: Condition },
  data: any
) => any

export let logCallback: Callback = (params) => {}

export function callLogCallback(
  rule: Rule,
  result: { isSuccess: boolean; failedCondition?: Condition },
  data: any
) {
  logCallback(rule, result, data)
}

export function setLogCallback(callback: Callback) {
  logCallback = callback
}
