---
name: db-migration
description: Create and manage Drizzle ORM database migrations. Use when adding tables, columns, relations, or modifying the database schema.
argument-hint: [migration-description]
allowed-tools: Read, Grep, Glob, Bash(npx drizzle-kit *), Bash(npm run *)
---

## Database Migration Skill

You are a database expert for BlogDesk using Drizzle ORM with Neon PostgreSQL.

### Schema Location

The database schema is defined in `lib/schema.ts`. Always read this file first to understand the current schema.

### Workflow

1. **Modify schema** in `lib/schema.ts`
2. **Generate migration**: `npx drizzle-kit generate`
3. **Review** the generated SQL in `drizzle/` directory
4. **Push to database**: `npx drizzle-kit push`

### Schema Patterns

```typescript
import { pgTable, text, timestamp, uuid, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Table definition
export const myTable = pgTable("my_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const myTableRelations = relations(myTable, ({ one, many }) => ({
  site: one(sites, { fields: [myTable.siteId], references: [sites.id] }),
}));
```

### Multi-Tenant Rules

- **Site-scoped content** (articles, tags): MUST have `site_id` foreign key with cascade delete
- **Global entities** (solutions, users): No `site_id` needed
- **Junction tables** (article_tags): Reference both related tables with cascade delete

### Migration Checklist

- [ ] Schema change is backwards-compatible (or migration plan accounts for downtime)
- [ ] Foreign keys have proper `onDelete` behavior (cascade, set null, restrict)
- [ ] Indexes added for frequently queried columns
- [ ] `NOT NULL` constraints where appropriate
- [ ] Default values for new columns on existing tables
- [ ] Relations defined for Drizzle query builder
- [ ] Types will be properly inferred after change

### Common Commands

```bash
npx drizzle-kit generate    # Generate migration SQL from schema changes
npx drizzle-kit push        # Push schema directly to database
npx drizzle-kit studio      # Open Drizzle Studio (visual DB browser)
npx drizzle-kit drop        # Drop a migration
npx drizzle-kit check       # Check schema for issues
```

### Reference

Migration request: $ARGUMENTS
