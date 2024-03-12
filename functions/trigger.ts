import type { Trigger } from "../types"

export function getTriggerModels(triggers: Record<string, readonly string[]>) {
  return Object.keys(triggers)
}

export function getTriggersByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, model: K) {
  return triggers[model].map((event) => ({ model, event })) as Trigger[]
}

export function getTriggerEventsByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, model: K) {
  return triggers[model]
}

export function getTriggerByModelAndEvent<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(triggers: T, model: U, event: T[U][number]) {
  return {
    model,
    event,
  } as Trigger
}
