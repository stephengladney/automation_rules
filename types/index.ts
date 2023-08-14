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
  callback: Function
  conditions: Condition[]
  description: string
  trigger: Trigger
}
