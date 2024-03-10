import type { Rule } from "../types"

export function getJsonStringFromRule(
  rule: Rule,
  functionDictionary: Record<string, Function>
) {
  return JSON.stringify({
    id: rule.id,
    trigger: rule.trigger,
    conditions: JSON.stringify(rule.conditions),
    callback: getKeyWhereValueIs(functionDictionary, rule.callback),
    callbackDescription: rule.callbackDescription,
    description: rule.description,
  })
}

export function getRuleFromJsonString(
  json: string,
  functionDictionary: Record<string, Function>
) {
  const rule = JSON.parse(json)
  return {
    ...rule,
    conditions: JSON.parse(rule.conditions),
    callback:
      functionDictionary[rule.callback as keyof typeof functionDictionary],
  }
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
