const ar = require("./index")
const data = { assignee: "Sam", previous: { assignee: "Dave" } }
const settings = require("./config/settings.json")
const trigger = ar.trigger("When someone is assigned")
const mappings = require("./config/mappings")

ar.addRule(
  ar.rule({
    callback: () => console.log("i fired"),
    conditions: [
      ar.condition("Assignee", ar.op.doesNotEqual, 2),
      ar.condition("Assignee", ar.op.equals, "Sam"),
    ],
    description: "Sam assigned",
    trigger,
  })
)

ar.addRule(
  ar.rule({
    callback: () => console.log("i fired"),
    conditions: [
      ar.condition("Assignee", ar.op.didNotEqual, "Dave"),
      ar.condition("Assignee", ar.op.equals, "Sam"),
    ],
    description: "John assigned",
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
      }\x1b[1m\x1b[31m${rule.description} | ${
        rule.trigger
      } \x1b[0m\x1b[37m\x1b[41m${conditions}${
        settings.logging.logDataOnFailure
          ? `\x1b[0m (${failedCondition.param}: ${
              data[mappings[failedCondition.param]]
            })`
          : ""
      }`
    )
  }
})

ar.executeAllRulesWithTrigger(trigger, { data })
