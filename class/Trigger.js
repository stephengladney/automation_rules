class Trigger {
  constructor({ target, event }) {
    if (!target) throw "Trigger: Target is required"
    if (!event) throw "Trigger: Event is required"
    this.target = target
    this.event = event
  }
}

function rulesWithTrigger(rules, trigger) {
  return rules.filter(
    rule =>
      rule.trigger.target === trigger.target &&
      rule.trigger.event === trigger.event
  )
}

module.exports = { Trigger, rulesWithTrigger }
