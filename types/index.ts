import { operators } from "../operators"

export type Operator = (typeof operators)[number]

export type Trigger = string

export type Condition = {
  operator: Operator
  param: string
  value: any
}

export type Rule = {
  id?: string | number
  trigger: Trigger
  conditions: Condition[]
  callback: Function
  callbackDescription?: string
  description: string
}

export type RuleJsonString = {
  id: string | number
  trigger: string
  conditions: string
  callback: string
  callbackDescription: string
  description: string
}
