import { rule as _rule } from "./functions/rule";
import { condition as _condition } from "./functions/condition";
import _trigger from "./functions/trigger";
import { addRule as _addRule, getRules as _getRules, setLogCallback as _setLogCallback } from "./functions/crud.js";
import * as _op from "./config/operators";
import type { Trigger } from "./types";
export declare const executeAllRulesWithTrigger: (trigger: Trigger, { data }: {
    data: any;
}) => void;
export declare const addRule: typeof _addRule;
export declare const trigger: typeof _trigger;
export declare const condition: typeof _condition;
export declare const getRules: typeof _getRules;
export declare const mappings: {
    Assignee: string;
    "Card title": string;
    "Current status": string;
    "Previous status": string;
    "Team assigned": string;
};
export declare const op: typeof _op;
export declare const rule: typeof _rule;
export declare const setLogCallback: typeof _setLogCallback;
