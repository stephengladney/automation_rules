import { isObjectInArray } from "./misc"
import type { Trigger } from "../types"

export const triggers: Trigger[] = []

export function createTriggers(
  ...triggerConstructors: { schema: string; events: string[] }[]
) {
  triggerConstructors.forEach(({ schema, events: newEvents }) => {
    newEvents.forEach((event) => {
      const newTrigger = { schema, event }
      if (!isObjectInArray(newTrigger, triggers))
        triggers.push(newTrigger as Trigger)
    })
  })
  return triggers
}

export function getTriggersBySchema(schema: string) {
  return triggers.filter(({ schema: paramSchema }) => paramSchema === schema)
}
