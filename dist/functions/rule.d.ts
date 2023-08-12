import type { Condition, Rule, Trigger } from "../types";
export declare function rule({ callback, conditions, description, trigger, }: {
    callback: Function;
    conditions: Condition[];
    description: string;
    trigger: Trigger;
}): Rule;
export declare function executeAutomationRule(data: any, rule: Rule): void;
export declare function getAllRulesWithTrigger(rules: Rule[], trigger: Trigger): Rule[];
export declare function executeAllRules(rules: Rule[], data: any): void;
