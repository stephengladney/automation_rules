import { operators } from "../operators"

export type Trigger = { schema: string; event: string }
export type Param = { schema: string; key: string }
export type Operator = (typeof operators)[number]

export type Condition = {
  operator: Operator
  param: Param
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
