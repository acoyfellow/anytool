import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { getRequestEvent } from "@sveltejs/kit/internal/server";
import "./app-server.js";
import "@sveltejs/kit";
import "clsx";
const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).$defaultFn(() => false).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});
const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
});
const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp"
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp"
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});
const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  )
});
let authInstance = null;
let drizzleInstance = null;
function initAuth(db, env) {
  if (!db) {
    throw new Error("D1 database is required for Better Auth");
  }
  if (authInstance && drizzleInstance) {
    return authInstance;
  }
  if (!drizzleInstance) {
    drizzleInstance = drizzle(db, {
      schema: {
        user,
        session,
        account,
        verification
      }
    });
  }
  if (!authInstance) {
    authInstance = betterAuth({
      trustedOrigins: [
        "http://localhost:5173"
        // TODO: Add your production domains here
        // "https://your-domain.com",
      ],
      database: drizzleAdapter(drizzleInstance, {
        provider: "sqlite",
        schema: {
          user,
          session,
          account,
          verification
        }
      }),
      emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        // 7 days
        updateAge: 60 * 60 * 24
        // 1 day
      },
      secret: env?.BETTER_AUTH_SECRET || (() => {
        throw new Error("BETTER_AUTH_SECRET environment variable is required");
      })(),
      baseURL: env?.BETTER_AUTH_URL || "http://localhost:5173",
      plugins: [sveltekitCookies(getRequestEvent)]
    });
  }
  return authInstance;
}
export {
  initAuth as i
};
