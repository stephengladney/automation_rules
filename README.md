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

### condition ([_param_, _operator_, _value_])

Conditions allow you to verify that a specific scenario has been met.

Example:

```javascript
const condition = ar.condition(["Assignee", ar.Op.equals, "Sam"])
```

**NOTE:** If you want to use past evaluating operators (didEqual, didNotEqual, hasChanged, hasNotChanged), when executing automatoin rules, your data will need to contain a key called `previous` that contains the data's previous state. More on that below.

<hr>

### rule ({ callback, conditions, trigger })

Create a rule with with a callback function to perform when the trigger and conditions are both met.

Note: Triggers are just strings that describe a scenario, i.e. "When a new user is created"

Example:

```javascript
const triggers = {
  NEW_USER_CREATED: "When a new user is created",
}

const rule = ar.rule({
  callback: () => console.log("A new user was created!"),
  conditions: [condition],
  trigger: triggers.NEW_USER_CREATED,
})
```

<hr>

### addRule (rule)

Add a rule to the current list of rules. (maintained in memory)

<hr>

### executeAllRulesWithTrigger (trigger, { data })

Execute all rules with a particular trigger. Place this method in your code where that trigger occurs.

Example:

```javascript
//do thing A
ar.executeAllRulesWithTrigger(trigger, {
  data: { first_name: "Thomas", last_name: "Anderson", age: 34 },
})
```

<hr>

### getRules ({ withTrigger? })

This method will return a JSON payload of rules currently being stored.

Example:

```
ar.getRules()
```

Response:

```javascript
;[
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

<hr>

### setLogCallback(({ data, failedCondition, isSuccess, rule })

Set the log callback function.

`failedCondition` - This variable gives you access to which specific condition failed if the rule fails.
`isSuccess` - Boolean that indicates whether all of the conditions were met and the callback was executed.
