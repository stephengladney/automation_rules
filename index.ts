import {
  getTriggerBySchemaAndEvent,
  getTriggerEventsBySchema,
  getTriggerSchemas,
  getTriggersBySchema,
} from "./functions/trigger"
import {
  getParamBySchemaAndKey,
  getParamKeysBySchema,
  getParamsBySchema,
  getParamSchemas,
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

import type { Condition, Operator, Rule, SafeTrigger, Trigger } from "./types"

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
    getAllBySchema: getParamsBySchema,
    getBySchemaAndKey: getParamBySchemaAndKey,
    keys: { getAllBySchema: getParamKeysBySchema },
    schemas: { getAll: getParamSchemas },
  },
  rules: {
    create: createRule,
    executeAllByTrigger: executeRulesWithTrigger,
    getAll: getAllRules,
    getAllByTrigger: getRulesByTrigger,
  },
  triggers: {
    events: { getAllBySchema: getTriggerEventsBySchema },
    schemas: { getAll: getTriggerSchemas },
    getAllBySchema: getTriggersBySchema,
    getBySchemaAndEvent: getTriggerBySchemaAndEvent,
  },
}
