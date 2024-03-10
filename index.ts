import {
  getTriggerByModelAndEvent,
  getTriggerEventsByModel,
  getTriggerModels,
  getTriggersByModel,
} from "./functions/trigger"
import {
  getParamByModelAndKey,
  getParamKeysByModel,
  getParamsByModel,
  getParamModels,
} from "./functions/param"
import { operators } from "./operators"
import { createCondition } from "./functions/condition"
import {
  createRule,
  executeRules,
  getAllRules,
  getRulesByTrigger,
} from "./functions/rule"
import { getLogCallback, setLogCallback, setLogging } from "./functions/log"
import { getJsonStringFromRule, getRuleFromJsonString } from "./functions/json"

import type { Condition, Operator, Rule, Trigger } from "./types"

function executeRulesWithTrigger<DataType>(
  trigger: Trigger,
  data: DataType & { previous?: DataType }
) {
  executeRules(getRulesByTrigger(trigger), data)
}

export type { Condition, Operator, Rule, Trigger }

export default {
  conditions: {
    create: createCondition,
  },
  json: {
    getJsonStringFromRule,
    getRuleFromJsonString,
  },
  log: {
    getLogCallback,
    setLogCallback,
    setLogging,
  },
  operators,
  params: {
    getAllByModel: getParamsByModel,
    getByModelAndKey: getParamByModelAndKey,
    keys: { getAllByModel: getParamKeysByModel },
    models: { getAll: getParamModels },
  },
  rules: {
    create: createRule,
    executeAllByTrigger: executeRulesWithTrigger,
    getAll: getAllRules,
    getAllByTrigger: getRulesByTrigger,
  },
  triggers: {
    events: { getAllByModel: getTriggerEventsByModel },
    models: { getAll: getTriggerModels },
    getAllByModel: getTriggersByModel,
    getByModelAndEvent: getTriggerByModelAndEvent,
  },
}
