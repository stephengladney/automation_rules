import { mappings } from "../config/mappings";
import * as operators from "../config/operators";
type OperatorKey = keyof typeof operators;
export type Operator = (typeof operators)[OperatorKey];
type ParamKey = keyof typeof mappings;
export type Param = (typeof mappings)[ParamKey];
export type Trigger = string;
export type Condition = {
    operator: Operator;
    param: Param;
    value: any;
};
export type Rule = {
    callback: Function;
    conditions: Condition[];
    description: string;
    trigger: Trigger;
};
export {};
