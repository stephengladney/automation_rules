import {
  createRule,
  executeRules,
  getFunctionDictionary,
  getJsonStringFromRule,
  getRuleFromJsonString,
  getRules,
  getRulesByTrigger,
  setFunctionDictionary,
} from "./functions/rule"
import { createCondition } from "./functions/condition"
import { setLogCallback, setLogging } from "./functions/logging"
import { createParam, params } from "./functions/params"
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
  createCondition,
  createParam,
  createRule,
  executeRulesWithTrigger,
  getFunctionDictionary,
  getJsonStringFromRule,
  getRuleFromJsonString,
  getRules,
  getRulesByTrigger,
  operators,
  params,
  setFunctionDictionary,
  setLogCallback,
  setLogging,
}
