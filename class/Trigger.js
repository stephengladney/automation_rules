const { rule } = require("./rule")

function trigger(event) {
  if (!event) throw "trigger: Event is required"
  const trigger = {
    rules: [],
    addRule: ({ action, conditions }) => {
      const splitConditions = conditions.map(
        (condition) =>
          `${condition.param1} ${condition.operator} ${condition.param2}`
      )
      trigger.rules.push(
        rule({
          action,
          conditions,
          trigger: event,
        })
      )
    },
  }
  return trigger
}

module.exports = trigger
