import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient, ObjectId } from 'mongodb';
import { createAuthMiddleware, APIError } from 'better-auth/api';

export const client = new MongoClient(process.env.MONGODB_URI!);
// authDb points to the default DB in the connection URI.
// Both better-auth collections (user, session, …) and app collections
// (shopmembers, shops, staff, …) live in this same database.
export const authDb = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(authDb),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  hooks: {
    /**
     * Before sign-in: enforce two access rules before any session is created:
     *  1. Nobody (owner or staff) can sign in if their shop is suspended.
     *  2. Deactivated staff members cannot sign in.
     */
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-in/email') return;

      const email = (ctx.body as Record<string, string> | undefined)?.email;
      if (!email) return;

      // 1. Find the auth user by email
      const authUser = await authDb.collection('user').findOne({
        email: email.toLowerCase(),
      });
      if (!authUser) return; // unknown email — let better-auth return its own error

      const userId = String(authUser.id ?? authUser._id);

      // 2. Look up their ShopMember record
      const membership = await authDb
        .collection('shopmembers')
        .findOne({ userId });

      if (!membership) return; // no membership → new user or super-admin, allow

      const shopId = String(membership.shopId);

      // 3. Check if the shop is suspended (applies to BOTH owners and staff)
      //    shopId is stored as a string; the Shop document's _id is an ObjectId.
      let shopDoc = null;
      try {
        shopDoc = await authDb
          .collection('shops')
          .findOne({ _id: new ObjectId(shopId) });
      } catch {
        // shopId might not be a valid ObjectId in some edge cases
      }

      if (shopDoc && shopDoc.status === 'suspended') {
        throw new APIError('FORBIDDEN', {
          message:
            'Your shop has been suspended by the administrator. Please contact support.',
        });
      }

      // 4. Deactivated staff → reject (owners skip this check)
      if (membership.role !== 'owner' && membership.isActive === false) {
        throw new APIError('UNAUTHORIZED', {
          message:
            'Your account has been deactivated by the owner. Please contact your shop manager.',
        });
      }
    }),
  },
});
