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
import { createParams, getParamsBySchema } from "./functions/param"
import { getTriggersBySchema, createTriggers } from "./functions/trigger"
import { operators } from "./operators"
import type { Condition, Operator, Rule, Trigger } from "./types"

function executeRulesWithTrigger<DataType>(
  trigger: Trigger,
  data: DataType & { previous?: DataType }
) {
  executeRules(getRulesByTrigger(trigger), data)
}

export type { Condition, Operator, Rule }

export default {
  createCondition,
  createParams,
  createRule,
  createTriggers,
  executeRulesWithTrigger,
  getFunctionDictionary,
  getJsonStringFromRule,
  getParamsBySchema,
  getRuleFromJsonString,
  getRules,
  getRulesByTrigger,
  getTriggersBySchema,
  operators,
  setFunctionDictionary,
  setLogCallback,
  setLogging,
}
