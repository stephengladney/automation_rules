import type { Trigger, TriggersMap } from "../types"

export function getTriggerSchemas(triggers: TriggersMap) {
  return Object.keys(triggers)
}

export function getTriggersBySchema<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, schema: K) {
  return triggers[schema].map((event) => ({ schema, event })) as Trigger[]
}

export function getTriggerEventsBySchema<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, schema: K) {
  return triggers[schema]
}

export function getTriggerBySchemaAndEvent<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(triggers: T, schema: U, event: T[U][number]) {
  return {
    schema,
    event,
  } as Trigger
}
