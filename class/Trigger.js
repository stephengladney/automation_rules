class Trigger {
  constructor({ target, event }) {
    if (!target) throw "Trigger: Target is required"
    if (!event) throw "Trigger: Event is required"
    this.target = target
    this.event = event
  }
}

module.exports = Trigger

function isTriggerEnabled(trigger, listOfTriggers) {
  return listOfTriggers.includes(trigger)
}

module.exports.isTriggerEnabled = isTriggerEnabled
