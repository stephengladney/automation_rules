const ar = require("./index")
const data = { assignee: "Sam" }

const newTrigger = ar.trigger("Thing happened")

newTrigger.addRule({
  action: () => console.log("i fired"),
  conditions: [
    ar.condition(["Assignee", ar.op.doesNotEqual, 2]),
    ar.condition(["Assignee", ar.op.equals, "Sam"]),
  ],
})

ar.executeAllRulesForTrigger(newTrigger, { data })
