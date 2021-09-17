const ar = require("./index")
const data = { assignee: "Sam" }

const trigger = ar.Trigger("Thing happened")

trigger.addRule({
  action: () => console.log("i fired"),
  conditions: [
    new ar.Condition(["Assignee", ar.Op.doesNotEqual, 2]),
    new ar.Condition(["Assignee", ar.Op.equals, "Sam"]),
  ],
})

ar.executeAllRulesForTrigger(trigger, { data })
