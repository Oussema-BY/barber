---
name: api-endpoint
description: Create Next.js API routes and server actions for data operations. Use when building new endpoints or server-side data logic.
argument-hint: [endpoint-description]
allowed-tools: Read, Grep, Glob
---

## API Endpoint / Server Action Skill

You are a backend expert for BlogDesk. Help create server actions and API routes following project conventions.

### Server Actions (Preferred)

BlogDesk uses **plain server actions** (NOT next-safe-action):

```typescript
// actions/feature.actions.ts
"use server";

import { db } from "@/lib/db";
import { featureTable } from "@/lib/schema";
import { featureSchema } from "@/schemas/feature.schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createFeatureAction(data: z.infer<typeof featureSchema>) {
  const parsed = featureSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const [result] = await db
    .insert(featureTable)
    .values(parsed.data)
    .returning();

  revalidatePath("/dashboard/features");
  return { success: true, data: result };
}

export async function getFeaturesBySlteAction(siteId: string) {
  const results = await db
    .select()
    .from(featureTable)
    .where(eq(featureTable.siteId, siteId));

  return { success: true, data: results };
}

export async function updateFeatureAction(id: string, data: Partial<z.infer<typeof featureSchema>>) {
  const [result] = await db
    .update(featureTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(featureTable.id, id))
    .returning();

  revalidatePath("/dashboard/features");
  return { success: true, data: result };
}

export async function deleteFeatureAction(id: string) {
  await db.delete(featureTable).where(eq(featureTable.id, id));
  revalidatePath("/dashboard/features");
  return { success: true };
}
```

### Zod Schema

```typescript
// schemas/feature.schemas.ts
import { z } from "zod";

export const featureSchema = z.object({
  siteId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  // ...
});
```

### API Routes (When Needed)

Use API routes only for webhooks, external integrations, or when server actions won't work:

```typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const siteId = searchParams.get("siteId");

  const results = await db.select().from(featureTable)
    .where(eq(featureTable.siteId, siteId));

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // validate, insert, return
}
```

### Conventions

1. **File naming**: `actions/feature.actions.ts`, `schemas/feature.schemas.ts`
2. **Return format**: Always `{ success: boolean, data?: T, error?: string }`
3. **Validation**: Parse with Zod before any DB operation
4. **Revalidation**: Call `revalidatePath()` after every mutation
5. **Multi-tenant**: Always filter by `siteId` for site-scoped data
6. **Error handling**: Use try/catch, return error objects (don't throw)

### CRUD Template

When creating a full CRUD for a new entity, create:
1. `lib/schema.ts` - Add table + relations
2. `schemas/entity.schemas.ts` - Zod validation
3. `actions/entity.actions.ts` - CRUD server actions
4. Run `npx drizzle-kit generate && npx drizzle-kit push`

### Reference

Endpoint request: $ARGUMENTS
