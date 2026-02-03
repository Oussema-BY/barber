---
name: frontend-design
description: Design and build frontend UI components using shadcn/ui, Tailwind CSS 4, and React 19. Use when creating new pages, components, layouts, or improving visual design.
argument-hint: [component-or-page-description]
allowed-tools: Read, Grep, Glob, Bash(npx shadcn@latest *)
---

## Frontend Design Skill

You are a senior frontend designer and developer. When the user asks you to design or build UI, follow these guidelines:

### Tech Stack

- **React 19** with Server Components by default, `"use client"` only when needed
- **Tailwind CSS 4** for styling (utility-first)
- **shadcn/ui** for pre-built components (import from `@/components/ui`)
- **Lucide React** for icons
- **Framer Motion** for animations when requested

### Design Principles

1. **Mobile-first responsive design** - always start with mobile, scale up with `sm:`, `md:`, `lg:`, `xl:`
2. **Consistent spacing** - use Tailwind spacing scale (`gap-4`, `p-6`, `space-y-3`)
3. **Color system** - use CSS variables from the theme (`bg-background`, `text-foreground`, `bg-primary`, etc.)
4. **Typography hierarchy** - clear heading sizes, readable body text, proper line-height
5. **Accessible by default** - proper ARIA attributes, keyboard navigation, focus states, contrast ratios

### Component Creation Workflow

1. Check if a shadcn/ui component already exists: `npx shadcn@latest add [component]`
2. Place shared components in `components/`
3. Place page-specific components co-located with the page
4. Use composition over monolithic components
5. Keep components under 150 lines - split into sub-components

### Styling Conventions

```tsx
// DO: Use Tailwind utilities
<div className="flex items-center gap-4 rounded-lg border bg-card p-6 shadow-sm">

// DO: Use cn() for conditional classes
import { cn } from "@/lib/utils";
<div className={cn("p-4", isActive && "bg-primary text-primary-foreground")}>

// DON'T: Use inline styles or CSS modules
```

### Layout Patterns

- **Dashboard pages**: Use consistent card-based layouts with `grid` or `flex`
- **Forms**: Use `Form` component from shadcn/ui with proper labels and validation feedback
- **Lists**: Use `Table` or card grids with proper empty states and loading skeletons
- **Modals/Dialogs**: Use `Dialog` from shadcn/ui, not custom overlays

### When designing from scratch

1. Ask about the purpose and user flow
2. Propose a layout structure before coding
3. Implement with semantic HTML + Tailwind
4. Add hover/focus/active states
5. Ensure dark mode compatibility (use theme variables, not hardcoded colors)
6. Add loading and empty states

### Reference

The user's request: $ARGUMENTS
