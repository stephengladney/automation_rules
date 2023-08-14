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
import { setLogCallback } from "./functions/logging"
import { addParam, params } from "./config/params"
import * as op from "./config/operators"
import type { Trigger } from "./types"

function executeRulesWithTrigger<DataType>(
  trigger: Trigger,
  data: DataType & { previous?: DataType }
) {
  executeRules(getRulesWithTrigger(rules, trigger), data)
}

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
}
