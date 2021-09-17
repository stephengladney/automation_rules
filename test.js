const ar = require("./index")
const data = { assignee: "Sam", previous: { assignee: "Dave" } }

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

ar.executeAllRulesForTrigger(trigger, { data })
