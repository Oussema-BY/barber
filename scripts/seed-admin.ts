/**
 * Seed Super Admin User
 *
 * Usage:
 *   SUPER_ADMIN_EMAIL=admin@example.com SUPER_ADMIN_PASSWORD=secret123 npx tsx scripts/seed-admin.ts
 *
 * Or add these to your .env file and run:
 *   npx tsx scripts/seed-admin.ts
 */

import "dotenv/config";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const MONGODB_URI =
  "mongodb+srv://saidsouda89_db_user:mM5IHUBpjTGcLBfz@cluster0.nlb2wkl.mongodb.net/?appName=Cluster0";
const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL || "admin@barberpro.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "admin123456";
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || "Super Admin";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(MONGODB_URI!);
  await client.connect();
  const db = client.db();

  const localAuth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      minPasswordLength: 6,
    },
    user: {
      additionalFields: {
        role: {
          type: "string" as const,
          defaultValue: "user",
          required: false,
        },
      },
    },
  });

  // Check if admin already exists
  const existing = await db
    .collection("user")
    .findOne({ email: SUPER_ADMIN_EMAIL });
  if (existing) {
    if (existing.role === "super_admin") {
      console.log(`Super admin already exists: ${SUPER_ADMIN_EMAIL}`);
    } else {
      // Upgrade to super admin
      await db
        .collection("user")
        .updateOne(
          { email: SUPER_ADMIN_EMAIL },
          { $set: { role: "super_admin" } },
        );
      console.log(`Upgraded ${SUPER_ADMIN_EMAIL} to super_admin`);
    }
    await client.close();
    return;
  }

  // Create super admin user
  const result = await localAuth.api.signUpEmail({
    body: {
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
    },
  });

  if (!result || !result.user) {
    console.error("Failed to create super admin user");
    await client.close();
    process.exit(1);
  }

  // Set role to super_admin
  await db
    .collection("user")
    .updateOne({ email: SUPER_ADMIN_EMAIL }, { $set: { role: "super_admin" } });

  console.log(`Super admin created successfully!`);
  console.log(`  Email: ${SUPER_ADMIN_EMAIL}`);
  console.log(`  Password: ${SUPER_ADMIN_PASSWORD}`);
  console.log(`  Name: ${SUPER_ADMIN_NAME}`);

  await client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
