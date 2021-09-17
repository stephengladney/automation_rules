class Trigger {
  constructor(event) {
    if (!event) throw "Trigger: Event is required"
    this.event = event
  }
}

function rulesWithTrigger(rules, trigger) {
  return rules.filter((rule) => rule.trigger.event === trigger.event)
}

module.exports = { Trigger, rulesWithTrigger }
