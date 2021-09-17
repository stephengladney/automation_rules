# automation_rules README

### Mappings

Mappings associate human-readable strings with actual key names from your object-oriented data. This is currently hard-coded in `mappings.js`

Example:

```javascript
module.exports = {
  Assignee: "assignee",
  "Card title": "cardTitle",
  "Current status": "currentStatus",
  "Previous status": "previousStatus",
  "Team assigned": "teamAssigned",
}
```

<hr>

### Operators

Operators are used to compare two pieces of information. These are static and provided by the library.

To use, require the index.js file and then use `.Op.` to access the operators.

Example:

```javascript
const ar = require("./index")
ar.Op.equals
```

<details>
<summary>Valid operators</summary>
<ul>
<li>equals</li>
<li>doesNotEqual</li>
<li>didEqual</li>
<li>didNotEqual</li>
<li>doesInclude</li>
<li>doesNotInclude</li>
<li>hasChanged</li>
<li>hasNotChanged</li>
<li>isGreatherThan</li>
<li>isGreatherThanOrEqualTo</li>
<li>isLessThan</li>
<li>isLessThanOrEqualTo</li>
<li>isFalsy</li>
<li>isTruthy</li>
</ul>
</details>

<hr>

### trigger(event)

Returns { event: _string_ }

A trigger is a string that describes a scenario where you'd like to execute an automation rule. This is required and will help organize your automation rules.

Example:

```javascript
const trigger = ar.trigger("When a user is created")
```

<hr>

### condition([_param_, _operator_, _value_])

Conditions allow you to verify that a specific scenario has been met.

Example:

```javascript
const condition = ar.condition(["Assignee", ar.Op.equals, "Sam"])
```

**NOTE:** If you want to use past evaluating operators (didEqual, didNotEqual, hasChanged, hasNotChanged), when executing automatoin rules, your data will need to contain a key called `previous` that contains the data's previous state. More on that below.

<hr>

### rule({ callback, conditions, trigger })

Rules combine triggers and conditions with an action to perform when the trigger and conditions are both met.

Example:

```javascript
const rule = ar.rule({
  action: () => console.log("rule fired"),
  conditions: [condition],
  trigger: trigger,
})
```

<hr>

### addRule (rule)

This method sets the list of rules that the library is aware of. (maintained in memory)

<hr>

### execute (trigger, data)

This method will execute all rules for a particular trigger. Place this method in your code where that trigger occurs.

Example:

```javascript
//do thing A
ar.execute(triggerForThingA, data)
```

### getRules({ withTrigger })

This method will return a JSON payload of rules currently being stored.

Example:

```
ar.getRules()
```

Response:
[
{
trigger: "Thing happened",
rules: [
{
conditions: [
{ operator: "does not equal", param: "Assignee", value: 2 },
{ operator: "equals", param: "Assignee", value: "Sam" },
],
description: "Log i fired is Assignee is Sam",
trigger: "Thing happened",
},
{
conditions: [
{ operator: "equals", param: "Assignee", value: "John" },
{ operator: "does not equal", param: "Assignee", value: 4 },
],
description: "Log i fired if Assignee is John",
trigger: "Thing happened",
},
],
},
]

```

```
