import type { Condition, Param, Operator, Rule } from "../types";
export declare function condition(param: Param, operator: Operator, value: any): Condition;
type Data = {
    [key: Param]: any;
    previous?: any;
};
export declare function isConditionMet(condition: Condition, data: Data): any;
export declare function stringifyCondition(condition: Condition): string;
export declare function areAllConditionsMet(data: Data, rule: Rule): boolean;
export {};
