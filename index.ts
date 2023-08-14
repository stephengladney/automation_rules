import {
  addRules,
  executeRules,
  getRules,
  getRulesByTrigger,
  removeAllRules,
  rule,
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
  executeRules(getRulesByTrigger(trigger), data)
}

export default {
  addParam,
  addRules,
  condition,
  executeRulesWithTrigger,
  getRules,
  getRulesByTrigger,
  op,
  params,
  rule,
  removeAllRules,
  setLogCallback,
}
