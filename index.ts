import { executeAllRules, getAllRulesWithTrigger, rule } from "./functions/rule"
import { condition } from "./functions/condition"
import trigger from "./functions/trigger"
import { addRule, getRules, setLogCallback, rules } from "./functions/crud.js"
import mappings from "./config/mappings"
import * as op from "./config/operators"

const executeAllRulesWithTrigger = (trigger, { data }) =>
  executeAllRules(getAllRulesWithTrigger(rules, trigger), data)

export default {
  addRule,
  condition,
  executeAllRulesWithTrigger,
  getRules,
  mappings,
  op,
  rule,
  setLogCallback,
  trigger,
}
