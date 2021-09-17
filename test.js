const ar = require("./index")
const data = { assignee: "Sam", previous: { assignee: "Dave" } }
const settings = require("./config/settings.json")
const { stringifyCondition } = require("./functions/condition")
const trigger = ar.trigger("Thing happened")

ar.addRule(
  ar.rule({
    action: () => console.log("i fired"),
    conditions: [
      ar.condition(["Assignee", ar.op.doesNotEqual, 2]),
      ar.condition(["Assignee", ar.op.equals, "Sam"]),
    ],
    description: "Log i fired is Assignee is Sam",
    trigger,
  })
)

ar.addRule(
  ar.rule({
    action: () => console.log("i fired"),
    conditions: [
      ar.condition(["Assignee", ar.op.equals, "John"]),
      ar.condition(["Assignee", ar.op.doesNotEqual, 4]),
    ],
    description: "Log i fired if Assignee is John",
    trigger,
  })
)

ar.setLogCallback(({ rule, isSuccess, failedCondition }) => {
  const conditions = rule.conditions
    .map(
      (condition) =>
        `${condition.param} ${condition.operator} ${condition.value}`
    )
    .join(", ")
  if (isSuccess) {
    console.log(
      `[\x1b[36mar\x1b[0m] ${
        settings.logging.includeTimestamp
          ? `${new Date().toDateString()} ${new Date().toLocaleTimeString()} `
          : ""
      }\x1b[1m\x1b[32m${rule.description} | ${
        rule.trigger
      } \x1b[30m\x1b[42m${conditions}\x1b[0m`
    )
  } else {
    console.log(
      `[\x1b[36mar\x1b[0m] ${
        settings.logging.includeTimestamp
          ? `${new Date().toDateString()} ${new Date().toLocaleTimeString()} `
          : ""
      }\x1b[1m\x1b[31m${rule.trigger} \x1b[0m\x1b[37m\x1b[41m${conditions}${
        settings.logging.logDataOnFailure
          ? `\x1b[0m (${stringifyCondition(failedCondition)})`
          : ""
      }`
    )
  }
})

console.log(JSON.stringify(ar.getRules()))
// ar.executeAllRulesForTrigger(trigger, { data })
