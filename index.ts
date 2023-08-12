import {
  executeAllRules,
  getAllRulesWithTrigger,
  rule as _rule,
} from "./functions/rule"
import { condition as _condition } from "./functions/condition"
import _trigger from "./functions/trigger"
import {
  addRule as _addRule,
  getRules as _getRules,
  setLogCallback as _setLogCallback,
  rules,
} from "./functions/crud.js"
import {
  addMapping as _addMapping,
  mappings as _mappings,
} from "./config/mappings"
import * as _op from "./config/operators"
import type { Trigger } from "./types"

export const executeAllRulesWithTrigger = (
  trigger: Trigger,
  { data }: { data: any }
) => executeAllRules(getAllRulesWithTrigger(rules, trigger), data)

export const addMapping = _addMapping
export const addRule = _addRule
export const trigger = _trigger
export const condition = _condition
export const getRules = _getRules
export const mappings = _mappings
export const op = _op
export const rule = _rule
export const setLogCallback = _setLogCallback
