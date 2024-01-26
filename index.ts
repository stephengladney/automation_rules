import {
  addRule,
  executeRules,
  getRules,
  getRulesByTrigger,
  removeAllRules,
  removeRuleById,
  rule,
} from "./functions/rule"
import { condition } from "./functions/condition"
import { setLogCallback, setLogging } from "./functions/logging"
import { addParam, params } from "./functions/params"
import { operators } from "./operators"
import type { Trigger } from "./types"

function executeRulesWithTrigger<DataType>(
  trigger: Trigger,
  data: DataType & { previous?: DataType }
) {
  executeRules(getRulesByTrigger(trigger), data)
}

export default {
  addParam,
  addRule,
  condition,
  executeRulesWithTrigger,
  getRules,
  getRulesByTrigger,
  operators,
  params,
  rule,
  removeRuleById,
  removeAllRules,
  setLogCallback,
  setLogging,
}
