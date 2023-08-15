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
