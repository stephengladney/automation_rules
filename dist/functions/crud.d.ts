import type { Condition, Rule, Trigger } from "../types";
export declare let rules: Rule[];
type Callback = ({ rule, isSuccess, failedCondition, data, }: {
    rule: Rule;
    isSuccess: boolean;
    failedCondition?: Condition;
    data: any;
}) => any;
export declare let logCallback: Callback;
export declare function logCallbackCaller({ rule, isSuccess, failedCondition, data, }: {
    rule: Rule;
    isSuccess: boolean;
    failedCondition?: Condition;
    data: any;
}): void;
export declare function addRule(rule: Rule): void;
export declare function getRules({ withTrigger }: {
    withTrigger?: any;
}): {
    trigger: Trigger;
    rules: Rule[];
}[];
export declare function setLogCallback(callback: Callback): void;
export {};
