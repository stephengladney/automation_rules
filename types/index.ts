import * as operators from "../config/operators"

type OperatorKey = keyof typeof operators
export type Operator = (typeof operators)[OperatorKey]

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
