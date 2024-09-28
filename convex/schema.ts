import { defineSchema, defineTable } from "convex/server";
import { vSessionId } from "convex-helpers/server/sessions";
import { v } from "convex/values";

export const RolesEnum = v.union(v.literal("admin"), v.literal("member"));

export default defineSchema({
  users: defineTable({
    sessionId: v.optional(vSessionId),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(RolesEnum),
    stripeCheckoutId: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_sessionId", ["sessionId"]),

  lessons: defineTable({
    lessonCode: v.string(),
    title: v.string(),
    content: v.optional(v.any()),
    notes: v.optional(v.string()),
  }).index("by_lessonCode", ["lessonCode"]),

  progress: defineTable({
    userId: v.id("users"),
    progress: v.array(v.string()),
  }),
});
