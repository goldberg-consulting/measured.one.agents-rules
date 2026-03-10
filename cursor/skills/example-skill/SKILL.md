---
name: example-skill
description: Example skill demonstrating the SKILL.md format. Use this as a template when creating new skills for Cursor agents.
---
# Example Skill

This file demonstrates the structure and conventions for a Cursor agent skill.

## When This Skill Is Invoked

Skills are invoked when the agent determines the task matches the skill's description. The agent reads this file and follows the instructions within.

## Skill Structure

A skill lives in a folder under `.cursor/skills-cursor/` (user-level) or `.cursor/skills/` (project-level):

```
.cursor/skills/
  my-skill/
    SKILL.md        # Required: skill definition and instructions
    templates/      # Optional: template files the skill may use
```

## Instructions for the Agent

When this skill is invoked:

1. Identify the user's goal from the conversation context.
2. Gather any required information using the AskQuestion tool.
3. Execute the task following the patterns and constraints defined in this file.

## Best Practices

- Keep skills focused on a single capability.
- Include concrete examples of inputs and outputs.
- Define clear steps the agent should follow.
- Specify what tools the agent should use (Read, Write, Shell, etc.).
- Note any prerequisites or constraints.
