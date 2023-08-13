import {
  executeRules,
  getRules as _getRules,
  getRulesWithTrigger,
  rule as _rule,
} from "./functions/rule"
import { condition as _condition } from "./functions/condition"
import _trigger from "./functions/trigger"
import {
  addRules as _addRules,
  setLogCallback as _setLogCallback,
  rules,
  removeAllRules as _removeAllRules,
} from "./functions/crud"
import { addParam as _addParam, params as _params } from "./config/params"
import * as _op from "./config/operators"
import type { Trigger } from "./types"

export const executeRulesWithTrigger = (trigger: Trigger, data: any) =>
  executeRules(getRulesWithTrigger(rules, trigger), data)

export const addParam = _addParam
export const addRules = _addRules
export const condition = _condition
export const getRules = _getRules
export const op = _op
export const params = _params
export const rule = _rule
export const removeAllRules = _removeAllRules
export const setLogCallback = _setLogCallback
export const trigger = _trigger
