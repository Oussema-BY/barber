---
name: review
description: Review code for quality, performance, security, and adherence to BlogDesk patterns. Use when reviewing PRs, files, or code changes.
argument-hint: [file-or-pr-reference]
allowed-tools: Read, Grep, Glob, Bash(gh pr *), Bash(git diff *), Bash(git log *)
---

## Code Review Skill

Review code against BlogDesk's standards and best practices.

### Review Checklist

**Architecture & Patterns**
- [ ] Server Components used by default, `"use client"` only when necessary
- [ ] Server actions are plain `async` functions in `actions/*.actions.ts`
- [ ] Zustand store is pure state (no fetch logic in store)
- [ ] Data fetching done in hooks or page components
- [ ] Content filtered by `site_id` (multi-tenant)

**Type Safety**
- [ ] TypeScript types properly inferred from Drizzle schema
- [ ] Zod schemas used for input validation in server actions
- [ ] No `any` types without justification
- [ ] Proper null/undefined handling

**Performance**
- [ ] No unnecessary re-renders (proper dependency arrays)
- [ ] Images optimized with `next/image`
- [ ] Dynamic imports for heavy components
- [ ] Proper use of `revalidatePath` after mutations

**Security**
- [ ] Input validation on all server actions
- [ ] No SQL injection risks (using Drizzle ORM properly)
- [ ] Auth checks where needed
- [ ] No secrets in client code

**UI/UX**
- [ ] Loading states for async operations
- [ ] Error states and user feedback
- [ ] Responsive design
- [ ] Accessible (ARIA, keyboard nav, contrast)

### Output Format

For each issue found:

```
### [severity] Description
**File**: path/to/file.ts:line
**Issue**: What's wrong
**Fix**: How to fix it
```

Severities: `CRITICAL` | `MAJOR` | `MINOR` | `SUGGESTION`

End with a summary: total issues by severity and overall assessment.

### Reference

Reviewing: $ARGUMENTS
