import {
  addRules,
  executeRules,
  getRules,
  getRulesWithTrigger,
  removeAllRules,
  rule,
  rules,
} from "./functions/rule"
import { condition } from "./functions/condition"
import trigger from "./functions/trigger"
import { setLogCallback } from "./functions/logging"
import { addParam, params } from "./config/params"
import * as op from "./config/operators"
import type { Trigger } from "./types"

const executeRulesWithTrigger = (trigger: Trigger, data: any) =>
  executeRules(getRulesWithTrigger(rules, trigger), data)

export default {
  addParam,
  addRules,
  condition,
  executeRulesWithTrigger,
  getRules,
  op,
  params,
  rule,
  removeAllRules,
  setLogCallback,
  trigger,
}
