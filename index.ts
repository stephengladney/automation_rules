import {
  addRule,
  executeRules,
  getJsonStringFromRules,
  getRules,
  getRulesFromJsonString,
  getRulesByTrigger,
  removeAllRules,
  removeRuleById,
  rule,
  setFunctionDictionary,
} from "./functions/rule"
import { condition } from "./functions/condition"
import { setLogCallback, setLogging } from "./functions/logging"
import { addParam, params } from "./functions/params"
import { operators } from "./operators"
import type { Condition, Operator, Rule, Trigger } from "./types"

function executeRulesWithTrigger<DataType>(
  trigger: Trigger,
  data: DataType & { previous?: DataType }
) {
  executeRules(getRulesByTrigger(trigger), data)
}

export type { Condition, Operator, Rule, Trigger }

export default {
  addParam,
  addRule,
  condition,
  executeRulesWithTrigger,
  getJsonStringFromRules,
  getRules,
  getRulesFromJsonString,
  getRulesByTrigger,
  operators,
  params,
  rule,
  removeRuleById,
  removeAllRules,
  setFunctionDictionary,
  setLogCallback,
  setLogging,
}
